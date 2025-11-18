import { createClient } from '@/lib/supabase/client';
import type { SavedOpportunity } from '@/components/dashboard/SavedOpportunities';

interface SavedOpportunityData {
  id: string;
  activity_id: string;
  saved_at: string;
}

interface ActivityData {
  id: string;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  categories: {
    name: string;
  } | null;
}

/**
 * Fetches saved opportunities (bookmarks) for a student
 * Returns activities that the user has bookmarked for later
 */
export async function getSavedOpportunities(userId: string): Promise<SavedOpportunity[]> {
  const supabase = createClient();

  // First, get all saved opportunities for this user
  const { data: savedOpportunities, error: savedError } = await supabase
    .from('saved_opportunities')
    .select('id, activity_id, saved_at')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .returns<Array<SavedOpportunityData>>();

  if (savedError) {
    console.error('Error fetching saved opportunities:', savedError);
    throw new Error('Failed to fetch saved opportunities');
  }

  if (!savedOpportunities || savedOpportunities.length === 0) {
    return [];
  }

  // Then get activity details for those saved opportunities
  const activityIds = savedOpportunities.map((s) => s.activity_id);

  const { data: activities, error: activityError } = await supabase
    .from('activities')
    .select('id, title, date, location, max_participants, current_participants, categories (name)')
    .in('id', activityIds)
    .is('deleted_at', null)
    .returns<Array<ActivityData>>();

  if (activityError) {
    console.error('Error fetching activities:', activityError);
    throw new Error('Failed to fetch activities');
  }

  if (!activities) {
    return [];
  }

  // Merge saved opportunities with activities
  const result: SavedOpportunity[] = savedOpportunities
    .map((saved: SavedOpportunityData) => {
      const activity = activities.find((a: ActivityData) => a.id === saved.activity_id);
      if (!activity) return null;

      return {
        id: saved.id,
        activityId: activity.id,
        activityTitle: activity.title,
        activityCategory: activity.categories?.name || 'General',
        activityDate: activity.date,
        activityLocation: activity.location,
        maxParticipants: activity.max_participants,
        currentParticipants: activity.current_participants,
        savedAt: saved.saved_at,
      };
    })
    .filter((opportunity): opportunity is SavedOpportunity => opportunity !== null);

  return result;
}
