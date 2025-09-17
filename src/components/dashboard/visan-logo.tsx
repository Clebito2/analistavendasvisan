import * as React from 'react';
import { cn } from '@/lib/utils';

export function VisanLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('h-8 w-8 text-primary', className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM184,88,136.63,176h-17L72,88H90.2l37.77,72.43L165.75,88Z"
      />
    </svg>
  );
}
