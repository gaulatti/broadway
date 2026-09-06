import React from 'react';
import {Composition} from 'remotion';
import {videoTemplates} from './definitions';

export const BroadwayVideoRoot: React.FC = () => (
  <>
    {videoTemplates.map((template) => (
      <Composition
        key={template.id}
        id={template.id}
        component={template.Component}
        width={template.width}
        height={template.height}
        fps={template.fps}
        durationInFrames={template.durationInFrames}
        defaultProps={template.defaultInput}
      />
    ))}
  </>
);
