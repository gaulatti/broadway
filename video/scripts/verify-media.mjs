import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const fixturePath = path.resolve(
  packageRoot,
  process.argv[2] ?? "fixtures/modo-italiano-giorgia.json",
);
const mediaPath = path.resolve(
  packageRoot,
  process.argv[3] ?? "out/modo-italiano-giorgia.mp4",
);
const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
const probe = spawnSync(
  "ffprobe",
  [
    "-v",
    "error",
    "-count_frames",
    "-show_entries",
    "format=duration,size:stream=index,codec_type,codec_name,width,height,avg_frame_rate,nb_read_frames,pix_fmt",
    "-of",
    "json",
    mediaPath,
  ],
  { encoding: "utf8" },
);
if (probe.error) throw probe.error;
if (probe.status !== 0)
  throw new Error(`ffprobe failed: ${probe.stderr.trim()}`);
const result = JSON.parse(probe.stdout);
const videoStreams = result.streams.filter(
  (stream) => stream.codec_type === "video",
);
const audioStreams = result.streams.filter(
  (stream) => stream.codec_type === "audio",
);
if (videoStreams.length !== 1)
  throw new Error(
    `Expected one video stream, received ${videoStreams.length}.`,
  );
const video = videoStreams[0];
if (video.codec_name !== "h264")
  throw new Error(`Expected H.264, received ${video.codec_name}.`);
if (video.width !== 1080 || video.height !== 1920)
  throw new Error(
    `Expected 1080x1920, received ${video.width}x${video.height}.`,
  );
if (video.avg_frame_rate !== "30/1")
  throw new Error(`Expected 30fps, received ${video.avg_frame_rate}.`);
if (!["yuv420p", "yuvj420p"].includes(video.pix_fmt))
  throw new Error(`Expected a 4:2:0 pixel format, received ${video.pix_fmt}.`);
const frameCount = Number(video.nb_read_frames);
if (!Number.isFinite(frameCount) || frameCount !== 450) {
  throw new Error(
    `Expected 450 decoded frames, received ${video.nb_read_frames}.`,
  );
}
const duration = Number(result.format.duration);
if (!Number.isFinite(duration) || Math.abs(duration - 15) > 0.12)
  throw new Error(`Expected 15 seconds, received ${result.format.duration}.`);
if (audioStreams.length !== 1 || audioStreams[0].codec_name !== "aac") {
  throw new Error("Expected one AAC audio stream.");
}
const report = {
  schemaVersion: 1,
  media: path.relative(packageRoot, mediaPath),
  durationSeconds: duration,
  sizeBytes: Number(result.format.size),
  video: {
    codec: video.codec_name,
    width: video.width,
    height: video.height,
    fps: video.avg_frame_rate,
    frames: frameCount,
    pixelFormat: video.pix_fmt,
  },
  audio: audioStreams.length ? { codec: audioStreams[0].codec_name } : null,
};
await writeFile(
  path.join(path.dirname(mediaPath), "media-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report));
