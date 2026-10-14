import React from 'react';

const SAMPLE_SHOWCASE = [
  { title: 'Autonomous Traffic', tag: 'Traffic', src: '/images/Trafic4.jpg', count: '18 Tasks' },
  { title: 'Facial Feature Tracking', tag: 'Faces', src: '/images/Faces1.jpg', count: '11 Tasks' },
  { title: 'Retail & Shelf Commerce', tag: 'Commerce', src: '/images/Commerce1.jpg', count: '12 Tasks' },
  { title: 'Vehicle Fleet Detection', tag: 'Traffic', src: '/images/Trafic10.jpg', count: '18 Tasks' },
  { title: 'Store Item Detection', tag: 'Commerce', src: '/images/Commerce5.jpg', count: '12 Tasks' },
  { title: 'Crowd Facial ROI', tag: 'Faces', src: '/images/Faces6.jpg', count: '11 Tasks' },
];

const FEATURES = [
  {
    icon: '🎯',
    title: 'Pixel-Accurate Canvas Engine',
    desc: 'Interactive 2D Canvas with real-time coordinate mapping from responsive screen viewports directly to intrinsic image resolutions. Zero coordinate drift.',
  },
  {
    icon: '✂️',
    title: 'Instant Hardware ROI Slicing',
    desc: 'Offscreen canvas extraction generates crisp PNG cutouts of every bounding box in real-time, ready for immediate single-click or batch download.',
  },
  {
    icon: '📦',
    title: 'Client-Side ZIP & PNG Packaging',
    desc: 'Zero-dependency PKZip engine bundles all crops into organized zip archives or triggers sequential ML-formatted PNG file downloads.',
  },
  {
    icon: '🗂️',
    title: 'Multi-Domain Task Queues',
    desc: 'Partitioned collections for Traffic, Faces, and Commerce with urgency indicators, thumbnail queues, and task status tracking.',
  },
  {
    icon: '💾',
    title: 'Persistent Workstation State',
    desc: 'Annotations, coordinate bounds, and reviewer notes persist safely in browser storage without risk of data loss on refresh.',
  },
  {
    icon: '⚡',
    title: '100% Static & Serverless',
    desc: 'Decoupled pure static architecture. Zero cold starts, zero API bottlenecks, and instant CDN deployment on Vercel.',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Select Collection',
    desc: 'Choose from pre-loaded Computer Vision datasets (Traffic, Faces, Commerce) or browse the task queue.',
  },
  {
    step: '02',
    title: 'Draw Bounding Box',
    desc: 'Click and drag on the interactive viewport. Bounding boxes preview in real-time with sub-pixel precision.',
  },
  {
    step: '03',
    title: 'Inspect & Review ROI',
    desc: 'Review automatic crop cards, check natural pixel dimensions, and attach timestamped reviewer notes.',
  },
  {
    step: '04',
    title: 'Export Dataset',
    desc: 'Download individual .png crops, batch zip archives, or export full JSON metadata for PyTorch and TensorFlow.',
  },
];

function Landing({ onLaunchDemo, onNavigateAbout }) {

  return (
    <div className="landing-wrapper">
      {/* 1. Announcement Banner */}
      <div className="landing-banner">
        <span className="landing-banner-badge">NEW</span>
        <span>DATANO v2.0: Pure CSS, Zero-Dependency ZIP Export & In-Browser ROI Slicing.</span>
        <button type="button" className="landing-banner-link" onClick={onLaunchDemo}>
          Test Live Demo ➔
        </button>
      </div>

      {/* 2. Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div className="landing-pill">
            <span className="landing-pill-dot" />
            Computer Vision Annotation Platform
          </div>

          <h1 className="landing-hero-title">
            Complete Data Labeling Suite For <br />
            <span className="landing-gradient-text">Teams Building Vision AI</span>
          </h1>

          <p className="landing-hero-subtitle">
            Turn raw imagery into model-ready datasets with DATANO. Draw bounding boxes, crop high-resolution regions
            of interest, and export training batches directly in your browser with zero backend overhead.
          </p>

          <div className="landing-hero-actions">
            <button
              type="button"
              className="landing-btn landing-btn-primary"
              onClick={onLaunchDemo}
            >
              Launch Live Studio ➔
            </button>
            <button
              type="button"
              className="landing-btn landing-btn-outline"
              onClick={onNavigateAbout}
            >
              Architecture & Features
            </button>
            <a
              href="https://github.com/aalachi/DATANO"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-btn landing-btn-ghost"
            >
              GitHub Source ↗
            </a>
          </div>

          <div className="landing-trust-bar">
            <span>✓ Zero Backend Required</span>
            <span>•</span>
            <span>✓ 100% Client-Side Privacy</span>
            <span>•</span>
            <span>✓ ML-Formatted PNG & ZIP Exports</span>
            <span>•</span>
            <span>✓ Vercel Edge Deployed</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Showcase Gallery */}
      <section className="landing-showcase-section">
        <div className="landing-section-header">
          <span className="landing-section-tag">PRE-LOADED VISION DOMAINS</span>
          <h2>Explore Pre-Configured Benchmark Datasets</h2>
          <p>Ready to annotate right out of the box with zero setup</p>
        </div>

        <div className="landing-showcase-grid">
          {SAMPLE_SHOWCASE.map((item, idx) => (
            <div key={idx} className="landing-showcase-card" onClick={onLaunchDemo} role="button" tabIndex={0}>
              <div className="landing-showcase-img-wrap">
                <img src={item.src} alt={item.title} loading="lazy" />
                <span className="landing-showcase-badge">{item.tag}</span>
              </div>
              <div className="landing-showcase-body">
                <h3>{item.title}</h3>
                <div className="landing-showcase-meta">
                  <span>{item.count}</span>
                  <span className="landing-showcase-cta">Open Studio ➔</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Multimodal Capabilities / Studio Features */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <span className="landing-section-tag">ENGINE ARCHITECTURE</span>
          <h2>Your Complete Toolkit for Scalable Data Annotation</h2>
          <p>Engineered for speed, mathematical precision, and frictionless developer ergonomics.</p>
        </div>

        <div className="landing-features-grid">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="landing-feature-box">
              <div className="landing-feature-icon-wrap">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works (Workflow Steps) */}
      <section className="landing-workflow-section">
        <div className="landing-section-header landing-header-light">
          <span className="landing-section-tag landing-tag-light">PIPELINE WORKFLOW</span>
          <h2>From Raw Assets to Model-Ready Labels in Seconds</h2>
          <p>A streamlined four-step pipeline designed for annotators and machine learning engineers.</p>
        </div>

        <div className="landing-workflow-grid">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div key={idx} className="landing-workflow-card">
              <div className="landing-step-num">{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Metrics & Benchmarks */}
      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          <div className="landing-stat-card">
            <div className="landing-stat-value">0 ms</div>
            <div className="landing-stat-label">Backend Latency (100% Client-Side)</div>
          </div>
          <div className="landing-stat-card">
            <div className="landing-stat-value">43</div>
            <div className="landing-stat-label">Pre-Packaged Computer Vision Tasks</div>
          </div>
          <div className="landing-stat-card">
            <div className="landing-stat-value">0 KB</div>
            <div className="landing-stat-label">External CSS Framework Bloat</div>
          </div>
          <div className="landing-stat-card">
            <div className="landing-stat-value">100%</div>
            <div className="landing-stat-label">Data Privacy (Zero Server Uploads)</div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call To Action */}
      <section className="landing-cta-section">
        <div className="landing-cta-box">
          <h2>Ready to test DATANO?</h2>
          <p>Experience the browser-based annotation studio right now. No signup or account creation required.</p>
          <div className="landing-cta-buttons">
            <button
              type="button"
              className="landing-btn landing-btn-primary landing-btn-lg"
              onClick={onLaunchDemo}
            >
              Launch Annotation Studio Now ➔
            </button>
            <button
              type="button"
              className="landing-btn landing-btn-outline landing-btn-lg"
              onClick={onNavigateAbout}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">DATANO</div>
            <p>High-performance web-based computer vision annotation and dataset labeling platform.</p>
          </div>
          <div className="landing-footer-links">
            <div>
              <h4>Platform</h4>
              <ul>
                <li><button type="button" onClick={onLaunchDemo}>Interactive Demo</button></li>
                <li><button type="button" onClick={onNavigateAbout}>Architecture</button></li>
                <li><a href="https://github.com/aalachi/DATANO" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              </ul>
            </div>
            <div>
              <h4>Collections</h4>
              <ul>
                <li><button type="button" onClick={onLaunchDemo}>Traffic & Vehicles</button></li>
                <li><button type="button" onClick={onLaunchDemo}>Facial Analysis</button></li>
                <li><button type="button" onClick={onLaunchDemo}>Retail Commerce</button></li>
              </ul>
            </div>
            <div>
              <h4>Compliance</h4>
              <ul>
                <li><span>GDPR Compliant</span></li>
                <li><span>CCPA Ready</span></li>
                <li><span>Client-Side Local Storage</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2026 DATANO. Open-source under MIT License.</span>
          <span>Deployed on Vercel • Built with Pure CSS & React</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

