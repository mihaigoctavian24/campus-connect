'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ProfessorStudentsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Studenți</h1>
        <p className="text-muted-foreground">Gestionează studenții înscriși în activitățile tale</p>
      </div>

      {/* Students List - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Toți Studenții</CardTitle>
          <CardDescription>Studenți înscriși în toate activitățile tale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nu ai studenți înscriși încă</p>
            <p className="text-sm">Creează oportunități pentru a atrage studenți</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
