import React from 'react';

function About({ onBackToStudio }) {
  return (
    <div className="datano-about-card">
      <div className="datano-about-header">
        <h2>About DATANO</h2>
        <p className="datano-about-subtitle">
          High-Performance Web-Based Computer Vision Annotation & Dataset Labeling Platform
        </p>
      </div>

      <div className="datano-about-grid">
        <div className="datano-feature-box">
          <div className="datano-feature-icon">🎯</div>
          <h3>Canvas Bounding Box Engine</h3>
          <p>
            Interactive HTML5 2D Canvas engine with coordinate mapping from responsive viewport to intrinsic image dimensions, live drag previews, and numbered bounding box overlay badges.
          </p>
        </div>

        <div className="datano-feature-box">
          <div className="datano-feature-icon">✂️</div>
          <h3>Instant ROI Cropping</h3>
          <p>
            Hardware-accelerated pixel extraction using offscreen canvas slices. Automatically generates DataURLs, inspects natural pixel dimensions, and allows single-click PNG exports.
          </p>
        </div>

        <div className="datano-feature-box">
          <div className="datano-feature-icon">🎨</div>
          <h3>Pure CSS Architecture</h3>
          <p>
            Built with zero external CSS dependencies—no Bootstrap, no Tailwind CSS. 100% native modern CSS Grid, Flexbox, design tokens, and smooth webkit scrollbars.
          </p>
        </div>

        <div className="datano-feature-box">
          <div className="datano-feature-icon">⚡</div>
          <h3>Serverless & Static Ready</h3>
          <p>
            Fully decoupled from legacy backends. Serves pre-packaged computer vision datasets statically with instant client-side persistence and zero cold-start latency.
          </p>
        </div>

        <div className="datano-feature-box">
          <div className="datano-feature-icon">📦</div>
          <h3>Dataset Collections</h3>
          <p>
            Partitioned task feeds across multiple computer vision domains including <strong>Trafic</strong> (vehicle detection), <strong>Faces</strong> (crowd face detection), and <strong>Commerce</strong> (product ROI).
          </p>
        </div>

        <div className="datano-feature-box">
          <div className="datano-feature-icon">💾</div>
          <h3>Local Persistence & Export</h3>
          <p>
            Annotator work, crop coordinates, and reviewer notes persist directly in browser storage across sessions, with instant JSON export ready for ML training pipelines.
          </p>
        </div>
      </div>

      <div className="datano-about-actions">
        <button
          type="button"
          className="datano-btn datano-btn-primary"
          style={{ padding: '10px 24px', fontSize: '15px' }}
          onClick={onBackToStudio}
        >
          Launch Annotation Studio &rarr;
        </button>
      </div>
    </div>
  );
}

export default About;

