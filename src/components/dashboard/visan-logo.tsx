import * as React from 'react';
import { cn } from '@/lib/utils';

export function VisanLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-8 w-8 text-primary', className)}
      {...props}
    >
      <path d="M3.5 3.5l5 5" />
      <path d="M20.5 3.5l-5 5" />
      <path d="M8.5 8.5l-5 5" />
      <path d="M15.5 8.5l5 5" />
      <path d="M12 12l-5 5" />
      <path d="M12 12l5 5" />
    </svg>
  );
}
