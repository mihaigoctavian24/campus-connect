'use client';

import { CreateOpportunityWizard } from '@/components/opportunities/CreateOpportunityWizard';

export default function CreateOpportunityPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creează Oportunitate Nouă</h1>
        <p className="text-muted-foreground">
          Completează pașii pentru a publica o nouă oportunitate de voluntariat
        </p>
      </div>

      {/* Wizard Component */}
      <CreateOpportunityWizard />
    </div>
  );
}
