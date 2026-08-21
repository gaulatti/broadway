import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-foreground"
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span className={cn(isLast && 'text-foreground')}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
