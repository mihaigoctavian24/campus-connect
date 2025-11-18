'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationStatusCard } from './ApplicationStatusCard';

export type ApplicationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

export interface Application {
  id: string;
  activityTitle: string;
  activityCategory: string;
  status: ApplicationStatus;
  appliedAt: string;
  respondedAt?: string;
  activityDate: string;
  activityLocation: string;
}

interface MyApplicationsProps {
  applications: Application[];
  loading?: boolean;
}

type FilterOption = 'ALL' | ApplicationStatus;

export function MyApplications({ applications, loading = false }: MyApplicationsProps) {
  const [filter, setFilter] = useState<FilterOption>('ALL');

  // Calculate counts by status
  const counts = {
    pending: applications.filter((app) => app.status === 'PENDING').length,
    confirmed: applications.filter((app) => app.status === 'CONFIRMED').length,
    rejected: applications.filter((app) => app.status === 'REJECTED').length,
  };

  // Filter applications based on selected filter
  const filteredApplications =
    filter === 'ALL' ? applications : applications.filter((app) => app.status === filter);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track the status of your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>Track the status of your applications</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterOption)}
              className="text-sm border rounded-md px-3 py-1.5 bg-background"
            >
              <option value="ALL">All ({applications.length})</option>
              <option value="PENDING">Pending ({counts.pending})</option>
              <option value="CONFIRMED">Accepted ({counts.confirmed})</option>
              <option value="REJECTED">Rejected ({counts.rejected})</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{counts.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold">{counts.confirmed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{counts.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {filter === 'ALL'
                ? 'No applications yet. Start exploring opportunities!'
                : `No ${filter.toLowerCase()} applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationStatusCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
