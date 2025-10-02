// Utilities to convert geographic coordinates to image/viewer coordinates
// - latLonToWebMercatorPixels: converts lat/lon to pixel coordinates for WebMercator tiled sources (GIBS)
// - latLonToTrekTileXY: estimate tile XY for NASA Trek XYZ services (EQ tiling scheme)

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

// For NASA Trek EQ tiles (they expose standard {z}/{y}/{x} where z=0 is low-res), we can map lat/lon to tile x/y
// This is a best-effort approximation and assumes global equirectangular projection used by Trek.
export function latLonToTrekTileXY(lat: number, lon: number, zoom: number) {
  // Normalize lon to [0,1]
  const xNorm = (lon + 180) / 360;
  // For EQ (latitude linear), normalize lat from [-90,90] to [0,1] with flip (y origin top)
  const yNorm = 1 - (lat + 90) / 180;

  const tiles = Math.pow(2, zoom);
  const xTile = Math.floor(xNorm * tiles);
  const yTile = Math.floor(yNorm * tiles);

  return { x: xTile, y: yTile };
}

// Convert pixel coords (for a given layer width/height) to OpenSeadragon viewport image coordinates (0..width, 0..height)
export function pixelsToImageCoordinates(px: number, py: number, _imageWidth: number, _imageHeight: number) {
  // OpenSeadragon expects image coordinates in pixels
  // imageWidth/imageHeight are intentionally unused in the simple passthrough
  return { x: px, y: py };
}
