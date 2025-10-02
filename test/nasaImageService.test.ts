import { describe, it, expect } from 'vitest';
import { NASAImageService } from '../src/services/NASAImageService';

describe('NASAImageService', () => {
  it('generates a tile source URL for GIBS', () => {
    const ts = NASAImageService.getTileSource('earth', 'VIIRS_SNPP_CorrectedReflectance_TrueColor', new Date('2025-10-02'));
    expect(ts.url).toContain('VIIRS_SNPP_CorrectedReflectance_TrueColor');
    expect(ts.url).toMatch(/GoogleMapsCompatible_Level/);
  });
});
