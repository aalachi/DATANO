import React from 'react';

function Right({ currInstru, crops = [], onDeleteCrop, onClearAll }) {
  if (!currInstru || !currInstru.instru) {
    return null;
  }

  const handleDownloadCrop = (crop, index) => {
    const link = document.createElement('a');
    link.href = crop.dataUrl;
    link.download = `crop-${currInstru.taskId || 'task'}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="datano-inspector">
      {/* Task Metadata Card */}
      <div id="infoz" className="datano-card">
        <div className="datano-card-header">
          Task Details
        </div>
        <div className="datano-detail-list">
          <div className="datano-detail-row">
            <span className="datano-detail-label">Task ID:</span>
            <span className="datano-detail-value">{currInstru.taskId || 'N/A'}</span>
          </div>
          <div className="datano-detail-row">
            <span className="datano-detail-label">Collection:</span>
            <span className="datano-detail-value">{currInstru.collection || 'Default'}</span>
          </div>
          <div className="datano-detail-row">
            <span className="datano-detail-label">Created At:</span>
            <span className="datano-detail-value">{currInstru.createdAt || 'N/A'}</span>
          </div>
          <div className="datano-detail-row">
            <span className="datano-detail-label">Urgency:</span>
            <div>
              <span className={`datano-badge ${currInstru.urgency === 'High' ? 'datano-badge-danger' : 'datano-badge-primary'}`}>
                {currInstru.urgency || 'Normal'}
              </span>
            </div>
          </div>
          <div className="datano-detail-row">
            <span className="datano-detail-label">Asset:</span>
            <span className="datano-detail-value" title={currInstru.src}>
              {currInstru.src ? currInstru.src.split('/').pop() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Annotations & Crops Gallery */}
      <div id="zcrops" className="datano-card">
        <div id="ntatio" className="datano-card-header">
          <span>Annotations ({crops.length})</span>
          {crops.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="datano-badge datano-badge-success">Active</span>
              {onClearAll && (
                <button
                  type="button"
                  className="datano-btn datano-btn-outline-danger"
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={onClearAll}
                  title="Clear all annotations on this task"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable container with fixed maximum height */}
        <div id="cropat" className="datano-crops-container">
          {crops.length === 0 ? (
            <div className="datano-empty-state">
              <p style={{ marginBottom: '4px' }}>No annotations yet.</p>
              <small>Click and drag on the image to crop bounding boxes.</small>
            </div>
          ) : (
            crops.map((crop, index) => (
              <div key={crop.id} className="datano-crop-card">
                {/* Header row: badge, real dimensions, download, delete */}
                <div className="datano-crop-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="datano-badge datano-badge-success">
                      #{index + 1}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {crop.width} &times; {crop.height} px
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      className="datano-btn-icon"
                      title="Download crop PNG"
                      onClick={() => handleDownloadCrop(crop, index)}
                    >
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="datano-btn-close"
                      aria-label="Delete crop"
                      title="Delete annotation"
                      onClick={() => onDeleteCrop && onDeleteCrop(crop.id)}
                    >
                      &times;
                    </button>
                  </div>
                </div>

                {/* Image container */}
                <div className="datano-crop-body">
                  <img
                    src={crop.dataUrl}
                    alt={`Crop ${index + 1}`}
                  />
                </div>

                {/* Footer row: coordinates */}
                <div className="datano-crop-footer">
                  <span>X: {crop.x}, Y: {crop.y}</span>
                  <span>{crop.createdAt || ''}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default Right;