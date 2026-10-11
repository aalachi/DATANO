import React, { useState, useEffect, useRef, useCallback } from 'react';

function Center({ currInstru, onAddCrop, existingCrops = [] }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const [comment, setComment] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [viewMode, setViewMode] = useState('fit'); // 'fit' or 'full'

  // Redraw canvas with source image and existing/active bounding boxes
  const redrawCanvas = useCallback((activeBox = null) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw existing annotations with distinct styling
    if (existingCrops && existingCrops.length > 0) {
      existingCrops.forEach((crop, idx) => {
        ctx.save();
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = Math.max(3, Math.round(canvas.width / 350));
        ctx.fillStyle = 'rgba(40, 167, 69, 0.25)';
        ctx.fillRect(crop.x, crop.y, crop.width, crop.height);
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

        // Badge label
        const fontSize = Math.max(14, Math.round(canvas.width / 45));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const labelText = `#${idx + 1}`;
        const textMetrics = ctx.measureText(labelText);
        const padding = 4;
        
        ctx.fillStyle = '#28a745';
        ctx.fillRect(
          crop.x, 
          Math.max(0, crop.y - fontSize - padding * 2), 
          textMetrics.width + padding * 2, 
          fontSize + padding * 2
        );
        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, crop.x + padding, Math.max(fontSize, crop.y - padding));
        ctx.restore();
      });
    }

    // Draw active bounding box while dragging
    if (activeBox) {
      ctx.save();
      ctx.strokeStyle = '#ff3838';
      ctx.lineWidth = Math.max(3, Math.round(canvas.width / 350));
      ctx.fillStyle = 'rgba(255, 56, 56, 0.3)';
      ctx.fillRect(activeBox.x, activeBox.y, activeBox.width, activeBox.height);
      ctx.strokeRect(activeBox.x, activeBox.y, activeBox.width, activeBox.height);
      ctx.restore();
    }
  }, [existingCrops]);

  // Load and initialize the image whenever currInstru changes
  useEffect(() => {
    if (!currInstru || !currInstru.src) {
      setImageLoaded(false);
      setImageDimensions({ width: 0, height: 0 });
      return;
    }

    setImageLoaded(false);
    const img = new Image();
    img.src = currInstru.src;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      imageRef.current = img;
      setImageDimensions({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        redrawCanvas();
        setImageLoaded(true);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image:', currInstru.src);
      setImageLoaded(false);
    };

    return () => {
      imageRef.current = null;
    };
  }, [currInstru, redrawCanvas]);

  // Redraw when existingCrops change
  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
  }, [existingCrops, imageLoaded, redrawCanvas]);

  // Coordinate helper: translates viewport event coordinates into intrinsic canvas pixel coordinates
  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * scaleY));

    return { x, y };
  };

  const handleMouseDown = (event) => {
    if (!imageLoaded || !imageRef.current) return;
    const { x, y } = getCanvasCoordinates(event);
    isDrawingRef.current = true;
    startPointRef.current = { x, y };
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRef.current || !imageLoaded) return;
    const { x, y } = getCanvasCoordinates(event);
    const startX = startPointRef.current.x;
    const startY = startPointRef.current.y;

    const boxX = Math.min(startX, x);
    const boxY = Math.min(startY, y);
    const boxWidth = Math.abs(x - startX);
    const boxHeight = Math.abs(y - startY);

    redrawCanvas({ x: boxX, y: boxY, width: boxWidth, height: boxHeight });
  };

  const handleMouseUp = (event) => {
    if (!isDrawingRef.current || !imageLoaded || !imageRef.current) return;
    isDrawingRef.current = false;

    const { x, y } = getCanvasCoordinates(event);
    const startX = startPointRef.current.x;
    const startY = startPointRef.current.y;

    const rawX = Math.round(Math.min(startX, x));
    const rawY = Math.round(Math.min(startY, y));
    const rawW = Math.round(Math.abs(x - startX));
    const rawH = Math.round(Math.abs(y - startY));

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Strict boundary clamping to original image dimensions
    const boxX = Math.max(0, Math.min(canvas.width - 1, rawX));
    const boxY = Math.max(0, Math.min(canvas.height - 1, rawY));
    const boxWidth = Math.max(1, Math.min(canvas.width - boxX, rawW));
    const boxHeight = Math.max(1, Math.min(canvas.height - boxY, rawH));

    // Minimum crop size check to avoid accidental clicks
    if (boxWidth >= 8 && boxHeight >= 8) {
      try {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = boxWidth;
        cropCanvas.height = boxHeight;
        const cropCtx = cropCanvas.getContext('2d');

        // Draw exact 1:1 slice from the original image element
        cropCtx.drawImage(
          imageRef.current,
          boxX,
          boxY,
          boxWidth,
          boxHeight,
          0,
          0,
          boxWidth,
          boxHeight
        );

        const dataUrl = cropCanvas.toDataURL('image/png');

        if (onAddCrop) {
          onAddCrop({
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            x: boxX,
            y: boxY,
            width: boxWidth,
            height: boxHeight,
            dataUrl,
            taskId: currInstru ? currInstru.taskId : '',
            createdAt: new Date().toLocaleTimeString()
          });
        }
      } catch (err) {
        console.error('Failed to generate crop sub-image:', err);
      }
    }

    redrawCanvas();
  };

  if (!currInstru || !currInstru.instru) {
    return (
      <div id="santr" className="col-lg-7 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <p className="text-muted">Select a collection and an image from the left panel to begin annotating.</p>
      </div>
    );
  }

  return (
    <div id="santr" className="col-lg-7">
      {/* Instruction & Controls Header */}
      <div id="foqcentral" className="d-flex justify-content-between align-items-center mb-2 px-3 py-2">
        <div className="d-flex align-items-center gap-2">
          <span id="instdir" className="fw-bold">Instruction:</span>
          <span className="text-primary fw-semibold">{currInstru.instru}</span>
        </div>
        
        {imageLoaded && (
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary" style={{ fontSize: '11px' }}>
              {imageDimensions.width} &times; {imageDimensions.height} px
            </span>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'fit' ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ fontSize: '11px', padding: '2px 8px' }}
              onClick={() => setViewMode(viewMode === 'fit' ? 'full' : 'fit')}
              title={viewMode === 'fit' ? 'Switch to Full Width' : 'Fit Entire Image on Screen'}
            >
              {viewMode === 'fit' ? 'Fit View' : 'Full Width'}
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Viewport Container: No fixed height, shows the ENTIRE image */}
      <div 
        id="central" 
        className="d-flex justify-content-center align-items-center position-relative w-100 p-2 mb-3"
        style={{
          background: '#0e141b',
          borderRadius: '8px',
          minHeight: '260px',
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 14px'
        }}
      >
        <canvas
          id="imgCanva"
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            maxHeight: viewMode === 'fit' ? '72vh' : 'none',
            width: 'auto',
            height: 'auto',
            display: imageLoaded ? 'block' : 'none',
            cursor: 'crosshair',
            userSelect: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />

        {!imageLoaded && (
          <div className="text-light text-center py-5">
            <div className="spinner-border spinner-border-sm me-2 text-primary" role="status" />
            <span>Loading image asset...</span>
          </div>
        )}
      </div>

      {/* Reviewer Notes & Comments */}
      <div className="row mb-3">
        <div id="msgsection" className="col-12">
          <textarea
            id="brr"
            className="form-control"
            placeholder="Add reviewer notes or annotation comments for this task..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Center;