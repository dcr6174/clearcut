# CLEARCUT

**Remove the background. Keep the subject.**

CLEARCUT is a local-first AI background remover built for the browser. It is a real React + TypeScript app, not a static demo: choose an image, run the model in a Web Worker, inspect the alpha cutout, set a background, compare, and export.

> Privacy wording matters: images are processed in your browser and are not sent to a CLEARCUT backend. The first run downloads model files from Hugging Face. The app therefore does **not** claim to be "100% offline".

## What works

- Real MODNet inference through Transformers.js
- WebGPU when available, WASM fallback
- Worker-based inference so the UI stays responsive
- Transparent PNG, WEBP and flattened JPG export
- Before/after comparison, background color/gradient/transparency
- Subject scale, rotation, flips, feather and opacity
- Copy PNG where the Clipboard API permits it
- Local IndexedDB history record
- Capability detection, cache clearing, PWA shell
- Hash routes compatible with GitHub Pages
- Responsive desktop and mobile layouts, keyboard shortcuts and reduced motion

## Current limits

- MODNet is tuned for portrait matting. Product, animal, and complex non-human subjects may be weaker.
- The first model download is large and needs a network connection.
- Browser memory limits vary. CLEARCUT rejects files over 25 MB; extremely large dimensions can still strain low-memory phones.
- Manual restore/erase controls are present, but full pixel-stroke persistence and batch ZIP export remain roadmap work. The UI does not pretend otherwise.
- No cloud provider is enabled. `BackgroundRemovalProvider` keeps that future option separate from the UI.

## Model and license

CLEARCUT currently uses [`Xenova/modnet`](https://huggingface.co/Xenova/modnet), a web-ready ONNX conversion of the upstream [`ZHKKKe/MODNet`](https://github.com/ZHKKKe/MODNet) portrait matting model.

- The Hugging Face model card declares **Apache-2.0**.
- The upstream MODNet repository's LICENSE is **Apache License 2.0**.
- Apache-2.0 permits commercial use and redistribution subject to its terms, notices, and attribution requirements.
- The model downloads at runtime and is not committed to this repository.
- This is a license review, not legal advice. Re-check the upstream model card and repository before a commercial release because model terms can change.

The CLEARCUT application code is separately licensed under **MIT**. The app license does not change the model license.

Sources checked September 20, 2026:
- https://huggingface.co/Xenova/modnet
- https://github.com/ZHKKKe/MODNet
- https://raw.githubusercontent.com/ZHKKKe/MODNet/master/LICENSE

## Beginner setup

You need Node.js 20 or newer.

```bash
git clone https://github.com/dcr6174/clearcut.git
cd clearcut
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173/clearcut/`.

### Production check

```bash
npm test
npm run build
npm run preview
```

Expected result: TypeScript passes, Vite builds `dist/`, and the preview opens CLEARCUT under `/clearcut/`.

## Architecture

```text
User image
  -> validation and decode
  -> Web Worker
  -> Transformers.js
  -> MODNet ONNX
  -> WebGPU, then WASM fallback
  -> alpha mask
  -> OffscreenCanvas transparent PNG
  -> local editor/export
```

The UI depends on `BackgroundRemovalProvider`, not model-specific code. `LocalBackgroundRemovalProvider` sends transferable image bytes to the Worker. The Worker lazy-loads the model and uses the browser cache.

## Browser compatibility

Current Chrome/Edge offer the best WebGPU path. Firefox and Safari use WASM when WebGPU is unavailable. Workers, WebAssembly, Canvas, and JavaScript are required. Clipboard copy is optional; download remains available.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z | Redo |
| Ctrl/Cmd + S | Export |
| B / E | Restore / erase brush |
| C | Compare |
| + / - / 0 | Zoom in / out / fit |
| Escape | Close settings |

## GitHub Pages

The Vite base is `/clearcut/`. `.github/workflows/deploy.yml` builds and publishes `dist` with the official Pages actions. Enable **Settings -> Pages -> Source: GitHub Actions** once if Pages is not already configured.

Live target: https://dcr6174.github.io/clearcut/

## Troubleshooting

- **Model download failed:** check the network, disable a blocking extension for the model host, then retry.
- **WebGPU failed:** CLEARCUT falls back to WASM. Close other heavy tabs if memory is tight.
- **Image too large:** resize it or use a file below 25 MB.
- **Clipboard failed:** browser permission or support is missing; use PNG download.
- **Blank GitHub Pages URL:** verify Pages uses GitHub Actions and wait for the deploy workflow.

## Security and privacy

There is no runtime server, API key, database, analytics SDK, authentication, or payment code. Do not add secrets to this repository. Any future cloud provider must be explicit opt-in and must not weaken the default local path.

## Roadmap

- Pixel-accurate restore/erase brush history
- Batch queue and browser-generated ZIP
- Crop handles and background image transforms
- Additional openly licensed general-subject model provider
- Saved presets and richer IndexedDB history

Contributions are welcome. Keep privacy claims exact, preserve the provider boundary, add tests for behavior, and do not add a model without documenting its separate license.
