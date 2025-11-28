import type { Metadata } from 'next';
import { ProfessorAnalytics } from '@/components/analytics/professor';

export const metadata: Metadata = {
  title: 'Analytics | Campus Connect',
  description: 'Statistici și rapoarte despre activitățile tale',
};

export default function ProfessorAnalyticsPage() {
  return <ProfessorAnalytics />;
}
