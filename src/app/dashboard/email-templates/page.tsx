'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Code,
  AlertCircle,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  template_type: string;
  subject: string;
  body: string;
  variables: string[] | null;
  department_id: string | null;
  created_by: string | null;
  updated_at: string | null;
  creator?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  department?: {
    name: string;
  } | null;
}

const PREDEFINED_VARIABLES = [
  { name: '{{student_name}}', description: 'Numele studentului' },
  { name: '{{professor_name}}', description: 'Numele profesorului' },
  { name: '{{activity_title}}', description: 'Titlul activității' },
  { name: '{{activity_date}}', description: 'Data activității' },
  { name: '{{hours}}', description: 'Numărul de ore' },
  { name: '{{status}}', description: 'Statusul cererii' },
  { name: '{{message}}', description: 'Mesaj personalizat' },
  { name: '{{app_url}}', description: 'URL-ul aplicației' },
];

const TEMPLATE_TYPES = [
  { value: 'application_accepted', label: 'Aplicație Acceptată' },
  { value: 'application_rejected', label: 'Aplicație Respinsă' },
  { value: 'application_waitlisted', label: 'Aplicație - Listă Așteptare' },
  { value: 'hours_approved', label: 'Ore Aprobate' },
  { value: 'hours_rejected', label: 'Ore Respinse' },
  { value: 'hours_info_requested', label: 'Ore - Informații Suplimentare' },
  { value: 'certificate_generated', label: 'Certificat Generat' },
  { value: 'session_reminder', label: 'Reminder Sesiune' },
  { value: 'welcome_email', label: 'Email de Bun Venit' },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Editor form state
  const [editorForm, setEditorForm] = useState({
    template_type: '',
    subject: '',
    body: '',
    variables: [] as string[],
  });

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/email-templates');
      const data = await response.json();
      if (response.ok) {
        setTemplates(data.templates || []);
      } else {
        toast.error(data.error || 'Eroare la încărcarea șabloanelor');
      }
    } catch {
      toast.error('Eroare de conexiune');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setEditorForm({
      template_type: '',
      subject: '',
      body: '',
      variables: [],
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditorForm({
      template_type: template.template_type,
      subject: template.subject,
      body: template.body,
      variables: template.variables || [],
    });
    setIsEditorOpen(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!editorForm.template_type || !editorForm.subject || !editorForm.body) {
      toast.error('Completează toate câmpurile obligatorii');
      return;
    }

    setIsSaving(true);
    try {
      const url = selectedTemplate
        ? `/api/admin/email-templates/${selectedTemplate.id}`
        : '/api/admin/email-templates';
      const method = selectedTemplate ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editorForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Șablonul a fost salvat');
        setIsEditorOpen(false);
        fetchTemplates();
      } else {
        toast.error(data.error || 'Eroare la salvarea șablonului');
      }
    } catch {
      toast.error('Eroare de conexiune');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Șablonul a fost șters');
        setIsDeleteOpen(false);
        setSelectedTemplate(null);
        fetchTemplates();
      } else {
        toast.error(data.error || 'Eroare la ștergerea șablonului');
      }
    } catch {
      toast.error('Eroare de conexiune');
    }
  };

  const insertVariable = (variable: string) => {
    setEditorForm((prev) => ({
      ...prev,
      body: prev.body + variable,
    }));
  };

  const getTemplateTypeLabel = (type: string) => {
    return TEMPLATE_TYPES.find((t) => t.value === type)?.label || type;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-7 h-7 text-blue-600" />
            Șabloane Email
          </h1>
          <p className="text-gray-600 mt-1">
            Gestionează șabloanele pentru notificările email trimise utilizatorilor
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTemplates} disabled={isLoading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizează
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Șablon Nou
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center mb-4">Nu există șabloane de email încă.</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Creează Primul Șablon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {getTemplateTypeLabel(template.template_type)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handlePreview(template)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(template)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base mt-2">{template.subject}</CardTitle>
                <CardDescription className="text-xs">
                  Actualizat: {formatDate(template.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
                {template.variables && template.variables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.variables.slice(0, 3).map((v, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                    {template.variables.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? 'Editează Șablon' : 'Șablon Nou'}</DialogTitle>
            <DialogDescription>
              Configurează conținutul emailului. Folosește variabilele pentru personalizare.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList>
              <TabsTrigger value="content">Conținut</TabsTrigger>
              <TabsTrigger value="variables">Variabile</TabsTrigger>
              <TabsTrigger value="preview">Previzualizare</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template_type">Tip Șablon *</Label>
                  <select
                    id="template_type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editorForm.template_type}
                    onChange={(e) =>
                      setEditorForm((prev) => ({ ...prev, template_type: e.target.value }))
                    }
                    disabled={!!selectedTemplate}
                  >
                    <option value="">Selectează tipul...</option>
                    {TEMPLATE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subiect Email *</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Aplicația ta a fost acceptată - {{activity_title}}"
                    value={editorForm.subject}
                    onChange={(e) =>
                      setEditorForm((prev) => ({ ...prev, subject: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Conținut HTML *</Label>
                <Textarea
                  id="body"
                  placeholder="Scrie conținutul emailului în format HTML..."
                  value={editorForm.body}
                  onChange={(e) => setEditorForm((prev) => ({ ...prev, body: e.target.value }))}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="variables" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>Click pe o variabilă pentru a o insera în conținutul emailului.</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PREDEFINED_VARIABLES.map((variable) => (
                    <Card
                      key={variable.name}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => insertVariable(variable.name)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Code className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-mono text-sm text-blue-700">{variable.name}</p>
                          <p className="text-xs text-gray-500">{variable.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-4 bg-white">
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-500">Subiect:</p>
                  <p className="font-medium">{editorForm.subject || '(fără subiect)'}</p>
                </div>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: editorForm.body || '<p class="text-gray-400">(fără conținut)</p>',
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Anulează
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Previzualizare Șablon</DialogTitle>
            <DialogDescription>Așa va arăta emailul trimis utilizatorilor.</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Subiect:</p>
                <p className="font-medium">{selectedTemplate.subject}</p>
              </div>
              <div className="border rounded-lg p-6 bg-white">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Șterge Șablonul?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune este ireversibilă. Șablonul &quot;{selectedTemplate?.subject}&quot; va
              fi șters permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
