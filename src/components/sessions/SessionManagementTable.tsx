'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  qr_code_data?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

interface SessionManagementTableProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onCancel: (sessionId: string) => void;
  onReschedule: (session: Session) => void;
  isLoading?: boolean;
}

export function SessionManagementTable({
  sessions,
  onEdit,
  onCancel,
  onReschedule,
  isLoading = false,
}: SessionManagementTableProps) {
  const [selectedSession] = useState<string | null>(null);

  const getStatusBadge = (status: Session['status']) => {
    const statusConfig = {
      SCHEDULED: {
        label: 'Programată',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      IN_PROGRESS: {
        label: 'În Desfășurare',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      COMPLETED: {
        label: 'Finalizată',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      CANCELLED: {
        label: 'Anulată',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, dd MMMM yyyy', { locale: ro });
    } catch {
      return dateString;
    }
  };

  const isPastSession = (dateString: string, endTime: string) => {
    const sessionDateTime = new Date(`${dateString}T${endTime}`);
    return sessionDateTime < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-gray-600">Se încarcă sesiunile...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <Calendar className="mx-auto mb-4 size-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-[#001f3f]">Nicio Sesiune</h3>
        <p className="text-gray-600">
          Nu există sesiuni create pentru această activitate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Dată & Oră
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Locație
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Participanți
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sessions.map((session) => {
                const isPast = isPastSession(session.date, session.end_time);
                const isEditable = session.status === 'SCHEDULED' && !isPast;

                return (
                  <tr
                    key={session.id}
                    className={`hover:bg-gray-50 transition ${
                      selectedSession === session.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#001f3f]">
                            {formatDate(session.date)}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="size-3" />
                            {session.start_time} - {session.end_time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{session.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {session.max_participants ? `Max ${session.max_participants}` : 'Nelimitat'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(session.status)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditable && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(session)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => onReschedule(session)}
                              className="text-amber-600 hover:bg-amber-50"
                            >
                              <Calendar className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  confirm(
                                    'Sigur vrei să anulezi această sesiune? Studenții înrolați vor fi notificați.'
                                  )
                                ) {
                                  onCancel(session.id);
                                }
                              }}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </>
                        )}
                        {!isEditable && (
                          <span className="text-xs text-gray-400">
                            {isPast ? 'Trecută' : 'Nu poate fi editată'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {sessions.map((session) => {
            const isPast = isPastSession(session.date, session.end_time);
            const isEditable = session.status === 'SCHEDULED' && !isPast;

            return (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#001f3f]">{formatDate(session.date)}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="size-3" />
                      {session.start_time} - {session.end_time}
                    </p>
                  </div>
                  {getStatusBadge(session.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-gray-400" />
                    <span className="text-gray-700">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-gray-400" />
                    <span className="text-gray-700">
                      {session.max_participants ? `Max ${session.max_participants}` : 'Nelimitat'}
                    </span>
                  </div>
                </div>

                {isEditable && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(session)}
                      className="flex-1 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="mr-2 size-4" />
                      Editează
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onReschedule(session)}
                      className="flex-1 text-amber-600 hover:bg-amber-50"
                    >
                      <Calendar className="mr-2 size-4" />
                      Reprogramează
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (
                          confirm(
                            'Sigur vrei să anulezi această sesiune? Studenții înrolați vor fi notificați.'
                          )
                        ) {
                          onCancel(session.id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
