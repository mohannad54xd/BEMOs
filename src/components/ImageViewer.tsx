import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { NASAImageService } from '../services/NASAImageService';

interface ImageViewerProps {
  onViewerReady?: (viewer: OpenSeadragon.Viewer) => void;
  bodyId: string;
  layerId: string;
  date: Date;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  onViewerReady,
  bodyId,
  layerId,
  date
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current || viewerInstance.current) return;

    const newViewer = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/',
      showNavigationControl: true,
  defaultZoomLevel: 2,
  minZoomLevel: 0,
  maxZoomLevel: 12,
      visibilityRatio: 0.5,
      constrainDuringPan: true,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      navigatorHeight: '100px',
      navigatorWidth: '150px',
      timeout: 120000,
      springStiffness: 6.5,
      animationTime: 1.0,
      gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true,
        pinchToZoom: true,
        scrollToZoom: true,
        dragToPan: true
      },
      // Use <img> tag loading to avoid CORS preflight; rely on CORS headers from servers
      loadTilesWithAjax: false,
      crossOriginPolicy: 'Anonymous',
  maxImageCacheCount: 1000,
      debugMode: false,
      placeholderFillStyle: '#000000',
      wrapHorizontal: false,
      wrapVertical: false
    });

    viewerInstance.current = newViewer;

    if (onViewerReady) {
      onViewerReady(newViewer);
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, [onViewerReady]);

  useEffect(() => {
    if (!viewerInstance.current) return;

    const loadNewImage = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
  let tileSource = NASAImageService.getTileSource(bodyId, layerId, date);
        let layer = NASAImageService.getLayer(bodyId, layerId);
        
        if (!layer) {
          setError('Layer not found');
          setIsLoading(false);
          return;
        }
        
        // For NASA GIBS, attempt to find a valid TileMatrixSet (avoids wrong Level mismatch)
        if (layer.dataSource === 'NASA GIBS') {
          try {
            tileSource = await NASAImageService.findValidGibsTileSource(bodyId, layerId, date);
          } catch (err) {
            // fallback previous behavior
            const isValid = await NASAImageService.validateTileSource(tileSource);
            if (!isValid) {
              const prevDate = new Date(date);
              prevDate.setDate(prevDate.getDate() - 1);
              tileSource = NASAImageService.getTileSource(bodyId, layerId, prevDate);
              const prevValid = await NASAImageService.validateTileSource(tileSource);
              if (!prevValid) {
                const fallbackLayerId = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';
                const fbLayer = NASAImageService.getLayer(bodyId, fallbackLayerId);
                if (fbLayer) {
                  layer = fbLayer;
                  tileSource = NASAImageService.getTileSource(bodyId, fallbackLayerId, prevDate);
                }
              }
            }
          }
        }

        // Before adding tiles, probe a few sample tile images to detect "empty" (all-black/transparent) tiles
        const isTileMostlyEmpty = async (tileUrl: string) => {
          try {
            const res = await fetch(tileUrl, { mode: 'cors', cache: 'no-cache' });
            if (!res.ok) return false;
            const blob = await res.blob();
            // createImageBitmap will obey CORS; if server doesn't allow, this will throw and we can't inspect
            const bitmap = await createImageBitmap(blob);
            const canvas = document.createElement('canvas');
            const w = 64, h = 64;
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return false;
            ctx.drawImage(bitmap, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;
            let total = 0;
            for (let i = 0; i < data.length; i += 4) {
              // use luminance
              const r = data[i], g = data[i+1], b = data[i+2];
              const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              total += lum;
            }
            const avg = total / (data.length / 4);
            // if average luminance is very low, treat as mostly empty (black)
            return avg < 8;
          } catch (err) {
            return false;
          }
        };

        // Build sample tile URLs for a low zoom to check mosaic completeness
        const buildSampleUrls = (ts: any) => {
          const maxZ = layer?.maxZoom ?? 8;
          const sampleLevel = Math.max(2, maxZ - 2);
          const coords = [0,1,2,3];
          const urls: string[] = [];
          for (const x of coords) for (const y of coords) {
            const raw = String(ts.url).replace('{z}', sampleLevel.toString()).replace('{x}', x.toString()).replace('{y}', y.toString());
            // route through local tile proxy: expect domain/path like 'gibs-a.earthdata.nasa.gov/wmts/...'
            try {
              const u = new URL(raw);
              const proxied = `/api/tiles/${u.host}${u.pathname}${u.search}`;
              urls.push(proxied);
            } catch (e) {
              // fallback to raw
              urls.push(raw);
            }
          }
          return urls.slice(0, 6); // probe first 6
        };

        // Remove existing items and force cleanup
        viewerInstance.current?.world.removeAll();
        viewerInstance.current?.forceRedraw();
        
        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));

        // Probe content: if many sampled tiles are empty, try fallback options first
        try {
          const sampleUrls = buildSampleUrls(tileSource);
          let emptyCount = 0;
          const checks = await Promise.all(sampleUrls.map(u => isTileMostlyEmpty(u)));
          for (const c of checks) if (c) emptyCount++;
          const emptyFraction = checks.length > 0 ? emptyCount / checks.length : 0;
          if (emptyFraction > 0.5) {
            console.log('Detected many empty tiles; requesting server-side mosaic as fallback');
            // Build template URL from tileSource (replace domain path to absolute)
            try {
              const template = tileSource.url;
              // determine a center z/x/y for mosaic probe
              const maxZ = layer?.maxZoom ?? 8;
              const z = Math.max(2, maxZ - 2);
              const x = 1; const y = 1; // sample center for mosaic
              const mosaicResp = await fetch('/api/mosaic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateUrl: template, z, x, y })
              });
              if (mosaicResp.ok) {
                const blob = await mosaicResp.blob();
                const objectUrl = URL.createObjectURL(blob);
                // use the mosaic image as a temporary single-image tile source
                tileSource = { ...tileSource, url: objectUrl } as any;
                layer = { ...layer, type: 'image' } as any;
                console.log('Using server-side mosaic image');
              }
            } catch (err) {
              console.warn('Mosaic request failed, continuing with other fallbacks', err);
            }
          }
        } catch (err) {
          console.warn('Tile sampling failed, continuing to load normally', err);
        }
        
        const retryImage = (attempt = 0, maxAttempts = 3) => {
          if (attempt >= maxAttempts) {
            console.error('Failed to load image after multiple attempts');
            setError(`Failed to load ${layer?.dataSource ?? 'imagery'} imagery. Please try a different dataset.`);
            setIsLoading(false);
            return;
          }

          const tileSourceConfig = NASAImageService.createTileSource(tileSource, layer!);
          
          viewerInstance.current?.addTiledImage({
            tileSource: tileSourceConfig,
            success: () => {
              console.log('Image loaded successfully');
              setError(null);
              setIsLoading(false);
            },
            error: (error: any) => {
              console.log(`Attempt ${attempt + 1} failed, retrying...`, error);
              console.log('Tile source URL:', tileSource.url);
              // If GIBS Earth layer fails, try previous date automatically
              if (layer?.dataSource === 'NASA GIBS') {
                const prevDate = new Date(date);
                prevDate.setDate(prevDate.getDate() - 1);
                try {
                  const prevSource = NASAImageService.getTileSource(bodyId, layerId, prevDate);
                  const prevConfig = NASAImageService.createTileSource(prevSource, layer!);
                  viewerInstance.current?.world.removeAll();
                  viewerInstance.current?.addTiledImage({ tileSource: prevConfig, success: () => setIsLoading(false) });
                  return;
                } catch {}
              }
              // If NASA Trek fails (Moon/Mars), attempt png/jpg swap once
              if (layer?.dataSource === 'NASA Trek') {
                const isJpg = tileSource.url.endsWith('.jpg');
                const altUrl = isJpg ? tileSource.url.replace('.jpg', '.png') : tileSource.url.replace('.png', '.jpg');
                const altSource = { ...tileSource, url: altUrl } as any;
                try {
                  const altConfig = NASAImageService.createTileSource(altSource, layer!);
                  viewerInstance.current?.world.removeAll();
                  viewerInstance.current?.addTiledImage({ tileSource: altConfig, success: () => setIsLoading(false) });
                  return;
                } catch {}
              }
              setTimeout(() => retryImage(attempt + 1), 2000 * (attempt + 1));
            }
          });
        };

        retryImage();
      } catch (error) {
        console.error('Error loading image:', error);
        setError('An error occurred while loading the image. Please try again.');
        setIsLoading(false);
      }
    };

    loadNewImage();
  }, [date, layerId, bodyId]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={viewerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-white text-lg font-semibold">Loading NASA Data...</div>
            <div className="text-gray-400 text-sm mt-2">Fetching imagery from NASA GIBS</div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <div className="text-white text-lg font-semibold mb-2">Unable to Load Image</div>
            <div className="text-gray-300 text-sm mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};