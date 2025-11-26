'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { getStudentStats } from '@/lib/services/student-stats.service';
import { getStudentApplications } from '@/lib/services/applications.service';
import type { Application } from '@/components/dashboard/MyApplications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: string;
  phone: string | null;
  profile_picture_url: string | null;
  faculty: string | null;
  specialization: string | null;
  year: number | null;
  program_type: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalHours: 0,
    activeOpportunities: 0,
    completedOpportunities: 0,
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [router]);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  async function loadProfileData() {
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>();

      if (!userProfile) {
        router.push('/auth/login');
        return;
      }

      setProfile(userProfile);

      // Load stats and applications for students
      if (userProfile.role === 'STUDENT') {
        try {
          const [studentStats, studentApplications] = await Promise.all([
            getStudentStats(user.id),
            getStudentApplications(user.id),
          ]);
          setStats(studentStats);
          setApplications(studentApplications);
        } catch {
          // Error loading student data - stats will remain at defaults
        }
      }

      // Load notification preferences
      try {
        const response = await fetch('/api/users/me/notifications');
        if (response.ok) {
          const prefs = await response.json();
          setNotificationPreferences(prefs);
        }
      } catch {
        // Use defaults if API fails
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (data: any) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setProfile(result.profile);

      showNotification('success', 'Profile updated successfully');

      // Reload profile data
      await loadProfileData();
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to update profile'
      );
      throw error;
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/users/me/avatar', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const result = await response.json();

      showNotification('success', 'Avatar uploaded successfully');

      // Reload profile data
      await loadProfileData();

      return result.avatarUrl;
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to upload avatar');
      throw error;
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch('/api/users/me/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove avatar');
      }

      showNotification('success', 'Avatar removed successfully');

      // Reload profile data
      await loadProfileData();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to remove avatar');
      throw error;
    }
  };

  const handleSaveNotifications = async (preferences: any) => {
    try {
      const response = await fetch('/api/users/me/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      setNotificationPreferences(preferences);

      showNotification('success', 'Notification preferences updated');
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to update preferences'
      );
      throw error;
    }
  };

  const handleChangePassword = async (_currentPassword: string, newPassword: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      showNotification('success', 'Password changed successfully');
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to change password'
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#001f3f] mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your information, notifications, and account settings
          </p>
        </div>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="view" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">View Profile</span>
              <span className="sm:hidden">View</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notify</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* View Profile Tab */}
          <TabsContent value="view">
            <ProfileContent
              profile={profile}
              stats={stats}
              applications={applications}
              showApplications={true}
              onSaveProfile={handleSaveProfile}
              onUploadAvatar={handleUploadAvatar}
              onRemoveAvatar={handleRemoveAvatar}
            />
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {/* Avatar Upload Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#001f3f] mb-6">Profile Picture</h3>
                <AvatarUpload
                  currentAvatarUrl={profile.profile_picture_url}
                  onUpload={handleUploadAvatar}
                  onRemove={profile.profile_picture_url ? handleRemoveAvatar : undefined}
                  userName={profile.full_name || profile.email}
                />
              </div>

              {/* Profile Edit Form */}
              <ProfileEditForm
                profile={{
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  phone: profile.phone,
                  faculty: profile.faculty,
                  specialization: profile.specialization,
                  year: profile.year,
                  program_type: profile.program_type,
                  role: profile.role,
                }}
                onSave={handleSaveProfile}
                onCancel={() => {
                  // Switch back to view tab
                  const viewTab = document.querySelector(
                    '[data-state="active"][value="view"]'
                  ) as HTMLElement;
                  viewTab?.click();
                }}
              />
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {notificationPreferences && (
                <NotificationSettings
                  preferences={notificationPreferences}
                  onSave={handleSaveNotifications}
                  role={profile.role}
                />
              )}
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <AccountSettings onChangePassword={handleChangePassword} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
