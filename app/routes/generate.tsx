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
import { Button } from '@gaulatti/bleecker/components/button';
import { Card } from '@gaulatti/bleecker/components/card';
import { Empty } from '@gaulatti/bleecker/components/empty';
import { Field } from '@gaulatti/bleecker/components/field';
import { Input } from '@gaulatti/bleecker/components/input';
import { LoadingSpinner } from '@gaulatti/bleecker/components/loading-spinner';
import { showAlert } from '@gaulatti/bleecker/components/alert';
import { Select } from '@gaulatti/bleecker/components/select';
import { StatusBadge } from '@gaulatti/bleecker/components/status-badge';
import { Textarea } from '@gaulatti/bleecker/components/textarea';
import { Download, FileInput, FileText, ImageDown, ImageUp, LayoutTemplate } from 'lucide-react';
import { templates } from '../templates';
import type { OverlayItem } from '../templates/types';
import { useT } from '../i18n/useT';
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
import { exportNodeToPng, generateResumePdf, generateFifthbellLetterPdf, generateGaulattiLetterPdf, imageExportErrorMessage } from '../utils/exportImage';
import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';
import type { FifthbellLetterProps } from '../templates/TemplateFifthbellLetter';
import type { GaulattiLetterProps } from '../templates/TemplateGaulattiLetter';
import { buildResumeSchemaExample, parseResumeSchema } from '../templates/resumeSchema';
import { TemplateFontBoundary } from '../templates/TemplateFontBoundary';

export default function Generate() {
  const t = useT();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [values, setValues] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [previewViewport, setPreviewViewport] = useState({ width: 0, height: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const additionalRefs = useRef<Array<HTMLDivElement | null>>([]);
  const resumeJsonInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageUploadFieldKeyRef = useRef<string>('');

  // Get current template
  const template = templates.find((t) => t.id === selectedTemplateId);
  const isResume = selectedTemplateId.startsWith('resume_');
  const hasPdf = isResume || selectedTemplateId === 'fifthbell_letter' || selectedTemplateId === 'gaulatti_letter';
  const previewScale = template?.previewScale ?? template?.galleryScale ?? 1;
  const previewViewportHeight = 'calc(100vh - var(--bleecker-header-height, 88px) - 72px)';
  const fittedPreviewScale = React.useMemo(() => {
    if (!template) return 1;
    const width = Math.max(0, previewViewport.width - 24);
    const height = Math.max(0, previewViewport.height - 24);
    if (!width || !height) return previewScale;

    const widthScale = width / template.width;
    const heightScale = height / template.height;
    const fit = Math.min(widthScale, heightScale);

    if (!Number.isFinite(fit) || fit <= 0) return previewScale;
    return fit;
  }, [previewScale, previewViewport.height, previewViewport.width, template]);
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

  React.useEffect(() => {
    const node = previewScrollRef.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setPreviewViewport({
        width: rect.width,
        height: rect.height
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(node);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [selectedTemplateId]);

  const handleFieldChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageFieldUpload = (key: string, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleFieldChange(key, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePickImage = (key: string) => {
    imageUploadFieldKeyRef.current = key;
    imageInputRef.current?.click();
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageFieldUpload(imageUploadFieldKeyRef.current, e.target.files?.[0]);
    e.target.value = '';
  };

  const handleExport = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      await exportNodeToPng(previewRef.current, `${template.id}.png`, template.width, template.height, template.fonts);
    } catch (error) {
      console.error('Export failed:', error);
      showAlert(imageExportErrorMessage(error), 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current || !template) return;
    setIsExporting(true);
    try {
      if (selectedTemplateId === 'fifthbell_letter') {
        await generateFifthbellLetterPdf(values as FifthbellLetterProps, `${template.id}.pdf`);
      } else if (selectedTemplateId === 'gaulatti_letter') {
        await generateGaulattiLetterPdf(values as GaulattiLetterProps, `${template.id}.pdf`);
      } else {
        await generateResumePdf(values as ResumeLetterProps, `${template.id}.pdf`);
      }
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
      <main className='page-canvas'><div className='page-container max-w-3xl'><Empty icon={<LayoutTemplate size={22} />} title={t('generate.title')} description={t('generate.noTemplates')} /></div></main>
    );
  }

  return (
    <main className='page-canvas'>
      <div className='page-container'>
        <header className='mb-9 flex flex-col gap-6 border-b border-sand/25 pb-8 dark:border-white/[0.08] sm:flex-row sm:items-end sm:justify-between'>
          <div><p className='text-[10px] font-semibold uppercase tracking-[0.13em] text-desert'>Production studio</p><h1 className='mt-3 text-4xl font-semibold tracking-refined sm:text-5xl'>{t('generate.title')}</h1><p className='font-secondary mt-3 max-w-xl text-sm leading-6 text-text-secondary'>Choose a format, refine its content, and export production-ready artwork.</p></div>
          <StatusBadge label={`${template.width} × ${template.height}px`} variant='default' />
        </header>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start'>
          {/* Left panel - Controls */}
          <div className='space-y-5 lg:col-span-4 xl:col-span-3'>
            {/* Template selector */}
            <Card variant='elevated'>
              <Field label={t('generate.selectTemplate')} description={`${templates.length} production formats`}>
              <Select
                aria-label={t('generate.selectTemplate')}
                value={selectedTemplateId}
                onChange={setSelectedTemplateId}
                options={templates.map((item) => ({ label: item.name, value: item.id }))}
              />
              </Field>
            </Card>

            {/* Dynamic form */}
            <Card variant='surface'>
              <div className='mb-5 flex items-center justify-between'><div><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Content</p><h2 className='mt-1.5 text-xl font-medium'>{t('generate.editFields')}</h2></div><StatusBadge label={`${template.fields.length} fields`} /></div>
              <div className='editor-stack max-h-[38rem] space-y-5 overflow-y-auto pr-2'>
                {template.fields.map((field) => (
                  <div key={field.key}>
                    {field.type === 'overlays' ? (
                      <Field label={field.label}><div><OverlayEditor value={(values[field.key] as OverlayItem[]) || []} onChange={(overlays) => handleFieldChange(field.key, overlays)} /></div></Field>
                    ) : field.type === 'experienceItems' ? (
                      <Field label={field.label}><div>
                      <ResumeExperienceEditor
                        value={(values[field.key] as ResumeLetterProps['experience']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'educationItems' ? (
                      <Field label={field.label}><div>
                      <ResumeEducationEditor
                        value={(values[field.key] as ResumeLetterProps['education']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'skillGroups' ? (
                      <Field label={field.label}><div>
                      <ResumeSkillGroupEditor
                        value={(values[field.key] as ResumeLetterProps['skillGroups']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'contactLinks' ? (
                      <Field label={field.label}><div>
                      <ResumeContactLinksEditor
                        value={(values[field.key] as ResumeLetterProps['contactLinks']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'languageItems' ? (
                      <Field label={field.label}><div>
                      <ResumeLanguageEditor
                        value={(values[field.key] as ResumeLetterProps['languages']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'spotlightItems' ? (
                      <Field label={field.label}><div>
                      <ResumeSpotlightEditor
                        value={(values[field.key] as ResumeLetterProps['spotlights']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'earlierExperienceItems' ? (
                      <Field label={field.label}><div>
                      <ResumeEarlierExperienceEditor
                        value={(values[field.key] as ResumeLetterProps['earlierExperiences']) || []}
                        onChange={(items) => handleFieldChange(field.key, items)}
                      /></div></Field>
                    ) : field.type === 'textarea' ? (
                      <Field label={field.label}><Textarea
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                      /></Field>
                    ) : field.type === 'number' ? (
                      <Field label={field.label}><Input
                        type='number'
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                      /></Field>
                    ) : field.type === 'image' ? (
                      <Field label={field.label}><div className='flex items-center gap-2'>
                        <Input
                          type='text'
                          value={String(values[field.key] || '').startsWith('data:') ? '' : values[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={String(values[field.key] || '').startsWith('data:') ? 'Local image loaded' : field.placeholder}
                        />
                        <Button
                          variant='secondary'
                          className='shrink-0'
                          title='Upload local image'
                          onClick={() => handlePickImage(field.key)}
                        >
                          <ImageUp size={15} />
                        </Button>
                      </div></Field>
                    ) : (
                      <Field label={field.label}><Input
                        type='text'
                        value={values[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      /></Field>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Export buttons */}
            <Card variant='outlined' className='space-y-3'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Export artwork</p>
              <Button fullWidth
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? <LoadingSpinner size='sm' /> : <ImageDown size={15} />}{isExporting ? t('generate.exporting') : t('generate.exportPng', { width: template.width, height: template.height })}
              </Button>
              {hasPdf && (
                <Button fullWidth variant='secondary'
                  onClick={handleExportPdf}
                  disabled={isExporting}
                >
                  <FileText size={15} />{isExporting ? t('generate.exporting') : t('generate.exportPdf')}
                </Button>
              )}
              {isResume && (
                <>
                  <Button fullWidth variant='ghost'
                    onClick={handleDownloadResumeTemplate}
                  >
                    <Download size={15} />{t('generate.downloadTemplate')}
                  </Button>
                  <Button fullWidth variant='ghost'
                    onClick={handlePickResumeJson}
                  >
                    <FileInput size={15} />{t('generate.loadJson')}
                  </Button>
                  <input ref={resumeJsonInputRef} type='file' accept='application/json,.json' onChange={handleLoadResumeJson} className='hidden' />
                </>
              )}
              <input ref={imageInputRef} type='file' accept='image/*' onChange={handleImageInputChange} className='hidden' />
            </Card>
          </div>

          {/* Right panel - Preview */}
          <div className='lg:sticky lg:top-6 lg:col-span-8 lg:self-start xl:col-span-9'>
            <Card padding='md' variant='elevated'>
              <div className='mb-5 flex items-center justify-between'><div><p className='text-[10px] font-semibold uppercase tracking-[0.1em] text-text-secondary'>Canvas</p><h2 className='mt-1.5 text-xl font-medium'>{t('generate.livePreview')}</h2></div><StatusBadge label='Live' variant='live' /></div>
              <div
                ref={previewScrollRef}
                className='preview-stage flex flex-col items-center gap-6 overflow-auto rounded-[var(--radius-ui)] p-4'
                style={{ height: previewViewportHeight }}
              >
                {/* Page 1 */}
                <div
                  className='relative shrink-0'
                  style={{ width: `${template.width * fittedPreviewScale}px`, height: `${template.height * fittedPreviewScale}px`, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      transformOrigin: 'top left',
                      transform: `scale(${fittedPreviewScale})`,
                      width: `${template.width}px`,
                      height: `${template.height}px`
                    }}
                  >
                    <div ref={previewRef} style={{ width: `${template.width}px`, height: `${template.height}px` }}>
                      <TemplateFontBoundary fonts={template.fonts}><template.Component key={JSON.stringify(values)} {...values} /></TemplateFontBoundary>
                    </div>
                  </div>
                </div>

                {/* Additional pages (e.g. resume page 2) */}
                {additionalPageElements.map((pageElement, index) => (
                  <div
                    key={index}
                    className='relative shrink-0'
                    style={{ width: `${template.width * fittedPreviewScale}px`, height: `${template.height * fittedPreviewScale}px`, overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        transformOrigin: 'top left',
                        transform: `scale(${fittedPreviewScale})`,
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
                        <TemplateFontBoundary fonts={template.fonts}>{pageElement}</TemplateFontBoundary>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
