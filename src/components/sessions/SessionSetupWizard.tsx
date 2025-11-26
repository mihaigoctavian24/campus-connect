'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List } from 'lucide-react';
import { RecurringPatternForm } from './RecurringPatternForm';
import { IndividualSessionManager } from './IndividualSessionManager';

interface SessionSetupWizardProps {
  activityId: string;
  defaultLocation: string;
  defaultMaxParticipants: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function SessionSetupWizard({
  activityId,
  defaultLocation,
  defaultMaxParticipants,
  onComplete,
  onCancel,
}: SessionSetupWizardProps) {
  const [activeTab, setActiveTab] = useState<'recurring' | 'individual'>('recurring');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-[#001f3f]">Configurare Sesiuni</h2>
        <p className="mt-2 text-gray-600">
          Alege cum vrei să creezi sesiunile pentru această activitate
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'recurring' | 'individual')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <Calendar className="size-4" />
            Pattern Recurent
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <List className="size-4" />
            Management Individual
          </TabsTrigger>
        </TabsList>

        {/* Option A: Recurring Pattern */}
        <TabsContent value="recurring" className="mt-6 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Pattern Recurent:</strong> Generează automat sesiuni multiple bazate pe un
              model recurent (săptămânal, bisăptămânal, sau zilnic personalizat).
            </p>
          </div>

          <RecurringPatternForm
            activityId={activityId}
            defaultLocation={defaultLocation}
            defaultMaxParticipants={defaultMaxParticipants}
            onSuccess={() => {
              onComplete?.();
            }}
            onCancel={onCancel}
          />
        </TabsContent>

        {/* Option B: Individual Session Management */}
        <TabsContent value="individual" className="mt-6 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              <strong>Management Individual:</strong> Adaugă și gestionează fiecare sesiune manual,
              cu posibilitatea de reordonare și editare în bloc.
            </p>
          </div>

          <IndividualSessionManager
            activityId={activityId}
            defaultLocation={defaultLocation}
            defaultMaxParticipants={defaultMaxParticipants}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
