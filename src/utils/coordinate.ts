// Utilities to convert geographic coordinates to image/viewer coordinates
// - latLonToImagePixels: converts lat/lon to pixel coordinates within the full image space
//   for either WebMercator (GIBS) or Equirectangular (NASA Trek) tiled sources.
// - imagePixelsToViewportPoint: converts image pixel coords to an OpenSeadragon viewport point

const TILE_SIZE = 256;

export function lonToX(lon: number): number {
  return (lon + 180) / 360;
}

export function latToY(lat: number): number {
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI);
  return y;
}

// Convert lat/lon to pixel coordinates at a given zoom for WebMercator (EPSG:3857)
export function latLonToWebMercatorPixels(lat: number, lon: number, zoom: number) {
  const x = lonToX(lon) * Math.pow(2, zoom) * TILE_SIZE;
  const y = latToY(lat) * Math.pow(2, zoom) * TILE_SIZE;
  return { x, y };
}

// For NASA Trek EQ tiles (they expose standard {z}/{y}/{x} where z=0 is low-res), estimate tile X/Y
export function latLonToTrekTileXY(lat: number, lon: number, zoom: number) {
  const xNorm = (lon + 180) / 360;
  const yNorm = 1 - (lat + 90) / 180;
  const tiles = Math.pow(2, zoom);
  const xTile = Math.floor(xNorm * tiles);
  const yTile = Math.floor(yNorm * tiles);
  return { x: xTile, y: yTile };
}

// Basic passthrough conversion (kept for compatibility)
export function pixelsToImageCoordinates(px: number, py: number, _imageWidth: number, _imageHeight: number) {
  return { x: px, y: py };
}

// New: Convert lat/lon -> image pixel coordinates for a given image width/height and zoom
// - projection: 'webmercator' | 'trek' | 'image'
export function latLonToImagePixels(
  lat: number,
  lon: number,
  zoom: number,
  imageWidth: number,
  imageHeight: number,
  projection: 'webmercator' | 'trek' | 'image' = 'webmercator'
) {
  if (!isFinite(lat) || !isFinite(lon) || !imageWidth || !imageHeight) {
    return { x: NaN, y: NaN };
  }

  if (projection === 'webmercator') {
    const gp = latLonToWebMercatorPixels(lat, lon, zoom);
    const worldPixels = TILE_SIZE * Math.pow(2, zoom);
    const scaleX = imageWidth / worldPixels;
    const scaleY = imageHeight / worldPixels;
    return { x: gp.x * scaleX, y: gp.y * scaleY };
  }

  if (projection === 'trek') {
    const tiles = Math.pow(2, zoom);
    const xNorm = (lon + 180) / 360;
    const yNorm = 1 - (lat + 90) / 180;
    const globalPixelX = xNorm * tiles * TILE_SIZE;
    const globalPixelY = yNorm * tiles * TILE_SIZE;
    const worldPixels = TILE_SIZE * Math.pow(2, zoom);
    const scaleX = imageWidth / worldPixels;
    const scaleY = imageHeight / worldPixels;
    return { x: globalPixelX * scaleX, y: globalPixelY * scaleY };
  }

  // For raw image-based sources (no geo-projection) we can't compute from lat/lon
  return { x: NaN, y: NaN };
}

// Convert image pixel coordinates -> OpenSeadragon viewport coordinate (requires viewer instance)
// Returns null on invalid input.
export function imagePixelsToViewportPoint(viewer: any, imgX: number, imgY: number) {
  try {
    if (!viewer || !viewer.viewport || !isFinite(imgX) || !isFinite(imgY)) return null;
    // OpenSeadragon stores image coordinates as Point objects; use runtime OpenSeadragon if available
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const Point = (window as any).OpenSeadragon?.Point;
    if (!Point) return null;
    const imgPoint = new Point(imgX, imgY);
    return viewer.viewport.imageToViewportCoordinates(imgPoint);
  } catch {
    return null;
  }
}
