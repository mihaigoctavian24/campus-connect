'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, CheckCircle, XCircle, Eye, User, CheckSquare, XSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ApplicationDetailView } from './ApplicationDetailView';
import { AcceptRejectModal } from './AcceptRejectModal';
import { StudentProfileQuickView } from './StudentProfileQuickView';

interface ApplicationReviewProps {
  activityId: string;
}

interface Application {
  id: string;
  user_id: string;
  status: string;
  motivation: string;
  availability: string;
  experience: string;
  applied_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  custom_message: string | null;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string | null;
    faculty: string;
    specialization: string;
    year: number;
    program_type: string;
    completed_activities: number;
    certificates_earned: number;
  };
}

export function ApplicationReview({ activityId }: ApplicationReviewProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAcceptRejectModalOpen, setIsAcceptRejectModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  async function fetchApplications() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/activities/${activityId}/applications`);

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Eroare la încărcarea aplicațiilor');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
  };

  const handleViewProfile = (app: Application) => {
    setSelectedApplication(app);
    setIsProfileModalOpen(true);
  };

  const handleAcceptClick = (app: Application) => {
    setSelectedApplication(app);
    setActionType('accept');
    setIsAcceptRejectModalOpen(true);
  };

  const handleRejectClick = (app: Application) => {
    setSelectedApplication(app);
    setActionType('reject');
    setIsAcceptRejectModalOpen(true);
  };

  const handleBulkToggle = (appId: string) => {
    const newSelected = new Set(selectedForBulk);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedForBulk(newSelected);
  };

  const handleBulkAccept = () => {
    if (selectedForBulk.size === 0) {
      toast.error('Selectează cel puțin o aplicație');
      return;
    }
    setActionType('accept');
    setIsAcceptRejectModalOpen(true);
  };

  const handleBulkReject = () => {
    if (selectedForBulk.size === 0) {
      toast.error('Selectează cel puțin o aplicație');
      return;
    }
    setActionType('reject');
    setIsAcceptRejectModalOpen(true);
  };

  const handleActionComplete = () => {
    fetchApplications();
    setSelectedForBulk(new Set());
    setIsAcceptRejectModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Se încarcă aplicațiile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Caută după nume sau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="ALL">Toate</option>
          <option value="PENDING">În Așteptare</option>
          <option value="CONFIRMED">Acceptate</option>
          <option value="CANCELLED">Respinse</option>
          <option value="WAITLISTED">Listă Așteptare</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedForBulk.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
          <span className="text-sm">{selectedForBulk.size} aplicații selectate</span>
          <Button
            size="sm"
            onClick={handleBulkAccept}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckSquare className="h-4 w-4" />
            Acceptă Selectate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkReject}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <XSquare className="h-4 w-4" />
            Respinge Selectate
          </Button>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredApplications.length} aplicații găsite
      </p>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Checkbox for bulk selection */}
              {app.status === 'PENDING' && (
                <Checkbox
                  checked={selectedForBulk.has(app.id)}
                  onCheckedChange={() => handleBulkToggle(app.id)}
                  className="mt-1"
                />
              )}

              {/* Avatar */}
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0">
                <span className="text-lg">
                  {app.student.first_name[0]}
                  {app.student.last_name[0]}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-primary">
                    {app.student.first_name} {app.student.last_name}
                  </h4>
                  <Badge variant="outline">Anul {app.student.year}</Badge>
                  <Badge className={getStatusBadgeClass(app.status)}>
                    {getStatusLabel(app.status)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {app.student.specialization} • {app.student.email}
                </p>

                <p className="text-sm mb-2 line-clamp-2">{app.motivation}</p>

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Activități: {app.student.completed_activities}</span>
                  <span>Certificate: {app.student.certificates_earned}</span>
                  <span>Aplicat: {new Date(app.applied_at).toLocaleDateString('ro-RO')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewProfile(app)}
                    variant="outline"
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profil
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleViewDetails(app)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Detalii
                  </Button>
                </div>
                {app.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptClick(app)}
                      className="gap-2 bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Acceptă
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectClick(app)}
                      className="gap-2 text-destructive hover:text-destructive flex-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Respinge
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedApplication && (
        <>
          <ApplicationDetailView
            application={selectedApplication}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            onAccept={() => handleAcceptClick(selectedApplication)}
            onReject={() => handleRejectClick(selectedApplication)}
          />

          <StudentProfileQuickView
            student={selectedApplication.student}
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
          />
        </>
      )}

      {/* Accept/Reject Modal - can be used for both individual and bulk actions */}
      {(selectedApplication || selectedForBulk.size > 0) && (
        <AcceptRejectModal
          isOpen={isAcceptRejectModalOpen}
          onClose={() => setIsAcceptRejectModalOpen(false)}
          actionType={actionType}
          activityId={activityId}
          applicationIds={
            selectedForBulk.size > 0
              ? Array.from(selectedForBulk)
              : selectedApplication
                ? [selectedApplication.id]
                : []
          }
          isBulk={selectedForBulk.size > 0}
          onComplete={handleActionComplete}
        />
      )}
    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-600 text-white';
    case 'CONFIRMED':
      return 'bg-green-600 text-white';
    case 'CANCELLED':
      return 'bg-red-600 text-white';
    case 'WAITLISTED':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'PENDING':
      return 'În Așteptare';
    case 'CONFIRMED':
      return 'Acceptat';
    case 'CANCELLED':
      return 'Respins';
    case 'WAITLISTED':
      return 'Listă Așteptare';
    default:
      return status;
  }
}
