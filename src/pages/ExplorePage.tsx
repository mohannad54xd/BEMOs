import { useState, useRef, useEffect } from 'react';
import { TimeSlider } from '../components/TimeSlider';
import { NASAImageService } from '../services/NASAImageService';
import { AnnotationService } from '../services/AnnotationService';
import { AnnotationOverlay } from '../components/AnnotationOverlay';
import { CoordinateSearch } from '../components/CoordinateSearch';
import { testNASAIntegration } from '../utils/testNASAIntegration';
import type { Layer } from '../services/NASAImageService';
import type { Annotation } from '../types/annotation';
// OpenSeadragon is used at runtime
import { ImageViewer } from '../components/ImageViewer';
import { NASAImageService as Service } from '../services/NASAImageService';
import { latLonToWebMercatorPixels, latLonToTrekTileXY } from '../utils/coordinate';
import OpenSeadragon from 'openseadragon';

export const ExplorePage = () => {
  const [selectedBody, setSelectedBody] = useState('earth');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  
  const celestialBodies = NASAImageService.celestialBodies;
  const currentBody = NASAImageService.getCelestialBody(selectedBody);
  const layers = currentBody?.datasets || [];

  // Initialize layer when body changes
  useEffect(() => {
    if (layers.length > 0 && !selectedLayer) {
      setSelectedLayer(layers[0].id);
    }
  }, [selectedBody, layers, selectedLayer]);

  // Load annotations when layer or date changes
  useEffect(() => {
    if (!selectedLayer) return;
    const dateString = selectedDate.toISOString().split('T')[0];
    const layerAnnotations = AnnotationService.getAnnotationsForLayer(selectedLayer, dateString);
    setAnnotations(layerAnnotations);
  }, [selectedLayer, selectedDate]);

  // Update the viewer with new image
  const updateViewer = (date: Date, layer: string) => {
    setSelectedDate(date);
    setSelectedLayer(layer);
  };

  const selectedLayerInfo = layers.find((l: Layer) => l.id === selectedLayer);

  const handleAnnotationAdd = (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnnotation = AnnotationService.addAnnotation({
      ...annotation,
      layerId: selectedLayer,
      date: selectedDate.toISOString().split('T')[0]
    });
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleAnnotationDelete = (id: string) => {
    const success = AnnotationService.deleteAnnotation(id);
    if (success) {
      setAnnotations(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleTestNASA = async () => {
    const results = await testNASAIntegration();
    setTestResults(results);
  };

  const handleCoordinateSearch = (lat: number, lng: number) => {
    if (viewerRef.current) {
      // Convert lat/lng to viewer coordinates and pan to location
      console.log(`Searching for coordinates: ${lat}, ${lng}`);
      const layer = selectedLayerInfo;
      if (!layer) return;

      try {
        // For WebMercator (NASA GIBS) layers we map to pixels at an appropriate zoom level
        if (layer.dataSource === 'NASA GIBS') {
          const zoom = Math.min(layer.maxZoom ?? 8, 8);
          const px = latLonToWebMercatorPixels(lat, lng, zoom);
          // Convert to image coordinates expected by OpenSeadragon: center point in image pixels
          // The viewer's viewport coordinates are fractional; use viewport.imageToViewportCoordinates when available
          const imagePoint = viewerRef.current.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(px.x, px.y));
          viewerRef.current.viewport.panTo(imagePoint);
          viewerRef.current.viewport.applyConstraints();
          return;
        }

        // For Trek/Moon/Mars XYZ tiles (EQ projection), map to tile XY and pan to approximate pixel center
        if (layer.dataSource === 'NASA Trek' || layer.type === 'xyz') {
          const zoom = Math.min(layer.maxZoom ?? 8, 8);
          const tile = latLonToTrekTileXY(lat, lng, zoom);
          const px = (tile.x + 0.5) * 256;
          const py = (tile.y + 0.5) * 256;
          const imagePoint = viewerRef.current.viewport.imageToViewportCoordinates(new OpenSeadragon.Point(px, py));
          viewerRef.current.viewport.panTo(imagePoint);
          viewerRef.current.viewport.applyConstraints();
          return;
        }

        // For plain image layers, pan to center
        viewerRef.current.viewport.panTo(new OpenSeadragon.Point(0.5, 0.5));
        viewerRef.current.viewport.applyConstraints();
      } catch (err) {
        console.warn('Coordinate search failed:', err);
      }
    }
  };

  const handleFeatureSearch = (feature: string) => {
    console.log(`Searching for feature: ${feature}`);
    // Very small local lookup table for demo purposes
    const lookup: Record<string, { lat: number; lng: number }> = {
      'Hurricane': { lat: 25.0, lng: -70.0 },
      'Volcano': { lat: -16.25, lng: -71.5 },
      'Deforestation': { lat: -3.4653, lng: -62.2159 },
      'Ice Sheet': { lat: 82.5, lng: -62.0 },
      'Ocean Current': { lat: 30.0, lng: -40.0 },
      'Olympus Mons': { lat: 18.65, lng: 226.2 }
    };

    const s = lookup[feature];
    if (s && viewerRef.current) {
      // reuse coordinate search pan
      handleCoordinateSearch(s.lat, s.lng);
    }
  };

  return (
  <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
          <h1 className="text-xl md:text-2xl text-white">NASA Space Explorer</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
            {/* Celestial Body Selection */}
            <select 
              value={selectedBody}
              onChange={(e) => {
                const newBody = e.target.value;
                setSelectedBody(newBody);
                setSelectedLayer(''); // Reset layer selection
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:min-w-[150px]"
            >
              {celestialBodies.map((body) => (
                <option key={body.id} value={body.id}>
                  {body.icon} {body.name}
                </option>
              ))}
            </select>
            
            {/* Layer Selection */}
            {layers.length > 0 && (
              <select 
                value={selectedLayer}
                onChange={(e) => {
                  const newLayer = e.target.value;
                  setSelectedLayer(newLayer);
                  updateViewer(selectedDate, newLayer);
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:min-w-[200px]"
              >
                {layers.map((layer: Layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
            )}

            {/* Import Trek Layers button for Moon/Mars */}
            {(selectedBody === 'moon' || selectedBody === 'mars') && (
              <button
                onClick={async () => {
                  const imported = await Service.discoverTrekLayers(selectedBody);
                  Service.addLayersToBody(selectedBody, imported as any);
                  // Force UI to see new layers by updating state
                  setSelectedLayer(prev => prev || (imported[0]?.id ?? ''));
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                Import Trek Layers
              </button>
            )}
            
            <div className="text-xs sm:text-sm text-gray-400 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span>Resolution: {selectedLayerInfo?.resolution}</span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate max-w-[200px] sm:max-w-none">{selectedLayerInfo?.description}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Viewer */}
        <div className="h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] rounded-lg overflow-hidden relative">
          {selectedLayer && (
            <ImageViewer 
              bodyId={selectedBody}
              layerId={selectedLayer}
              date={selectedDate}
              onViewerReady={(viewer) => {
                viewerRef.current = viewer;
              }}
            />
          )}
          
          {/* Coordinate Search */}
          <CoordinateSearch
            onCoordinateSearch={handleCoordinateSearch}
            onFeatureSearch={handleFeatureSearch}
            currentBody={selectedBody}
          />
          
          {/* Annotation Overlay */}
          {viewerRef.current && (
            <AnnotationOverlay
              viewer={viewerRef.current}
              annotations={annotations}
              onAnnotationAdd={handleAnnotationAdd}
              onAnnotationDelete={handleAnnotationDelete}
              isAnnotationMode={isAnnotationMode}
              onAnnotationModeToggle={setIsAnnotationMode}
            />
          )}
        </div>

        {/* Time Slider (only for temporal datasets like Earth/GIBS) */}
        {selectedBody === 'earth' && (
          <div className="mt-4">
            <div className="relative">
              <TimeSlider 
                onDateChange={(date) => updateViewer(date, selectedLayer)}
              />
            </div>
          </div>
        )}

        {/* Annotation Stats */}
        {annotations.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-300">
              📝 {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} for this view
            </div>
          </div>
        )}

        {/* Mobile Instructions */}
        <div className="mt-4 md:hidden p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> Pinch to zoom, drag to pan. Use the annotation mode to mark interesting features!
          </div>
        </div>

        {/* Development Test Button */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div>
                <h3 className="text-white font-semibold mb-2">🧪 Development Tools</h3>
                <button
                  onClick={handleTestNASA}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Test NASA Integration
                </button>
              </div>
              {testResults && (
                <div className="flex-1 bg-gray-900 p-3 rounded-lg">
                  <div className="text-sm text-gray-300">
                    <div className="font-semibold mb-2">Test Results:</div>
                    <div className="space-y-1">
                      <div>✅ Success: {testResults.success ? 'Yes' : 'No'}</div>
                      {testResults.success && (
                        <>
                          <div>🌍 Celestial Bodies: {testResults.celestialBodiesCount}</div>
                          <div>📊 Layers: {testResults.layersCount}</div>
                          <div>🔗 Tile Source Valid: {testResults.tileSourceValid ? 'Yes' : 'No'}</div>
                          <div>📡 Layer Available: {testResults.layerAvailable ? 'Yes' : 'No'}</div>
                          <div>📅 Available Dates: {testResults.availableDatesCount}</div>
                        </>
                      )}
                      {!testResults.success && (
                        <div className="text-red-400">❌ Error: {testResults.error}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};