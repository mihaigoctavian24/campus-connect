'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Search, ArrowUpDown, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import Link from 'next/link';

interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  totalHours: number;
  approvedHours: number;
  sessionsAttended: number;
  totalSessions: number;
  attendanceRate: number;
  lastActivity: string | null;
}

interface StudentPerformanceTableProps {
  students: StudentPerformance[];
  title?: string;
  description?: string;
  pageSize?: number;
}

type SortField = 'name' | 'totalHours' | 'attendanceRate' | 'sessionsAttended';
type SortOrder = 'asc' | 'desc';

function getAttendanceBadge(rate: number) {
  if (rate >= 80) {
    return <Badge className="bg-green-100 text-green-800">Excelent</Badge>;
  } else if (rate >= 60) {
    return <Badge className="bg-amber-100 text-amber-800">Bun</Badge>;
  } else if (rate >= 40) {
    return <Badge className="bg-orange-100 text-orange-800">Moderat</Badge>;
  } else {
    return <Badge variant="destructive">La risc</Badge>;
  }
}

export function StudentPerformanceTable({
  students,
  title = 'Performanța Studenților',
  description = 'Detalii despre participarea și orele fiecărui student',
  pageSize = 10,
}: StudentPerformanceTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => {
        if (statusFilter === 'excellent') return s.attendanceRate >= 80;
        if (statusFilter === 'good') return s.attendanceRate >= 60 && s.attendanceRate < 80;
        if (statusFilter === 'moderate') return s.attendanceRate >= 40 && s.attendanceRate < 60;
        if (statusFilter === 'at-risk') return s.attendanceRate < 40;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'totalHours':
          comparison = a.totalHours - b.totalHours;
          break;
        case 'attendanceRate':
          comparison = a.attendanceRate - b.attendanceRate;
          break;
        case 'sessionsAttended':
          comparison = a.sessionsAttended - b.sessionsAttended;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, searchQuery, sortField, sortOrder, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Nu există studenți înscriși în activitățile tale
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută student..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrează status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toți studenții</SelectItem>
              <SelectItem value="excellent">Excelent (≥80%)</SelectItem>
              <SelectItem value="good">Bun (60-79%)</SelectItem>
              <SelectItem value="moderate">Moderat (40-59%)</SelectItem>
              <SelectItem value="at-risk">La risc (&lt;40%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => handleSort('name')}
                  >
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => handleSort('totalHours')}
                  >
                    Ore
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => handleSort('sessionsAttended')}
                  >
                    Sesiuni
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => handleSort('attendanceRate')}
                  >
                    Prezență
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.approvedHours}h</p>
                      <p className="text-xs text-muted-foreground">din {student.totalHours}h</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.sessionsAttended}/{student.totalSessions}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.attendanceRate >= 80
                              ? 'bg-green-500'
                              : student.attendanceRate >= 60
                                ? 'bg-amber-500'
                                : student.attendanceRate >= 40
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{student.attendanceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getAttendanceBadge(student.attendanceRate)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`mailto:${student.email}`}>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Afișez {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredStudents.length)} din{' '}
              {filteredStudents.length} studenți
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Pagina {currentPage} din {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
