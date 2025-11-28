'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  GraduationCap,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PlatformStats {
  users: {
    total: number;
    students: number;
    professors: number;
    admins: number;
    newThisMonth: number;
    activeToday: number;
  };
  activities: {
    total: number;
    active: number;
    completed: number;
    draft: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  hours: {
    totalLogged: number;
    pendingValidation: number;
    validated: number;
  };
  topFaculties: Array<{ name: string; studentCount: number }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Eroare la încărcarea utilizatorilor');
      const usersData = await usersResponse.json();
      const users = usersData.users || [];

      // Fetch professor requests for pending count
      const requestsResponse = await fetch('/api/admin/professor-requests');
      const requestsData = requestsResponse.ok ? await requestsResponse.json() : { requests: [] };
      const requests = requestsData.requests || [];
      const pendingRequests = requests.filter((r: { status: string }) => r.status === 'PENDING');

      // Calculate user stats
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const newThisMonth = users.filter((u: { created_at: string }) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= monthAgo;
      }).length;

      const activeToday = users.filter((u: { last_login: string | null }) => {
        if (!u.last_login) return false;
        const lastLogin = new Date(u.last_login);
        return lastLogin >= today;
      }).length;

      // Faculty distribution
      const facultyMap = new Map<string, number>();
      users
        .filter((u: { role: string }) => u.role?.toUpperCase() === 'STUDENT')
        .forEach((u: { faculty: string | null }) => {
          const faculty = u.faculty || 'Nespecificat';
          facultyMap.set(faculty, (facultyMap.get(faculty) || 0) + 1);
        });

      const topFaculties = Array.from(facultyMap.entries())
        .map(([name, studentCount]) => ({ name, studentCount }))
        .sort((a, b) => b.studentCount - a.studentCount)
        .slice(0, 5);

      setStats({
        users: {
          total: users.length,
          students: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'STUDENT')
            .length,
          professors: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'PROFESSOR')
            .length,
          admins: users.filter((u: { role: string }) => u.role?.toUpperCase() === 'ADMIN').length,
          newThisMonth,
          activeToday,
        },
        activities: {
          total: 0, // TODO: Fetch from activities API
          active: 0,
          completed: 0,
          draft: 0,
        },
        applications: {
          total: 0, // TODO: Fetch from applications API
          pending: pendingRequests.length, // Using professor requests for now
          approved: requests.filter((r: { status: string }) => r.status === 'APPROVED').length,
          rejected: requests.filter((r: { status: string }) => r.status === 'REJECTED').length,
        },
        hours: {
          totalLogged: 0, // TODO: Fetch from hours API
          pendingValidation: 0,
          validated: 0,
        },
        topFaculties,
        recentActivity: [], // TODO: Implement activity log
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

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
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <p className="mb-4 text-red-600">{error}</p>
        <Button variant="outline" onClick={fetchStats}>
          <RefreshCw className="mr-2 h-4 w-4" />
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
          <h1 className="text-2xl font-bold">Rapoarte și Statistici</h1>
          <p className="text-muted-foreground">Analize detaliate ale platformei</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selectează perioada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Ultimele 7 zile</SelectItem>
              <SelectItem value="30d">Ultimele 30 zile</SelectItem>
              <SelectItem value="90d">Ultimele 90 zile</SelectItem>
              <SelectItem value="1y">Ultimul an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reîmprospătează
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportă Raport
          </Button>
        </div>
      </div>

      {/* User Overview */}
      <div>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Utilizatori
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />+
                {stats?.users.newThisMonth || 0} luna aceasta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Studenți</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.users.students || 0}</div>
              <p className="text-xs text-muted-foreground">
                {(((stats?.users.students || 0) / (stats?.users.total || 1)) * 100).toFixed(1)}% din
                total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profesori</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.users.professors || 0}</div>
              <p className="text-xs text-muted-foreground">
                {(((stats?.users.professors || 0) / (stats?.users.total || 1)) * 100).toFixed(1)}%
                din total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activi Astăzi</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {stats?.users.activeToday || 0}
              </div>
              <p className="text-xs text-muted-foreground">utilizatori logați azi</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activities & Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activități
            </CardTitle>
            <CardDescription>Statistici despre oportunități</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total activități</span>
                <span className="font-medium">{stats?.activities.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </span>
                <span className="font-medium">{stats?.activities.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Finalizate</Badge>
                </span>
                <span className="font-medium">{stats?.activities.completed || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Badge variant="secondary">Draft</Badge>
                </span>
                <span className="font-medium">{stats?.activities.draft || 0}</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Date despre activități vor fi afișate după implementarea API-ului
            </p>
          </CardContent>
        </Card>

        {/* Applications / Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cereri Profesor
            </CardTitle>
            <CardDescription>Status cereri pentru rol de profesor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total cereri</span>
                <span className="font-medium">
                  {(stats?.applications.pending || 0) +
                    (stats?.applications.approved || 0) +
                    (stats?.applications.rejected || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  În așteptare
                </span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {stats?.applications.pending || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Aprobate
                </span>
                <Badge className="bg-green-100 text-green-800">
                  {stats?.applications.approved || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Respinse
                </span>
                <Badge className="bg-red-100 text-red-800">
                  {stats?.applications.rejected || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Distribuție pe Facultăți
          </CardTitle>
          <CardDescription>Top 5 facultăți după numărul de studenți</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.topFaculties && stats.topFaculties.length > 0 ? (
            <div className="space-y-3">
              {stats.topFaculties.map((faculty, index) => {
                const maxCount = stats.topFaculties[0].studentCount;
                const percentage = (faculty.studentCount / maxCount) * 100;
                return (
                  <div key={faculty.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#001f3f] text-xs text-white">
                          {index + 1}
                        </span>
                        {faculty.name}
                      </span>
                      <span className="font-medium">{faculty.studentCount} studenți</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-[#001f3f] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <PieChart className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Nu există date despre facultăți</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hours Stats Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Statistici Ore Voluntariat
          </CardTitle>
          <CardDescription>Raport despre orele înregistrate și validate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">{stats?.hours.totalLogged || 0}</div>
              <p className="text-sm text-muted-foreground">Total ore înregistrate</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.hours.pendingValidation || 0}
              </div>
              <p className="text-sm text-muted-foreground">În așteptare validare</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.hours.validated || 0}</div>
              <p className="text-sm text-muted-foreground">Ore validate</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Statisticile detaliate vor fi disponibile după implementarea sistemului de ore
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Activitate Recentă
          </CardTitle>
          <CardDescription>Ultimele acțiuni din platformă</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Activity className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Jurnalul de activitate va fi implementat în curând</p>
            <p className="text-sm">Va include înregistrări, aplicări, validări ore, etc.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
