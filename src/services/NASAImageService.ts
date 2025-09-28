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
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
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
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
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
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
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
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
        tileFormat: 'jpg',
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
        id: 'LRO_WAC_Moon',
        name: 'Lunar Reconnaissance Orbiter (WAC)',
        description: 'Wide Angle Camera imagery of the Moon',
        resolution: '100m',
        category: 'Base Layers',
        dataSource: 'NASA LRO',
        baseUrl: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Moon_Global_303ppd_v02/{z}/{x}/{y}.png',
        tileFormat: 'png',
        maxZoom: 8
      },
      {
        id: 'LRO_LROC_Moon',
        name: 'Lunar Reconnaissance Orbiter (LROC)',
        description: 'Lunar Reconnaissance Orbiter Camera imagery',
        resolution: '50m',
        category: 'Base Layers',
        dataSource: 'NASA LRO',
        baseUrl: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LROC_Moon_Global_303ppd_v02/{z}/{x}/{y}.png',
        tileFormat: 'png',
        maxZoom: 8
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    description: 'Mars Reconnaissance Orbiter and other Mars missions',
    icon: '🔴',
    datasets: [
      {
        id: 'MRO_Mars_Global',
        name: 'Mars Global Survey',
        description: 'Global view of Mars surface',
        resolution: '500m',
        category: 'Base Layers',
        dataSource: 'NASA MRO',
        baseUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/MRO_Mars_Global_303ppd_v02/{z}/{x}/{y}.png',
        tileFormat: 'png',
        maxZoom: 8
      },
      {
        id: 'MRO_Mars_Color',
        name: 'Mars Color Imager',
        description: 'Color imagery of Mars surface',
        resolution: '250m',
        category: 'Base Layers',
        dataSource: 'NASA MRO',
        baseUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/MRO_Mars_Color_303ppd_v02/{z}/{x}/{y}.png',
        tileFormat: 'png',
        maxZoom: 8
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
        description: '2.5-gigapixel image of Andromeda galaxy',
        resolution: 'Ultra High',
        category: 'Deep Space',
        dataSource: 'NASA Hubble',
        baseUrl: 'https://hubblesite.org/images/news/release/2015-02/{z}/{x}/{y}.jpg',
        tileFormat: 'jpg',
        maxZoom: 10
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
      url = `${layer.baseUrl}/${layerId}/default/${imageDate}/250m/{z}/{y}/{x}.${layer.tileFormat}`;
    } else {
      // For static datasets like Moon, Mars, Andromeda
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
    return {
      type: 'legacy-image-pyramid',
      getTileUrl: function(level: number, x: number, y: number) {
        // For GIBS (Earth data), flip Y coordinate
        if (layer.dataSource === 'NASA GIBS') {
          const numTiles = Math.pow(2, level);
          const flippedY = (numTiles - 1) - y;
          return source.url
            .replace('{z}', level.toString())
            .replace('{y}', flippedY.toString())
            .replace('{x}', x.toString());
        } else {
          // For other datasets, use standard tile coordinates
          return source.url
            .replace('{z}', level.toString())
            .replace('{y}', y.toString())
            .replace('{x}', x.toString());
        }
      },
      width: Math.pow(2, layer.maxZoom) * 256,
      height: Math.pow(2, layer.maxZoom) * 256,
      tileWidth: 256,
      tileHeight: 256,
      minLevel: 0,
      maxLevel: layer.maxZoom,
      tileOverlap: 0,
      wrapHorizontal: layer.dataSource === 'NASA GIBS', // Only Earth wraps
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