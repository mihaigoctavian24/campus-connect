'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Calendar, Users, Eye, Edit, Archive, TrendingUp, Clock } from 'lucide-react';
import { EditOpportunityModal } from '@/components/opportunities/EditOpportunityModal';

interface OpportunityStats {
  enrolled: number;
  maxStudents: number;
  avgAttendance: number | null;
  totalHours: number;
  pendingApplications: number;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  category_name: string;
  department_name: string;
  stats: OpportunityStats;
}

export function MyOpportunities() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'CLOSED' | 'DRAFT'>('all');
  const [editingOpportunityId, setEditingOpportunityId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/professor/opportunities');

      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredOpportunities =
    filter === 'all' ? opportunities : opportunities.filter((opp) => opp.status === filter);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-600 text-white';
      case 'CLOSED':
        return 'bg-gray-600 text-white';
      case 'DRAFT':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Activ';
      case 'CLOSED':
        return 'Închis';
      case 'DRAFT':
        return 'Draft';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Se încarcă oportunităț ile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Oportunități Create</h2>
          <p className="text-muted-foreground">
            Gestionează toate oportunităț ile tale de voluntariat
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/professor/opportunities/create')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Creează Oportunitate
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">Toate</TabsTrigger>
          <TabsTrigger value="OPEN">Active</TabsTrigger>
          <TabsTrigger value="CLOSED">Închise</TabsTrigger>
          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {filter === 'all'
              ? 'Nu ai oportunități create încă'
              : `Nu ai oportunități ${getStatusLabel(filter).toLowerCase()}`}
          </p>
          <Button onClick={() => router.push('/dashboard/professor/opportunities/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Creează Prima Oportunitate
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className="p-6 bg-white border border-border shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{opp.title}</h3>
                    <Badge variant="outline">{opp.department_name}</Badge>
                    <Badge className={getStatusBadgeClass(opp.status)}>
                      {getStatusLabel(opp.status)}
                    </Badge>
                  </div>

                  {/* Next Session Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(opp.date).toLocaleDateString('ro-RO')} •{' '}
                        {opp.start_time.substring(0, 5)}-{opp.end_time.substring(0, 5)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {opp.location}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {opp.stats.enrolled}/{opp.stats.maxStudents} studenți
                      </span>
                      {opp.stats.pendingApplications > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-1 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {opp.stats.pendingApplications} aplicații noi
                        </Badge>
                      )}
                    </div>
                    {opp.stats.avgAttendance !== null && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{opp.stats.avgAttendance}% prezență</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{opp.stats.totalHours} ore total</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/professor/opportunities/${opp.id}`)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Vezi Detalii
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setEditingOpportunityId(opp.id)}
                >
                  <Edit className="h-4 w-4" />
                  Editează
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Archive className="h-4 w-4" />
                  Arhivează
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Opportunity Modal */}
      <EditOpportunityModal
        opportunityId={editingOpportunityId}
        isOpen={!!editingOpportunityId}
        onClose={() => setEditingOpportunityId(null)}
        onSuccess={() => {
          setEditingOpportunityId(null);
          fetchOpportunities();
        }}
      />
    </div>
  );
}
