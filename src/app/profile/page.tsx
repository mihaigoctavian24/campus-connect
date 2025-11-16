import { Mail, Phone, Calendar, User, Clock, FolderOpen, CheckCircle } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="border-b border-gray-200 bg-white px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-xl font-medium text-[#001f3f]">My Profile</h1>
          <p className="text-gray-500">
            Manage your information and track your volunteer applications
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-[380px_1fr] gap-8">
          {/* Left Column - Profile Card */}
          <aside className="space-y-6">
            {/* Profile Info Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <div className="flex size-24 items-center justify-center rounded-lg bg-[#001f3f]">
                  <User className="size-12 text-white" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="mb-6 text-center">
                <h2 className="mb-1 text-lg font-medium text-[#001f3f]">Jane Smith</h2>
                <p className="text-sm text-gray-500">Junior, Computer Science</p>
              </div>

              {/* Contact Info */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail className="size-4 text-gray-400" />
                  <span>jane.smith@university.edu</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Phone className="size-4 text-gray-400" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Calendar className="size-4 text-gray-400" />
                  <span>Class of 2026</span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#001f3f] transition hover:bg-gray-50">
                Edit Profile
              </button>
            </div>

            {/* Volunteer Stats Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-medium text-[#001f3f]">Volunteer Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="size-4 text-[gold]" />
                    <span>Total Hours</span>
                  </div>
                  <span className="font-medium text-[#001f3f]">42 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FolderOpen className="size-4 text-[gold]" />
                    <span>Active Projects</span>
                  </div>
                  <span className="font-medium text-[#001f3f]">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="size-4 text-[gold]" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium text-[#001f3f]">5</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column - Applications & Saved */}
          <main className="space-y-8">
            {/* My Applications */}
            <section>
              <h2 className="mb-6 text-lg font-medium text-[#001f3f]">My Applications</h2>
              <div className="space-y-4">
                {/* Application 1 - Under Review */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-medium text-[#001f3f]">STEM Mentorship Program</h3>
                      <p className="mb-2 text-sm text-gray-500">Engineering Society</p>
                      <p className="text-xs text-gray-400">Applied: 11/1/2025</p>
                    </div>
                    <span className="rounded-full bg-[gold]/20 px-3 py-1 text-xs font-medium text-[#001f3f]">
                      Under Review
                    </span>
                  </div>
                </div>

                {/* Application 2 - Accepted */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-medium text-[#001f3f]">
                        Community Outreach Coordinator
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">Student Volunteer Center</p>
                      <p className="text-xs text-gray-400">Applied: 10/15/2025</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Accepted
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Saved Opportunities */}
            <section>
              <h2 className="mb-6 text-lg font-medium text-[#001f3f]">Saved Opportunities</h2>
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <p className="mb-2 text-gray-500">No saved opportunities</p>
                <p className="text-sm text-gray-400">Save opportunities to apply later</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
