import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex flex-col sm:flex-row gap-2',
          defaultClassNames.months
        ),
        month: cn('flex flex-col gap-4', defaultClassNames.month),
        month_caption: cn(
          'flex justify-center pt-1 relative items-center w-full',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'text-sm font-medium',
          defaultClassNames.caption_label
        ),
        nav: cn(
          'flex items-center justify-between absolute inset-x-0 top-0 w-full',
          defaultClassNames.nav
        ),
        button_previous: cn(
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-input shadow-sm',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-input shadow-sm',
          defaultClassNames.button_next
        ),
        month_grid: cn('w-full border-collapse space-y-1', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          defaultClassNames.weekday
        ),
        weeks: cn('space-y-1', defaultClassNames.weeks),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          defaultClassNames.day
        ),
        day_button: cn(
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground',
          defaultClassNames.day_button
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        today: cn('bg-accent text-accent-foreground', defaultClassNames.today),
        selected: cn(
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          defaultClassNames.selected
        ),
        disabled: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        range_start: cn('rounded-r-none', defaultClassNames.range_start),
        range_middle: cn(
          'rounded-none bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground',
          defaultClassNames.range_middle
        ),
        range_end: cn('rounded-l-none', defaultClassNames.range_end),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" {...props} />
          ) : (
            <ChevronRight className="h-4 w-4" {...props} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
