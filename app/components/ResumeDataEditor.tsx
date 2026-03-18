import React from 'react';
import type {
  ResumeEducationItem,
  ResumeEarlierExperienceItem,
  ResumeExperienceItem,
  ResumeLanguageItem,
  ResumeSkillGroup,
  ResumeSpotlightItem
} from '../templates/TemplateResumeLetterP1';

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const SectionFrame: React.FC<{ title: string; onAdd: () => void; addLabel: string; children: React.ReactNode }> = ({ title, onAdd, addLabel, children }) => (
  <div className='rounded-xl border border-sand/40 dark:border-sand/30 bg-light-sand/50 dark:bg-dark-sand/50 p-3 space-y-3'>
    <div className='flex items-center justify-between'>
      <span className='text-xs font-semibold uppercase tracking-widest text-text-secondary'>{title}</span>
      <button onClick={onAdd} className='text-xs px-2 py-1 rounded border border-sand/50 hover:border-sea transition-colors'>
        {addLabel}
      </button>
    </div>
    {children}
  </div>
);

const RowActions: React.FC<{ onUp: () => void; onDown: () => void; onDelete: () => void; canMoveUp: boolean; canMoveDown: boolean }> = ({
  onUp,
  onDown,
  onDelete,
  canMoveUp,
  canMoveDown
}) => (
  <div className='flex items-center gap-2'>
    <button onClick={onUp} disabled={!canMoveUp} className='text-xs px-2 py-1 rounded border border-sand/50 disabled:opacity-40'>
      Up
    </button>
    <button onClick={onDown} disabled={!canMoveDown} className='text-xs px-2 py-1 rounded border border-sand/50 disabled:opacity-40'>
      Down
    </button>
    <button onClick={onDelete} className='text-xs px-2 py-1 rounded border border-red-300 text-red-700 dark:text-red-300'>
      Remove
    </button>
  </div>
);

const move = <T,>(arr: T[], from: number, to: number): T[] => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

interface ExperienceEditorProps {
  value: ResumeExperienceItem[];
  onChange: (items: ResumeExperienceItem[]) => void;
}

export const ResumeExperienceEditor: React.FC<ExperienceEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('exp'),
        title: '',
        company: '',
        date: '',
        highlights: []
      }
    ]);

  const update = (id: string, patch: Partial<ResumeExperienceItem>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <SectionFrame title='Experience Items' onAdd={addItem} addLabel='Add Job'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No experience entries yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <div className='grid grid-cols-1 gap-2'>
              <input
                type='text'
                value={item.title}
                onChange={(e) => update(item.id, { title: e.target.value })}
                placeholder='Role / Title'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <input
                  type='text'
                  value={item.company}
                  onChange={(e) => update(item.id, { company: e.target.value })}
                  placeholder='Company'
                  className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
                />
                <input
                  type='text'
                  value={item.date}
                  onChange={(e) => update(item.id, { date: e.target.value })}
                  placeholder='Dates'
                  className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
                />
              </div>
              <textarea
                value={item.highlights.join('\n')}
                onChange={(e) => update(item.id, { highlights: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })}
                rows={4}
                placeholder='Highlights (one per line)'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
            </div>
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface EducationEditorProps {
  value: ResumeEducationItem[];
  onChange: (items: ResumeEducationItem[]) => void;
}

export const ResumeEducationEditor: React.FC<EducationEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('edu'),
        degree: '',
        school: '',
        date: ''
      }
    ]);

  const update = (id: string, patch: Partial<ResumeEducationItem>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <SectionFrame title='Education Items' onAdd={addItem} addLabel='Add Education'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No education entries yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <input
              type='text'
              value={item.degree}
              onChange={(e) => update(item.id, { degree: e.target.value })}
              placeholder='Degree'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <input
                type='text'
                value={item.school}
                onChange={(e) => update(item.id, { school: e.target.value })}
                placeholder='School'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
              <input
                type='text'
                value={item.date}
                onChange={(e) => update(item.id, { date: e.target.value })}
                placeholder='Date'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
            </div>
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface SkillGroupEditorProps {
  value: ResumeSkillGroup[];
  onChange: (items: ResumeSkillGroup[]) => void;
}

export const ResumeSkillGroupEditor: React.FC<SkillGroupEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('skills'),
        title: '',
        items: []
      }
    ]);

  const update = (id: string, patch: Partial<ResumeSkillGroup>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));
  const updateSkill = (id: string, skillIndex: number, nextValue: string) =>
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              items: item.items.map((skill, index) => (index === skillIndex ? nextValue : skill))
            }
          : item
      )
    );
  const addSkill = (id: string) =>
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              items: [...item.items, '']
            }
          : item
      )
    );
  const removeSkill = (id: string, skillIndex: number) =>
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              items: item.items.filter((_, index) => index !== skillIndex)
            }
          : item
      )
    );

  return (
    <SectionFrame title='Skill Groups' onAdd={addItem} addLabel='Add Group'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No skill groups yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <input
              type='text'
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder='Group title (e.g. Frontend)'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <div className='space-y-2'>
              {(item.items || []).map((skill, skillIndex) => (
                <div key={`${item.id}-skill-${skillIndex}`} className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={skill}
                    onChange={(e) => updateSkill(item.id, skillIndex, e.target.value)}
                    placeholder='Skill item'
                    className='flex-1 px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
                  />
                  <button
                    onClick={() => removeSkill(item.id, skillIndex)}
                    className='text-xs px-2 py-2 rounded border border-red-300 text-red-700 dark:text-red-300'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={() => addSkill(item.id)} className='text-xs px-2 py-1 rounded border border-sand/50 hover:border-sea transition-colors'>
                Add Skill
              </button>
            </div>
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface SpotlightEditorProps {
  value: ResumeSpotlightItem[];
  onChange: (items: ResumeSpotlightItem[]) => void;
}

export const ResumeSpotlightEditor: React.FC<SpotlightEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('spotlight'),
        title: '',
        metric: '',
        impact: ''
      }
    ]);

  const update = (id: string, patch: Partial<ResumeSpotlightItem>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <SectionFrame title='Spotlights' onAdd={addItem} addLabel='Add Spotlight'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No spotlight entries yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <input
              type='text'
              value={item.title}
              onChange={(e) => update(item.id, { title: e.target.value })}
              placeholder='Title'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <input
              type='text'
              value={item.metric}
              onChange={(e) => update(item.id, { metric: e.target.value })}
              placeholder='Metric / headline'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <textarea
              value={item.impact}
              onChange={(e) => update(item.id, { impact: e.target.value })}
              rows={3}
              placeholder='Impact details'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface EarlierExperienceEditorProps {
  value: ResumeEarlierExperienceItem[];
  onChange: (items: ResumeEarlierExperienceItem[]) => void;
}

export const ResumeEarlierExperienceEditor: React.FC<EarlierExperienceEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('earlier'),
        text: ''
      }
    ]);

  const update = (id: string, patch: Partial<ResumeEarlierExperienceItem>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <SectionFrame title='Earlier Experience' onAdd={addItem} addLabel='Add Earlier Item'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No earlier experience entries yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <textarea
              value={item.text}
              onChange={(e) => update(item.id, { text: e.target.value })}
              rows={2}
              placeholder='Earlier experience summary'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface ContactLinksEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
}

export const ResumeContactLinksEditor: React.FC<ContactLinksEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () => onChange([...items, '']);

  const update = (index: number, nextValue: string) => onChange(items.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  const remove = (index: number) => onChange(items.filter((_, itemIndex) => itemIndex !== index));

  return (
    <SectionFrame title='Contact Links' onAdd={addItem} addLabel='Add Link'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No contact links yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={`contact-link-${index}`} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <input
              type='text'
              value={item}
              onChange={(e) => update(index, e.target.value)}
              placeholder='https://github.com/yourname'
              className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
            />
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(index)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};

interface LanguageEditorProps {
  value: ResumeLanguageItem[];
  onChange: (items: ResumeLanguageItem[]) => void;
}

export const ResumeLanguageEditor: React.FC<LanguageEditorProps> = ({ value, onChange }) => {
  const items = value || [];

  const addItem = () =>
    onChange([
      ...items,
      {
        id: uid('lang'),
        language: '',
        proficiency: ''
      }
    ]);

  const update = (id: string, patch: Partial<ResumeLanguageItem>) => onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <SectionFrame title='Languages' onAdd={addItem} addLabel='Add Language'>
      {items.length === 0 && <p className='text-xs text-text-secondary italic'>No language entries yet.</p>}
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={item.id} className='rounded-lg border border-sand/40 bg-white dark:bg-sand/30 p-3 space-y-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <input
                type='text'
                value={item.language}
                onChange={(e) => update(item.id, { language: e.target.value })}
                placeholder='Language'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
              <input
                type='text'
                value={item.proficiency}
                onChange={(e) => update(item.id, { proficiency: e.target.value })}
                placeholder='Fluency level'
                className='w-full px-3 py-2 text-sm border border-sand/40 rounded-md bg-white dark:bg-sand'
              />
            </div>
            <RowActions
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onUp={() => onChange(move(items, index, index - 1))}
              onDown={() => onChange(move(items, index, index + 1))}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};
