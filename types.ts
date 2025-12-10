export enum SoilType {
  CLAY = 'Clay',
  SANDY = 'Sandy',
  LOAMY = 'Loamy',
  RED = 'Red',
  BLACK = 'Black'
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilType: SoilType;
  location: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number; // in mm
  description: string;
  isSimulated: boolean;
}

export interface CropRecommendation {
  crop: string;
  suitabilityScore: number;
  fertilizerAdvice: string;
  expectedYield: 'Low' | 'Medium' | 'High';
  profitEstimator: string;
  rotationAdvice: string;
}

export interface AnalysisResult {
  soilData: SoilData;
  weatherData: WeatherData;
  recommendations: CropRecommendation[];
  analysisTimestamp: number;
}