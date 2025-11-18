import { createClient } from '@/lib/supabase/client';

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  requiredHours: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  status: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  createdById: string;
  createdByName: string;
}

interface GetOpportunitiesOptions {
  search?: string;
  category?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  limit?: number;
  offset?: number;
}

/**
 * Fetches opportunities with optional filters
 * Returns only published, non-deleted opportunities
 */
export async function getOpportunities(
  options: GetOpportunitiesOptions = {}
): Promise<Opportunity[]> {
  const supabase = createClient();
  const { search, category, status, limit = 100, offset = 0 } = options;

  let query = supabase
    .from('activities')
    .select(
      `
      id,
      title,
      description,
      location,
      date,
      start_time,
      end_time,
      max_participants,
      current_participants,
      status,
      category_id,
      department_id,
      created_by,
      categories (
        id,
        name
      ),
      departments (
        id,
        name,
        short_code
      )
    `
    )
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    // First get the category ID
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .single();

    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  if (status) {
    query = query.eq('status', status);
  } else {
    // By default, only show OPEN and IN_PROGRESS opportunities
    query = query.in('status', ['OPEN', 'IN_PROGRESS']);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching opportunities:', error);
    throw new Error('Failed to fetch opportunities');
  }

  if (!data) {
    return [];
  }

  // Transform database response to Opportunity type
  const opportunities: Opportunity[] = data.map((activity: any) => {
    // Generate slug from title
    const slug = activity.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      id: activity.id,
      slug: slug,
      title: activity.title,
      description: activity.description,
      location: activity.location,
      requiredHours: 10, // Default hours since not in schema yet
      maxParticipants: activity.max_participants,
      currentParticipants: activity.current_participants,
      startDate: activity.date,
      endDate: activity.date, // Using same date for now
      status: activity.status,
      categoryId: activity.category_id,
      categoryName: activity.categories?.name || 'General',
      departmentId: activity.department_id || '',
      departmentCode: activity.departments?.short_code || 'CC',
      departmentName: activity.departments?.name || 'Campus Connect',
      createdById: activity.created_by,
      createdByName: 'Professor',
    };
  });

  return opportunities;
}

/**
 * Fetches a single opportunity by slug (generated from title)
 * Note: Since slug is not in DB, we fetch all and match by generated slug
 */
export async function getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
  const opportunities = await getOpportunities({ limit: 1000 });
  return opportunities.find(opp => opp.slug === slug) || null;
}
