import React, { useState, useRef } from 'react';

function ImageCrop() {
  const [image, setImage] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [cropRect, setCropRect] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setCanvasDimensions({ width: img.width, height: img.height });
        setImage(img);
        setCropRect(null);
        setCroppedImage(null);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasMouseDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCropRect({ x, y, width: 0, height: 0 });
  };

  const handleCanvasMouseMove = (event) => {
    if (!cropRect) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCropRect((prev) => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y
    }));
  };

  const handleCanvasMouseUp = () => {
    if (!cropRect || !canvasRef.current) return;
    const { x, y, width, height } = cropRect;
    if (Math.abs(width) < 5 || Math.abs(height) < 5) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const startX = width < 0 ? x + width : x;
    const startY = height < 0 ? y + height : y;
    const cropW = Math.abs(width);
    const cropH = Math.abs(height);

    const cropImage = ctx.getImageData(startX, startY, cropW, cropH);
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.putImageData(cropImage, 0, 0);
    setCroppedImage(cropCanvas.toDataURL());
  };

  return (
    <div className="card p-3 my-3">
      <h5 className="card-title">Standalone Image Cropper (Utility)</h5>
      <input 
        type="file" 
        accept="image/*" 
        className="form-control mb-3" 
        onChange={handleFileChange} 
      />

      {image && (
        <div className="position-relative d-inline-block">
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            className="border rounded"
            style={{ maxWidth: '100%', height: 'auto', cursor: 'crosshair' }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          />
          {cropRect && (
            <div
              style={{
                position: 'absolute',
                left: cropRect.width < 0 ? cropRect.x + cropRect.width : cropRect.x,
                top: cropRect.height < 0 ? cropRect.y + cropRect.height : cropRect.y,
                width: Math.abs(cropRect.width),
                height: Math.abs(cropRect.height),
                border: '2px solid red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      )}

      {croppedImage && (
        <div className="mt-3">
          <h6>Cropped Result:</h6>
          <img src={croppedImage} alt="Cropped Preview" className="border rounded shadow-sm" style={{ maxHeight: '200px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageCrop;
