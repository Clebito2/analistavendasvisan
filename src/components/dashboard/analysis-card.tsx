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
    const hasTable = content.includes('|');
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground/90">$1</strong>');

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-sm text-foreground/80 whitespace-pre-wrap font-body",
            hasTable && "font-code text-xs"
          )}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </CardContent>
    </Card>
  );
}
