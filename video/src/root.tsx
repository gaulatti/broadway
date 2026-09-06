import React from 'react';
import {Composition} from 'remotion';
import {modoItalianoGiorgiaDefinition, recordedProgramDraftDefinition} from './definitions';

export const BroadwayVideoRoot: React.FC = () => (
  <>
    <Composition
      id={modoItalianoGiorgiaDefinition.id}
      component={modoItalianoGiorgiaDefinition.Component}
      width={modoItalianoGiorgiaDefinition.width}
      height={modoItalianoGiorgiaDefinition.height}
      fps={modoItalianoGiorgiaDefinition.fps}
      durationInFrames={modoItalianoGiorgiaDefinition.durationInFrames}
      defaultProps={modoItalianoGiorgiaDefinition.defaultInput}
    />
    <Composition
      id={recordedProgramDraftDefinition.id}
      component={recordedProgramDraftDefinition.Component}
      width={recordedProgramDraftDefinition.width}
      height={recordedProgramDraftDefinition.height}
      fps={recordedProgramDraftDefinition.fps}
      durationInFrames={recordedProgramDraftDefinition.durationInFrames}
      calculateMetadata={recordedProgramDraftDefinition.calculateMetadata}
      defaultProps={recordedProgramDraftDefinition.defaultInput}
    />
  </>
);
