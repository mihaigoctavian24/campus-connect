'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, User, Calendar, CheckSquare } from 'lucide-react';
import { HourRequestDetailModal } from './HourRequestDetailModal';
import { HoursActionButtons } from './HoursActionButtons';
import { BulkApproveModal } from './BulkApproveModal';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export interface HoursRequest {
  id: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
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
  reviewed_by?: string;
  professor_notes?: string;
}

interface HoursValidationProps {
  requests: HoursRequest[];
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
  onRequestInfo: (requestId: string, message: string) => Promise<void>;
  onBulkApprove: (requestIds: string[], notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export function HoursValidation({
  requests,
  onApprove,
  onReject,
  onRequestInfo,
  onBulkApprove,
  isLoading = false,
}: HoursValidationProps) {
  const [selectedRequest, setSelectedRequest] = useState<HoursRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>(
    'PENDING'
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Filter requests by status
  const filteredRequests = requests.filter((request) => {
    if (activeTab === 'ALL') return true;
    return request.status === activeTab;
  });

  // Only pending requests can be selected for bulk approval
  const pendingRequests = filteredRequests.filter((r) => r.status === 'PENDING');
  const selectedRequests = pendingRequests.filter((r) => selectedIds.has(r.id));

  // Count by status
  const counts = {
    PENDING: requests.filter((r) => r.status === 'PENDING').length,
    APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
    REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
    ALL: requests.length,
  };

  // Selection handlers
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingRequests.length && pendingRequests.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingRequests.map((r) => r.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const getStatusBadge = (status: HoursRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">⏳ Pending</Badge>;
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-500">
            ✅ Aprobat
          </Badge>
        );
      case 'REJECTED':
        return <Badge variant="destructive">❌ Respins</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div>
        <h2 className="text-2xl font-bold">Validare Ore</h2>
        <p className="text-muted-foreground mt-1">
          Revizuiește și validează cererile de ore ale studenților
        </p>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="PENDING">Pending ({counts.PENDING})</TabsTrigger>
          <TabsTrigger value="APPROVED">Aprobate ({counts.APPROVED})</TabsTrigger>
          <TabsTrigger value="REJECTED">Respinse ({counts.REJECTED})</TabsTrigger>
          <TabsTrigger value="ALL">Toate ({counts.ALL})</TabsTrigger>
        </TabsList>

        {/* Content for each tab */}
        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Se încarcă cererile...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                {activeTab === 'PENDING'
                  ? 'Nu există cereri în așteptare'
                  : `Nu există cereri ${activeTab.toLowerCase()}`}
              </p>
            </div>
          ) : (
            <>
              {/* Bulk actions bar - only show for PENDING tab */}
              {activeTab === 'PENDING' && pendingRequests.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all"
                        checked={
                          selectedIds.size === pendingRequests.length && pendingRequests.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                        Selectează toate ({pendingRequests.length})
                      </label>
                    </div>
                    {selectedIds.size > 0 && (
                      <Badge variant="secondary">
                        {selectedIds.size} selectat{selectedIds.size > 1 ? 'e' : 'ă'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIds.size > 0 && (
                      <>
                        <Button variant="outline" size="sm" onClick={clearSelection}>
                          Anulează selecția
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setShowBulkModal(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Aprobă selectate ({selectedIds.size})
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {/* Checkbox for PENDING requests only */}
                        {request.status === 'PENDING' && (
                          <div className="pt-1">
                            <Checkbox
                              id={`select-${request.id}`}
                              checked={selectedIds.has(request.id)}
                              onCheckedChange={() => toggleSelection(request.id)}
                            />
                          </div>
                        )}
                        <div className="flex-1 flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {request.student.first_name} {request.student.last_name}
                            </CardTitle>
                            <CardDescription>{request.activity.title}</CardDescription>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Request details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Data:</span>
                          <span className="text-muted-foreground">
                            {format(new Date(request.date), 'PPP', { locale: ro })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Ore:</span>
                          <span className="text-muted-foreground">{request.hours} hrs</span>
                        </div>
                      </div>

                      {/* Description preview */}
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Descriere:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
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

                      {/* Professor notes (if reviewed) */}
                      {request.professor_notes && (
                        <div className="bg-muted p-3 rounded-md space-y-1">
                          <p className="text-sm font-medium">Notițe profesor:</p>
                          <p className="text-sm text-muted-foreground">{request.professor_notes}</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          Vezi Detalii
                        </Button>

                        {request.status === 'PENDING' && (
                          <HoursActionButtons
                            requestId={request.id}
                            onApprove={onApprove}
                            onReject={onReject}
                            onRequestInfo={onRequestInfo}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedRequest && (
        <HourRequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={onApprove}
          onReject={onReject}
          onRequestInfo={onRequestInfo}
        />
      )}

      {/* Bulk Approve Modal */}
      {showBulkModal && (
        <BulkApproveModal
          requests={selectedRequests}
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onConfirm={async (notes) => {
            await onBulkApprove(Array.from(selectedIds), notes);
            setShowBulkModal(false);
            clearSelection();
          }}
        />
      )}
    </div>
  );
}
