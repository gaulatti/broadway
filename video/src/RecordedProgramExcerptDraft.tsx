import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {assertRecordedProgramDraftInput, type RecordedProgramDraftInput} from './recording-draft';

const NAVY = '#0a1234';
const MAGENTA = '#ed0076';
const CREAM = '#fff8ee';

export const RecordedProgramExcerptDraft: React.FC<RecordedProgramDraftInput> = (input) => {
  assertRecordedProgramDraftInput(input);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const caption = input.captions?.cues.find((cue) => seconds >= cue.startSeconds && seconds < cue.endSeconds);
  const video = staticFile(input.source.mediaAsset);

  return (
    <AbsoluteFill style={{backgroundColor: NAVY, color: CREAM, fontFamily: 'Barlow Condensed', overflow: 'hidden'}}>
      <OffthreadVideo
        src={video}
        trimBefore={input.source.window.startFrame}
        trimAfter={input.source.window.endFrame}
        volume={0}
        style={{height: '100%', width: '100%', objectFit: 'cover', filter: 'blur(34px)', opacity: 0.48, transform: 'scale(1.12)'}}
      />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,9,28,.48), rgba(5,9,28,.08) 38%, rgba(5,9,28,.78))'}} />
      <OffthreadVideo
        src={video}
        trimBefore={input.source.window.startFrame}
        trimAfter={input.source.window.endFrame}
        style={{height: '100%', width: '100%', objectFit: 'contain'}}
      />
      <div style={{position: 'absolute', left: 72, right: 72, top: 82, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Img src={staticFile('mi.svg')} style={{width: 190, filter: 'brightness(0) invert(1)'}} />
        <div style={{border: `2px solid ${MAGENTA}`, borderRadius: 999, padding: '10px 18px', fontSize: 24, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase'}}>Draft · review required</div>
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 104, padding: '30px 34px 34px', background: 'rgba(10,18,52,.9)', borderLeft: `8px solid ${MAGENTA}`}}>
        <div style={{color: MAGENTA, fontSize: 24, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase'}}>{input.editorial.eyebrow}</div>
        <div style={{fontSize: 66, fontWeight: 600, lineHeight: 0.98, marginTop: 12}}>{input.editorial.headline}</div>
        {caption ? <div style={{fontSize: 34, lineHeight: 1.15, marginTop: 24}}>{caption.text}</div> : <div style={{fontSize: 28, lineHeight: 1.15, marginTop: 18, opacity: 0.82}}>{input.editorial.summary}</div>}
        <div style={{fontSize: 24, letterSpacing: 1.6, marginTop: 24, opacity: 0.78, textTransform: 'uppercase'}}>{input.editorial.handle} · source {input.source.operationId.slice(0, 6)}… · unpublished</div>
      </div>
    </AbsoluteFill>
  );
};
