'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Award,
  Download,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  User,
  Building,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface CertificateData {
  id: string;
  generated_at: string;
  certificate_type: 'participation' | 'completion' | 'hours';
  student: {
    name: string;
    email: string;
    faculty: string | null;
    study_year: number | null;
  };
  hours: {
    total: number;
    activities: Array<{
      title: string;
      hours: number;
      date: string;
    }>;
  };
  activity: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
  } | null;
  verification_code: string;
}

interface CertificateGeneratorProps {
  studentId?: string;
  activityId?: string;
  onGenerate?: (certificate: CertificateData) => void;
}

export function CertificateGenerator({
  studentId,
  activityId,
  onGenerate,
}: CertificateGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generateCertificate = async (type: 'participation' | 'completion' | 'hours') => {
    setLoading(true);
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          activity_id: activityId,
          certificate_type: type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la generarea certificatului');
      }

      const data = await response.json();
      setCertificate(data.certificate);
      setShowPreview(true);
      onGenerate?.(data.certificate);
      toast.success('Certificat generat cu succes!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la generare');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!certificate) return;

    // Create a printable HTML document
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificat - ${certificate.student.name}</title>
        <style>
          @page { size: A4 landscape; margin: 0; }
          body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #001f3f 0%, #003366 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 900px;
            text-align: center;
            border: 8px double #FFD700;
          }
          .header {
            color: #001f3f;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 48px;
            color: #001f3f;
            margin: 20px 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 5px;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 30px;
          }
          .name {
            font-size: 36px;
            color: #001f3f;
            margin: 30px 0;
            font-style: italic;
            border-bottom: 2px solid #FFD700;
            padding-bottom: 10px;
            display: inline-block;
          }
          .description {
            font-size: 16px;
            color: #333;
            line-height: 1.8;
            margin: 20px 0;
          }
          .hours {
            font-size: 32px;
            color: #FFD700;
            font-weight: bold;
            margin: 20px 0;
          }
          .details {
            margin-top: 40px;
            font-size: 12px;
            color: #666;
            display: flex;
            justify-content: space-between;
          }
          .verification {
            font-family: monospace;
            font-size: 14px;
            color: #001f3f;
            background: #f0f0f0;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 30px;
            display: inline-block;
          }
          .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
          }
          .seal {
            width: 100px;
            height: 100px;
            border: 3px solid #FFD700;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #001f3f;
            font-weight: bold;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">Universitatea Româno-Americană</div>
          <div class="title">Certificat</div>
          <div class="subtitle">de ${certificate.certificate_type === 'hours' ? 'Voluntariat' : 'Participare'}</div>

          <p class="description">Se acordă prezentul certificat</p>
          <div class="name">${certificate.student.name}</div>

          <p class="description">
            pentru participarea la activități de voluntariat în cadrul platformei Campus Connect,
            acumulând un total de
          </p>

          <div class="hours">${certificate.hours.total} ore</div>

          <p class="description">
            ${certificate.student.faculty ? `Facultatea: ${certificate.student.faculty}` : ''}
            ${certificate.student.study_year ? ` | Anul: ${certificate.student.study_year}` : ''}
          </p>

          <div class="details">
            <div>Data emiterii: ${format(new Date(certificate.generated_at), 'dd MMMM yyyy', { locale: ro })}</div>
            <div>București, România</div>
          </div>

          <div class="verification">Cod verificare: ${certificate.verification_code}</div>

          <div class="seal">CAMPUS<br/>CONNECT</div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Generator Certificate
          </CardTitle>
          <CardDescription>
            Generează certificate pentru orele de voluntariat acumulate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => generateCertificate('participation')}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <FileText className="h-8 w-8 text-blue-500" />
              )}
              <span className="font-medium">Certificat Participare</span>
              <span className="text-xs text-muted-foreground">Pentru o activitate specifică</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => generateCertificate('hours')}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Clock className="h-8 w-8 text-green-500" />
              )}
              <span className="font-medium">Certificat Ore</span>
              <span className="text-xs text-muted-foreground">Pentru toate orele acumulate</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => generateCertificate('completion')}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-amber-500" />
              )}
              <span className="font-medium">Certificat Finalizare</span>
              <span className="text-xs text-muted-foreground">Pentru activități finalizate</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Previzualizare Certificat
            </DialogTitle>
            <DialogDescription>
              Verifică datele înainte de a descărca certificatul
            </DialogDescription>
          </DialogHeader>

          {certificate && (
            <div className="space-y-6">
              {/* Certificate Preview Card */}
              <div className="bg-gradient-to-br from-[#001f3f] to-[#003366] p-1 rounded-lg">
                <div className="bg-white p-6 rounded-lg space-y-4">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      Campus Connect
                    </Badge>
                    <h2 className="text-2xl font-bold text-[#001f3f]">CERTIFICAT</h2>
                    <p className="text-muted-foreground">
                      de{' '}
                      {certificate.certificate_type === 'hours'
                        ? 'Voluntariat'
                        : certificate.certificate_type === 'participation'
                          ? 'Participare'
                          : 'Finalizare'}
                    </p>
                  </div>

                  <div className="text-center py-4 border-y">
                    <p className="text-sm text-muted-foreground">Se acordă</p>
                    <p className="text-xl font-semibold text-[#001f3f]">
                      {certificate.student.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{certificate.student.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">{certificate.hours.total} ore</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {format(new Date(certificate.generated_at), 'dd MMM yyyy', { locale: ro })}
                      </span>
                    </div>
                    {certificate.student.faculty && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-green-500" />
                        <span>{certificate.student.faculty}</span>
                      </div>
                    )}
                    {certificate.student.study_year && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-500" />
                        <span>Anul {certificate.student.study_year}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Activități incluse:</p>
                    <div className="space-y-1">
                      {certificate.hours.activities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">{activity.title}</span>
                          <Badge variant="secondary">{activity.hours}h</Badge>
                        </div>
                      ))}
                      {certificate.hours.activities.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          + {certificate.hours.activities.length - 5} alte activități
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Badge variant="outline" className="font-mono">
                      {certificate.verification_code}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>
                  Închide
                </Button>
                <Button className="flex-1" onClick={downloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Descarcă PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
