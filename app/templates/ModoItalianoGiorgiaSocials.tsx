import React from 'react';

type SocialNetwork = 'instagram' | 'twitter' | 'youtube' | 'tiktok';

const SOCIAL_ICON_PATHS: Record<SocialNetwork, string> = {
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2-2.76v-3.5a6.33 6.33 0 1 0 5.45 6.26V8.73a8.16 8.16 0 0 0 4.77 1.52V6.8c-.34 0-.67-.04-1-.11z'
};

const SocialIcon: React.FC<{ network: SocialNetwork }> = ({ network }) => (
  <svg aria-hidden='true' viewBox='0 0 24 24' fill='currentColor' style={{ width: '28px', height: '28px', flex: '0 0 auto' }}>
    <path d={SOCIAL_ICON_PATHS[network]} />
  </svg>
);

const WebsiteIcon: React.FC = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={{ width: '28px', height: '28px', flex: '0 0 auto' }}
  >
    <circle cx='12' cy='12' r='9' />
    <path d='M3 12h18M12 3c2.25 2.47 3.4 5.47 3.4 9s-1.15 6.53-3.4 9M12 3c-2.25 2.47-3.4 5.47-3.4 9s1.15 6.53 3.4 9' />
  </svg>
);

interface ModoItalianoGiorgiaSocialsProps {
  fontSize?: string;
}

export const ModoItalianoGiorgiaSocials: React.FC<ModoItalianoGiorgiaSocialsProps> = ({ fontSize = '29px' }) => (
  <div
    aria-label='ModoItaliano social media accounts and website'
    style={{
      marginTop: '30px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255,255,255,0.34)',
      display: 'flex',
      alignItems: 'center',
      gap: '42px',
      fontFamily: "'Barlow Condensed', system-ui, sans-serif",
      fontSize,
      lineHeight: 1,
      fontWeight: 500,
      letterSpacing: '0.025em',
      color: 'rgba(255,255,255,0.9)'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
      <SocialIcon network='instagram' />
      <span>@modoitaliano.fm</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '13px', whiteSpace: 'nowrap' }}>
      <SocialIcon network='twitter' />
      <SocialIcon network='youtube' />
      <SocialIcon network='tiktok' />
      <span style={{ marginLeft: '1px' }}>@modoitaliano</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
      <WebsiteIcon />
      <span>modoitaliano.fm</span>
    </div>
  </div>
);
