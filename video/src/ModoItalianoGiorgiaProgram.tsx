import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {assertModoItalianoGiorgiaInput, type ModoItalianoGiorgiaVideoInput} from './types';

const NAVY = '#0a1234';
const MAGENTA = '#ed0076';
const CREAM = '#fff8ee';
const SAFE_X = 86;
const SAFE_TOP = 118;
const SAFE_BOTTOM = 150;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

function ease(frame: number, from: number, to: number): number {
  return interpolate(frame, [from, to], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
}

function reveal(frame: number, from: number, to: number, distance = 52): React.CSSProperties {
  const progress = ease(frame, from, to);
  return {
    opacity: progress,
    clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`,
    transform: `translate3d(0, ${(1 - progress) * distance}px, 0)`,
    filter: `blur(${(1 - progress) * 8}px)`
  };
}

const Atmosphere = ({light = false}: {light?: boolean}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 450], [-36, 46], clamp);
  return (
    <>
      <AbsoluteFill
        style={{
          background: light
            ? 'radial-gradient(circle at 72% 18%, rgba(237,0,118,.16), transparent 34%), linear-gradient(150deg, #fff8ee 0%, #f0dfcd 100%)'
            : 'radial-gradient(circle at 74% 17%, rgba(237,0,118,.34), transparent 34%), linear-gradient(150deg, #111b4b 0%, #05091c 72%)'
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate3d(${drift}px, ${-drift * 0.22}px, 0) rotate(-8deg)`,
          background: `repeating-linear-gradient(90deg, transparent 0 118px, ${light ? 'rgba(10,18,52,.035)' : 'rgba(255,255,255,.025)'} 118px 120px)`,
          opacity: 0.8
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: light ? 0.08 : 0.13,
          mixBlendMode: light ? 'multiply' : 'screen',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.12\'/%3E%3C/svg%3E")'
        }}
      />
    </>
  );
};

const BrandMark = ({inverse = false}: {inverse?: boolean}) => (
  <Img
    src={staticFile('mi.svg')}
    style={{
      width: 228,
      height: 'auto',
      filter: inverse ? 'brightness(0) invert(1)' : 'none'
    }}
  />
);

const Footer = ({handle, inverse = false}: {handle: string; inverse?: boolean}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE_X,
      right: SAFE_X,
      bottom: SAFE_BOTTOM,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: `2px solid ${inverse ? 'rgba(255,248,238,.36)' : 'rgba(10,18,52,.24)'}`,
      paddingTop: 22,
      color: inverse ? CREAM : NAVY,
      fontFamily: 'Barlow Condensed',
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    }}
  >
    <span>{handle}</span>
    <span>RADIO · PODCAST · CULTURA</span>
  </div>
);

const Opening = ({eyebrow, headline, handle}: Pick<ModoItalianoGiorgiaVideoInput, 'eyebrow' | 'headline' | 'handle'>) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame: frame - 5, fps, config: {damping: 18, stiffness: 92, mass: 0.9}, durationInFrames: 38});
  const line = ease(frame, 20, 58);
  return (
    <AbsoluteFill style={{backgroundColor: NAVY, color: CREAM, fontFamily: 'Barlow Condensed', overflow: 'hidden'}}>
      <Atmosphere />
      <div style={{position: 'absolute', left: SAFE_X, top: SAFE_TOP, transform: `scale(${0.88 + mark * 0.12})`, opacity: mark}}>
        <BrandMark inverse />
      </div>
      <div style={{position: 'absolute', left: SAFE_X, right: SAFE_X, top: 530}}>
        <div style={{fontSize: 30, fontWeight: 600, letterSpacing: 3, color: MAGENTA, textTransform: 'uppercase', ...reveal(frame, 28, 54, 34)}}>
          {eyebrow}
        </div>
        <h1 style={{margin: '32px 0 0', maxWidth: 880, fontSize: 102, lineHeight: 0.94, fontWeight: 600, letterSpacing: '-0.024em', ...reveal(frame, 48, 88)}}>
          {headline}
        </h1>
      </div>
      <div style={{position: 'absolute', left: SAFE_X, bottom: 360, width: `${line * 700}px`, height: 9, background: MAGENTA}} />
      <Footer handle={handle} inverse />
    </AbsoluteFill>
  );
};

const Context = ({summary, handle}: Pick<ModoItalianoGiorgiaVideoInput, 'summary' | 'handle'>) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const orbit = interpolate(frame, [0, 180], [-18, 28], clamp);
  const words = summary.split(' ');
  return (
    <AbsoluteFill style={{backgroundColor: CREAM, color: NAVY, fontFamily: 'Barlow Condensed', overflow: 'hidden'}}>
      <Atmosphere light />
      <div style={{position: 'absolute', width: 690, height: 690, right: -250, top: 90, borderRadius: '50%', border: `3px solid ${MAGENTA}`, transform: `translate3d(${orbit}px,0,0)`}}>
        <div style={{position: 'absolute', inset: 88, borderRadius: '50%', border: '2px solid rgba(10,18,52,.2)'}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 280, height: 4, transformOrigin: '0 0', transform: `rotate(${frame * 0.8}deg)`, background: MAGENTA}} />
      </div>
      <div style={{position: 'absolute', left: SAFE_X, top: SAFE_TOP}}><BrandMark /></div>
      <div style={{position: 'absolute', left: SAFE_X, right: SAFE_X, top: 530}}>
        <div style={{fontSize: 28, fontWeight: 600, letterSpacing: 3, color: MAGENTA}}>UNA HISTORIA · TRES CLAVES</div>
        <div style={{marginTop: 34, maxWidth: 900, fontSize: 82, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-0.02em'}}>
          {words.map((word, index) => {
            const p = spring({frame: frame - 18 - index * 4, fps, config: {damping: 22, stiffness: 110, mass: 0.8}, durationInFrames: 34});
            return <span key={`${word}-${index}`} style={{display: 'inline-block', marginRight: 18, opacity: p, transform: `translateY(${(1 - p) * 34}px)`}}>{word}</span>;
          })}
        </div>
      </div>
      <Footer handle={handle} />
    </AbsoluteFill>
  );
};

const Outro = ({callToAction, handle}: Pick<ModoItalianoGiorgiaVideoInput, 'callToAction' | 'handle'>) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame: frame - 10, fps, config: {damping: 16, stiffness: 88, mass: 0.9}, durationInFrames: 42});
  const pulse = 0.88 + Math.sin(frame / 8) * 0.04;
  return (
    <AbsoluteFill style={{backgroundColor: NAVY, color: CREAM, fontFamily: 'Barlow Condensed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <Atmosphere />
      <div style={{transform: `scale(${0.72 + mark * 0.28})`, opacity: mark}}><BrandMark inverse /></div>
      <div style={{marginTop: 76, width: 850, textAlign: 'center', fontSize: 86, lineHeight: 0.98, fontWeight: 600, letterSpacing: '-0.018em', ...reveal(frame, 28, 64, 38)}}>
        {callToAction}
      </div>
      <div style={{marginTop: 54, padding: '18px 34px', border: `3px solid ${MAGENTA}`, color: CREAM, fontSize: 34, fontWeight: 600, letterSpacing: 2, transform: `scale(${pulse})`}}>
        {handle}
      </div>
      <Footer handle={handle} inverse />
    </AbsoluteFill>
  );
};

export const ModoItalianoGiorgiaProgram: React.FC<ModoItalianoGiorgiaVideoInput> = (props) => {
  assertModoItalianoGiorgiaInput(props);
  return (
    <AbsoluteFill>
      {props.audioAsset ? <Audio src={staticFile(props.audioAsset)} /> : null}
      <Sequence from={0} durationInFrames={150} premountFor={30}><Opening eyebrow={props.eyebrow} headline={props.headline} handle={props.handle} /></Sequence>
      <Sequence from={150} durationInFrames={180} premountFor={30}><Context summary={props.summary} handle={props.handle} /></Sequence>
      <Sequence from={330} durationInFrames={120} premountFor={30}><Outro callToAction={props.callToAction} handle={props.handle} /></Sequence>
    </AbsoluteFill>
  );
};
