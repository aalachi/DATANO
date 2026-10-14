# DATANO

> **High-Performance Web-Based Computer Vision Annotation & Dataset Labeling Engine**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-datano.vercel.app-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://datano.vercel.app)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![CSS](https://img.shields.io/badge/CSS-Pure%20Native%20(No%20Tailwind%2FBootstrap)-1572b6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20Serverless%20Static-41b3a3?style=for-the-badge)](https://datano.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## Overview

**DATANO** is an in-browser computer vision annotation platform engineered for rapid dataset labeling, region-of-interest (ROI) cropping, and training batch export. Built originally as a decoupled Django + React tool, it has been modernized into a **100% static, client-side application** deployed at edge on Vercel.

The tool enables annotators and machine learning engineers to inspect image feeds across multiple vision domains (autonomous driving, facial recognition, retail commerce), draw sub-pixel bounding boxes on an HTML5 Canvas, slice crops in real time, and export model-ready PNGs or bundled ZIP archives with zero backend dependencies.

**Live Application:** [https://datano.vercel.app](https://datano.vercel.app)

---

## Engineering Highlights

### 1. Intrinsic Coordinate Transformation
Canvas annotations must retain spatial fidelity regardless of screen resolution, viewport resizing, or CSS scaling. DATANO decouples viewport pixel coordinates from the source image's natural geometry:

$$\text{Scale}_X = \frac{\text{naturalWidth}}{\text{clientWidth}}, \quad \text{Scale}_Y = \frac{\text{naturalHeight}}{\text{clientHeight}}$$

$$X_{\text{image}} = (X_{\text{screen}} - \text{rect.left}) \times \text{Scale}_X$$

$$Y_{\text{image}} = (Y_{\text{screen}} - \text{rect.top}) \times \text{Scale}_Y$$

Every bounding box and crop extraction is performed against the source asset's native resolution, ensuring exported training images never suffer from display-dependent downsampling or coordinate drift.

### 2. Zero-Dependency Client-Side PKZip Engine (`src/utils/zip.js`)
Instead of bundling heavy third-party archiving packages (such as `jszip`, which introduces ~100KB+ of bundle weight), DATANO implements a custom, specification-compliant **PKZip generator** in pure JavaScript:
- Generates binary ZIP archives directly in-memory using `Uint8Array`, `ArrayBuffer`, and `DataView`.
- Implements standard PKZip headers (`0x04034b50` local file header, `0x02014b50` central directory file header, and `0x06054b50` end of central directory).
- Uses a bitwise **CRC-32 checksum calculation table** to produce valid, uncompressed (Store Mode `0`) ZIP archives that unpack natively on macOS, Linux, and Windows.

### 3. Canvas Render Decoupling (Flicker-Free Annotations)
During active bounding box drawing, state updates could trigger parent component re-renders that clear the canvas or re-fetch base images. DATANO avoids this through:
- **`React.memo` barrier** wrapping the canvas workspace.
- **Reference tracking (`useRef`)** for existing crop overlays so the canvas rendering loop operates independently of React's reconciliation cycle.
- Main image canvas remains completely stable while coordinates are drawn, updated, or removed.

### 4. Storage Quota Management
To prevent browser `QuotaExceededError` exceptions in `localStorage` when handling dozens of high-resolution images, DATANO separates coordinate metadata from raster DataURLs:
- **Persistent layer (`localStorage`):** Stores strictly bounding box geometry `(x, y, width, height, naturalWidth, naturalHeight)` and task notes.
- **Runtime memory layer:** Dynamic offscreen canvas slicing reconstructs base64 DataURLs on-the-fly when requested by the inspector gallery.

### 5. Pure Native CSS Architecture
Zero utility-class dependencies (no Tailwind CSS, no Bootstrap). Built entirely with:
- **Modern CSS Grid & Flexbox layouts** across responsive breakpoints (desktop three-column studio down to single-column mobile view).
- **CSS Custom Properties (design tokens)** defined in `:root` for consistent typography, surfaces, and spacing.
- **Total CSS bundle size:** ~6 KB gzipped.

---

## Features

- **Interactive Canvas Engine:** Click-and-drag bounding box creation with active crosshair indicators, numbered badge tags, and real-time dimension readouts.
- **Instant ROI Cropping:** Offscreen canvas extraction captures pixel-exact regions of interest as inspectable crop cards.
- **Flexible Export Options:**
  - **Single PNG Download:** ML-standardized filenames (`[collection]_[taskId]_[asset]_crop[NN]_x[X]_y[Y]_w[W]_h[H].png`).
  - **Batch ZIP Archive:** Bundles all current annotations into a single archive in one click without triggering browser popup blockers.
  - **Sequential PNG Export:** Staggered automated export of all crops.
  - **JSON Metadata Export:** Full annotation coordinate schema ready for ingestion into PyTorch, TensorFlow, or YOLO conversion scripts.
- **Domain Benchmark Queues:** Pre-loaded with 43 computer vision tasks across 3 domains:
  - `Traffic`: Autonomous vehicles, road infrastructure, vehicle detection.
  - `Faces`: Crowd analysis, facial feature boundary tracking.
  - `Commerce`: Retail shelf scanning, product bounding boxes.
- **Reviewer Notes & Persistence:** Notes and annotations auto-save across sessions to `localStorage`.
- **CVAT-Inspired Presentation:** Features a modern dark-theme landing page with benchmark showcase gallery, architecture breakdowns, and direct studio launch.

---

## Application Structure

```
DATANO/
├── frontend/
│   ├── public/
│   │   ├── images/               # Pre-packaged dataset images (43 tasks)
│   │   └── index.html            # HTML shell with Graphik typography
│   └── src/
│       ├── components/
│       │   ├── Landing.js        # CVAT-inspired homepage with showcase & workflow
│       │   ├── Nav.js            # Global navigation bar & studio trigger
│       │   ├── Main.js           # Studio orchestrator (state, collections, notes)
│       │   ├── LeftUp.js         # Collection domain selector
│       │   ├── LeftDown.js       # Task queue with thumbnail gallery & urgency tags
│       │   ├── Center.js         # HTML5 Canvas annotation & bounding box engine
│       │   ├── Right.js          # Task inspector, crop cards gallery, export suite
│       │   └── About.js          # Technical architecture overview
│       ├── data/
│       │   ├── instructions.js   # LocalStorage persistence & sync engine
│       │   └── instructions.json # Static dataset tasks (Traffic, Faces, Commerce)
│       ├── utils/
│       │   ├── download.js       # PNG conversion & filename generator
│       │   └── zip.js            # Zero-dependency in-memory PKZip generator
│       ├── App.js                # Root component with tab routing (Landing/Studio/About)
│       ├── App.css               # Pure CSS design system (Grid, Flexbox, Themes)
│       └── index.css             # Design tokens & CSS reset
├── package.json                  # Root monorepo prefix scripts
├── vercel.json                   # Edge deployment configuration
└── README.md
```

---

## Component Architecture

```
                    ┌─────────────────────────┐
                    │         App.js          │
                    │  (Active Tab: Routing)  │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Landing.js    │     │     Nav.js      │     │    About.js     │
│ (Hero/Showcase) │     │(Global Header)  │     │ (Architecture)  │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │         Main.js         │
                    │ (Annotation Orchestrator│
                    └────────────┬────────────┘
                                 │
         ┌───────────────┬───────┴───────┬───────────────┐
         ▼               ▼               ▼               ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │  LeftUp.js  │ │ LeftDown.js │ │  Center.js  │ │  Right.js   │
  │ (Collection │ │(Task Queue  │ │(HTML5 Canvas│ │(ROI Crops & │
  │   Selector) │ │ Thumbnails) │ │  Engine)    │ │ Export Tool)│
  └─────────────┘ └─────────────┘ └──────┬──────┘ └──────┬──────┘
                                         │               │
                                         ▼               ▼
                                  [Coordinate]    [PNG / ZIP / JSON]
                                  [Transform ]    [Export Engine   ]
```

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 19.3.0 | Component modularity, `useRef` coordinate tracking, and memoized rendering |
| **Graphics Engine** | HTML5 Canvas 2D API | Hardware-accelerated sub-pixel drawing and offscreen pixel slicing |
| **Styling** | Pure Native CSS (Grid & Flexbox) | Zero framework runtime, custom design tokens, ~6 KB bundle size |
| **Archive Generation** | Custom PKZip (`src/utils/zip.js`) | Client-side in-memory ZIP building with CRC32 without external packages |
| **Persistence** | Browser `localStorage` API | Zero backend required; persists coordinate geometry and notes safely |
| **Deployment** | Vercel Edge Network | Monorepo CRA build configuration with global CDN delivery |
| **Testing** | React Testing Library & Jest | Automated component rendering and navigation test suite |

---

## Getting Started

### Prerequisites
- **Node.js** `>= 18.x`
- **npm** `>= 9.x`

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aalachi/DATANO.git
   cd DATANO
   ```

2. **Install dependencies:**
   ```bash
   npm run postinstall
   ```
   *(Or navigate into `frontend/` and run `npm install`)*

3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run the test suite:**
   ```bash
   npm test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static assets will be output to `frontend/build/`.

---

## Export Data Formats

### 1. PNG Crop Filename Schema
Crops are exported with deterministic, machine-learning-friendly filenames:
```
datano_<collection>_<taskId>_<assetName>_crop<index>_x<X>_y<Y>_w<W>_h<H>.png
```
*Example:* `datano_Trafic_NqVwY69041VP_Trafic4_crop01_x142_y88_w310_h185.png`

### 2. JSON Annotation Schema
Full task exports produce structured JSON consumable by dataset conversion pipelines:
```json
{
  "taskId": "NqVwY69041VP",
  "collection": "Trafic",
  "asset": "/images/Trafic4.jpg",
  "instruction": "Crop only 4 tires vehicules",
  "totalAnnotations": 2,
  "annotations": [
    {
      "id": 1,
      "coordinates": {
        "x": 142,
        "y": 88,
        "width": 310,
        "height": 185
      },
      "naturalDimensions": {
        "naturalWidth": 1280,
        "naturalHeight": 720
      },
      "createdAt": "2026-10-12T16:20:00.000Z"
    }
  ],
  "reviewerNotes": "Checked bounding box overlap on lead vehicle."
}
```

---

## Deployment Configuration

DATANO deploys to Vercel as a Create React App project located in the `frontend/` subdirectory via root [`vercel.json`](vercel.json):

```json
{
  "framework": "create-react-app",
  "installCommand": "npm --prefix frontend install",
  "buildCommand": "npm --prefix frontend run build",
  "outputDirectory": "frontend/build"
}
```

Every push to `main` automatically triggers an optimized static build and edge deployment.

---

## Author & License

- **Developer:** [Mohamed Aalachi](https://github.com/aalachi)
- **License:** Open-source under the [MIT License](LICENSE).
