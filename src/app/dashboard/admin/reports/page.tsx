'use client';

import { useRouter } from 'next/navigation';
import { AdvancedReports } from '@/components/reports/AdvancedReports';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

export default function AdminReportsPage() {
  const router = useRouter();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Rapoarte
          </h1>
          <p className="text-muted-foreground mt-1">
            Generează și exportă rapoarte detaliate despre activitățile platformei
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard/admin/analytics')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Statistici
        </Button>
      </div>

      <AdvancedReports />
    </div>
  );
}
