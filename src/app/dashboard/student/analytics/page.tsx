import type { Metadata } from 'next';
import { StudentAnalytics } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Statistici | Campus Connect',
  description: 'Vizualizează progresul tău în activitățile de voluntariat',
};

export default function StudentAnalyticsPage() {
  return <StudentAnalytics />;
}
