import path from 'node:path';
import {cancelRecordingDraft} from './recording-draft-workflow';

const draftDirectory = path.resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw new TypeError('Pass the draft directory to cancel.');
const job = await cancelRecordingDraft(draftDirectory);
console.log(JSON.stringify({draftId: job.draftId, state: job.state, publicationState: job.publicationState}));
