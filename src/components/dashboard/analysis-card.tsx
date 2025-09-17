import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  title: string;
  icon: ReactNode;
  content: string;
  className?: string;
}

export function AnalysisCard({ title, icon, content, className }: AnalysisCardProps) {
  const formattedContent = content
    .replace(/-\s/g, '• ')
    .replace(/\*\s/g, '• ');

  const hasTable = formattedContent.includes('|');

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-sm text-foreground/80 whitespace-pre-wrap font-body space-y-2",
          hasTable && "font-code text-xs"
          )}>
          {formattedContent.split('\n').map((line, index) => (
            <p key={index}>
              {line.trim() === '' ? '\u00A0' : line}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
