import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export const metadata = {
  title: 'Notificări | Campus Connect',
  description: 'Vizualizează și gestionează notificările tale',
};

export default function ProfessorNotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <NotificationCenter />
    </div>
  );
}
