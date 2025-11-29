'use client';

import { PlatformConfigPanel } from '@/components/admin/PlatformConfigPanel';
import { DepartmentsManager } from '@/components/admin/DepartmentsManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, Bell, Database, FolderCog } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Setări Platformă
        </h1>
        <p className="text-muted-foreground mt-1">
          Configurează setările globale ale platformei Campus Connect
        </p>
      </div>

      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FolderCog className="h-4 w-4" />
            Date Platformă
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Configurări
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Securitate
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificări
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderCog className="h-5 w-5" />
                Gestionare Date Platformă
              </CardTitle>
              <CardDescription>
                Administrează departamentele/facultățile și categoriile de activități
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <DepartmentsManager />
              <div className="border-t pt-8">
                <CategoriesManager />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <PlatformConfigPanel />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Setări Securitate
              </CardTitle>
              <CardDescription>
                Configurează politicile de securitate ale platformei
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Autentificare</h4>
                  <p className="text-sm text-muted-foreground">
                    Autentificarea este gestionată prin Supabase Auth cu verificare email
                    obligatorie.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Row Level Security (RLS)</h4>
                  <p className="text-sm text-muted-foreground">
                    Toate tabelele au politici RLS active pentru protecția datelor.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Jurnalizare Audit</h4>
                  <p className="text-sm text-muted-foreground">
                    Toate acțiunile administrative sunt înregistrate în jurnalul de audit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Setări Notificări
              </CardTitle>
              <CardDescription>Configurează sistemul de notificări al platformei</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Notificări Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Emailurile sunt trimise prin Supabase Email pentru verificare cont și notificări
                    importante.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Notificări In-App</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilizatorii primesc notificări în timp real pentru activități, înscrieri și
                    validări ore.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
