import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'Niciun fișier selectat' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Tipul fișierului nu este valid. Te rugăm să încarci o imagine.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fișierul este prea mare. Dimensiunea maximă permisă este 5MB.' },
        { status: 400 }
      );
    }

    // Get current profile to check for existing avatar
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_picture_url')
      .eq('id', user.id)
      .single();

    // Delete old avatar if exists
    if (profile?.profile_picture_url) {
      const oldFilePath = profile.profile_picture_url.split('/').pop();
      if (oldFilePath) {
        await supabase.storage.from('avatars').remove([`${user.id}/${oldFilePath}`]);
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return NextResponse.json({ error: 'Eroare la încărcarea imaginii' }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        profile_picture_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError);
      // Clean up uploaded file
      await supabase.storage.from('avatars').remove([filePath]);
      return NextResponse.json({ error: 'Eroare la actualizarea profilului' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Avatar încărcat cu succes',
      avatarUrl: publicUrl,
    });
  } catch (error) {
    console.error('Error in PUT /api/users/me/avatar:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}

export async function DELETE() {
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

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_picture_url')
      .eq('id', user.id)
      .single();

    // Delete avatar file from storage if exists
    if (profile?.profile_picture_url) {
      const filePath = profile.profile_picture_url.split('/').pop();
      if (filePath) {
        await supabase.storage.from('avatars').remove([`${user.id}/${filePath}`]);
      }
    }

    // Remove avatar URL from profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        profile_picture_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error removing avatar from profile:', updateError);
      return NextResponse.json({ error: 'Eroare la ștergerea avatar-ului' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Avatar șters cu succes',
    });
  } catch (error) {
    console.error('Error in DELETE /api/users/me/avatar:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
