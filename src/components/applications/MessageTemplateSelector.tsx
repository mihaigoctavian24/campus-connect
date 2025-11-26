'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export interface MessageTemplate {
  id: string;
  label: string;
  category?: 'professional' | 'friendly' | 'encouraging';
  message: string;
}

interface MessageTemplateSelectorProps {
  templates: MessageTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  type: 'accept' | 'reject';
}

export function MessageTemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  type,
}: MessageTemplateSelectorProps) {
  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'professional':
        return <Badge variant="outline" className="text-xs">Profesional</Badge>;
      case 'friendly':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Prietenos</Badge>;
      case 'encouraging':
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Încurajator</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplateId === template.id
                ? type === 'accept'
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-start gap-3">
              {/* Selection Indicator */}
              <div
                className={`mt-0.5 rounded-full p-0.5 ${
                  selectedTemplateId === template.id
                    ? type === 'accept'
                      ? 'bg-green-600'
                      : 'bg-primary'
                    : 'bg-gray-200'
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    selectedTemplateId === template.id ? 'text-white' : 'text-transparent'
                  }`}
                />
              </div>

              {/* Template Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">{template.label}</h4>
                  {template.category && getCategoryBadge(template.category)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{template.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Selected Template */}
      {selectedTemplateId && (
        <Card className="p-4 bg-muted/30">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Previzualizare mesaj selectat
            </p>
            <p className="text-sm">
              {templates.find((t) => t.id === selectedTemplateId)?.message}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
