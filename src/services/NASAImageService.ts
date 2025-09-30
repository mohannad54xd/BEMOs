/**
 * NASA Data Integration Service for multiple celestial bodies
 * Supports Earth, Moon, Mars, and Andromeda galaxy datasets
 */

export interface CelestialBody {
  id: string;
  name: string;
  description: string;
  icon: string;
  datasets: Layer[];
}

export interface Layer {
  id: string;
  name: string;
  description: string;
  resolution: string;
  category: string;
  dataSource: string;
  baseUrl: string;
  tileFormat: string;
  maxZoom: number;
  type?: 'xyz' | 'dzi' | 'iiif' | 'image';
  urlOrder?: 'z-y-x' | 'z-x-y';
  minLevel?: number;
}

const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'earth',
    name: 'Earth',
    description: 'Our home planet with real-time satellite imagery',
    icon: '🌍',
    datasets: [
      {
        id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        name: 'True Color (Terra/MODIS)',
        description: 'True color image of Earth from Terra satellite',
        resolution: '250m',
        category: 'Base Layers',
        dataSource: 'NASA GIBS',
        baseUrl: 'https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best',
        tileFormat: 'jpg',
        maxZoom: 8
      },
      {
        id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        name: 'True Color (Suomi NPP/VIIRS)',
        description: 'True color image from Suomi NPP satellite',
        resolution: '375m',
        category: 'Base Layers',
        dataSource: 'NASA GIBS',
        baseUrl: 'https://gibs-b.earthdata.nasa.gov/wmts/epsg3857/best',
        tileFormat: 'jpg',
        maxZoom: 8
      },
      {
        id: 'MODIS_Terra_CorrectedReflectance_Bands367',
        name: 'False Color (Terra/MODIS)',
        description: 'False color image emphasizing vegetation',
        resolution: '250m',
        category: 'Base Layers',
        dataSource: 'NASA GIBS',
        baseUrl: 'https://gibs-c.earthdata.nasa.gov/wmts/epsg3857/best',
        tileFormat: 'jpg',
        maxZoom: 8
      },
      {
        id: 'MODIS_Terra_Land_Surface_Temp_Day',
        name: 'Land Surface Temperature (Day)',
        description: 'Daily land surface temperature',
        resolution: '1km',
        category: 'Science Layers',
        dataSource: 'NASA GIBS',
        baseUrl: 'https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best',
        tileFormat: 'png',
        maxZoom: 8
      }
    ]
  },
  {
    id: 'moon',
    name: 'Moon',
    description: 'Lunar Reconnaissance Orbiter high-resolution imagery',
    icon: '🌙',
    datasets: [
      {
        id: 'LRO_WAC_Mosaic_Global_303ppd',
        name: 'LRO WAC Global Mosaic',
        description: 'Lunar Reconnaissance Orbiter WAC global mosaic',
        resolution: '100m',
        category: 'Base Layers',
        dataSource: 'NASA Trek',
        // Adjusted for proper XYZ tile rendering: use {z}/{y}/{x} placeholders
        baseUrl: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
        tileFormat: 'jpg',
        maxZoom: 9,
        type: 'xyz',
        minLevel: 4
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    description: 'Mars Reconnaissance Orbiter, Viking, and other Mars missions',
    icon: '🔴',
    datasets: [
      {
        id: 'Mars_Viking_MDIM21_ClrMosaic_global_232m',
        name: 'Viking VIS, Global Color Mosaic (232m)',
        description: 'Global color mosaic of Mars (Viking MDIM2.1)',
        resolution: '250m',
        category: 'Base Layers',
        dataSource: 'NASA Trek',
        baseUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
        tileFormat: 'jpg',
        maxZoom: 9,
        type: 'xyz',
        minLevel: 4
      },
      {
        id: 'Mars_MGS_MOLA_ClrShade_merge_global_463m',
        name: 'MGS MOLA Color Shaded Relief (463m)',
        description: 'Color shaded relief map of Mars from MGS MOLA',
        resolution: '463m',
        category: 'Base Layers',
        dataSource: 'NASA Trek',
        // Adjusted for proper XYZ tile rendering: remove hardcoded tile path, use {z}/{y}/{x} placeholders
        baseUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
        tileFormat: 'jpg',
        maxZoom: 15,
        type: 'xyz',
        minLevel: 0
      }
    ]
  
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    description: 'Hubble Space Telescope 2.5-gigapixel image',
    icon: '🌌',
    datasets: [
      {
        id: 'Hubble_Andromeda',
        name: 'Hubble Andromeda Galaxy',
        description: 'Hubble M31 mosaic (2025 release)',
        resolution: '10552x2468',
        category: 'Deep Space',
        dataSource: 'NASA Hubble',
        baseUrl: 'https://assets.science.nasa.gov/content/dam/science/missions/hubble/galaxies/andromeda/Hubble_M31Mosaic_2025_10552x2468_STScI-01JGY92V0Z2HJTVH605N4WH9XQ.jpg',
        tileFormat: 'jpg',
        maxZoom: 8,
        type: 'image'
      },
      {
        id: 'Hubble_Andromeda_Compass',
        name: 'Hubble Andromeda Galaxy (Compass)',
        description: 'Hubble M31 mosaic with compass overlay (7680x4320)',
        resolution: '7680x4320',
        category: 'Deep Space',
        dataSource: 'NASA Hubble',
        baseUrl: 'https://assets.science.nasa.gov/content/dam/science/missions/hubble/galaxies/andromeda/Hubble_M31Mosaic_Compass_7680x4320_STScI-01JGYCFA9BHKB7V0W7SKDKND29.jpg',
        tileFormat: 'jpg',
        maxZoom: 8,
        type: 'image'
      }
    ]
  }
];

export interface TileSource {
  url: string;
  date: string;
  layer: string;
  width?: number;
  height?: number;
}

export class NASAImageService {
  static celestialBodies = CELESTIAL_BODIES;
  
  static getCelestialBody(bodyId: string): CelestialBody | undefined {
    return this.celestialBodies.find(body => body.id === bodyId);
  }
  
  static getLayersForBody(bodyId: string): Layer[] {
    const body = this.getCelestialBody(bodyId);
    return body ? body.datasets : [];
  }
  
  static getLayer(bodyId: string, layerId: string): Layer | undefined {
    const layers = this.getLayersForBody(bodyId);
    return layers.find(layer => layer.id === layerId);
  }

  private static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static getTileSource(bodyId: string, layerId: string, date?: Date): TileSource {
    const layer = this.getLayer(bodyId, layerId);
    if (!layer) {
      throw new Error(`Layer ${layerId} not found for body ${bodyId}`);
    }
    
    const imageDate = date ? this.formatDate(date) : this.formatDate(new Date());
    
    // Different URL patterns for different data sources
    let url: string;
    if (layer.dataSource === 'NASA GIBS') {
      // GIBS WMTS (EPSG:3857 GoogleMapsCompatible) XYZ-style
      url = `${layer.baseUrl}/${layerId}/default/${imageDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${layer.tileFormat}`;
    } else {
      // For Moon/Mars XYZ or Andromeda DZI
      url = layer.baseUrl;
    }
    
    return {
      url,
      date: imageDate,
      layer: layerId,
      width: 256,
      height: 256
    };
  }

  static createTileSource(source: TileSource, layer: Layer) {
    // Single static image
    if (layer.type === 'image') {
      return {
        type: 'image',
        url: source.url,
        buildPyramid: true,
        crossOriginPolicy: 'Anonymous'
      } as any;
    }

    // DZI source
    if (layer.type === 'dzi') {
      return source.url;
    }

    // XYZ sources
    return {
      type: 'legacy-image-pyramid',
      getTileUrl: function(level: number, x: number, y: number) {
        const url = source.url.replace('{z}', level.toString());
        if (layer.urlOrder === 'z-x-y') {
          return url.replace('{x}', x.toString()).replace('{y}', y.toString());
        }
        return url.replace('{y}', y.toString()).replace('{x}', x.toString());
      },
      width: Math.pow(2, layer.maxZoom) * 256,
      height: Math.pow(2, layer.maxZoom) * 256,
      tileWidth: 256,
      tileHeight: 256,
      minLevel: layer.minLevel ?? 0,
      maxLevel: layer.maxZoom,
      tileOverlap: 0,
      wrapHorizontal: layer.dataSource === 'NASA GIBS',
      wrapVertical: false,
      crossOriginPolicy: 'Anonymous'
    };
  }

  static async validateTileSource(tileSource: TileSource): Promise<boolean> {
    try {
      const response = await fetch(tileSource.url.replace('{z}', '0').replace('{y}', '0').replace('{x}', '0'));
      return response.ok;
    } catch {
      return false;
    }
  }

  static async getAvailableDates(_layer: string): Promise<Date[]> {
    try {
      // This would typically call a NASA API to get available dates
      // For now, we'll return a range of recent dates
      const dates: Date[] = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
      }
      
      return dates;
    } catch (error) {
      console.error('Failed to get available dates:', error);
      return [];
    }
  }

  static async checkLayerAvailability(bodyId: string, layerId: string, date: Date): Promise<boolean> {
    try {
      const tileSource = this.getTileSource(bodyId, layerId, date);
      return await this.validateTileSource(tileSource);
    } catch (error) {
      console.error('Failed to check layer availability:', error);
      return false;
    }
  }
}