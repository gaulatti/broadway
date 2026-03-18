import type { ResumeLetterProps } from './TemplateResumeLetterP1';

export const RESUME_SCHEMA_VERSION = '2.0.0' as const;
export const RESUME_TEMPLATE_ID = 'resume_letter' as const;

export interface ResumeTemplateSchema {
  schemaVersion: typeof RESUME_SCHEMA_VERSION;
  templateId: typeof RESUME_TEMPLATE_ID;
  profile: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    links?: string[];
    website?: string;
    introStatement?: string;
  };
  languages?: Array<
    | string
    | {
        language?: string;
        proficiency?: string;
      }
  >;
  spotlights?: Array<{
    title?: string;
    metric?: string;
    impact?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    date: string;
    highlights: string[];
  }>;
  earlierExperiences?: Array<
    | string
    | {
        text?: string;
      }
  >;
  education?: Array<{
    degree?: string;
    school?: string;
    date?: string;
  }>;
  skillGroups?: Array<{
    title?: string;
    items: string[];
  }>;
}

export interface ResumeSchemaParseResult {
  ok: boolean;
  errors: string[];
  value?: ResumeLetterProps;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const ensureString = (value: unknown, path: string, errors: string[], required = true): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (!required && (value === undefined || value === null)) {
    return '';
  }
  errors.push(`${path} must be a string.`);
  return '';
};

const ensureStringArray = (value: unknown, path: string, errors: string[]): string[] => {
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
    return value.map((entry) => entry.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\n|·|,|;/)
      .map((entry) => entry.replace(/^[-*•\s]+/, '').trim())
      .filter(Boolean);
  }
  errors.push(`${path} must be an array of strings (or a delimited string).`);
  return [];
};

export const buildResumeSchemaExample = (props: ResumeLetterProps): ResumeTemplateSchema => ({
  schemaVersion: RESUME_SCHEMA_VERSION,
  templateId: RESUME_TEMPLATE_ID,
  profile: {
    name: props.name,
    title: props.title,
    email: props.email,
    phone: props.phone || '',
    location: props.location,
    links: props.contactLinks || [],
    introStatement: props.introStatement || ''
  },
  languages: (props.languages || []).map((item) => ({
    language: item.language || '',
    proficiency: item.proficiency || ''
  })),
  spotlights: (props.spotlights || []).map((item) => ({
    title: item.title || '',
    metric: item.metric || '',
    impact: item.impact || ''
  })),
  experience: (props.experience || []).map((entry) => ({
    title: entry.title,
    company: entry.company,
    date: entry.date,
    highlights: entry.highlights || []
  })),
  earlierExperiences: (props.earlierExperiences || []).map((item) => ({
    text: item.text || ''
  })),
  education: (props.education || []).map((entry) => ({
    degree: entry.degree,
    school: entry.school,
    date: entry.date
  })),
  skillGroups: (props.skillGroups || []).map((group) => ({
    title: group.title,
    items: group.items || []
  }))
});

export const parseResumeSchema = (input: unknown, base: ResumeLetterProps): ResumeSchemaParseResult => {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return { ok: false, errors: ['Root JSON value must be an object.'] };
  }

  const schemaVersion = ensureString(input.schemaVersion, 'schemaVersion', errors);
  const templateId = ensureString(input.templateId, 'templateId', errors);

  if (schemaVersion !== RESUME_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be "${RESUME_SCHEMA_VERSION}".`);
  }
  if (templateId !== RESUME_TEMPLATE_ID) {
    errors.push(`templateId must be "${RESUME_TEMPLATE_ID}".`);
  }

  const profile = input.profile;
  if (!isRecord(profile)) {
    errors.push('profile must be an object.');
  }

  const experience = input.experience;
  if (!Array.isArray(experience)) {
    errors.push('experience must be an array.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const parsedProfile = profile as Record<string, unknown>;
  const parsedExperience = experience as Array<unknown>;
  const profileLinks = parsedProfile.links;
  const normalizedContactLinks =
    profileLinks !== undefined
      ? ensureStringArray(profileLinks, 'profile.links', errors)
      : (() => {
          const legacyWebsite = ensureString(parsedProfile.website, 'profile.website', errors, false);
          return legacyWebsite ? [legacyWebsite] : [];
        })();

  const normalizedExperience = parsedExperience.map((entry, index) => {
    if (!isRecord(entry)) {
      errors.push(`experience[${index}] must be an object.`);
      return {
        id: uid('exp'),
        title: '',
        company: '',
        date: '',
        highlights: [] as string[]
      };
    }

    return {
      id: uid('exp'),
      title: ensureString(entry.title, `experience[${index}].title`, errors),
      company: ensureString(entry.company, `experience[${index}].company`, errors),
      date: ensureString(entry.date, `experience[${index}].date`, errors),
      highlights: ensureStringArray(entry.highlights, `experience[${index}].highlights`, errors)
    };
  });

  const languages = input.languages;
  const normalizedLanguages: ResumeLetterProps['languages'] = [];
  if (languages !== undefined && languages !== null) {
    if (!Array.isArray(languages)) {
      errors.push('languages must be an array when provided.');
    } else {
      languages.forEach((entry, index) => {
        if (typeof entry === 'string') {
          normalizedLanguages.push({
            id: uid('lang'),
            language: entry.trim(),
            proficiency: ''
          });
          return;
        }
        if (!isRecord(entry)) {
          errors.push(`languages[${index}] must be a string or object.`);
          return;
        }
        normalizedLanguages.push({
          id: uid('lang'),
          language: ensureString(entry.language, `languages[${index}].language`, errors, false),
          proficiency: ensureString(entry.proficiency, `languages[${index}].proficiency`, errors, false)
        });
      });
    }
  }

  const spotlights = input.spotlights;
  const legacySpotlight = input.spotlight;
  const normalizedSpotlights: ResumeLetterProps['spotlights'] = [];
  if (spotlights !== undefined && spotlights !== null) {
    if (!Array.isArray(spotlights)) {
      errors.push('spotlights must be an array when provided.');
    } else {
      spotlights.forEach((entry, index) => {
        if (!isRecord(entry)) {
          errors.push(`spotlights[${index}] must be an object.`);
          return;
        }
        normalizedSpotlights.push({
          id: uid('spotlight'),
          title: ensureString(entry.title, `spotlights[${index}].title`, errors, false),
          metric: ensureString(entry.metric, `spotlights[${index}].metric`, errors, false),
          impact: ensureString(entry.impact, `spotlights[${index}].impact`, errors, false)
        });
      });
    }
  } else if (legacySpotlight !== undefined && legacySpotlight !== null) {
    if (!isRecord(legacySpotlight)) {
      errors.push('spotlight must be an object when provided.');
    } else {
      normalizedSpotlights.push({
        id: uid('spotlight'),
        title: ensureString(legacySpotlight.title, 'spotlight.title', errors, false),
        metric: ensureString(legacySpotlight.metric, 'spotlight.metric', errors, false),
        impact: ensureString(legacySpotlight.impact, 'spotlight.impact', errors, false)
      });
    }
  }

  const earlierExperiences = input.earlierExperiences;
  const legacyEarlierExperience = input.earlierExperience;
  const normalizedEarlierExperiences: ResumeLetterProps['earlierExperiences'] = [];
  if (earlierExperiences !== undefined && earlierExperiences !== null) {
    if (!Array.isArray(earlierExperiences)) {
      errors.push('earlierExperiences must be an array when provided.');
    } else {
      earlierExperiences.forEach((entry, index) => {
        if (typeof entry === 'string') {
          normalizedEarlierExperiences.push({
            id: uid('earlier'),
            text: entry.trim()
          });
          return;
        }
        if (!isRecord(entry)) {
          errors.push(`earlierExperiences[${index}] must be a string or object.`);
          return;
        }
        normalizedEarlierExperiences.push({
          id: uid('earlier'),
          text: ensureString(entry.text, `earlierExperiences[${index}].text`, errors, false)
        });
      });
    }
  } else if (legacyEarlierExperience !== undefined) {
    const text = ensureString(legacyEarlierExperience, 'earlierExperience', errors, false);
    if (text) {
      normalizedEarlierExperiences.push({
        id: uid('earlier'),
        text
      });
    }
  }

  const education = input.education;
  const normalizedEducation: ResumeLetterProps['education'] = [];
  if (education !== undefined && education !== null) {
    if (!Array.isArray(education)) {
      errors.push('education must be an array when provided.');
    } else {
      education.forEach((entry, index) => {
        if (!isRecord(entry)) {
          errors.push(`education[${index}] must be an object.`);
          return;
        }
        normalizedEducation.push({
          id: uid('edu'),
          degree: ensureString(entry.degree, `education[${index}].degree`, errors, false),
          school: ensureString(entry.school, `education[${index}].school`, errors, false),
          date: ensureString(entry.date, `education[${index}].date`, errors, false)
        });
      });
    }
  }

  const skillGroups = input.skillGroups;
  const legacyTechnicalSkills = input.technicalSkills;
  const normalizedSkillGroups: ResumeLetterProps['skillGroups'] = [];

  if (Array.isArray(skillGroups)) {
    skillGroups.forEach((entry, index) => {
      if (!isRecord(entry)) {
        errors.push(`skillGroups[${index}] must be an object.`);
        return;
      }
      normalizedSkillGroups.push({
        id: uid('skills'),
        title: ensureString(entry.title, `skillGroups[${index}].title`, errors, false),
        items: ensureStringArray(entry.items, `skillGroups[${index}].items`, errors)
      });
    });
  } else if (skillGroups !== undefined) {
    errors.push('skillGroups must be an array when provided.');
  } else if (isRecord(legacyTechnicalSkills)) {
    // Backward compatibility with v1 payloads.
    const frontend = ensureStringArray(legacyTechnicalSkills.frontendUI, 'technicalSkills.frontendUI', errors);
    const backend = ensureStringArray(legacyTechnicalSkills.backendCloud, 'technicalSkills.backendCloud', errors);
    const tools = ensureStringArray(legacyTechnicalSkills.toolsMedia, 'technicalSkills.toolsMedia', errors);

    if (frontend.length > 0) normalizedSkillGroups.push({ id: uid('skills'), title: 'Frontend', items: frontend });
    if (backend.length > 0) normalizedSkillGroups.push({ id: uid('skills'), title: 'Backend & Cloud', items: backend });
    if (tools.length > 0) normalizedSkillGroups.push({ id: uid('skills'), title: 'Tools & Media', items: tools });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const next: ResumeLetterProps = {
    ...base,
    name: ensureString(parsedProfile.name, 'profile.name', errors),
    title: ensureString(parsedProfile.title, 'profile.title', errors),
    email: ensureString(parsedProfile.email, 'profile.email', errors),
    phone: ensureString(parsedProfile.phone, 'profile.phone', errors, false),
    location: ensureString(parsedProfile.location, 'profile.location', errors),
    contactLinks: normalizedContactLinks,
    languages: normalizedLanguages,
    introStatement: ensureString(parsedProfile.introStatement, 'profile.introStatement', errors, false),
    experience: normalizedExperience,
    earlierExperiences: normalizedEarlierExperiences,
    spotlights: normalizedSpotlights,
    education: normalizedEducation,
    skillGroups: normalizedSkillGroups
  };

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, errors: [], value: next };
};
