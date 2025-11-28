import type { Metadata } from 'next';
import { ProfessorApprovalQueue } from '@/components/admin';

export const metadata: Metadata = {
  title: 'Aprobare Profesori | Campus Connect',
  description: 'Gestionează cererile de acces pentru rol de profesor',
};

export default function AdminProfessorsPage() {
  return <ProfessorApprovalQueue />;
}
