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
    <div className="col-lg-3" style={{ position: 'sticky', top: '15px', alignSelf: 'flex-start' }}>
      {/* Task Metadata Card */}
      <div id="infoz" className="col p-3 mb-3 shadow-sm" style={{ borderRadius: '10px' }}>
        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark">Task Details</h6>
        <div className="row mb-1">
          <div className="col-5 text-muted" style={{ fontSize: '13px' }}>Task ID:</div>
          <div className="col-7 fw-semibold text-truncate" style={{ fontSize: '13px' }}>{currInstru.taskId || 'N/A'}</div>
        </div>
        <div className="row mb-1">
          <div className="col-5 text-muted" style={{ fontSize: '13px' }}>Collection:</div>
          <div className="col-7" style={{ fontSize: '13px' }}>{currInstru.collection || 'Default'}</div>
        </div>
        <div className="row mb-1">
          <div className="col-5 text-muted" style={{ fontSize: '13px' }}>Created At:</div>
          <div className="col-7 text-truncate" style={{ fontSize: '13px' }}>{currInstru.createdAt || 'N/A'}</div>
        </div>
        <div className="row mb-1">
          <div className="col-5 text-muted" style={{ fontSize: '13px' }}>Urgency:</div>
          <div className="col-7">
            <span className={`badge ${currInstru.urgency === 'High' ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '11px' }}>
              {currInstru.urgency || 'Normal'}
            </span>
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-5 text-muted" style={{ fontSize: '13px' }}>Asset:</div>
          <div className="col-7 text-truncate" style={{ fontSize: '12px' }} title={currInstru.src}>
            {currInstru.src ? currInstru.src.split('/').pop() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Annotations & Crops Gallery: Scrollable & Non-Stacking */}
      <div id="zcrops" className="col p-3 shadow-sm" style={{ borderRadius: '10px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <div id="ntatio" className="fw-bold mb-0">
            Annotations ({crops.length})
          </div>
          {crops.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success" style={{ fontSize: '11px' }}>
                Active
              </span>
              {onClearAll && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm py-0 px-2"
                  style={{ fontSize: '11px' }}
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
        <div
          id="cropat"
          style={{
            maxHeight: 'calc(100vh - 360px)',
            minHeight: '160px',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px'
          }}
        >
          {crops.length === 0 ? (
            <div className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>
              <p className="mb-1">No annotations yet.</p>
              <small>Click and drag on the image to crop bounding boxes.</small>
            </div>
          ) : (
            crops.map((crop, index) => (
              <div
                key={crop.id}
                className="crop-card card shadow-sm border-0 position-relative"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Header row: badge, real dimensions, download, delete */}
                <div className="d-flex justify-content-between align-items-center px-3 py-1 bg-light border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success" style={{ fontSize: '11px' }}>
                      #{index + 1}
                    </span>
                    <span className="text-secondary fw-semibold" style={{ fontSize: '11px' }}>
                      {crop.width} &times; {crop.height} px
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                      style={{ fontSize: '12px' }}
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
                      className="btn-close"
                      style={{ fontSize: '9px', padding: '4px' }}
                      aria-label="Delete crop"
                      title="Delete annotation"
                      onClick={() => onDeleteCrop && onDeleteCrop(crop.id)}
                    />
                  </div>
                </div>

                {/* Image container: Keeps the real dimensions and natural aspect ratio of the crop! */}
                <div
                  className="p-2 d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: '#f8f9fa',
                    minHeight: '70px'
                  }}
                >
                  <img
                    src={crop.dataUrl}
                    alt={`Crop ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '160px',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '4px',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Footer row: coordinates */}
                <div className="px-3 py-1 bg-white border-top d-flex justify-content-between text-muted" style={{ fontSize: '11px' }}>
                  <span>X: {crop.x}, Y: {crop.y}</span>
                  <span>{crop.createdAt || ''}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Right;