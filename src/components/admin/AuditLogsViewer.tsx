'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Shield,
  User,
  Settings,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user: {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
  } | null;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    actions: string[];
    entityTypes: string[];
  };
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  PROFESSOR_REQUEST_APPROVED: <Shield className="h-4 w-4 text-green-500" />,
  PROFESSOR_REQUEST_REJECTED: <Shield className="h-4 w-4 text-red-500" />,
  USER_ROLE_CHANGED: <User className="h-4 w-4 text-blue-500" />,
  CONFIG_UPDATED: <Settings className="h-4 w-4 text-purple-500" />,
  CONFIG_CREATED: <Settings className="h-4 w-4 text-green-500" />,
  CERTIFICATE_GENERATED: <FileText className="h-4 w-4 text-amber-500" />,
  BULK_USER_ACTION: <AlertTriangle className="h-4 w-4 text-orange-500" />,
};

const ACTION_LABELS: Record<string, string> = {
  PROFESSOR_REQUEST_APPROVED: 'Cerere profesor aprobată',
  PROFESSOR_REQUEST_REJECTED: 'Cerere profesor respinsă',
  USER_ROLE_CHANGED: 'Rol utilizator schimbat',
  CONFIG_UPDATED: 'Configurare actualizată',
  CONFIG_CREATED: 'Configurare creată',
  CERTIFICATE_GENERATED: 'Certificat generat',
  BULK_USER_ACTION: 'Acțiune în masă',
};

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    actions: [] as string[],
    entityTypes: [] as string[],
  });
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedAction && selectedAction !== 'all') {
        params.append('action', selectedAction);
      }
      if (selectedEntityType && selectedEntityType !== 'all') {
        params.append('entity_type', selectedEntityType);
      }

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch logs');

      const data: AuditLogsResponse = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedAction, selectedEntityType]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(search) ||
      log.entity_type.toLowerCase().includes(search) ||
      log.user?.email?.toLowerCase().includes(search) ||
      log.user?.first_name?.toLowerCase().includes(search) ||
      log.user?.last_name?.toLowerCase().includes(search)
    );
  });

  const exportLogs = () => {
    const csv = [
      ['Data', 'Utilizator', 'Acțiune', 'Tip Entitate', 'ID Entitate', 'Detalii'].join(','),
      ...filteredLogs.map((log) =>
        [
          format(new Date(log.created_at), 'dd.MM.yyyy HH:mm:ss'),
          log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Sistem',
          log.action,
          log.entity_type,
          log.entity_id || '-',
          JSON.stringify(log.details || {}),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Jurnal de Audit
            </CardTitle>
            <CardDescription>
              Monitorizează toate acțiunile importante din platformă
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reîmprospătează
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Exportă CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Caută în log-uri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtru acțiune" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate acțiunile</SelectItem>
              {filters.actions.map((action) => (
                <SelectItem key={action} value={action}>
                  {ACTION_LABELS[action] || action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtru entitate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate entitățile</SelectItem>
              {filters.entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Data & Ora</TableHead>
                <TableHead>Utilizator</TableHead>
                <TableHead>Acțiune</TableHead>
                <TableHead>Entitate</TableHead>
                <TableHead className="w-[80px]">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nu există log-uri pentru filtrele selectate
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: ro })}
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <div className="font-medium">
                            {log.user.first_name} {log.user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sistem</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ACTION_ICONS[log.action] || <FileText className="h-4 w-4" />}
                        <Badge variant="outline">{ACTION_LABELS[log.action] || log.action}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.entity_type}</Badge>
                      {log.entity_id && (
                        <span className="ml-2 text-xs text-muted-foreground font-mono">
                          {log.entity_id.slice(0, 8)}...
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Afișare {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} din {pagination.total}{' '}
            înregistrări
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 text-sm">
              Pagina {pagination.page} din {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalii Log</DialogTitle>
              <DialogDescription>Informații complete despre această acțiune</DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data & Ora</label>
                    <p className="font-mono">
                      {format(new Date(selectedLog.created_at), 'dd MMMM yyyy, HH:mm:ss', {
                        locale: ro,
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Acțiune</label>
                    <p>
                      <Badge>{ACTION_LABELS[selectedLog.action] || selectedLog.action}</Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Utilizator</label>
                    <p>
                      {selectedLog.user
                        ? `${selectedLog.user.first_name} ${selectedLog.user.last_name} (${selectedLog.user.email})`
                        : 'Sistem'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tip Entitate
                    </label>
                    <p>
                      <Badge variant="secondary">{selectedLog.entity_type}</Badge>
                    </p>
                  </div>
                  {selectedLog.entity_id && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        ID Entitate
                      </label>
                      <p className="font-mono text-sm">{selectedLog.entity_id}</p>
                    </div>
                  )}
                  {selectedLog.ip_address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Adresă IP</label>
                      <p className="font-mono text-sm">{selectedLog.ip_address}</p>
                    </div>
                  )}
                </div>
                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Detalii</label>
                    <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-sm">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedLog.user_agent && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="text-sm text-muted-foreground break-all">
                      {selectedLog.user_agent}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
