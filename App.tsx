import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Sprout } from 'lucide-react';
import Home from './pages/Home';
import SoilInput from './pages/SoilInput';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import { AnalysisResult } from './types';

// Global Context for sharing data between Input and Dashboard/Results
interface AppContextType {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
}

const AppContext = createContext<AppContextType>({
  analysisResult: null,
  setAnalysisResult: () => {},
});

export const useApp = () => useContext(AppContext);

// Header Component
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze Soil', path: '/input' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Sprout className="h-8 w-8 text-agro-600" />
              <span className="font-display font-bold text-xl text-slate-800 tracking-tight">AgroSense</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-agro-700 bg-agro-50' 
                    : 'text-gray-600 hover:text-agro-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/input">
                <button className="bg-agro-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-agro-700 transition-all shadow-md hover:shadow-lg">
                Start Analysis
                </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                   isActive(link.path)
                    ? 'text-agro-700 bg-agro-50'
                    : 'text-gray-600 hover:text-agro-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Footer Component
const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-white pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-agro-400" />
            <span className="font-display font-bold text-lg text-white">AgroSense</span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Empowering farmers with AI-driven insights for sustainable, high-yield agriculture. 
            Smart farming starts here.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-agro-400 transition-colors">Home</Link></li>
            <li><Link to="/input" className="hover:text-agro-400 transition-colors">Analyze</Link></li>
            <li><Link to="/dashboard" className="hover:text-agro-400 transition-colors">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-100 mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>mitobiastech@gmail.com</li>
            <li>Erode, Tamil Nadu, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; 2024 AgroSense. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Powered by AI for Sustainable Agriculture <Leaf className="h-3 w-3 text-agro-500" />
        </p>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  return (
    <AppContext.Provider value={{ analysisResult, setAnalysisResult }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/input" element={<SoilInput />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;