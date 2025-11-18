import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle } from 'lucide-react';

interface PendingActionsProps {
  newApplications: number;
  pendingHours: number;
  upcomingSessions: number;
  onNavigate: (tab: string) => void;
}

export function PendingActions({
  newApplications,
  pendingHours,
  upcomingSessions,
  onNavigate,
}: PendingActionsProps) {
  const hasPending = newApplications > 0 || pendingHours > 0 || upcomingSessions > 0;

  if (!hasPending) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-primary mb-1">Totul la zi!</h3>
            <p className="text-sm text-muted-foreground">Nu ai acțiuni pendinte în acest moment</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-primary mb-3">Acțiuni Pendinte</h3>
      <div className="space-y-2">
        {newApplications > 0 && (
          <button
            onClick={() => onNavigate('opportunities')}
            className="w-full p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-primary">Aplicații Noi</p>
                  <p className="text-xs text-muted-foreground">Necesită revizuire</p>
                </div>
              </div>
              <Badge className="bg-blue-600">{newApplications}</Badge>
            </div>
          </button>
        )}

        {pendingHours > 0 && (
          <button
            onClick={() => onNavigate('opportunities')}
            className="w-full p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-primary">Ore de Validat</p>
                  <p className="text-xs text-muted-foreground">Studenți așteaptă aprobare</p>
                </div>
              </div>
              <Badge className="bg-yellow-600">{pendingHours}</Badge>
            </div>
          </button>
        )}

        {upcomingSessions > 0 && (
          <button
            onClick={() => onNavigate('sessions')}
            className="w-full p-3 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-primary">Sesiuni Următoare</p>
                  <p className="text-xs text-muted-foreground">În următoarele 7 zile</p>
                </div>
              </div>
              <Badge className="bg-purple-600">{upcomingSessions}</Badge>
            </div>
          </button>
        )}
      </div>
    </Card>
  );
}
