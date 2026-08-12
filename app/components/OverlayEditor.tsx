/**
 * OverlayEditor
 *
 * Visual editor for OverlayItem arrays.
 * Three fixed slots (Top / Center / Bottom), each holding N text items.
 * Items can be dragged between slots and reordered within a slot.
 * Each item has inline controls for text, size, weight, align, case.
 */

import React, { useState } from 'react';
import { Button } from '@gaulatti/bleecker/components/button';
import { IconButton } from '@gaulatti/bleecker/components/icon-button';
import { Input } from '@gaulatti/bleecker/components/input';
import { Slider } from '@gaulatti/bleecker/components/slider';
import { Toggle } from '@gaulatti/bleecker/components/toggle';
import { ToggleGroup, ToggleGroupItem } from '@gaulatti/bleecker/components/toggle-group';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { OverlayItem } from '../templates/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Placement = 'top' | 'center' | 'bottom';

interface OverlayEditorProps {
  value: OverlayItem[];
  onChange: (items: OverlayItem[]) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}

function newItem(placement: Placement): OverlayItem {
  return {
    id: uid(),
    text: '',
    placement,
    align: 'left',
    fontSize: 72,
    fontWeight: 'bold',
    uppercase: false,
    shadow: true
  };
}

const SLOT_LABELS: Record<Placement, string> = {
  top: 'Top',
  center: 'Center',
  bottom: 'Bottom'
};

const SLOT_COLORS: Record<Placement, string> = {
  top: 'border-white/10 bg-white/[0.035]',
  center: 'border-white/10 bg-white/[0.05]',
  bottom: 'border-white/10 bg-white/[0.035]'
};

const SLOT_BADGE: Record<Placement, string> = {
  top: 'bg-white/[0.07] text-white/65',
  center: 'bg-desert/15 text-desert',
  bottom: 'bg-white/[0.07] text-white/65'
};

// ─── Single sortable item row ─────────────────────────────────────────────────

interface ItemRowProps {
  item: OverlayItem;
  onUpdate: (updated: OverlayItem) => void;
  onDelete: () => void;
  ghost?: boolean;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onUpdate, onDelete, ghost }) => {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  };

  const upd = (patch: Partial<OverlayItem>) => onUpdate({ ...item, ...patch });

  return (
    <div ref={setNodeRef} style={style} className={`rounded-lg border border-white/10 bg-white/5 ${ghost ? 'opacity-40' : ''}`}>
      {/* Header row */}
      <div className='flex items-center gap-2 px-3 py-2'>
        {/* Drag handle */}
        <IconButton
          {...listeners}
          {...attributes}
          aria-label='Drag to reorder'
          className='h-7 w-7 cursor-grab touch-none shrink-0 border-transparent bg-transparent text-white/30 hover:bg-white/[0.06] hover:text-white/60 active:cursor-grabbing'
          title='Drag to reorder'
        >
          <svg width='14' height='14' viewBox='0 0 14 14' fill='currentColor'>
            <circle cx='4' cy='3' r='1.2' />
            <circle cx='10' cy='3' r='1.2' />
            <circle cx='4' cy='7' r='1.2' />
            <circle cx='10' cy='7' r='1.2' />
            <circle cx='4' cy='11' r='1.2' />
            <circle cx='10' cy='11' r='1.2' />
          </svg>
        </IconButton>

        {/* Text preview / input */}
        <Input
          type='text'
          value={item.text}
          onChange={(e) => upd({ text: e.target.value })}
          placeholder='Enter text…'
          className='h-8 min-w-0 flex-1 border-transparent bg-transparent px-1 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:ring-0 dark:bg-transparent'
        />

        {/* Expand toggle */}
        <IconButton aria-label='Edit text style' onClick={() => setExpanded((x) => !x)} className='h-7 w-7 shrink-0 border-transparent bg-transparent text-white/40 hover:bg-white/[0.06] hover:text-white/80' title='Edit style'>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </IconButton>

        {/* Delete */}
        <IconButton aria-label='Remove text item' onClick={onDelete} className='h-7 w-7 shrink-0 border-transparent bg-transparent text-white/25 hover:bg-terracotta/10 hover:text-terracotta' title='Remove item'>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'>
            <path d='M2 2l10 10M12 2L2 12' />
          </svg>
        </IconButton>
      </div>

      {/* Expanded style controls */}
      {expanded && (
        <div className='px-3 pb-3 space-y-3 border-t border-white/10 pt-3'>
          {/* Font size slider */}
          <div>
            <div className='flex justify-between mb-1'>
              <span className='text-xs text-white/50'>Size</span>
              <span className='text-xs text-white/70 font-mono'>{item.fontSize ?? 72}px</span>
            </div>
            <Slider
              aria-label='Font size'
              min={24}
              max={180}
              step={2}
              value={item.fontSize ?? 72}
              onChange={(value) => upd({ fontSize: value })}
              className='w-full'
            />
          </div>

          {/* Alignment */}
          <div>
            <span className='text-xs text-white/50 block mb-1'>Align</span>
            <ToggleGroup type='single' value={item.align} onValueChange={(value) => value && upd({ align: value as OverlayItem['align'] })} size='sm' className='grid grid-cols-3'>
              {(['left', 'center', 'right'] as const).map((a) => (
                <ToggleGroupItem
                  key={a}
                  value={a}
                  aria-label={`Align ${a}`}
                  className='text-xs'
                >
                  {a[0].toUpperCase() + a.slice(1)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Toggles row */}
          <div className='flex gap-2'>
            {/* Bold */}
            <Toggle size='sm' pressed={item.fontWeight === 'bold'} onPressedChange={() => upd({ fontWeight: item.fontWeight === 'bold' ? 'normal' : 'bold' })} className='flex-1 text-xs font-semibold'>
              B Bold
            </Toggle>

            {/* Uppercase */}
            <Toggle size='sm' pressed={item.uppercase} onPressedChange={() => upd({ uppercase: !item.uppercase })} className='flex-1 text-xs'>
              AA Caps
            </Toggle>

            {/* Shadow */}
            <Toggle size='sm' pressed={item.shadow ?? true} onPressedChange={() => upd({ shadow: !(item.shadow ?? true) })} className='flex-1 text-xs'>
              ◑ Shadow
            </Toggle>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Slot container ───────────────────────────────────────────────────────────

interface SlotProps {
  placement: Placement;
  items: OverlayItem[];
  onAdd: () => void;
  onUpdate: (id: string, updated: OverlayItem) => void;
  onDelete: (id: string) => void;
}

const Slot: React.FC<SlotProps> = ({ placement, items, onAdd, onUpdate, onDelete }) => (
  <div className={`rounded-xl border ${SLOT_COLORS[placement]} p-3 space-y-2`}>
    <div className='flex items-center justify-between mb-1'>
      <span className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${SLOT_BADGE[placement]}`}>{SLOT_LABELS[placement]}</span>
      <Button onClick={onAdd} variant='ghost' size='xs' className='text-white/45 hover:bg-white/[0.06] hover:text-white/85' title='Add text item'>
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'>
          <path d='M6 1v10M1 6h10' />
        </svg>
        Add
      </Button>
    </div>

    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      {items.length === 0 ? (
        <p className='text-xs text-white/20 text-center py-3 italic'>Empty — add a text item</p>
      ) : (
        <div className='space-y-2'>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onUpdate={(u) => onUpdate(item.id, u)} onDelete={() => onDelete(item.id)} />
          ))}
        </div>
      )}
    </SortableContext>
  </div>
);

// ─── Main editor ──────────────────────────────────────────────────────────────

const OverlayEditor: React.FC<OverlayEditorProps> = ({ value, onChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const itemsFor = (placement: Placement) => value.filter((i) => (i.placement ?? 'bottom') === placement);

  const handleAdd = (placement: Placement) => {
    onChange([...value, newItem(placement)]);
  };

  const handleUpdate = (id: string, updated: OverlayItem) => {
    onChange(value.map((i) => (i.id === id ? updated : i)));
  };

  const handleDelete = (id: string) => {
    onChange(value.filter((i) => i.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = value.find((i) => i.id === active.id);
    if (!activeItem) return;

    // Determine target placement from over id — could be an item id or a slot sentinel
    const overItem = value.find((i) => i.id === over.id);
    const targetPlacement: Placement = overItem ? (overItem.placement ?? 'bottom') : (over.id as Placement);

    if (activeItem.placement !== targetPlacement) {
      onChange(value.map((i) => (i.id === active.id ? { ...i, placement: targetPlacement } : i)));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((i) => i.id === active.id);
    const newIndex = value.findIndex((i) => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const activeItem = activeId ? value.find((i) => i.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className='space-y-3'>
        {(['top', 'center', 'bottom'] as Placement[]).map((placement) => (
          <Slot
            key={placement}
            placement={placement}
            items={itemsFor(placement)}
            onAdd={() => handleAdd(placement)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className='rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-white shadow-2xl opacity-90 cursor-grabbing'>
            {activeItem.text || <em className='text-white/40'>empty</em>}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default OverlayEditor;
