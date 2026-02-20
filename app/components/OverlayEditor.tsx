/**
 * OverlayEditor
 *
 * Visual editor for OverlayItem arrays.
 * Three fixed slots (Top / Center / Bottom), each holding N text items.
 * Items can be dragged between slots and reordered within a slot.
 * Each item has inline controls for text, size, weight, align, case.
 */

import React, { useState } from 'react';
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
  top: 'border-sky-400/40 bg-sky-950/20',
  center: 'border-violet-400/40 bg-violet-950/20',
  bottom: 'border-emerald-400/40 bg-emerald-950/20'
};

const SLOT_BADGE: Record<Placement, string> = {
  top: 'bg-sky-500/20 text-sky-300',
  center: 'bg-violet-500/20 text-violet-300',
  bottom: 'bg-emerald-500/20 text-emerald-300'
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
        <button
          {...listeners}
          {...attributes}
          className='cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 touch-none shrink-0'
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
        </button>

        {/* Text preview / input */}
        <input
          type='text'
          value={item.text}
          onChange={(e) => upd({ text: e.target.value })}
          placeholder='Enter text…'
          className='flex-1 min-w-0 bg-transparent text-white placeholder-white/30 text-sm outline-none'
        />

        {/* Expand toggle */}
        <button onClick={() => setExpanded((x) => !x)} className='text-white/40 hover:text-white/80 shrink-0 transition-colors' title='Edit style'>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor' className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path d='M4 6l4 4 4-4' stroke='currentColor' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </button>

        {/* Delete */}
        <button onClick={onDelete} className='text-white/25 hover:text-red-400 shrink-0 transition-colors' title='Remove item'>
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'>
            <path d='M2 2l10 10M12 2L2 12' />
          </svg>
        </button>
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
            <input
              type='range'
              min={24}
              max={180}
              step={2}
              value={item.fontSize ?? 72}
              onChange={(e) => upd({ fontSize: parseInt(e.target.value) })}
              className='w-full accent-sky-400 h-1.5'
            />
          </div>

          {/* Alignment */}
          <div>
            <span className='text-xs text-white/50 block mb-1'>Align</span>
            <div className='flex gap-1'>
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => upd({ align: a })}
                  className={`flex-1 py-1 rounded text-xs transition-colors ${item.align === a ? 'bg-sky-500/40 text-sky-200' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                >
                  {a === 'left' ? '⬛ Left' : a === 'center' ? '⬜ Center' : 'Right ⬛'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles row */}
          <div className='flex gap-2'>
            {/* Bold */}
            <button
              onClick={() => upd({ fontWeight: item.fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${item.fontWeight === 'bold' ? 'bg-sky-500/40 text-sky-200' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              B Bold
            </button>

            {/* Uppercase */}
            <button
              onClick={() => upd({ uppercase: !item.uppercase })}
              className={`flex-1 py-1 rounded text-xs transition-colors ${item.uppercase ? 'bg-sky-500/40 text-sky-200' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              AA Caps
            </button>

            {/* Shadow */}
            <button
              onClick={() => upd({ shadow: !(item.shadow ?? true) })}
              className={`flex-1 py-1 rounded text-xs transition-colors ${(item.shadow ?? true) ? 'bg-sky-500/40 text-sky-200' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              ◑ Shadow
            </button>
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
      <button onClick={onAdd} className='text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1' title='Add text item'>
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'>
          <path d='M6 1v10M1 6h10' />
        </svg>
        Add
      </button>
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
