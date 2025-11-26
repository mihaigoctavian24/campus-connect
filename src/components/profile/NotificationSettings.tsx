'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Bell, Mail, MessageSquare } from 'lucide-react';

interface NotificationPreferences {
  email_applications: boolean;
  email_hours: boolean;
  email_activity_updates: boolean;
  email_reminders: boolean;
  email_general: boolean;
  in_app_applications: boolean;
  in_app_hours: boolean;
  in_app_activity_updates: boolean;
  in_app_reminders: boolean;
  in_app_general: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => Promise<void>;
  role: string;
}

export function NotificationSettings({ preferences, onSave, role }: NotificationSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      await onSave(localPreferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvarea preferințelor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStudent = role === 'STUDENT';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#001f3f] mb-2">Preferințe Notificări</h3>
        <p className="text-sm text-gray-600">
          Alege cum dorești să primești notificări pentru diferite tipuri de evenimente
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
          Preferințele au fost salvate cu succes!
        </div>
      )}

      <div className="space-y-6">
        {/* Applications Notifications - For Students */}
        {isStudent && (
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#001f3f]" />
              <h4 className="font-medium text-[#001f3f]">Aplicații & Înscrieri</h4>
            </div>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_applications" className="font-normal">
                    Actualizări aplicații (acceptat/respins)
                  </Label>
                  <p className="text-xs text-gray-500">
                    Primește notificări când aplicația ta este procesată
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Email</span>
                      <Switch
                        id="email_applications"
                        checked={localPreferences.email_applications}
                        onCheckedChange={() => handleToggle('email_applications')}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">În aplicație</span>
                      <Switch
                        checked={localPreferences.in_app_applications}
                        onCheckedChange={() => handleToggle('in_app_applications')}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hours Validation - For Students */}
        {isStudent && (
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#001f3f]" />
              <h4 className="font-medium text-[#001f3f]">Validare Ore</h4>
            </div>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_hours" className="font-normal">
                    Ore aprobate/respinse
                  </Label>
                  <p className="text-xs text-gray-500">
                    Notificări când profesorul validează sau respinge orele tale
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Email</span>
                      <Switch
                        id="email_hours"
                        checked={localPreferences.email_hours}
                        onCheckedChange={() => handleToggle('email_hours')}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">În aplicație</span>
                      <Switch
                        checked={localPreferences.in_app_hours}
                        onCheckedChange={() => handleToggle('in_app_hours')}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Updates */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#001f3f]" />
            <h4 className="font-medium text-[#001f3f]">Actualizări Activități</h4>
          </div>
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_activity_updates" className="font-normal">
                  Modificări activități
                </Label>
                <p className="text-xs text-gray-500">
                  {isStudent
                    ? 'Modificări la activitățile la care ești înscris'
                    : 'Actualizări pentru activitățile tale'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">Email</span>
                    <Switch
                      id="email_activity_updates"
                      checked={localPreferences.email_activity_updates}
                      onCheckedChange={() => handleToggle('email_activity_updates')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">În aplicație</span>
                    <Switch
                      checked={localPreferences.in_app_activity_updates}
                      onCheckedChange={() => handleToggle('in_app_activity_updates')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#001f3f]" />
            <h4 className="font-medium text-[#001f3f]">Mementouri</h4>
          </div>
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_reminders" className="font-normal">
                  Mementouri activități
                </Label>
                <p className="text-xs text-gray-500">
                  {isStudent
                    ? 'Amintiri despre sesiuni viitoare și deadline-uri'
                    : 'Reminder-e pentru sesiunile tale programate'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">Email</span>
                    <Switch
                      id="email_reminders"
                      checked={localPreferences.email_reminders}
                      onCheckedChange={() => handleToggle('email_reminders')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">În aplicație</span>
                    <Switch
                      checked={localPreferences.in_app_reminders}
                      onCheckedChange={() => handleToggle('in_app_reminders')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Announcements */}
        <div className="pb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#001f3f]" />
            <h4 className="font-medium text-[#001f3f]">Anunțuri Generale</h4>
          </div>
          <div className="space-y-3 ml-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email_general" className="font-normal">
                  Newsletter și anunțuri platformă
                </Label>
                <p className="text-xs text-gray-500">
                  Noutăți despre platformă și oportunități noi
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">Email</span>
                    <Switch
                      id="email_general"
                      checked={localPreferences.email_general}
                      onCheckedChange={() => handleToggle('email_general')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">În aplicație</span>
                    <Switch
                      checked={localPreferences.in_app_general}
                      onCheckedChange={() => handleToggle('in_app_general')}
                      className="data-[state=checked]:bg-[#FFD700] data-[state=unchecked]:bg-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-gray-200 pt-6">
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-[#001f3f] hover:bg-[#003366] text-white"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvează Preferințele
        </Button>
      </div>
    </div>
  );
}
