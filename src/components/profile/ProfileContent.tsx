'use client';

import { useState } from 'react';
import { User, Mail, Phone, BookOpen, Award, Calendar, Clock } from 'lucide-react';
import type { Application } from '@/components/dashboard/MyApplications';
import { AchievementBadges } from './AchievementBadges';
import { EditProfileModal } from './EditProfileModal';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
  faculty: string | null;
  specialization: string | null;
  year: number | null;
  program_type: string | null;
  profile_picture_url: string | null;
  created_at: string;
}

interface Stats {
  totalHours: number;
  activeOpportunities: number;
  completedOpportunities: number;
}

interface ProfileContentProps {
  profile: Profile;
  stats: Stats;
  applications: Application[];
  showApplications?: boolean; // Optional prop to control applications display
  onSaveProfile: (data: any) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>;
  onRemoveAvatar: () => Promise<void>;
}

export function ProfileContent({
  profile,
  stats,
  applications,
  showApplications = true,
  onSaveProfile,
  onUploadAvatar,
  onRemoveAvatar,
}: ProfileContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Application['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Accepted';
      case 'PENDING':
        return 'Under Review';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001f3f] mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your information and track your volunteer applications
        </p>
      </div>

      <div
        className={`grid grid-cols-1 gap-8 ${
          profile.role === 'STUDENT' && showApplications
            ? 'lg:grid-cols-3'
            : profile.role === 'STUDENT'
              ? 'lg:grid-cols-2'
              : 'lg:grid-cols-1 max-w-2xl mx-auto'
        }`}
      >
        {/* Profile Information - Merged with Stats */}
        <div
          className={`${profile.role === 'STUDENT' && showApplications ? 'lg:col-span-1' : ''}`}
        >
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {/* User Info Section */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-200">
              <div className="w-24 h-24 bg-[#001f3f] rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#001f3f] mb-1">
                {profile.full_name ||
                 (profile.first_name && profile.last_name
                   ? `${profile.first_name} ${profile.last_name}`
                   : profile.email.split('@')[0])}
              </h2>
              <p className="text-gray-600 capitalize">{profile.role?.toLowerCase()}</p>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 break-all">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Member since {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>

            {/* Stats Section - Only for students */}
            {profile.role === 'STUDENT' && (
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#001f3f] mb-4">Volunteer Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[gold]" />
                      <span className="text-sm text-gray-700">Total Hours</span>
                    </div>
                    <span className="font-semibold text-[#001f3f]">{stats.totalHours} hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[gold]" />
                      <span className="text-sm text-gray-700">Active Projects</span>
                    </div>
                    <span className="font-semibold text-[#001f3f]">
                      {stats.activeOpportunities}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[gold]" />
                      <span className="text-sm text-gray-700">Completed</span>
                    </div>
                    <span className="font-semibold text-[#001f3f]">
                      {stats.completedOpportunities}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full mt-6 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          profile={profile}
          onSave={onSaveProfile}
          onUploadAvatar={onUploadAvatar}
          onRemoveAvatar={onRemoveAvatar}
        />

        {/* Achievement Badges Column - Only in dashboard profile (no applications) */}
        {profile.role === 'STUDENT' && !showApplications && (
          <div>
            <AchievementBadges
              totalHours={stats.totalHours}
              activeOpportunities={stats.activeOpportunities}
              completedOpportunities={stats.completedOpportunities}
            />
          </div>
        )}

        {/* Applications - Only for students and only if showApplications is true */}
        {profile.role === 'STUDENT' && showApplications && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-[#001f3f]">My Applications</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {application.activityTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{application.activityCategory}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                      {application.respondedAt && (
                        <span>
                          Responded: {new Date(application.respondedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {applications.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-600">No applications yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start exploring opportunities to apply
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* For Professors and Admins - show role-specific content */}
        {profile.role !== 'STUDENT' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-[#001f3f] mb-2">
                  {profile.role === 'PROFESSOR' ? 'Professor' : 'Administrator'} Profile
                </h2>
                <p className="text-gray-600">
                  {profile.role === 'PROFESSOR'
                    ? 'Manage your opportunities and track student applications from your dashboard.'
                    : 'Manage users, activities, and system settings from your dashboard.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
