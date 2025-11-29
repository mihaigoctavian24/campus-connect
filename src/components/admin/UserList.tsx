'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  UserCog,
  Mail,
  Loader2,
  RefreshCw,
  CheckSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { UserDetailModal } from './UserDetailModal';
import { RoleAssignmentModal } from './RoleAssignmentModal';
import { BulkUserActionsModal } from './BulkUserActionsModal';
import { toast } from 'sonner';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
  created_at: string;
  last_login: string | null;
  profile_picture_url: string | null;
  faculty: string | null;
  year: number | null;
  specialization: string | null;
  is_active: boolean | null;
}

type SortField = 'name' | 'email' | 'role' | 'created_at';
type SortOrder = 'asc' | 'desc';

function getRoleBadge(role: string) {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case 'ADMIN':
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    case 'PROFESSOR':
      return <Badge className="bg-blue-100 text-blue-800">Profesor</Badge>;
    case 'STUDENT':
      return <Badge className="bg-green-100 text-green-800">Student</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Eroare la încărcarea utilizatorilor');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setSelectedUserIds(new Set()); // Clear selection on refresh
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          (u.first_name && u.first_name.toLowerCase().includes(query)) ||
          (u.last_name && u.last_name.toLowerCase().includes(query))
      );
    }

    // Apply role filter (case-insensitive)
    if (roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role?.toUpperCase() === roleFilter.toUpperCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleRoleChanged = () => {
    fetchUsers();
    toast.success('Rolul a fost actualizat cu succes');
  };

  // Selection handlers
  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelection = new Set(selectedUserIds);
    if (checked) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPageUserIds = paginatedUsers.map((u) => u.id);
      setSelectedUserIds(new Set([...selectedUserIds, ...allPageUserIds]));
    } else {
      const pageUserIds = new Set(paginatedUsers.map((u) => u.id));
      setSelectedUserIds(new Set([...selectedUserIds].filter((id) => !pageUserIds.has(id))));
    }
  };

  const isAllPageSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.has(u.id));
  const isSomePageSelected = paginatedUsers.some((u) => selectedUserIds.has(u.id));

  const clearSelection = () => {
    setSelectedUserIds(new Set());
  };

  const handleBulkActionComplete = () => {
    fetchUsers();
    setIsBulkModalOpen(false);
  };

  // Get selected users data
  const selectedUsers = useMemo(() => {
    return users.filter((u) => selectedUserIds.has(u.id));
  }, [users, selectedUserIds]);

  // Stats (case-insensitive)
  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role?.toUpperCase() === 'STUDENT').length,
      professors: users.filter((u) => u.role?.toUpperCase() === 'PROFESSOR').length,
      admins: users.filter((u) => u.role?.toUpperCase() === 'ADMIN').length,
    };
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchUsers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestionare Utilizatori</h1>
          <p className="text-muted-foreground">Administrează utilizatorii platformei</p>
        </div>
        <Button variant="outline" onClick={fetchUsers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reîmprospătează
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Studenți</p>
                <p className="text-2xl font-bold text-green-600">{stats.students}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Student</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profesori</p>
                <p className="text-2xl font-bold text-blue-600">{stats.professors}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Profesor</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admini</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selection Bar */}
      {selectedUserIds.size > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedUserIds.size} utilizator{selectedUserIds.size !== 1 ? 'i' : ''} selectat
                  {selectedUserIds.size !== 1 ? 'i' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Anulează selecția
                </Button>
                <Button size="sm" onClick={() => setIsBulkModalOpen(true)}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Acțiuni în masă
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Utilizatori</CardTitle>
          <CardDescription>{filteredUsers.length} utilizatori găsiți</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după nume sau email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrează rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate rolurile</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professor">Profesor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllPageSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selectează toți utilizatorii din pagină"
                      className={
                        isSomePageSelected && !isAllPageSelected
                          ? 'data-[state=checked]:bg-blue-600'
                          : ''
                      }
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => handleSort('name')}
                    >
                      Utilizator
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => handleSort('email')}
                    >
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => handleSort('role')}
                    >
                      Rol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3"
                      onClick={() => handleSort('created_at')}
                    >
                      Înregistrat
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Ultima activitate</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">Niciun utilizator găsit</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className={selectedUserIds.has(user.id) ? 'bg-blue-50/50' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                          aria-label={`Selectează ${user.email}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center relative">
                            {user.profile_picture_url ? (
                              <Image
                                src={user.profile_picture_url}
                                alt=""
                                fill
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.first_name || user.last_name
                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                : 'Necompletat'}
                            </p>
                            {user.faculty && (
                              <p className="text-xs text-muted-foreground">{user.faculty}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(user.created_at), {
                          addSuffix: true,
                          locale: ro,
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_login
                          ? formatDistanceToNow(new Date(user.last_login), {
                              addSuffix: true,
                              locale: ro,
                            })
                          : 'Niciodată'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Vezi detalii
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(user)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Schimbă rol
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${user.email}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Trimite email
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Afișez {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredUsers.length)} din {filteredUsers.length}{' '}
                utilizatori
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

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <RoleAssignmentModal
        user={selectedUser}
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onRoleChanged={handleRoleChanged}
      />

      <BulkUserActionsModal
        users={selectedUsers}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onActionComplete={handleBulkActionComplete}
      />
    </div>
  );
}
