import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {draftDurationInFrames} from '../src/recording-draft';
import {loadDraft, verifyRenderedResult} from './recording-draft-workflow';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftDirectory = path.resolve(packageRoot, process.argv[2] ?? 'out/recording-drafts');
if (!process.argv[2]) throw new TypeError('Pass the rendered draft directory to verify.');
const {input, job} = await loadDraft(draftDirectory);
const result = await verifyRenderedResult(draftDirectory, input, job);
const mediaPath = path.join(draftDirectory, result.output);
const probe = spawnSync('ffprobe', [
  '-v', 'error', '-count_frames', '-show_entries',
  'format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_read_frames,pix_fmt,sample_rate,channels',
  '-of', 'json', mediaPath
], {encoding: 'utf8'});
if (probe.error || probe.status !== 0) throw new TypeError('Rendered draft could not be probed.');
const payload = JSON.parse(probe.stdout) as {format?: Record<string, unknown>; streams?: Array<Record<string, unknown>>};
const video = payload.streams?.filter((stream) => stream.codec_type === 'video') ?? [];
const audio = payload.streams?.filter((stream) => stream.codec_type === 'audio') ?? [];
if (video.length !== 1 || audio.length !== 1 || !payload.format) throw new TypeError('Rendered draft must contain one video and one audio stream.');
const expectedFrames = draftDurationInFrames(input);
const expectedDuration = expectedFrames / 30;
const actualDuration = Number(payload.format.duration);
if (video[0].codec_name !== 'h264' || video[0].width !== 1080 || video[0].height !== 1920 || video[0].avg_frame_rate !== '30/1' || Number(video[0].nb_read_frames) !== expectedFrames || !['yuv420p', 'yuvj420p'].includes(String(video[0].pix_fmt))) throw new TypeError('Rendered draft video stream violates the Broadway draft contract.');
if (audio[0].codec_name !== 'aac' || Number(audio[0].sample_rate) !== 48000 || Number(audio[0].channels) < 1) throw new TypeError('Rendered draft audio stream violates the Broadway draft contract.');
if (!Number.isFinite(actualDuration) || Math.abs(actualDuration - expectedDuration) > 0.12) throw new TypeError('Rendered draft duration does not match the human-selected window.');
console.log(JSON.stringify({draftId: input.draftId, state: result.state, approvalRequired: result.approvalRequired, publicationState: result.publicationState, durationSeconds: actualDuration, frames: expectedFrames, sha256: result.sha256}));
