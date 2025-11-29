'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ProfessorRequestDetailModal } from './ProfessorRequestDetailModal';
import { toast } from 'sonner';

interface ProfessorRequest {
  id: string;
  user_id: string;
  department: string | null;
  reason: string;
  supporting_documents: string[] | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    faculty: string | null;
  };
  reviewer?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-amber-100 text-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          În așteptare
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge className="bg-green-100 text-green-800">
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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function ProfessorApprovalQueue() {
  const [requests, setRequests] = useState<ProfessorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ProfessorRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/professor-requests');
      if (!response.ok) {
        throw new Error('Eroare la încărcarea cererilor');
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Error fetching professor requests:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewDetails = (request: ProfessorRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleQuickApprove = async (request: ProfessorRequest) => {
    try {
      const response = await fetch(`/api/admin/professor-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (!response.ok) {
        throw new Error('Eroare la aprobare');
      }

      toast.success('Cererea a fost aprobată');
      fetchRequests();
    } catch {
      toast.error('Eroare la aprobare');
    }
  };

  const handleQuickReject = async (request: ProfessorRequest) => {
    try {
      const response = await fetch(`/api/admin/professor-requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejection_reason: 'Cererea nu îndeplinește criteriile necesare.',
        }),
      });

      if (!response.ok) {
        throw new Error('Eroare la respingere');
      }

      toast.success('Cererea a fost respinsă');
      fetchRequests();
    } catch {
      toast.error('Eroare la respingere');
    }
  };

  const handleRequestUpdated = () => {
    fetchRequests();
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // Filter requests by status
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const approvedRequests = requests.filter((r) => r.status === 'APPROVED');
  const rejectedRequests = requests.filter((r) => r.status === 'REJECTED');

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'pending':
        return pendingRequests;
      case 'approved':
        return approvedRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return requests;
    }
  };

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
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchRequests}>
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
          <h1 className="text-2xl font-bold">Aprobare Profesori</h1>
          <p className="text-muted-foreground">
            Gestionează cererile de acces pentru rol de profesor
          </p>
        </div>
        <Button variant="outline" onClick={fetchRequests}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reîmprospătează
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={pendingRequests.length > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">În așteptare</p>
                <p className="text-2xl font-bold text-amber-600">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprobate</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Respinse</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Cereri Rol Profesor
          </CardTitle>
          <CardDescription>{requests.length} cereri totale</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">În așteptare ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Aprobate ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Respinse ({rejectedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Solicitant</TableHead>
                      <TableHead>Departament</TableHead>
                      <TableHead>Data cererii</TableHead>
                      <TableHead>Status</TableHead>
                      {activeTab !== 'pending' && <TableHead>Revizuit de</TableHead>}
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredRequests().length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={activeTab === 'pending' ? 5 : 6}
                          className="text-center py-8"
                        >
                          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">
                            {activeTab === 'pending'
                              ? 'Nu există cereri în așteptare'
                              : activeTab === 'approved'
                                ? 'Nu există cereri aprobate'
                                : 'Nu există cereri respinse'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredRequests().map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {request.user.first_name || request.user.last_name
                                  ? `${request.user.first_name || ''} ${request.user.last_name || ''}`.trim()
                                  : 'Necompletat'}
                              </p>
                              <p className="text-sm text-muted-foreground">{request.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{request.department || request.user.faculty || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">
                                {format(new Date(request.created_at), 'd MMM yyyy', { locale: ro })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(request.created_at), {
                                  addSuffix: true,
                                  locale: ro,
                                })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          {activeTab !== 'pending' && (
                            <TableCell>
                              {request.reviewer ? (
                                <span className="text-sm">
                                  {`${request.reviewer.first_name || ''} ${request.reviewer.last_name || ''}`.trim() ||
                                    '-'}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Vezi detalii
                                </DropdownMenuItem>
                                {request.status === 'PENDING' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleQuickApprove(request)}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Aprobă rapid
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleQuickReject(request)}
                                      className="text-red-600"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Respinge
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <ProfessorRequestDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        onRequestUpdated={handleRequestUpdated}
      />
    </div>
  );
}
