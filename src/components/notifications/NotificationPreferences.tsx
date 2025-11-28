'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { NotificationPreferences as NotificationPreferencesType } from '@/types/notification';

interface PreferenceCategory {
  key: string;
  label: string;
  description: string;
  emailKey: keyof NotificationPreferencesType;
  inAppKey: keyof NotificationPreferencesType;
}

const PREFERENCE_CATEGORIES: PreferenceCategory[] = [
  {
    key: 'applications',
    label: 'Aplicații',
    description: 'Notificări despre statusul aplicațiilor (acceptat, respins, lista de așteptare)',
    emailKey: 'email_applications',
    inAppKey: 'in_app_applications',
  },
  {
    key: 'hours',
    label: 'Ore voluntariat',
    description: 'Notificări despre aprobarea sau respingerea orelor de voluntariat',
    emailKey: 'email_hours',
    inAppKey: 'in_app_hours',
  },
  {
    key: 'activity_updates',
    label: 'Actualizări activități',
    description: 'Notificări despre schimbări în activitățile la care ești înscris',
    emailKey: 'email_activity_updates',
    inAppKey: 'in_app_activity_updates',
  },
  {
    key: 'reminders',
    label: 'Reminder-uri',
    description: 'Reminder-uri pentru sesiuni viitoare (24h și 1h înainte)',
    emailKey: 'email_reminders',
    inAppKey: 'in_app_reminders',
  },
  {
    key: 'general',
    label: 'General',
    description: 'Anunțuri generale și noutăți de pe platformă',
    emailKey: 'email_general',
    inAppKey: 'in_app_general',
  },
];

const DEFAULT_PREFERENCES: NotificationPreferencesType = {
  email_applications: true,
  email_hours: true,
  email_activity_updates: true,
  email_reminders: true,
  email_general: false,
  in_app_applications: true,
  in_app_hours: true,
  in_app_activity_updates: true,
  in_app_reminders: true,
  in_app_general: true,
};

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferencesType>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] =
    useState<NotificationPreferencesType>(DEFAULT_PREFERENCES);

  // Fetch current preferences
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch('/api/users/me/notifications');
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
          setOriginalPreferences(data);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
    setHasChanges(changed);
  }, [preferences, originalPreferences]);

  const handleToggle = (key: keyof NotificationPreferencesType) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/users/me/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setOriginalPreferences(preferences);
      setHasChanges(false);
      toast.success('Preferințele tale de notificări au fost actualizate.');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Nu am putut salva preferințele. Te rugăm să încerci din nou.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableAll = (channel: 'email' | 'in_app') => {
    setPreferences((prev) => {
      const updated = { ...prev };
      PREFERENCE_CATEGORIES.forEach((cat) => {
        const key = channel === 'email' ? cat.emailKey : cat.inAppKey;
        updated[key] = true;
      });
      return updated;
    });
  };

  const handleDisableAll = (channel: 'email' | 'in_app') => {
    setPreferences((prev) => {
      const updated = { ...prev };
      PREFERENCE_CATEGORIES.forEach((cat) => {
        const key = channel === 'email' ? cat.emailKey : cat.inAppKey;
        updated[key] = false;
      });
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Preferințe notificări</h2>
          <p className="text-muted-foreground">Alege cum vrei să primești notificările</p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvează
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notificări prin email</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEnableAll('email')}>
                Activează toate
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDisableAll('email')}>
                Dezactivează toate
              </Button>
            </div>
          </div>
          <CardDescription>Primește notificări importante pe adresa ta de email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {PREFERENCE_CATEGORIES.map((category) => (
            <div key={category.emailKey} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={category.emailKey}>{category.label}</Label>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Switch
                id={category.emailKey}
                checked={preferences[category.emailKey]}
                onCheckedChange={() => handleToggle(category.emailKey)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notificări în aplicație</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEnableAll('in_app')}>
                Activează toate
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDisableAll('in_app')}>
                Dezactivează toate
              </Button>
            </div>
          </div>
          <CardDescription>Notificări care apar în meniul de notificări din header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {PREFERENCE_CATEGORIES.map((category) => (
            <div key={category.inAppKey} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={category.inAppKey}>{category.label}</Label>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Switch
                id={category.inAppKey}
                checked={preferences[category.inAppKey]}
                onCheckedChange={() => handleToggle(category.inAppKey)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="shadow-lg">
            <CardContent className="flex items-center gap-4 p-4">
              <p className="text-sm">Ai modificări nesalvate</p>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvează'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
