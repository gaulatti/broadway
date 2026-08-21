import * as React from 'react';
import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export interface SelectFilter {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: SelectFilter[];
  searchPlaceholder?: string;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  filters,
  searchPlaceholder = 'Search...',
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center',
        className
      )}
    >
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="sm:max-w-xs"
      />
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onValueChange={filter.onChange}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue
              placeholder={filter.placeholder ?? filter.label}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
