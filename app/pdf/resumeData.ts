/**
 * resumeData.ts — PRIVATE / GITIGNORED
 */

import type { ResumeLetterProps } from '../templates/TemplateResumeLetterP1';

export const resumeData: ResumeLetterProps = {
  name: 'Jordan Avery',
  title: 'Staff Software Engineer',
  email: 'jordan@example.com',
  phone: '+1 (212) 555-0147',
  location: 'New York, NY',
  contactLinks: ['github.com/jordanavery', 'jordanavery.dev'],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Fluent' },
    { id: 'lang-2', language: 'Italian', proficiency: 'Intermediate' },
    { id: 'lang-3', language: 'Spanish', proficiency: 'Native' }
  ],
  introStatement: 'Product-minded engineer blending software, media systems, and live operations across high-pressure environments.',

  experience: [
    {
      id: 'exp-1',
      title: 'Founder & Lead Engineer',
      company: 'NovaSystems',
      date: '2023 – Present',
      highlights: [
        'Built real-time news aggregation platform with semantic deduplication across 40+ sources.',
        'Designed end-to-end publishing pipeline: S3/CloudFront CDN, custom CMS, broadcast overlay tooling.',
        'Provisioned all infrastructure via AWS CDK: Lambda, DynamoDB, SQS, SNS, Cognito, CloudWatch.'
      ]
    },
    {
      id: 'exp-2',
      title: 'Executive Producer — MusicFest Live',
      company: 'NovaSystems',
      date: 'Jan 2026',
      highlights: [
        'Led distributed live broadcast operation spanning crews in 3 countries simultaneously.',
        'Rebuilt the entire production model in 72 hours following a critical failure mid-event.',
        'Directed nightly 4–5 hr broadcasts achieving 2,000+ concurrent peak viewers.'
      ]
    },
    {
      id: 'exp-3',
      title: 'Senior Software Engineer II',
      company: 'Meridian Bank',
      date: '2025 – Present',
      highlights: [
        'Account opening platform and digital banking feature development for retail customers.',
        'AI-powered risk assessment and automated decisioning pipeline integrations.'
      ]
    },
    {
      id: 'exp-4',
      title: 'Staff Software Engineer',
      company: 'GlobalMedia Corp',
      date: '2023 – 2025',
      highlights: [
        'Design systems engineering lead — partnered with design, brand, and five product squads.',
        'Built site performance observability platform unifying Lighthouse CI, Datadog RUM, and PageSpeed Insights.'
      ]
    },
    {
      id: 'exp-5',
      title: 'Software Development Engineer',
      company: 'Apex Commerce',
      date: '2017 – 2022',
      highlights: [
        'Expanded campaign builder to EU and FE markets, handling localisation and compliance requirements.',
        'Reduced catastrophic defect rate from 40% to 1.3% through improved test coverage and release gates.',
        'Led Prime Day readiness program coordinating across 15 global teams and three time zones.',
        'Launched EBT and HSA/FSA payment methods, expanding eligibility to 28M+ additional customers.'
      ]
    }
  ],

  earlierExperiences: [{ id: 'earlier-1', text: 'Freelance Software Engineer — agencies and startups, Remote & Santiago, Chile · 2010 – 2016' }],
  spotlights: [
    {
      id: 'spotlight-1',
      title: 'Platform Performance Breakthrough',
      metric: 'Reduced critical API latency by 42% in 6 weeks',
      impact: 'Lifted checkout conversion by 8.3% and cut on-call incidents by 35% through cache redesign + query-path refactor.'
    }
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.S. Computer Science',
      school: 'State University',
      date: '2012'
    }
  ],

  skillGroups: [
    {
      id: 'skills-1',
      title: 'Frontend',
      items: ['React', 'TypeScript', 'Redux', 'Angular', 'Tailwind CSS', 'WebRTC', 'RTMP']
    },
    {
      id: 'skills-2',
      title: 'Backend & Cloud',
      items: ['NestJS', 'Express', 'AWS CDK', 'Lambda', 'S3', 'CloudFront', 'DynamoDB', 'Docker', 'PostgreSQL']
    },
    {
      id: 'skills-3',
      title: 'Tools & Media',
      items: ['OBS', 'FFmpeg', 'LiveKit', 'gRPC', 'n8n', 'Qdrant', 'Git']
    }
  ]
};
