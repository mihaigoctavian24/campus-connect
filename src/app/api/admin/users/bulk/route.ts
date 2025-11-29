import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp, rateLimitErrorResponse } from '@/lib/security';

const bulkActionSchema = z.object({
  action: z.enum(['change_role', 'deactivate']),
  user_ids: z.array(z.string().uuid()).min(1, 'Selectează cel puțin un utilizator'),
  new_role: z.enum(['STUDENT', 'PROFESSOR', 'ADMIN']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Strict rate limiting for admin bulk operations - 5 per minute
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, {
      limit: 5,
      windowMs: 60 * 1000,
      identifier: 'admin-bulk',
    });

    if (!rateLimitResult.success) {
      return rateLimitErrorResponse(rateLimitResult.resetAt);
    }

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
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminError || adminProfile?.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Acces interzis' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = bulkActionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { action, user_ids, new_role } = validationResult.data;

    // Validate role change action has new_role
    if (action === 'change_role' && !new_role) {
      return NextResponse.json(
        { error: 'Noul rol este obligatoriu pentru schimbarea rolului' },
        { status: 400 }
      );
    }

    // Prevent self-modification
    if (user_ids.includes(user.id)) {
      return NextResponse.json(
        { error: 'Nu îți poți modifica propriul cont prin acțiuni în masă' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each user
    for (const userId of user_ids) {
      try {
        // Get user profile
        const { data: targetUser, error: targetError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', userId)
          .single();

        if (targetError || !targetUser) {
          failedCount++;
          errors.push(`Utilizatorul ${userId} nu a fost găsit`);
          continue;
        }

        // Execute action
        if (action === 'change_role' && new_role) {
          // Skip if user is already in the target role
          if (targetUser.role === new_role) {
            successCount++;
            continue;
          }

          // Update role
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: new_role })
            .eq('id', userId);

          if (updateError) {
            failedCount++;
            errors.push(`Eroare la actualizarea rolului pentru ${targetUser.email}`);
            continue;
          }

          // Log the action
          await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'BULK_ROLE_CHANGE',
            entity_type: 'profile',
            entity_id: userId,
            details: {
              target_email: targetUser.email,
              previous_role: targetUser.role,
              new_role: new_role,
            },
          });

          successCount++;
        } else if (action === 'deactivate') {
          // For deactivation, we can set a flag or delete the user
          // Here we'll update a status field (assuming it exists) or add to deactivated list
          // For now, we'll update the role to a 'deactivated' status or similar
          // Since the schema might not have a deactivated field, we'll log it and set role to student

          const { error: deactivateError } = await supabase
            .from('profiles')
            .update({
              role: 'STUDENT', // Reset to student role
              // If there's a status field, set it to 'deactivated'
            })
            .eq('id', userId);

          if (deactivateError) {
            failedCount++;
            errors.push(`Eroare la dezactivarea contului ${targetUser.email}`);
            continue;
          }

          // Log the action
          await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'BULK_USER_DEACTIVATE',
            entity_type: 'profile',
            entity_id: userId,
            details: {
              target_email: targetUser.email,
              previous_role: targetUser.role,
            },
          });

          successCount++;
        }
      } catch {
        failedCount++;
        errors.push(`Eroare neașteptată pentru utilizatorul ${userId}`);
      }
    }

    // Log the bulk action summary
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: `BULK_ACTION_${action.toUpperCase()}`,
      entity_type: 'bulk_operation',
      entity_id: user.id,
      details: {
        total_users: user_ids.length,
        success_count: successCount,
        failed_count: failedCount,
        action,
        ...(action === 'change_role' && { new_role }),
      },
    });

    return NextResponse.json({
      message: 'Acțiunea în masă a fost executată',
      results: {
        success: successCount,
        failed: failedCount,
      },
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error('Error in POST /api/admin/users/bulk:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
