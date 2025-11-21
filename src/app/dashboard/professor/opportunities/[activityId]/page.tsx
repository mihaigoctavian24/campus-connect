import { OpportunityDetailPage } from '@/components/opportunities/OpportunityDetailPage';

export default async function ProfessorOpportunityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;

  return <OpportunityDetailPage activityId={activityId} />;
}
