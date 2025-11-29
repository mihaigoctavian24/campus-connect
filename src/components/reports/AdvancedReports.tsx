'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Users,
  Clock,
  BarChart3,
  TrendingUp,
  Award,
  Loader2,
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

type ReportType =
  | 'student_hours'
  | 'activity_summary'
  | 'attendance_report'
  | 'enrollment_stats'
  | 'professor_performance';

interface ReportConfig {
  type: ReportType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const REPORT_CONFIGS: ReportConfig[] = [
  {
    type: 'student_hours',
    label: 'Raport Ore Studenți',
    description: 'Export ore voluntariat per student cu status și activități',
    icon: <Clock className="h-5 w-5" />,
    color: 'text-blue-500',
  },
  {
    type: 'activity_summary',
    label: 'Sumar Activități',
    description: 'Statistici complete pentru toate activitățile',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'text-green-500',
  },
  {
    type: 'attendance_report',
    label: 'Raport Prezență',
    description: 'Statistici prezență per sesiune și activitate',
    icon: <Users className="h-5 w-5" />,
    color: 'text-purple-500',
  },
  {
    type: 'enrollment_stats',
    label: 'Statistici Înscrieri',
    description: 'Analiză înscrieri, rate acceptare, tendințe',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-amber-500',
  },
  {
    type: 'professor_performance',
    label: 'Performanță Profesori',
    description: 'Activități create, studenți coordonați, ore validate',
    icon: <Award className="h-5 w-5" />,
    color: 'text-red-500',
  },
];

export function AdvancedReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('student_hours');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 3)),
    to: endOfMonth(new Date()),
  });
  const [format_type, setFormatType] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        type: selectedReport,
        format: format_type,
      });

      if (dateRange?.from) {
        params.append('start_date', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append('end_date', dateRange.to.toISOString());
      }

      const response = await fetch(`/api/reports/generate?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Eroare la generarea raportului');
      }

      // For CSV, download directly
      if (format_type === 'csv') {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raport-${selectedReport}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        // Handle other formats
        console.log('Report data:', data);
      }

      toast.success('Raport generat cu succes!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(error instanceof Error ? error.message : 'Eroare la generare');
    } finally {
      setGenerating(false);
    }
  };

  const selectedConfig = REPORT_CONFIGS.find((r) => r.type === selectedReport);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rapoarte Avansate
        </CardTitle>
        <CardDescription>Generează rapoarte detaliate pentru analiză și export</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generate">Generează Raport</TabsTrigger>
            <TabsTrigger value="scheduled">Rapoarte Programate</TabsTrigger>
            <TabsTrigger value="history">Istoric</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* Report Type Selection */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {REPORT_CONFIGS.map((config) => (
                <div
                  key={config.type}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedReport === config.type
                      ? 'border-[#001f3f] bg-[#001f3f]/5 ring-2 ring-[#001f3f]/20'
                      : 'hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedReport(config.type)}
                >
                  <div className="flex items-start gap-3">
                    <div className={config.color}>{config.icon}</div>
                    <div>
                      <h4 className="font-medium">{config.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Options */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Perioadă</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'dd MMM', { locale: ro })} -{' '}
                            {format(dateRange.to, 'dd MMM yyyy', { locale: ro })}
                          </>
                        ) : (
                          format(dateRange.from, 'dd MMM yyyy', { locale: ro })
                        )
                      ) : (
                        'Selectează perioada'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Format */}
              <div>
                <label className="text-sm font-medium mb-2 block">Format Export</label>
                <Select
                  value={format_type}
                  onValueChange={(v) => setFormatType(v as typeof format_type)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel compatibil)</SelectItem>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <Button className="w-full" onClick={generateReport} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se generează...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generează Raport
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Selected Report Preview */}
            {selectedConfig && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className={selectedConfig.color}>{selectedConfig.icon}</div>
                  <h4 className="font-medium">{selectedConfig.label}</h4>
                  <Badge variant="outline">{format_type.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedConfig.description}</p>
                {dateRange?.from && dateRange?.to && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Perioadă: {format(dateRange.from, 'dd MMMM yyyy', { locale: ro })} -{' '}
                    {format(dateRange.to, 'dd MMMM yyyy', { locale: ro })}
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Rapoarte Programate</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Configurează rapoarte automate care se generează periodic și se trimit pe email.
                Această funcționalitate va fi disponibilă în curând.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Istoric Rapoarte</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Aici vei putea vedea și descărca rapoartele generate anterior. Generează primul tău
                raport pentru a popula istoricul.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
