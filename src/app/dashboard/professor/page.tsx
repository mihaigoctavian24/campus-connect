'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Users, BookOpen, Clock, CheckCircle, Plus } from 'lucide-react';
import { PendingActions } from '@/components/dashboard/professor/PendingActions';

interface ProfessorStats {
  activeOpportunities: number;
  totalStudents: number;
  pendingActions: number;
  newApplications: number;
  pendingHours: number;
  upcomingSessions: number;
}

export default function ProfessorDashboardPage() {
  const [userName, setUserName] = useState('Professor');
  const [stats, setStats] = useState<ProfessorStats>({
    activeOpportunities: 0,
    totalStudents: 0,
    pendingActions: 0,
    newApplications: 0,
    pendingHours: 0,
    upcomingSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfessorData() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single<{ first_name: string; last_name: string }>();

          if (profileData) {
            setUserName(`${profileData.first_name} ${profileData.last_name}`);
          }

          // TODO: Fetch professor stats from database
          // For now, using placeholder data
          setStats({
            activeOpportunities: 0,
            totalStudents: 0,
            pendingActions: 0,
            newApplications: 0,
            pendingHours: 0,
            upcomingSessions: 0,
          });
        } catch (error) {
          console.error('Failed to load professor data:', error);
        }
      }

      setLoading(false);
    }

    loadProfessorData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bun venit, {userName}</h1>
        <p className="text-muted-foreground">
          Gestionează oportunitățile tale de voluntariat și studenții
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunități Active</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOpportunities}</div>
            <p className="text-xs text-muted-foreground">Acceptă aplicații în prezent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Studenți</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Înscriși în toate activitățile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acțiuni Pendinte</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingActions}</div>
            <p className="text-xs text-muted-foreground">Necesită atenția ta</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acțiuni Rapide</CardTitle>
          <CardDescription>Operațiuni frecvente pentru gestionarea oportunităților</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-6 hover:bg-[#FFD600] transition-colors group"
          >
            <Plus className="h-8 w-8 mb-2 text-[#001f3f] group-hover:text-black transition-colors" />
            <span className="font-medium group-hover:text-black transition-colors">Creează Oportunitate</span>
            <span className="text-xs text-muted-foreground group-hover:text-black text-center mt-1 transition-colors">
              Configurează o nouă activitate
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-6 hover:bg-[#FFD600] transition-colors group relative"
          >
            {stats.newApplications > 0 && (
              <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                {stats.newApplications}
              </span>
            )}
            <Users className="h-8 w-8 mb-2 text-[#001f3f] group-hover:text-black transition-colors" />
            <span className="font-medium group-hover:text-black transition-colors">Revizuiește Aplicații</span>
            <span className="text-xs text-muted-foreground group-hover:text-black text-center mt-1 transition-colors">
              Acceptă sau respinge studenți
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-6 hover:bg-[#FFD600] transition-colors group relative"
          >
            {stats.pendingHours > 0 && (
              <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center">
                {stats.pendingHours}
              </span>
            )}
            <CheckCircle className="h-8 w-8 mb-2 text-[#001f3f] group-hover:text-black transition-colors" />
            <span className="font-medium group-hover:text-black transition-colors">Aprobă Ore</span>
            <span className="text-xs text-muted-foreground group-hover:text-black text-center mt-1 transition-colors">
              Validează ore înregistrate
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-6 hover:bg-[#FFD600] transition-colors group"
          >
            <Clock className="h-8 w-8 mb-2 text-[#001f3f] group-hover:text-black transition-colors" />
            <span className="font-medium group-hover:text-black transition-colors">Gestionează Sesiuni</span>
            <span className="text-xs text-muted-foreground group-hover:text-black text-center mt-1 transition-colors">
              Programează și urmărește
            </span>
          </Button>
        </CardContent>
      </Card>

      {/* Pending Actions */}
      <PendingActions
        newApplications={stats.newApplications}
        pendingHours={stats.pendingHours}
        upcomingSessions={stats.upcomingSessions}
        onNavigate={(_tab) => {
          // TODO: Navigate to appropriate section when pages are created
        }}
      />
    </div>
  );
}
