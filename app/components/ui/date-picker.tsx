import * as React from 'react';
import { format, getDate, getMonth, getYear, setDate, setMonth, setYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ?? new Date();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 121 }, (_, i) => currentYear - 100 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const update = (updater: (d: Date) => Date) => {
    const next = updater(new Date(date));
    onChange?.(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-2">
          <Select
            value={String(getMonth(date))}
            onValueChange={(v) => update((d) => setMonth(d, Number(v)))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={String(index)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(getDate(date))}
            onValueChange={(v) => update((d) => setDate(d, Number(v)))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={String(day)}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(getYear(date))}
            onValueChange={(v) => update((d) => setYear(d, Number(v)))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
