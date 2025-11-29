'use client';

import { AdvancedReports } from '@/components/reports/AdvancedReports';
import { FileText } from 'lucide-react';

export default function ProfessorReportsPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Rapoarte
        </h1>
        <p className="text-muted-foreground mt-1">
          Generează rapoarte pentru activitățile și studenții tăi
        </p>
      </div>

      <AdvancedReports />
    </div>
  );
}
