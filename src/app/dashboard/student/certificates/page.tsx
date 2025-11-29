'use client';

import { useState, useEffect } from 'react';
import { CertificateGenerator } from '@/components/certificates/CertificateGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  approvedHours: number;
  totalActivities: number;
  completedActivities: number;
  goalHours: number;
}

export default function StudentCertificatesPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/users/me/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const minHoursForCertificate = 10;
  const canGenerateCertificate = (analytics?.approvedHours || 0) >= minHoursForCertificate;

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="h-8 w-8 text-amber-500" />
          Certificatele Mele
        </h1>
        <p className="text-muted-foreground mt-1">
          Generează și descarcă certificate pentru orele tale de voluntariat
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status Eligibilitate</CardTitle>
          <CardDescription>
            Verifică dacă îndeplinești cerințele pentru generarea unui certificat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.approvedHours || 0}h</p>
                  <p className="text-sm text-muted-foreground">Ore aprobate</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.completedActivities || 0}</p>
                  <p className="text-sm text-muted-foreground">Activități finalizate</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                {canGenerateCertificate ? (
                  <>
                    <Award className="h-8 w-8 text-amber-500" />
                    <div>
                      <Badge className="bg-green-500">Eligibil</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Poți genera certificate</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                    <div>
                      <Badge variant="secondary">
                        Mai ai nevoie de {minHoursForCertificate - (analytics?.approvedHours || 0)}h
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Minim {minHoursForCertificate}h pentru certificat
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Generator */}
      {canGenerateCertificate ? (
        <CertificateGenerator />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nu ești încă eligibil pentru certificate</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ai nevoie de minimum {minHoursForCertificate} ore aprobate pentru a genera un
              certificat. Continuă să participi la activități și să îți validezi orele!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Despre Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Badge variant="outline">Participare</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Confirmă participarea la o activitate specifică de voluntariat.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Badge variant="outline">Ore</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Atestă totalul orelor de voluntariat acumulate și aprobate.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Badge variant="outline">Finalizare</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Confirmă finalizarea cu succes a unei activități complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
