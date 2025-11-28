import type { Metadata } from 'next';
import { UserList } from '@/components/admin';

export const metadata: Metadata = {
  title: 'Gestionare Utilizatori | Campus Connect',
  description: 'Administrează utilizatorii platformei',
};

export default function AdminUsersPage() {
  return <UserList />;
}
