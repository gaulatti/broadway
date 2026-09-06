# Broadway programmatic video

This isolated package owns Broadway's deterministic motion compositions. It is intentionally separate from the root React Router application: installing or rendering video dependencies does not change the existing static `TemplateDefinition`, preview, PNG, or PDF paths.

## Contract

`VideoTemplateDefinition` schema 1 declares the composition ID and entry point, exact dimensions, FPS, frame duration, typed/default JSON input, locally packaged fonts, and optional locally packaged audio. Registration validates those invariants before Remotion enumerates a composition. Input parsing rejects unknown fields and unsafe asset paths.

The first composition is `ModoItalianoGiorgiaProgram`: 1080×1920, 30fps, 450 frames (15 seconds). Its opening, context, and outro are driven only by the current frame and JSON fixture. Essential copy stays inside an 86px horizontal, 118px top, and 150px bottom title-safe boundary.

`RecordedProgramExcerptDraft` consumes a bounded, frame-aligned human selection from a finalized Alana recording. Its duration is calculated from that selection. The workflow pins Alana's landed recording contract commit, verifies the manifest and packaged MP4 checksum, probes codecs/duration/dimensions/audio and video bounds, and preserves the source operation and artifact digests in a versioned input fixture. A pinned, landed Mistify result may supply captions, but captions are optional.

Every generated recording excerpt remains `approvalRequired: true` and `publicationState: not-published`. Broadway owns draft creation, rendering, verification, failure/retry state, and cancellation only; this package contains no publication client or credentials.

## Commands

Run from the Broadway repository root:

```bash
npm install --prefix video
npm run video:typecheck
npm run video:test
npm run video:compositions
npm run video:render
npm run video:verify
npm run video:review
npm run video:draft:create
```

The render command writes the MP4 and a render-cost JSON report under `video/out/`. Media verification uses `ffprobe` and fails unless the fixture is a 1080×1920, 30fps, 15-second H.264/AAC artifact with a 4:2:0 pixel format. A silent AAC track is retained when no licensed local audio is selected so downstream editors receive a stable stream contract. Review rendering writes opening, midpoint, and outro PNGs twice and verifies byte-for-byte determinism.

`video:draft:create` writes a deterministic draft under `video/out/recording-drafts/<draft-id>/` and prints the ID. Pass that directory to the remaining lifecycle commands:

```bash
npm run video:draft:render -- out/recording-drafts/<draft-id>
npm run video:draft:verify -- out/recording-drafts/<draft-id>
npm run video:draft:review -- out/recording-drafts/<draft-id> out/recording-drafts/<draft-id>/review
npm run video:draft:cancel -- out/recording-drafts/<draft-id>
```

The committed end-to-end fixture is fictional. It mirrors the public fields produced by Alana at `fcc1ec29a4239631d7fb146b2d9ea905103aa0f2`, uses a locally generated H.264/AAC source, and optionally consumes the landed Mistify result shape at `f47aa6bb1fe5ef56f36621abba6d103908faf490`. Retrying an identical editorial request reuses its deterministic draft and rendered result. Reusing the same request ID with different input fails closed instead of creating an ambiguous duplicate. Render errors persist only the closed code `render-failed`; cancellation remains terminal and removes partial output.

To prove the renderer does not need external resources, prime Remotion's local browser once and rerun the render under an operating-system or container network deny that still permits loopback traffic for Remotion's local bundle server. On macOS:

```bash
sandbox-exec -p '(version 1)(allow default)(deny network*)(allow network-inbound (local ip "localhost:*"))(allow network-outbound (remote ip "localhost:*"))' npm run video:render
```

## Asset provenance and licensing

- `public/mi.svg` is Broadway's existing Modo Italiano mark, duplicated here so the isolated package owns every render input. It is covered by this repository's MIT license.
- Barlow Condensed 500 and 600 are pinned through `@fontsource/barlow-condensed@5.3.0` and covered by the SIL Open Font License 1.1.
- Remotion 4.0.509 is subject to the Remotion License shipped with its packages, not Broadway's MIT license. Confirm that the intended team and rendering workflow comply with those terms before production use.
- The fixture contains no documentary photography, generated narration, CDN content, or assets from the local Remotion experiment.
- `public/fixtures/alana-recording.mp4` is a fictional locally generated color/test-tone fixture committed solely for contract testing; it contains no production recording, personal data, or third-party media.
- Optional audio must be committed under `video/public/`, named by a safe relative `audioAsset`, and documented with its license in the template definition before use.

## Measured fixture cost

On the reference Apple M1 Max development host, the network-denied 450-frame render completed in 41.25 seconds with 4.58 process CPU-seconds, 511,803,392 bytes peak process RSS, and a 2,409,990-byte MP4. The artifact contains 450 H.264 frames at 1080×1920/30fps plus one AAC track and probes at 15.061 seconds including audio padding. These are reproducibility measurements, not production capacity or cost guarantees; CI preserves fresh JSON reports as build artifacts.

## Ownership and boundaries

Broadway owns composition code and the local rendering contract. Editorial backends own their queue, API, durable shared storage, approval UI, and publishing integrations; those are deliberately absent here. The package performs no API, font, image, or CDN request. It does not claim a deployed Alana-to-Broadway integration. Rendering cost varies by host and must be measured in delivery evidence rather than treated as a capacity promise.
