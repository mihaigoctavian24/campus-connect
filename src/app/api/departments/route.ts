import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: departments, error } = await supabase
      .from('departments')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching departments:', error);
      return NextResponse.json(
        { message: 'Eroare la încărcarea departamentelor' },
        { status: 500 }
      );
    }

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Departments fetch error:', error);
    return NextResponse.json({ message: 'Eroare internă' }, { status: 500 });
  }
}
