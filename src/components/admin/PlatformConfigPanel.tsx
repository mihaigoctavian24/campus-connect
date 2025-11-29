'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Settings,
  Save,
  RefreshCw,
  Plus,
  Globe,
  Clock,
  Users,
  Bell,
  Award,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface PlatformConfig {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description: string | null;
  is_public: boolean;
  updated_at: string;
  updater: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  general: <Globe className="h-4 w-4" />,
  volunteering: <Users className="h-4 w-4" />,
  activities: <Clock className="h-4 w-4" />,
  attendance: <CheckCircle className="h-4 w-4" />,
  enrollments: <Users className="h-4 w-4" />,
  certificates: <Award className="h-4 w-4" />,
  notifications: <Bell className="h-4 w-4" />,
  system: <Shield className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  volunteering: 'Voluntariat',
  activities: 'Activități',
  attendance: 'Prezență',
  enrollments: 'Înscrieri',
  certificates: 'Certificate',
  notifications: 'Notificări',
  system: 'Sistem',
};

export function PlatformConfigPanel() {
  const [, setConfigs] = useState<PlatformConfig[]>([]);
  const [groupedConfigs, setGroupedConfigs] = useState<Record<string, PlatformConfig[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, unknown>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newConfig, setNewConfig] = useState({
    key: '',
    value: '',
    category: 'general',
    description: '',
    is_public: false,
  });

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/config');
      if (!response.ok) throw new Error('Failed to fetch configs');

      const data = await response.json();
      setConfigs(data.configs);
      setGroupedConfigs(data.groupedConfigs);

      // Initialize edited values
      const initialValues: Record<string, unknown> = {};
      data.configs.forEach((config: PlatformConfig) => {
        initialValues[config.key] = parseConfigValue(config.value);
      });
      setEditedValues(initialValues);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Eroare la încărcarea configurărilor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const parseConfigValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value: editedValues[key],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update config');
      }

      toast.success('Configurare actualizată cu succes');
      fetchConfigs();
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la actualizare');
    } finally {
      setSaving(null);
    }
  };

  const handleAddConfig = async () => {
    try {
      let parsedValue: unknown = newConfig.value;
      try {
        parsedValue = JSON.parse(newConfig.value);
      } catch {
        // Keep as string if not valid JSON
      }

      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newConfig,
          value: parsedValue,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create config');
      }

      toast.success('Configurare adăugată cu succes');
      setShowAddDialog(false);
      setNewConfig({
        key: '',
        value: '',
        category: 'general',
        description: '',
        is_public: false,
      });
      fetchConfigs();
    } catch (error) {
      console.error('Error creating config:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la creare');
    }
  };

  const renderConfigInput = (config: PlatformConfig) => {
    const value = editedValues[config.key];
    const originalValue = parseConfigValue(config.value);
    const hasChanged = JSON.stringify(value) !== JSON.stringify(originalValue);

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                setEditedValues((prev) => ({ ...prev, [config.key]: checked }))
              }
            />
            <span className="text-sm">{value ? 'Activat' : 'Dezactivat'}</span>
          </div>
          {hasChanged && (
            <Button
              size="sm"
              onClick={() => handleSave(config.key)}
              disabled={saving === config.key}
            >
              {saving === config.key ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setEditedValues((prev) => ({ ...prev, [config.key]: parseInt(e.target.value) || 0 }))
            }
            className="w-32"
          />
          {hasChanged && (
            <Button
              size="sm"
              onClick={() => handleSave(config.key)}
              disabled={saving === config.key}
            >
              {saving === config.key ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Input
          value={String(value || '')}
          onChange={(e) => setEditedValues((prev) => ({ ...prev, [config.key]: e.target.value }))}
          className="flex-1"
        />
        {hasChanged && (
          <Button size="sm" onClick={() => handleSave(config.key)} disabled={saving === config.key}>
            {saving === config.key ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  };

  const categories = Object.keys(groupedConfigs);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurare Platformă
            </CardTitle>
            <CardDescription>Gestionează setările globale ale platformei</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchConfigs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reîmprospătează
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adaugă Configurare
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs
            defaultValue={categories[0] || 'general'}
            orientation="vertical"
            className="flex flex-row gap-6"
          >
            <TabsList className="flex flex-col h-fit w-48 shrink-0">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="w-full justify-start gap-2">
                  {CATEGORY_ICONS[category] || <Settings className="h-4 w-4" />}
                  {CATEGORY_LABELS[category] || category}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 min-w-0">
              {categories.map((category) => (
                <TabsContent
                  key={category}
                  value={category}
                  className="m-0 data-[state=active]:flex-1"
                >
                  <div className="space-y-4">
                    {groupedConfigs[category]?.map((config) => (
                      <div
                        key={config.id}
                        className="flex flex-col gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium">{config.key}</Label>
                            {config.is_public && (
                              <Badge variant="outline" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        {config.description && (
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        )}
                        {renderConfigInput(config)}
                        {config.updater && (
                          <p className="text-xs text-muted-foreground">
                            Ultima actualizare de {config.updater.first_name}{' '}
                            {config.updater.last_name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}

        {/* Add Config Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adaugă Configurare Nouă</DialogTitle>
              <DialogDescription>Creează o nouă configurare pentru platformă</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Cheie</Label>
                <Input
                  value={newConfig.key}
                  onChange={(e) => setNewConfig((prev) => ({ ...prev, key: e.target.value }))}
                  placeholder="ex: max_file_size_mb"
                />
              </div>
              <div>
                <Label>Valoare</Label>
                <Input
                  value={newConfig.value}
                  onChange={(e) => setNewConfig((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder='ex: 10 sau true sau "text"'
                />
              </div>
              <div>
                <Label>Categorie</Label>
                <select
                  value={newConfig.category}
                  onChange={(e) => setNewConfig((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border bg-background"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Descriere</Label>
                <Input
                  value={newConfig.description}
                  onChange={(e) =>
                    setNewConfig((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Descriere opțională"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newConfig.is_public}
                  onCheckedChange={(checked) =>
                    setNewConfig((prev) => ({ ...prev, is_public: checked }))
                  }
                />
                <Label>Configurare publică</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Anulează
              </Button>
              <Button onClick={handleAddConfig} disabled={!newConfig.key || !newConfig.value}>
                <Plus className="mr-2 h-4 w-4" />
                Adaugă
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
