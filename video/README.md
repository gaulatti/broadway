# Broadway programmatic video

This isolated package owns Broadway's deterministic motion compositions. It is intentionally separate from the root React Router application: installing or rendering video dependencies does not change the existing static `TemplateDefinition`, preview, PNG, or PDF paths.

## Contract

`VideoTemplateDefinition` schema 1 declares the composition ID and entry point, exact dimensions, FPS, frame duration, typed/default JSON input, locally packaged fonts, and optional locally packaged audio. Registration validates those invariants before Remotion enumerates a composition. Input parsing rejects unknown fields and unsafe asset paths.

The first composition is `ModoItalianoGiorgiaProgram`: 1080×1920, 30fps, 450 frames (15 seconds). Its opening, context, and outro are driven only by the current frame and JSON fixture. Essential copy stays inside an 86px horizontal, 118px top, and 150px bottom title-safe boundary.

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
```

The render command writes the MP4 and a render-cost JSON report under `video/out/`. Media verification uses `ffprobe` and fails unless the fixture is a 1080×1920, 30fps, 15-second H.264/AAC artifact with a 4:2:0 pixel format. A silent AAC track is retained when no licensed local audio is selected so downstream editors receive a stable stream contract. Review rendering writes opening, midpoint, and outro PNGs twice and verifies byte-for-byte determinism.

To prove the renderer does not need external resources, prime Remotion's local browser once and rerun the render under an operating-system or container network deny that still permits loopback traffic for Remotion's local bundle server. On macOS:

```bash
sandbox-exec -p '(version 1)(allow default)(deny network*)(allow network-inbound (local ip "localhost:*"))(allow network-outbound (remote ip "localhost:*"))' npm run video:render
```

## Asset provenance and licensing

- `public/mi.svg` is Broadway's existing Modo Italiano mark, duplicated here so the isolated package owns every render input. It is covered by this repository's MIT license.
- Barlow Condensed 500 and 600 are pinned through `@fontsource/barlow-condensed@5.3.0` and covered by the SIL Open Font License 1.1.
- Remotion 4.0.509 is subject to the Remotion License shipped with its packages, not Broadway's MIT license. Confirm that the intended team and rendering workflow comply with those terms before production use.
- The fixture contains no documentary photography, generated narration, CDN content, or assets from the local Remotion experiment.
- Optional audio must be committed under `video/public/`, named by a safe relative `audioAsset`, and documented with its license in the template definition before use.

## Measured fixture cost

On the reference Apple M1 Max development host, the network-denied 450-frame render completed in 41.25 seconds with 4.58 process CPU-seconds, 511,803,392 bytes peak process RSS, and a 2,409,990-byte MP4. The artifact contains 450 H.264 frames at 1080×1920/30fps plus one AAC track and probes at 15.061 seconds including audio padding. These are reproducibility measurements, not production capacity or cost guarantees; CI preserves fresh JSON reports as build artifacts.

## Ownership and boundaries

Broadway owns composition code and the local rendering contract. Editorial backends own their queue, API, storage, and publishing integrations; those are deliberately absent here. The package performs no API, font, image, or CDN request. Rendering cost varies by host and must be recorded from `out/render-report.json` in delivery evidence rather than treated as a capacity promise.
