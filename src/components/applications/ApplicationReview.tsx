'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  User,
  CheckSquare,
  XSquare,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { ApplicationDetailView } from './ApplicationDetailView';
import { AcceptModal } from './AcceptModal';
import { RejectModal } from './RejectModal';
import { StudentProfileModal } from './StudentProfileModal';
import { WaitingListPanel } from './WaitingListPanel';

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
  professor_notes: string | null;
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
  const [activityDetails, setActivityDetails] = useState<{
    max_participants: number;
    current_participants: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set());

  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'year'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchApplications();
    fetchActivityDetails();
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

  async function fetchActivityDetails() {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivityDetails({
          max_participants: data.max_participants,
          current_participants: data.current_participants,
        });
      }
    } catch (error) {
      console.error('Error fetching activity details:', error);
    }
  }

  // Get unique faculties for filter
  const uniqueFaculties = Array.from(
    new Set(applications.map((app) => app.student.faculty).filter(Boolean))
  ).sort();

  const filteredAndSortedApplications = applications
    .filter((app) => {
      // Search filter
      const matchesSearch =
        app.student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.student.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

      // Faculty filter
      const matchesFaculty = facultyFilter === 'ALL' || app.student.faculty === facultyFilter;

      // Date range filter
      const applicationDate = new Date(app.applied_at);
      const matchesDateFrom = !dateFrom || applicationDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || applicationDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesStatus && matchesFaculty && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          const nameA = `${a.student.last_name} ${a.student.first_name}`.toLowerCase();
          const nameB = `${b.student.last_name} ${b.student.first_name}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'date':
          comparison = new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime();
          break;
        case 'year':
          comparison = (a.student.year || 0) - (b.student.year || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
  };

  const handleViewProfile = (app: Application) => {
    setSelectedApplication(app);
    setSelectedStudentId(app.user_id);
    setIsProfileModalOpen(true);
  };

  const handleAcceptClick = (app: Application) => {
    setSelectedApplication(app);
    setIsAcceptModalOpen(true);
  };

  const handleRejectClick = (app: Application) => {
    setSelectedApplication(app);
    setIsRejectModalOpen(true);
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
    setIsAcceptModalOpen(true);
  };

  const handleBulkReject = () => {
    if (selectedForBulk.size === 0) {
      toast.error('Selectează cel puțin o aplicație');
      return;
    }
    setIsRejectModalOpen(true);
  };

  const handleActionComplete = () => {
    fetchApplications();
    fetchActivityDetails();
    setSelectedForBulk(new Set());
    setIsAcceptModalOpen(false);
    setIsRejectModalOpen(false);
  };

  const handlePromote = async (app: Application) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/enrollments/${app.id}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custom_message:
            'Felicitări! Un loc s-a eliberat și ai fost promovat din lista de așteptare. Te așteptăm!',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to promote from waitlist');
      }

      toast.success('Student promovat cu succes din lista de așteptare!');
      handleActionComplete();
    } catch (error) {
      console.error('Error promoting student:', error);
      toast.error('Eroare la promovarea studentului');
    }
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

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtre Avansate
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card className="p-4 space-y-4 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Faculty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Facultate</label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="ALL">Toate facultățile</option>
                {uniqueFaculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de la</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data până la</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Reset Filters Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFacultyFilter('ALL');
              setDateFrom('');
              setDateTo('');
            }}
            className="text-xs"
          >
            Resetează filtrele avansate
          </Button>
        </Card>
      )}

      {/* Sorting Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sortare:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'year')}
          className="px-3 py-1.5 border rounded-md text-sm"
        >
          <option value="date">Dată aplicare</option>
          <option value="name">Nume</option>
          <option value="year">An studiu</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-3 py-1.5 border rounded-md text-sm"
        >
          <option value="desc">Descrescător</option>
          <option value="asc">Crescător</option>
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
        {filteredAndSortedApplications.length} aplicații găsite
      </p>

      {/* Waiting List Panel or Applications List */}
      {statusFilter === 'WAITLISTED' ? (
        <WaitingListPanel
          applications={filteredAndSortedApplications}
          activityId={activityId}
          onViewProfile={handleViewProfile}
          onViewDetails={handleViewDetails}
          onPromote={handlePromote}
          availableSlots={
            activityDetails
              ? activityDetails.max_participants - activityDetails.current_participants
              : 0
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredAndSortedApplications.map((app) => (
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
      )}

      {/* Modals */}
      {selectedApplication && (
        <>
          <ApplicationDetailView
            application={selectedApplication}
            activityId={activityId}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            onAccept={() => handleAcceptClick(selectedApplication)}
            onReject={() => handleRejectClick(selectedApplication)}
            onNotesUpdate={fetchApplications}
          />

          <StudentProfileModal
            studentId={selectedStudentId}
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
          />
        </>
      )}

      {/* Accept Modal */}
      {(selectedApplication || selectedForBulk.size > 0) && (
        <AcceptModal
          isOpen={isAcceptModalOpen}
          onClose={() => setIsAcceptModalOpen(false)}
          activityId={activityId}
          applicationIds={
            selectedForBulk.size > 0
              ? Array.from(selectedForBulk)
              : selectedApplication
                ? [selectedApplication.id]
                : []
          }
          studentNames={
            selectedForBulk.size > 0
              ? Array.from(selectedForBulk)
                  .map((id) => {
                    const app = applications.find((a) => a.id === id);
                    return app
                      ? `${app.student.first_name} ${app.student.last_name}`
                      : '';
                  })
                  .filter(Boolean)
              : selectedApplication
                ? [`${selectedApplication.student.first_name} ${selectedApplication.student.last_name}`]
                : []
          }
          isBulk={selectedForBulk.size > 0}
          onComplete={handleActionComplete}
        />
      )}

      {/* Reject Modal */}
      {(selectedApplication || selectedForBulk.size > 0) && (
        <RejectModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          activityId={activityId}
          applicationIds={
            selectedForBulk.size > 0
              ? Array.from(selectedForBulk)
              : selectedApplication
                ? [selectedApplication.id]
                : []
          }
          studentNames={
            selectedForBulk.size > 0
              ? Array.from(selectedForBulk)
                  .map((id) => {
                    const app = applications.find((a) => a.id === id);
                    return app
                      ? `${app.student.first_name} ${app.student.last_name}`
                      : '';
                  })
                  .filter(Boolean)
              : selectedApplication
                ? [`${selectedApplication.student.first_name} ${selectedApplication.student.last_name}`]
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
