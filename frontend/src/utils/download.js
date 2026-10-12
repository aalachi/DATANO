/**
 * Generates a clean, standardized, ML-ready filename for cropped annotations.
 * Example output: trafic_NqVwY69041VP_00000000_crop01_x120_y85_w350_h220.png
 */
export function generateCropFileName(currInstru, crop, index) {
  const collection = (currInstru?.collection || 'dataset')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/gi, '_');

  const taskId = (currInstru?.taskId || (currInstru?.id ? `task_${currInstru.id}` : 'task'))
    .trim()
    .replace(/[^a-z0-9_-]/gi, '_');

  let assetName = 'asset';
  if (currInstru?.src) {
    const filenameWithExt = currInstru.src.split('/').pop().split('?')[0];
    assetName = filenameWithExt
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9_-]/gi, '_');
  }

  const cropNum = String(index + 1).padStart(2, '0');
  const x = Math.round(crop.x);
  const y = Math.round(crop.y);
  const w = Math.round(crop.width);
  const h = Math.round(crop.height);

  return `${collection}_${taskId}_${assetName}_crop${cropNum}_x${x}_y${y}_w${w}_h${h}.png`;
}

/**
 * Downloads a base64 DataURL as a .png file reliably across all browsers.
 * Converts to a Blob URL to avoid browser DataURL length/sandbox limits.
 */
export function downloadDataUrlAsPng(dataUrl, filename) {
  if (!dataUrl) return;

  try {
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const buffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(buffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([buffer], { type: mimeString || 'image/png' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return;
    }

    // Direct URL fallback
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download failed, falling back to direct anchor:', err);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Extracts a crop from an HTMLImageElement using an offscreen canvas and returns a PNG DataURL.
 */
export function sliceCropFromImage(img, crop) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(crop.width));
    canvas.height = Math.max(1, Math.round(crop.height));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      img,
      Math.round(crop.x),
      Math.round(crop.y),
      Math.round(crop.width),
      Math.round(crop.height),
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Failed to slice crop from image:', err);
    return null;
  }
}

/**
 * Returns a PNG DataURL for a crop. If crop.dataUrl exists, returns it.
 * Otherwise, loads the source image asset and extracts the slice on the fly.
 */
export async function getCropDataUrl(currInstru, crop) {
  if (crop && crop.dataUrl && crop.dataUrl.startsWith('data:image/')) {
    return crop.dataUrl;
  }

  if (!currInstru || !currInstru.src) {
    throw new Error('No image source available to extract crop');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (currInstru.src.startsWith('http://') || currInstru.src.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      const dataUrl = sliceCropFromImage(img, crop);
      if (dataUrl) {
        resolve(dataUrl);
      } else {
        reject(new Error('Failed to generate crop canvas'));
      }
    };
    img.onerror = () => {
      reject(new Error(`Failed to load source image: ${currInstru.src}`));
    };
    img.src = currInstru.src;
  });
}


