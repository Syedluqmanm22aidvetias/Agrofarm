import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { SoilData, SoilType, WeatherData } from '../types';
import { generateCropRecommendations } from '../services/geminiService';
import { Beaker, CloudRain, MapPin, Loader2, AlertCircle } from 'lucide-react';

const SoilInput: React.FC = () => {
  const navigate = useNavigate();
  const { setAnalysisResult } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [soilData, setSoilData] = useState<SoilData>({
    ph: 6.5,
    nitrogen: 100,
    phosphorus: 40,
    potassium: 150,
    soilType: SoilType.LOAMY,
    location: ''
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSoilData(prev => ({
      ...prev,
      [name]: name === 'soilType' || name === 'location' ? value : parseFloat(value) || 0
    }));
  };

  const simulateWeather = () => {
    // In a real app with API keys, we would fetch from OpenWeatherMap here.
    // For this demo, we generate realistic weather based on randomness + location hint if possible.
    const temps = [22, 24, 28, 30, 32, 18];
    const rain = [0, 5, 20, 100, 2];
    const conds = ['Sunny', 'Cloudy', 'Light Rain', 'Humid'];
    
    setWeatherData({
      temperature: temps[Math.floor(Math.random() * temps.length)],
      humidity: Math.floor(Math.random() * (90 - 40) + 40),
      rainfall: rain[Math.floor(Math.random() * rain.length)],
      description: conds[Math.floor(Math.random() * conds.length)],
      isSimulated: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weatherData) {
      setError("Please fetch weather data first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { recommendations, summary } = await generateCropRecommendations(soilData, weatherData);
      
      setAnalysisResult({
        soilData,
        weatherData,
        recommendations,
        analysisTimestamp: Date.now()
      });

      navigate('/dashboard');
    } catch (err) {
      setError("Failed to generate recommendations. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-display font-bold text-slate-800">Soil Analysis & Input</h1>
        <p className="mt-2 text-gray-600">Enter your soil parameters and local weather details to get AI-powered advice.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location & Weather Section */}
            <div className="bg-agro-50 rounded-xl p-6 border border-agro-100">
              <h3 className="flex items-center text-lg font-semibold text-agro-800 mb-4">
                <CloudRain className="w-5 h-5 mr-2" /> 
                Location & Weather
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location / Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={soilData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. California Central Valley"
                      className="pl-10 w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-2.5 focus:ring-2 focus:ring-agro-500 focus:border-agro-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                   <button
                    type="button"
                    onClick={simulateWeather}
                    className="w-full bg-white border border-agro-300 text-agro-700 font-medium py-2.5 px-4 rounded-lg hover:bg-agro-50 transition-colors flex items-center justify-center gap-2"
                   >
                     {weatherData ? 'Refresh Weather Data' : 'Fetch Local Weather'}
                   </button>
                </div>
              </div>

              {weatherData && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">Temp</span>
                      <span className="text-xl font-bold text-slate-800">{weatherData.temperature}°C</span>
                   </div>
                   <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">Humidity</span>
                      <span className="text-xl font-bold text-slate-800">{weatherData.humidity}%</span>
                   </div>
                   <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">Rainfall</span>
                      <span className="text-xl font-bold text-slate-800">{weatherData.rainfall}mm</span>
                   </div>
                   <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide">Condition</span>
                      <span className="text-base font-semibold text-agro-600">{weatherData.description}</span>
                   </div>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Soil Parameters Section */}
            <div>
               <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-6">
                <Beaker className="w-5 h-5 mr-2 text-agro-600" /> 
                Soil Parameters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                  <select
                    name="soilType"
                    value={soilData.soilType}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white border p-2.5 focus:ring-2 focus:ring-agro-500 outline-none"
                  >
                    {Object.values(SoilType).map((type) => (
                      <option key={type} value={type} className="bg-slate-800 text-white">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soil pH Level (0-14)</label>
                  <input
                    type="number"
                    name="ph"
                    step="0.1"
                    min="0"
                    max="14"
                    value={soilData.ph}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-2.5 focus:ring-2 focus:ring-agro-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N) mg/kg</label>
                  <input
                    type="number"
                    name="nitrogen"
                    value={soilData.nitrogen}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-2.5 focus:ring-2 focus:ring-agro-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (P) mg/kg</label>
                  <input
                    type="number"
                    name="phosphorus"
                    value={soilData.phosphorus}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-2.5 focus:ring-2 focus:ring-agro-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (K) mg/kg</label>
                  <input
                    type="number"
                    name="potassium"
                    value={soilData.potassium}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-slate-800 border-slate-700 text-white placeholder-gray-400 border p-2.5 focus:ring-2 focus:ring-agro-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading || !weatherData}
                className={`
                  flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all shadow-lg
                  ${loading || !weatherData 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-agro-600 to-teal-600 hover:from-agro-700 hover:to-teal-700 hover:shadow-agro-500/40'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Soil Data...
                  </>
                ) : (
                  'Generate Recommendation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoilInput;