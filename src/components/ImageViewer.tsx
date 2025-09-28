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
      defaultZoomLevel: 1,
      minZoomLevel: 0,
      maxZoomLevel: 8,
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
      loadTilesWithAjax: true,
      crossOriginPolicy: 'Anonymous',
      ajaxHeaders: {
        'Access-Control-Allow-Origin': '*'
      },
      maxImageCacheCount: 500,
      debugMode: false,
      placeholderFillStyle: '#000000',
      wrapHorizontal: true,
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
        const tileSource = NASAImageService.getTileSource(bodyId, layerId, date);
        const layer = NASAImageService.getLayer(bodyId, layerId);
        
        if (!layer) {
          setError('Layer not found');
          setIsLoading(false);
          return;
        }
        
        // Remove existing items and force cleanup
        viewerInstance.current?.world.removeAll();
        viewerInstance.current?.forceRedraw();
        
        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const retryImage = (attempt = 0, maxAttempts = 3) => {
          if (attempt >= maxAttempts) {
            console.error('Failed to load image after multiple attempts');
            setError(`Failed to load ${layer.dataSource} imagery. Please try a different dataset.`);
            setIsLoading(false);
            return;
          }

          const tileSourceConfig = NASAImageService.createTileSource(tileSource, layer);
          
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
        className="w-full h-full bg-black"
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