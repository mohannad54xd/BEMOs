import { useState, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { motion, AnimatePresence } from 'framer-motion';
import type { Annotation } from '../types/annotation';

interface AnnotationOverlayProps {
  viewer: any; // OpenSeadragon viewer
  annotations: Annotation[];
  onAnnotationAdd: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAnnotationDelete: (id: string) => void;
  isAnnotationMode: boolean;
  onAnnotationModeToggle: (enabled: boolean) => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  viewer,
  annotations,
  onAnnotationAdd,
  onAnnotationDelete,
  isAnnotationMode,
  onAnnotationModeToggle
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState<{
    x: number;
    y: number;
    title: string;
    description: string;
  } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Convert viewer coordinates to screen coordinates
  const viewerToScreen = (viewerPoint: { x: number; y: number }) => {
    if (!viewer || !overlayRef.current) return { x: 0, y: 0 };
    
    const containerRect = overlayRef.current.getBoundingClientRect();
    const viewport = viewer.viewport;
    // viewerPoint is stored as image coordinates (pixels). Convert to viewport coords then to screen pixels.
    try {
      const viewportPoint = viewport.imageToViewportCoordinates(new OpenSeadragon.Point(viewerPoint.x, viewerPoint.y));
      return {
        x: (viewportPoint.x * containerRect.width),
        y: (viewportPoint.y * containerRect.height)
      };
    } catch (err) {
      // fallback: try raw multiplication if methods aren't available
      return { x: viewerPoint.x, y: viewerPoint.y } as any;
    }
  };

  // Convert screen coordinates to viewer coordinates
  const screenToViewer = (screenPoint: { x: number; y: number }) => {
    if (!viewer || !overlayRef.current) return { x: 0, y: 0 };
    
    const containerRect = overlayRef.current.getBoundingClientRect();
    const viewport = viewer.viewport;
    const normalizedPoint = {
      x: screenPoint.x / containerRect.width,
      y: screenPoint.y / containerRect.height
    };
    
    return viewport.viewportToImageCoordinates(normalizedPoint);
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (!isAnnotationMode || isCreating) return;

    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const viewerPoint = screenToViewer({ x, y });

    setNewAnnotation({
      x: viewerPoint.x,
      y: viewerPoint.y,
      title: '',
      description: ''
    });
    setIsCreating(true);
  };

  const handleAnnotationSubmit = () => {
    if (!newAnnotation || !newAnnotation.title.trim()) return;

    onAnnotationAdd({
      x: newAnnotation.x,
      y: newAnnotation.y,
      title: newAnnotation.title,
      description: newAnnotation.description,
      type: 'point',
      color: '#3B82F6',
      layerId: '', // Will be set by parent component
      date: new Date().toISOString().split('T')[0]
    });

    setNewAnnotation(null);
    setIsCreating(false);
  };

  const handleAnnotationCancel = () => {
    setNewAnnotation(null);
    setIsCreating(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Annotation Mode Toggle */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => onAnnotationModeToggle(!isAnnotationMode)}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
            isAnnotationMode
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="hidden sm:inline">
            {isAnnotationMode ? '✏️ Annotation Mode' : '📝 Add Annotations'}
          </span>
          <span className="sm:hidden">
            {isAnnotationMode ? '✏️' : '📝'}
          </span>
        </button>
      </div>

      {/* Overlay for click detection */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 ${isAnnotationMode ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={handleOverlayClick}
      />

      {/* Render existing annotations */}
      <AnimatePresence>
        {annotations.map((annotation) => {
            const screenPos = viewerToScreen({ x: annotation.x, y: annotation.y });
            // guard against invalid coordinates which can produce NaN CSS values
            if (!Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y)) {
              // optional: log once for debugging
              // console.debug('Skipping annotation render due to invalid screen coordinates', annotation.id, screenPos);
              return null;
            }

            return (
              <motion.div
                key={annotation.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute pointer-events-auto"
                style={{
                  left: screenPos.x - 10,
                  top: screenPos.y - 10,
                }}
              >
              <div
                className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnnotation === annotation.id
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-blue-500 bg-blue-500 hover:border-blue-400'
                }`}
                onClick={() => setSelectedAnnotation(
                  selectedAnnotation === annotation.id ? null : annotation.id
                )}
              />
              
              {/* Annotation popup */}
              {selectedAnnotation === annotation.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-8 left-0 bg-gray-900 text-white p-4 rounded-lg shadow-xl min-w-[200px] max-w-[300px] z-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-400">{annotation.title}</h3>
                    <button
                      onClick={() => onAnnotationDelete(annotation.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  {annotation.description && (
                    <p className="text-sm text-gray-300 mb-3">{annotation.description}</p>
                  )}
                  <div className="text-xs text-gray-400">
                    {new Date(annotation.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* New annotation form */}
      {isCreating && newAnnotation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-xl z-50 pointer-events-auto w-[90vw] sm:w-auto sm:min-w-[300px] max-w-[400px]"
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Add Annotation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={newAnnotation.title}
                onChange={(e) => setNewAnnotation({
                  ...newAnnotation,
                  title: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter annotation title"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newAnnotation.description}
                onChange={(e) => setNewAnnotation({
                  ...newAnnotation,
                  description: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                placeholder="Enter annotation description (optional)"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAnnotationSubmit}
                disabled={!newAnnotation.title.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Annotation
              </button>
              <button
                onClick={handleAnnotationCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Annotation mode instructions */}
      {isAnnotationMode && !isCreating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 bg-blue-900/80 text-blue-100 p-3 rounded-lg text-sm pointer-events-auto"
        >
          Click anywhere on the image to add an annotation
        </motion.div>
      )}
    </div>
  );
};
