'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

export default function ProfessorSessionsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sesiuni</h1>
        <p className="text-muted-foreground">Programează și urmărește sesiunile de voluntariat</p>
      </div>

      {/* Create Session Button */}
      <div>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Programează Sesiune Nouă
        </Button>
      </div>

      {/* Sessions Calendar/List - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiuni Viitoare</CardTitle>
          <CardDescription>Sesiunile tale programate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nu ai sesiuni programate</p>
            <p className="text-sm mb-4">Programează o sesiune pentru studenții tăi</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Programează Sesiune
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
