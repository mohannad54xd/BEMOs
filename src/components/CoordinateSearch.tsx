import { useState } from 'react';
import { motion } from 'framer-motion';

interface CoordinateSearchProps {
  onCoordinateSearch: (lat: number, lng: number) => void;
  onFeatureSearch: (feature: string) => void;
  currentBody: string;
}

export const CoordinateSearch: React.FC<CoordinateSearchProps> = ({
  onCoordinateSearch,
  onFeatureSearch,
  currentBody
}) => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [feature, setFeature] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCoordinateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onCoordinateSearch(lat, lng);
    }
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feature.trim()) {
      onFeatureSearch(feature.trim());
    }
  };

  const getBodySpecificFeatures = () => {
    switch (currentBody) {
      case 'earth':
        return ['Hurricane', 'Volcano', 'Deforestation', 'Ice Sheet', 'Desert', 'Ocean Current'];
      case 'moon':
        return ['Crater', 'Mare', 'Highland', 'Rille', 'Mountain', 'Lunar Base'];
      case 'mars':
        return ['Olympus Mons', 'Valles Marineris', 'Polar Ice Cap', 'Dust Storm', 'Rover Landing Site', 'Canyon'];
      case 'andromeda':
        return ['Star Cluster', 'Nebula', 'Galaxy Core', 'Spiral Arm', 'Dark Matter', 'Black Hole'];
      default:
        return [];
    }
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        🔍 Search
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 left-0 bg-gray-900 text-white p-4 rounded-lg shadow-xl min-w-[300px] z-50"
        >
          <div className="space-y-4">
            {/* Coordinate Search */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">📍 Coordinate Search</h3>
              <form onSubmit={handleCoordinateSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={coordinates.lat}
                    onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    step="any"
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={coordinates.lng}
                    onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    step="any"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go to Coordinates
                </button>
              </form>
            </div>

            {/* Feature Search */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-400">🏷️ Feature Search</h3>
              <form onSubmit={handleFeatureSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Search for features..."
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Search Features
                </button>
              </form>
              
              {/* Quick Feature Buttons */}
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">Quick searches:</p>
                <div className="flex flex-wrap gap-2">
                  {getBodySpecificFeatures().map((featureName) => (
                    <button
                      key={featureName}
                      onClick={() => {
                        setFeature(featureName);
                        onFeatureSearch(featureName);
                      }}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
                    >
                      {featureName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
