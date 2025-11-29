import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Type for platform_config table (may not be in generated types yet)
interface PlatformConfigRow {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description: string | null;
  is_public: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  updater: { first_name: string | null; last_name: string | null } | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyQueryBuilder = any;

const updateConfigSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role || '').toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Get all configurations
    // Note: platform_config table may not be in generated types yet
    const { data: configs, error: configsError } = (await (supabase as AnyQueryBuilder)
      .from('platform_config')
      .select(
        `
        id,
        key,
        value,
        category,
        description,
        is_public,
        updated_by,
        created_at,
        updated_at,
        updater:profiles!platform_config_updated_by_fkey (
          first_name,
          last_name
        )
      `
      )
      .order('category')
      .order('key')) as { data: PlatformConfigRow[] | null; error: unknown };

    if (configsError) {
      console.error('Error fetching configs:', configsError);
      return NextResponse.json({ error: 'Eroare la încărcarea configurărilor' }, { status: 500 });
    }

    // Group by category
    const groupedConfigs: Record<string, PlatformConfigRow[]> = {};
    (configs || []).forEach((config) => {
      if (!groupedConfigs[config.category]) {
        groupedConfigs[config.category] = [];
      }
      groupedConfigs[config.category].push(config);
    });

    return NextResponse.json({
      configs,
      groupedConfigs,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/config:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role || '').toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateConfigSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { key, value } = validationResult.data;

    // Update configuration
    const { data: updatedConfig, error: updateError } = (await (supabase as AnyQueryBuilder)
      .from('platform_config')
      .update({
        value: JSON.stringify(value),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()
      .single()) as { data: PlatformConfigRow | null; error: unknown };

    if (updateError) {
      console.error('Error updating config:', updateError);
      return NextResponse.json({ error: 'Eroare la actualizarea configurării' }, { status: 500 });
    }

    if (!updatedConfig) {
      return NextResponse.json({ error: 'Configurare negăsită' }, { status: 404 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CONFIG_UPDATED',
      entity_type: 'platform_config',
      entity_id: updatedConfig.id,
      details: {
        key,
        new_value: JSON.stringify(value),
      },
    });

    return NextResponse.json({
      message: 'Configurare actualizată cu succes',
      config: updatedConfig,
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/config:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profile?.role || '').toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value, category, description, is_public } = body;

    if (!key || value === undefined || !category) {
      return NextResponse.json({ error: 'Câmpuri obligatorii lipsă' }, { status: 400 });
    }

    // Create new configuration
    const { data: newConfig, error: insertError } = (await (supabase as AnyQueryBuilder)
      .from('platform_config')
      .insert({
        key,
        value: JSON.stringify(value),
        category,
        description,
        is_public: is_public || false,
        updated_by: user.id,
      })
      .select()
      .single()) as { data: PlatformConfigRow | null; error: { code?: string } | null };

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Cheia există deja' }, { status: 400 });
      }
      console.error('Error creating config:', insertError);
      return NextResponse.json({ error: 'Eroare la crearea configurării' }, { status: 500 });
    }

    if (!newConfig) {
      return NextResponse.json({ error: 'Eroare la crearea configurării' }, { status: 500 });
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CONFIG_CREATED',
      entity_type: 'platform_config',
      entity_id: newConfig.id,
      details: {
        key,
        value: JSON.stringify(value),
        category,
      },
    });

    return NextResponse.json({
      message: 'Configurare creată cu succes',
      config: newConfig,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/config:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
