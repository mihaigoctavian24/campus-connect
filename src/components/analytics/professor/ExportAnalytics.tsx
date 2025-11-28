'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, FileText, FileJson, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportColumn {
  id: string;
  label: string;
  default: boolean;
}

interface ExportAnalyticsProps {
  onExportCSV: (columns: string[]) => Promise<void>;
  onExportPDF?: (columns: string[]) => Promise<void>;
  onExportJSON?: (columns: string[]) => Promise<void>;
  columns?: ExportColumn[];
  disabled?: boolean;
}

const DEFAULT_COLUMNS: ExportColumn[] = [
  { id: 'name', label: 'Nume Student', default: true },
  { id: 'email', label: 'Email', default: true },
  { id: 'totalHours', label: 'Ore Totale', default: true },
  { id: 'approvedHours', label: 'Ore Aprobate', default: true },
  { id: 'sessionsAttended', label: 'Sesiuni Prezent', default: true },
  { id: 'totalSessions', label: 'Total Sesiuni', default: false },
  { id: 'attendanceRate', label: 'Rata Prezență', default: true },
  { id: 'lastActivity', label: 'Ultima Activitate', default: false },
  { id: 'status', label: 'Status', default: true },
];

export function ExportAnalytics({
  onExportCSV,
  onExportPDF,
  onExportJSON,
  columns = DEFAULT_COLUMNS,
  disabled = false,
}: ExportAnalyticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.filter((c) => c.default).map((c) => c.id)
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns.map((c) => c.id));
  };

  const handleSelectDefault = () => {
    setSelectedColumns(columns.filter((c) => c.default).map((c) => c.id));
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Selectează cel puțin o coloană pentru export');
      return;
    }

    setIsExporting(true);
    try {
      switch (selectedFormat) {
        case 'csv':
          await onExportCSV(selectedColumns);
          toast.success('Export CSV finalizat cu succes');
          break;
        case 'pdf':
          if (onExportPDF) {
            await onExportPDF(selectedColumns);
            toast.success('Export PDF finalizat cu succes');
          }
          break;
        case 'json':
          if (onExportJSON) {
            await onExportJSON(selectedColumns);
            toast.success('Export JSON finalizat cu succes');
          }
          break;
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Eroare la export. Te rugăm să încerci din nou.');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'json':
        return <FileJson className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const openExportDialog = (format: 'csv' | 'pdf' | 'json') => {
    setSelectedFormat(format);
    setIsOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={disabled}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Format Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openExportDialog('csv')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </DropdownMenuItem>
          {onExportPDF && (
            <DropdownMenuItem onClick={() => openExportDialog('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </DropdownMenuItem>
          )}
          {onExportJSON && (
            <DropdownMenuItem onClick={() => openExportDialog('json')}>
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFormatIcon(selectedFormat)}
              Export {selectedFormat.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Selectează coloanele pe care vrei să le incluzi în export
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Selectează toate
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectDefault}>
                Implicit
              </Button>
            </div>

            {/* Column checkboxes */}
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <Label htmlFor={column.id} className="text-sm font-normal cursor-pointer">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Selected count */}
            <p className="text-sm text-muted-foreground">
              {selectedColumns.length} din {columns.length} coloane selectate
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleExport} disabled={isExporting || selectedColumns.length === 0}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Se exportă...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Exportă
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Utility function for CSV generation
export function generateCSV(
  data: Record<string, unknown>[],
  columns: string[],
  columnLabels: Record<string, string>
): string {
  // Header row
  const headers = columns.map((col) => columnLabels[col] || col);
  const headerRow = headers.map((h) => `"${h}"`).join(',');

  // Data rows
  const dataRows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return `"${value}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

// Utility function to download file
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
