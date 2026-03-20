/**
 * Generate Page
 *
 * Main template generation interface where users can:
 * 1. Select a template from dropdown
 * 2. Edit template fields via auto-generated form
 * 3. Preview changes live
 * 4. Export the result as PNG (and PDF for resume templates)
 */

import React, { useState, useRef } from 'react';
import { templates } from '../templates';
import type { OverlayItem } from '../templates/types';
import OverlayEditor from '../components/OverlayEditor';
import {
  ResumeContactLinksEditor,
  ResumeEducationEditor,
  ResumeEarlierExperienceEditor,
  ResumeExperienceEditor,
  ResumeLanguageEditor,
  ResumeSkillGroupEditor,
  ResumeSpotlightEditor
} from '../components/ResumeDataEditor';
import { exportNodeToPng, generateResumePdf } from '../utils/exportImage';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';
import { buildResumeSchemaExample, parseResumeSchema } from '../templates/resumeSchema';

export default function Generate() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [values, setValues] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const additionalRefs = useRef<Array<HTMLDivElement | null>>([]);
  const resumeJsonInputRef = useRef<HTMLInputElement>(null);

  // Get current template
  const template = templates.find((t) => t.id === selectedTemplateId);
  const isResume = selectedTemplateId.startsWith('resume_');
  const additionalPageElements = template
    ? template.renderAdditionalPages
      ? template.renderAdditionalPages(values as any)
      : template.additionalPages?.map((PageComponent, index) => <PageComponent key={`additional-${index}`} {...values} />) || []
    : [];

  // Initialize values when template changes
  React.useEffect(() => {
    if (template) {
      setValues({ ...template.defaultProps });
    }
  }, [template]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplateId(e.target.value);
  };

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      await exportNodeToPng(previewRef.current, `${template.id}.png`, template.width, template.height);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      // Vector PDF only — @react-pdf/renderer with true selectable text
      await generateResumePdf(values as ResumeLetterProps, `${template.id}.pdf`);
    } catch (error) {
      console.error('Vector PDF export failed:', error);
      alert('PDF export failed. Check console for details.');
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadResumeTemplate = () => {
    if (!template || !isResume) return;

    const sourceProps = (values as ResumeLetterProps) || (template.defaultProps as ResumeLetterProps);
    const schema = buildResumeSchemaExample(sourceProps);
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.id}.schema.example.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePickResumeJson = () => {
    resumeJsonInputRef.current?.click();
  };

  const handleLoadResumeJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !template || !isResume) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const result = parseResumeSchema(parsed, template.defaultProps as ResumeLetterProps);

      if (!result.ok || !result.value) {
        alert(`Invalid resume JSON:\n\n${result.errors.join('\n')}`);
        return;
      }

      setValues(result.value);
    } catch (error) {
      console.error('Failed to load resume JSON:', error);
      alert('Failed to load JSON file. Please verify it is valid JSON and follows the resume schema.');
    } finally {
      event.target.value = '';
    }
  };

  if (!template) {
    return (
      <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
        <div className='container mx-auto'>
          <h1 className='text-4xl font-display font-medium text-text-primary mb-4 tracking-refined'>Template Generator</h1>
          <p className='text-text-secondary'>No templates available. Please add templates to the registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-light-sand dark:bg-deep-sea p-8'>
      <div className='container mx-auto'>
        <h1 className='text-4xl font-display font-medium text-text-primary mb-8 tracking-refined'>Template Generator</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left panel - Controls */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Template selector */}
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <label className='block text-sm font-medium text-text-primary dark:text-white mb-2 tracking-wide'>Select Template</label>
              <select
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue bg-white dark:bg-sand text-text-primary dark:text-white transition-all duration-300'
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic form */}
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <h2 className='text-lg font-display font-medium text-text-primary dark:text-white mb-4 tracking-refined'>Edit Fields</h2>
              <div className='space-y-4 max-h-[600px] overflow-y-auto'>
                {template.fields.map((field) => (
                  <div key={field.key}>
                    <label className='block text-sm font-medium text-text-primary dark:text-white mb-1 tracking-wide'>{field.label}</label>
                    {field.type === 'overlays' ? (
                      <OverlayEditor value={(values[field.key] as OverlayItem[]) || []} onChange={(overlays) => handleFieldChange(field.key, overlays)} />
                    ) : field.type === 'experienceItems' ? (
                      <ResumeExperienceEditor
                        value={(values[field.key] as ResumeLetterProps['experience']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'educationItems' ? (
                      <ResumeEducationEditor
                        value={(values[field.key] as ResumeLetterProps['education']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'skillGroups' ? (
                      <ResumeSkillGroupEditor
                        value={(values[field.key] as ResumeLetterProps['skillGroups']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'contactLinks' ? (
                      <ResumeContactLinksEditor
                        value={(values[field.key] as ResumeLetterProps['contactLinks']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'languageItems' ? (
                      <ResumeLanguageEditor
                        value={(values[field.key] as ResumeLetterProps['languages']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'spotlightItems' ? (
                      <ResumeSpotlightEditor
                        value={(values[field.key] as ResumeLetterProps['spotlights']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'earlierExperienceItems' ? (
                      <ResumeEarlierExperienceEditor
                        value={(values[field.key] as ResumeLetterProps['earlierExperiences']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      />
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    ) : field.type === 'number' ? (
                      <input
                        type='number'
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    ) : (
                      <input
                        type='text'
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className='w-full px-3 py-2 border border-sand/30 dark:border-sand/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sea dark:focus:ring-accent-blue focus:border-sea dark:focus:border-accent-blue text-sm text-text-primary dark:text-white bg-white dark:bg-sand transition-all duration-300'
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export buttons */}
            <div className='flex flex-col gap-2'>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className='w-full bg-sea dark:bg-accent-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-desert dark:hover:bg-desert disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
              >
                {isExporting ? 'Exporting...' : `Export PNG (${template.width}×${template.height})`}
              </button>
              {isResume && (
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className='w-full bg-desert text-white px-6 py-3 rounded-lg font-medium hover:bg-sea dark:hover:bg-sea disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all duration-400 shadow-sm hover:shadow tracking-elegant'
                >
                  {isExporting ? 'Exporting...' : 'Export PDF (Letter)'}
                </button>
              )}
              {isResume && (
                <>
                  <button
                    onClick={handleDownloadResumeTemplate}
                    className='w-full bg-white dark:bg-sand text-text-primary dark:text-white px-6 py-3 rounded-lg font-medium border border-sand/40 hover:border-sea dark:hover:border-accent-blue transition-all duration-300'
                  >
                    Download Template
                  </button>
                  <button
                    onClick={handlePickResumeJson}
                    className='w-full bg-white dark:bg-sand text-text-primary dark:text-white px-6 py-3 rounded-lg font-medium border border-sand/40 hover:border-sea dark:hover:border-accent-blue transition-all duration-300'
                  >
                    Load JSON
                  </button>
                  <input ref={resumeJsonInputRef} type='file' accept='application/json,.json' onChange={handleLoadResumeJson} className='hidden' />
                </>
              )}
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-dark-sand rounded-lg shadow-sm p-6 border border-sand/10 dark:border-dark-sand/20'>
              <h2 className='text-lg font-display font-medium text-text-primary dark:text-white mb-4 tracking-refined'>Live Preview</h2>
              <div className='flex flex-col items-center gap-6 bg-light-sand dark:bg-dark-sand p-4 rounded-lg'>
                {/* Page 1 */}
                <div
                  className='relative'
                  style={{ width: `${template.width * template.galleryScale}px`, height: `${template.height * template.galleryScale}px`, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: `scale(${template.galleryScale})`,
                      width: `${template.width}px`,
                      height: `${template.height}px`
                    }}
                  >
                    <div ref={previewRef} style={{ width: `${template.width}px`, height: `${template.height}px` }}>
                      <template.Component key={JSON.stringify(values)} {...values} />
                    </div>
                  </div>
                </div>

                {/* Additional pages (e.g. resume page 2) */}
                {additionalPageElements.map((pageElement, index) => (
                  <div
                    key={index}
                    className='relative'
                    style={{ width: `${template.width * template.galleryScale}px`, height: `${template.height * template.galleryScale}px`, overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        transformOrigin: 'top left',
                        transform: `scale(${template.galleryScale})`,
                        width: `${template.width}px`,
                        height: `${template.height}px`
                      }}
                    >
                      <div
                        ref={(el) => {
                          additionalRefs.current[index] = el;
                        }}
                        style={{ width: `${template.width}px`, height: `${template.height}px` }}
                      >
                        {pageElement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
