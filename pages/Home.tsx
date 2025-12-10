import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, TrendingUp, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1625246333195-098e47972279?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-500/20 text-agro-300 border border-agro-500/30 text-xs font-semibold uppercase tracking-wider mb-6">
              AI-Powered Agriculture
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Smart Farming <br />
              <span className="text-agro-400">Starts Here</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Optimize your crop yields with real-time soil analysis and weather-based recommendations. 
              Join the future of sustainable agriculture today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/input" 
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-agro-600 hover:bg-agro-700 transition-all shadow-lg hover:shadow-agro-500/30"
              >
                Start Crop Recommendation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex justify-center items-center px-8 py-4 border border-gray-600 text-base font-semibold rounded-lg text-gray-200 hover:bg-white/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">Why Choose AgroSense?</h2>
            <p className="text-gray-600">We combine advanced agronomy with cutting-edge machine learning to provide actionable insights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sun className="h-8 w-8 text-amber-500" />}
              title="Weather Integration"
              description="Real-time weather data analysis to ensure your crops thrive in current conditions."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-agro-600" />}
              title="Soil Health Analysis"
              description="Detailed feedback on NPK levels and pH balance to optimize fertilizer usage."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
              title="Yield Prediction"
              description="AI-driven forecasts to estimate potential yield categories and market suitability."
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-agro-50 border-t border-agro-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to optimize your farm?</h2>
            <Link to="/input" className="text-agro-600 font-semibold hover:text-agro-700 underline underline-offset-4">
              Try the recommendation engine now &rarr;
            </Link>
         </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Home;