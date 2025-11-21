'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

export default function ProfessorOpportunitiesPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Oportunitățile Mele</h1>
        <p className="text-muted-foreground">
          Gestionează oportunitățile create și aplicațiile studenților
        </p>
      </div>

      {/* Create Opportunity Button */}
      <div>
        <Link href="/dashboard/professor/opportunities/create">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Creează Oportunitate Nouă
          </Button>
        </Link>
      </div>

      {/* Opportunities List - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunități Active</CardTitle>
          <CardDescription>Lista ta de activități de voluntariat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nu ai oportunități create încă</p>
            <p className="text-sm mb-4">Creează prima ta oportunitate de voluntariat</p>
            <Link href="/dashboard/professor/opportunities/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Creează Oportunitate
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
