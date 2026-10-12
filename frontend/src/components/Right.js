import React, { useState } from 'react';
import { generateCropFileName, downloadDataUrlAsPng, getCropDataUrl } from '../utils/download';
import { downloadZipArchive } from '../utils/zip';

function Right({ currInstru, crops = [], onDeleteCrop, onClearAll, onResetAll }) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!currInstru || !currInstru.instru) {
    return null;
  }

  // Singular download of a single cropped image in .png format
  const handleDownloadCrop = async (crop, index) => {
    try {
      const filename = generateCropFileName(currInstru, crop, index);
      let dataUrl = crop.dataUrl;
      if (!dataUrl) {
        dataUrl = await getCropDataUrl(currInstru, crop);
      }
      downloadDataUrlAsPng(dataUrl, filename);
    } catch (err) {
      console.error('Failed to download crop PNG:', err);
    }
  };

  // Download all cropped images packaged at once in a single ZIP containing .png files
  const handleDownloadAllZip = async () => {
    if (!crops || crops.length === 0) return;

    try {
      setIsDownloading(true);
      const files = [];
      for (let i = 0; i < crops.length; i++) {
        const crop = crops[i];
        const filename = generateCropFileName(currInstru, crop, i);
        let dataUrl = crop.dataUrl;
        if (!dataUrl) {
          dataUrl = await getCropDataUrl(currInstru, crop);
        }
        files.push({ filename, dataUrl });
      }

      const collection = (currInstru.collection || 'dataset')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/gi, '_');
      const taskId = (currInstru.taskId || (currInstru.id ? `task_${currInstru.id}` : 'task'))
        .replace(/[^a-z0-9_-]/gi, '_');
      const zipFilename = `datano_${collection}_${taskId}_all_crops.zip`;

      downloadZipArchive(files, zipFilename);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download all cropped images as separate individual .png files
  const handleDownloadAllPngs = async () => {
    if (!crops || crops.length === 0) return;

    try {
      setIsDownloading(true);
      for (let i = 0; i < crops.length; i++) {
        await handleDownloadCrop(crops[i], i);
        await new Promise((r) => setTimeout(r, 220));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      task: {
        id: currInstru.id,
        taskId: currInstru.taskId,
        collection: currInstru.collection,
        instruction: currInstru.instru,
        src: currInstru.src,
        urgency: currInstru.urgency
      },
      annotations: crops.map(({ id, x, y, width, height, createdAt }) => ({
        id,
        x,
        y,
        width,
        height,
        createdAt
      })),
      totalAnnotations: crops.length,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `datano-annotations-${currInstru.taskId || 'task'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          {onClearAll && crops.length > 0 && (
            <button
              type="button"
              className="datano-btn datano-btn-outline-danger"
              style={{ padding: '2px 8px', fontSize: '11px' }}
              onClick={onClearAll}
              title="Clear annotations on this task"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Action Toolbar for Downloading All */}
        {crops.length > 0 && (
          <div className="datano-crops-toolbar">
            <button
              type="button"
              className="datano-btn datano-btn-primary"
              style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={handleDownloadAllZip}
              disabled={isDownloading}
              title="Download all cropped PNG images at once in a single ZIP file"
            >
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              <span>{isDownloading ? 'Packaging...' : 'Download All (.zip)'}</span>
            </button>

            <button
              type="button"
              className="datano-btn datano-btn-outline-primary"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              onClick={handleDownloadAllPngs}
              disabled={isDownloading}
              title="Download all cropped images as separate individual .png files"
            >
              Download All (.png)
            </button>

            <button
              type="button"
              className="datano-btn datano-btn-outline-primary"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              onClick={handleExportJSON}
              title="Export annotations metadata as JSON"
            >
              Export JSON
            </button>
          </div>
        )}

        {/* Scrollable container with fixed maximum height */}
        <div id="cropat" className="datano-crops-container">
          {crops.length === 0 ? (
            <div className="datano-empty-state">
              <p style={{ marginBottom: '4px' }}>No annotations yet.</p>
              <small>Click and drag on the image to crop bounding boxes.</small>
            </div>
          ) : (
            crops.map((crop, index) => {
              const filename = generateCropFileName(currInstru, crop, index);
              return (
                <div key={crop.id} className="datano-crop-card">
                  {/* Header row: badge, real dimensions, delete */}
                  <div className="datano-crop-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="datano-badge datano-badge-success">
                        #{index + 1}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        {crop.width} &times; {crop.height} px
                      </span>
                    </div>
                    <div>
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
                  <div
                    className="datano-crop-body"
                    title={`Click to download ${filename}`}
                    onClick={() => handleDownloadCrop(crop, index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={crop.dataUrl}
                      alt={filename}
                    />
                  </div>

                  {/* Dedicated Singular Download Button Bar */}
                  <div className="datano-crop-actions">
                    <button
                      type="button"
                      className="datano-btn datano-btn-primary datano-btn-download"
                      title={`Download ${filename} in .png format`}
                      onClick={() => handleDownloadCrop(crop, index)}
                    >
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                      <span>Download .png</span>
                    </button>
                  </div>

                  {/* Footer row: coordinates & filename */}
                  <div className="datano-crop-footer">
                    <span>X: {crop.x}, Y: {crop.y}</span>
                    <span title={filename} style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {filename}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

export default Right;