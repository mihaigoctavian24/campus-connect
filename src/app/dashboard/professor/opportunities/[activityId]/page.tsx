import { OpportunityDetailPage } from '@/components/opportunities/OpportunityDetailPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalii Oportunitate - Campus Connect',
  description: 'Gestionează oportunitatea de voluntariat',
};

export default async function ProfessorOpportunityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;

  return <OpportunityDetailPage activityId={activityId} />;
}
