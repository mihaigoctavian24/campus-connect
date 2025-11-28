'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export interface StudentHoursRequest {
  id: string;
  activity: {
    id: string;
    title: string;
  };
  enrollment_id: string;
  hours: number;
  date: string;
  description: string;
  evidence_urls: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  reviewed_at?: string;
  professor_notes?: string;
  rejection_reason?: string;
}

interface HoursHistoryPanelProps {
  requests: StudentHoursRequest[];
  isLoading?: boolean;
}

export function HoursHistoryPanel({ requests, isLoading = false }: HoursHistoryPanelProps) {
  // Calculate totals
  const totalApprovedHours = requests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.hours, 0);

  const totalPendingHours = requests
    .filter((r) => r.status === 'PENDING')
    .reduce((sum, r) => sum + r.hours, 0);

  // Count by status
  const counts = {
    PENDING: requests.filter((r) => r.status === 'PENDING').length,
    APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
    REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
    ALL: requests.length,
  };

  const getStatusBadge = (status: StudentHoursRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            În așteptare
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobat
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Respins
          </Badge>
        );
    }
  };

  const filterRequests = (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL') => {
    if (status === 'ALL') return requests;
    return requests.filter((r) => r.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div>
        <h2 className="text-2xl font-bold">Istoricul Orelor</h2>
        <p className="text-muted-foreground mt-1">Vizualizează și urmărește cererile tale de ore</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ore Aprobate</CardDescription>
            <CardTitle className="text-3xl text-green-600">{totalApprovedHours}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{counts.APPROVED} cereri aprobate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ore în Așteptare</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{totalPendingHours}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{counts.PENDING} cereri în așteptare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Cereri</CardDescription>
            <CardTitle className="text-3xl">{counts.ALL}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {counts.APPROVED} aprobate, {counts.REJECTED} respinse
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ALL">Toate ({counts.ALL})</TabsTrigger>
          <TabsTrigger value="PENDING">În așteptare ({counts.PENDING})</TabsTrigger>
          <TabsTrigger value="APPROVED">Aprobate ({counts.APPROVED})</TabsTrigger>
          <TabsTrigger value="REJECTED">Respinse ({counts.REJECTED})</TabsTrigger>
        </TabsList>

        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Se încarcă istoricul...</p>
              </div>
            ) : filterRequests(status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL').length ===
              0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-4">
                  {status === 'ALL'
                    ? 'Nu ai cereri de ore'
                    : `Nu ai cereri ${status === 'PENDING' ? 'în așteptare' : status === 'APPROVED' ? 'aprobate' : 'respinse'}`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filterRequests(status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL').map(
                  (request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{request.activity.title}</CardTitle>
                            <CardDescription>
                              Trimisă {format(new Date(request.created_at), 'PPP', { locale: ro })}
                            </CardDescription>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Request details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Data activității:</span>
                            <span className="text-muted-foreground">
                              {format(new Date(request.date), 'PPP', { locale: ro })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Ore:</span>
                            <span className="text-muted-foreground font-semibold">
                              {request.hours} ore
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Descriere:</p>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>

                        {/* Evidence */}
                        {request.evidence_urls && request.evidence_urls.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-500">
                              {request.evidence_urls.length} fișier(e) atașat(e)
                            </span>
                          </div>
                        )}

                        {/* Approved - Show professor notes */}
                        {request.status === 'APPROVED' && request.professor_notes && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-1">
                            <p className="text-sm font-medium text-green-900">Notițe profesor:</p>
                            <p className="text-sm text-green-800">{request.professor_notes}</p>
                            {request.reviewed_at && (
                              <p className="text-xs text-green-700 mt-2">
                                Aprobat la{' '}
                                {format(new Date(request.reviewed_at), 'PPP', { locale: ro })}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Rejected - Show reason */}
                        {request.status === 'REJECTED' && request.professor_notes && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-1">
                            <p className="text-sm font-medium text-red-900">Motiv respingere:</p>
                            <p className="text-sm text-red-800">{request.professor_notes}</p>
                            {request.reviewed_at && (
                              <p className="text-xs text-red-700 mt-2">
                                Respins la{' '}
                                {format(new Date(request.reviewed_at), 'PPP', { locale: ro })}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pending - Show waiting message */}
                        {request.status === 'PENDING' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <p className="text-sm text-yellow-900">
                              ⏳ Cererea ta este în așteptare și va fi revizuită de profesor în
                              curând.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
