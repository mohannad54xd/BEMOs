import { NASAImageService } from '../services/NASAImageService';

export const testNASAIntegration = async () => {
  console.log('🧪 Testing NASA Data Integration...');
  
  try {
    // Test 1: Check if celestial bodies are available
    console.log('🌍 Available celestial bodies:', NASAImageService.celestialBodies.length);
    console.log('📂 Bodies:', NASAImageService.celestialBodies.map(b => b.name));
    
    // Test 2: Test tile source generation
    const testDate = new Date();
    const testBody = 'earth';
    const testLayer = NASAImageService.getLayersForBody(testBody)[0]?.id;
    
    if (!testLayer) {
      throw new Error('No layers available for testing');
    }
    
    const tileSource = NASAImageService.getTileSource(testBody, testLayer, testDate);
    
    console.log('🔗 Generated tile source:', {
      url: tileSource.url,
      date: tileSource.date,
      layer: tileSource.layer
    });
    
    // Test 3: Test tile source validation
    console.log('✅ Testing tile source validation...');
    const isValid = await NASAImageService.validateTileSource(tileSource);
    console.log('🎯 Tile source valid:', isValid);
    
    // Test 4: Test layer availability
    console.log('🌍 Testing layer availability...');
    const isAvailable = await NASAImageService.checkLayerAvailability(testBody, testLayer, testDate);
    console.log('📡 Layer available:', isAvailable);
    
    // Test 5: Test available dates
    console.log('📅 Testing available dates...');
    const availableDates = await NASAImageService.getAvailableDates(testLayer);
    console.log('📆 Available dates count:', availableDates.length);
    
    console.log('✅ NASA Integration Test Complete!');
    return {
      success: true,
      celestialBodiesCount: NASAImageService.celestialBodies.length,
      layersCount: NASAImageService.getLayersForBody(testBody).length,
      tileSourceValid: isValid,
      layerAvailable: isAvailable,
      availableDatesCount: availableDates.length
    };
    
  } catch (error) {
    console.error('❌ NASA Integration Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
