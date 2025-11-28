import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
