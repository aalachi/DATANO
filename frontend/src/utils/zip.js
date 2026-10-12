/**
 * Lightweight, zero-dependency client-side ZIP generator.
 * Packages multiple files into a standard .zip archive using uncompressed (Store) mode,
 * which is ideal for PNG images (already deflate-compressed) and 100% compatible with
 * macOS Archive Utility, Windows Explorer, and Linux.
 */

// CRC-32 Lookup Table
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function computeCrc32(uint8Array) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < uint8Array.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ uint8Array[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Converts a base64 DataURL (image/png) into a raw Uint8Array.
 */
export function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(',')[1] || '';
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a standard ZIP Blob from an array of files:
 * files: Array of { filename: string, data: Uint8Array | dataUrl: string }
 */
export function createZipArchive(files) {
  const encoder = new TextEncoder();
  const fileRecords = [];
  let currentOffset = 0;

  // Process input files
  for (const file of files) {
    const rawData = file.data instanceof Uint8Array 
      ? file.data 
      : dataUrlToUint8Array(file.dataUrl || '');
    
    const nameBytes = encoder.encode(file.filename);
    const crc = computeCrc32(rawData);
    const size = rawData.length;

    fileRecords.push({
      nameBytes,
      data: rawData,
      crc,
      size,
      offset: currentOffset
    });

    // Local Header (30 bytes) + filename + data
    currentOffset += 30 + nameBytes.length + size;
  }

  // Calculate Central Directory size
  let centralDirSize = 0;
  for (const record of fileRecords) {
    centralDirSize += 46 + record.nameBytes.length;
  }

  const totalZipSize = currentOffset + centralDirSize + 22; // 22 bytes for End of Central Directory
  const buffer = new ArrayBuffer(totalZipSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let pos = 0;

  // 1. Write Local File Headers and Data
  for (const record of fileRecords) {
    // Signature: 0x04034b50
    view.setUint32(pos, 0x04034b50, true);
    view.setUint16(pos + 4, 20, true); // Version needed: 2.0
    view.setUint16(pos + 6, 0, true);  // General purpose bit flag
    view.setUint16(pos + 8, 0, true);  // Compression method: 0 (Store)
    view.setUint16(pos + 10, 0, true); // Last mod time
    view.setUint16(pos + 12, 0, true); // Last mod date
    view.setUint32(pos + 14, record.crc, true);
    view.setUint32(pos + 18, record.size, true); // Compressed size
    view.setUint32(pos + 22, record.size, true); // Uncompressed size
    view.setUint16(pos + 26, record.nameBytes.length, true);
    view.setUint16(pos + 28, 0, true); // Extra field length

    pos += 30;
    uint8.set(record.nameBytes, pos);
    pos += record.nameBytes.length;

    uint8.set(record.data, pos);
    pos += record.size;
  }

  const centralDirStartOffset = pos;

  // 2. Write Central Directory Headers
  for (const record of fileRecords) {
    // Signature: 0x02014b50
    view.setUint32(pos, 0x02014b50, true);
    view.setUint16(pos + 4, 20, true); // Version made by: 2.0
    view.setUint16(pos + 6, 20, true); // Version needed: 2.0
    view.setUint16(pos + 8, 0, true);  // Flags
    view.setUint16(pos + 10, 0, true); // Compression: 0
    view.setUint16(pos + 12, 0, true); // Mod time
    view.setUint16(pos + 14, 0, true); // Mod date
    view.setUint32(pos + 16, record.crc, true);
    view.setUint32(pos + 20, record.size, true); // Compressed size
    view.setUint32(pos + 24, record.size, true); // Uncompressed size
    view.setUint16(pos + 28, record.nameBytes.length, true);
    view.setUint16(pos + 30, 0, true); // Extra field length
    view.setUint16(pos + 32, 0, true); // Comment length
    view.setUint16(pos + 34, 0, true); // Disk number start
    view.setUint16(pos + 36, 0, true); // Internal attributes
    view.setUint32(pos + 38, 0, true); // External attributes
    view.setUint32(pos + 42, record.offset, true); // Relative offset of local header

    pos += 46;
    uint8.set(record.nameBytes, pos);
    pos += record.nameBytes.length;
  }

  // 3. Write End of Central Directory Record (EOCD)
  // Signature: 0x06054b50
  view.setUint32(pos, 0x06054b50, true);
  view.setUint16(pos + 4, 0, true); // Number of this disk
  view.setUint16(pos + 6, 0, true); // Disk where central directory starts
  view.setUint16(pos + 8, fileRecords.length, true);  // Central dir records on this disk
  view.setUint16(pos + 10, fileRecords.length, true); // Total central dir records
  view.setUint32(pos + 12, centralDirSize, true);     // Size of central directory
  view.setUint32(pos + 16, centralDirStartOffset, true); // Offset of start of central directory
  view.setUint16(pos + 20, 0, true); // ZIP comment length

  return new Blob([buffer], { type: 'application/zip' });
}

/**
 * Downloads multiple files packaged into a single ZIP archive.
 */
export function downloadZipArchive(files, zipFilename) {
  if (!files || files.length === 0) return;

  const blob = createZipArchive(files);
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = zipFilename.endsWith('.zip') ? zipFilename : `${zipFilename}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

