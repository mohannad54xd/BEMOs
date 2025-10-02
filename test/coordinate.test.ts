import { describe, it, expect } from 'vitest';
import { latLonToWebMercatorPixels, latLonToTrekTileXY } from '../src/utils/coordinate';

describe('coordinate utils', () => {
  it('converts lat/lon to web mercator pixels (approx)', () => {
    const p = latLonToWebMercatorPixels(0, 0, 2);
    expect(p.x).toBeGreaterThan(0);
    expect(p.y).toBeGreaterThan(0);
  });

  it('converts lat/lon to trek tile x/y', () => {
    const t = latLonToTrekTileXY(0, 0, 2);
    expect(t.x).toBeGreaterThanOrEqual(0);
    expect(t.y).toBeGreaterThanOrEqual(0);
  });
});
