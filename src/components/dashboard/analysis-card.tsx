import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AnalysisCardProps {
  title: string;
  icon: ReactNode;
  content: string;
  className?: string;
}

function MarkdownTable({ content }: { content: string }) {
  const lines = content.trim().split('\n');
  const headerLine = lines[0];
  const separatorLine = lines[1];
  
  // Basic check if it's a markdown table
  if (!headerLine?.includes('|') || !separatorLine?.includes('|')) {
    return null;
  }

  const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));

  if (headers.length === 0 || rows.some(row => row.length !== headers.length)) {
    return null; // Invalid table structure
  }
  
  return (
    <Table className="font-code text-xs">
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export function AnalysisCard({ title, icon, content, className }: AnalysisCardProps) {
  // Regex to find a markdown table. It looks for a header with pipes, a separator line, and then the content.
  const tableRegex = /(\s*\|.*\|[\s\S]*?)(?:\n\n|$)/;
  const tableMatch = content.match(tableRegex);
  
  let textContent = content;
  let tableContent: string | null = null;
  
  if (tableMatch) {
    tableContent = tableMatch[0];
    textContent = content.replace(tableContent, '').trim();
  }
  
  const formattedText = textContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground/90">$1</strong>');

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {formattedText && (
          <div
            className="text-sm text-foreground/80 whitespace-pre-wrap font-body"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        )}
        {tableContent && <MarkdownTable content={tableContent} />}
      </CardContent>
    </Card>
  );
}
