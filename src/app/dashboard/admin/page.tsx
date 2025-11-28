'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  students: number;
  professors: number;
  admins: number;
  pendingProfessorRequests: number;
  totalActivities: number;
  activeActivities: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Eroare la încărcarea utilizatorilor');
      const usersData = await usersResponse.json();
      const users = usersData.users || [];

      // Fetch professor requests
      const requestsResponse = await fetch('/api/admin/professor-requests');
      const requestsData = requestsResponse.ok ? await requestsResponse.json() : { requests: [] };
      const requests = requestsData.requests || [];
      const pendingRequests = requests.filter((r: { status: string }) => r.status === 'PENDING');

      setStats({
        totalUsers: users.length,
        students: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'STUDENT').length,
        professors: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'PROFESSOR')
          .length,
        admins: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'ADMIN').length,
        pendingProfessorRequests: pendingRequests.length,
        totalActivities: 0, // TODO: Fetch from activities API
        activeActivities: 0, // TODO: Fetch from activities API
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">Bine ai venit în panoul de administrare</p>
        </div>
        <Button variant="outline" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reîmprospătează
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.students} studenți, {stats?.professors} profesori
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Studenți</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.students || 0}</div>
            <p className="text-xs text-muted-foreground">Utilizatori activi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesori</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.professors || 0}</div>
            <p className="text-xs text-muted-foreground">Organizatori de activități</p>
          </CardContent>
        </Card>

        <Card
          className={
            stats?.pendingProfessorRequests && stats.pendingProfessorRequests > 0
              ? 'border-yellow-300 bg-yellow-50/50'
              : ''
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cereri în Așteptare</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.pendingProfessorRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cereri rol profesor</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestionare Utilizatori
            </CardTitle>
            <CardDescription>
              Vizualizează și administrează toți utilizatorii platformei
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/dashboard/admin/users">
                <Button>
                  Vezi Utilizatori
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            stats?.pendingProfessorRequests && stats.pendingProfessorRequests > 0
              ? 'border-yellow-300'
              : ''
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Aprobare Profesori
              {stats?.pendingProfessorRequests && stats.pendingProfessorRequests > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {stats.pendingProfessorRequests} noi
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Revizuiește și aprobă cererile pentru rol de profesor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/dashboard/admin/professors">
                <Button
                  variant={
                    stats?.pendingProfessorRequests && stats.pendingProfessorRequests > 0
                      ? 'default'
                      : 'outline'
                  }
                >
                  Vezi Cereri
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activitate Recentă
          </CardTitle>
          <CardDescription>Ultimele acțiuni din platformă</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Activitatea recentă va fi afișată aici</p>
            <p className="text-sm">În dezvoltare</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
