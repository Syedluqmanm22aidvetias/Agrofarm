import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer
} from 'recharts';
import { Download, Droplets, Thermometer, Wind, RefreshCw, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard: React.FC = () => {
  const { analysisResult } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisResult) {
      navigate('/input');
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { soilData, weatherData, recommendations } = analysisResult;

  // Data preparation for charts
  const nutrientData = [
    { name: 'Nitrogen', value: soilData.nitrogen, max: 200 },
    { name: 'Phosphorus', value: soilData.phosphorus, max: 100 },
    { name: 'Potassium', value: soilData.potassium, max: 300 },
  ];

  // PDF Generation Logic
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); // agro-600 color approx
    doc.text("AgroSense Crop Analysis Report", 14, 20);
    
    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Location: ${soilData.location}`, 14, 35);

    // Weather Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Weather Conditions", 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Temperature', 'Humidity', 'Rainfall', 'Condition']],
        body: [[
            `${weatherData.temperature}°C`, 
            `${weatherData.humidity}%`, 
            `${weatherData.rainfall}mm`, 
            weatherData.description
        ]],
        theme: 'striped',
        headStyles: { fillColor: [22, 163, 74] }
    });

    // Soil Section
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.text("Soil Parameters", 14, finalY + 15);

    autoTable(doc, {
        startY: finalY + 20,
        head: [['Parameter', 'Value', 'Type']],
        body: [
            ['Soil Type', soilData.soilType, '-'],
            ['pH Level', soilData.ph.toString(), '-'],
            ['Nitrogen (N)', `${soilData.nitrogen}`, 'mg/kg'],
            ['Phosphorus (P)', `${soilData.phosphorus}`, 'mg/kg'],
            ['Potassium (K)', `${soilData.potassium}`, 'mg/kg'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [22, 163, 74] }
    });

    // Recommendations Section
    // @ts-ignore
    const finalY2 = doc.lastAutoTable.finalY;
    doc.text("Top Recommendations", 14, finalY2 + 15);

    const recRows = recommendations.map(rec => [
        rec.crop,
        `${rec.suitabilityScore}%`,
        rec.expectedYield,
        rec.fertilizerAdvice
    ]);

    autoTable(doc, {
        startY: finalY2 + 20,
        head: [['Crop', 'Score', 'Yield', 'Advice']],
        body: recRows,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        columnStyles: {
            0: { fontStyle: 'bold' },
            3: { cellWidth: 80 } // Wider column for advice
        }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Powered by AgroSense AI', 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`AgroSense_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-800">Crop Analysis Dashboard</h1>
           <p className="text-gray-500 text-sm mt-1">
             Results for {soilData.location} • {new Date(analysisResult.analysisTimestamp).toLocaleDateString()}
           </p>
        </div>
        <div className="flex gap-3">
          <Link to="/input" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
            New Analysis
          </Link>
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center gap-2 text-sm font-medium shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      {/* Weather & Soil Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Temp</p>
            <p className="text-xl font-bold text-slate-800">{weatherData.temperature}°C</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Rainfall</p>
            <p className="text-xl font-bold text-slate-800">{weatherData.rainfall}mm</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Soil Type</p>
            <p className="text-xl font-bold text-slate-800">{soilData.soilType}</p>
          </div>
        </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">pH Level</p>
            <p className="text-xl font-bold text-slate-800">{soilData.ph}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Recommendation Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h2 className="text-xl font-bold text-slate-800">Top Crop Recommendations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Crop</th>
                  <th className="px-6 py-4 font-semibold">Suitability</th>
                  <th className="px-6 py-4 font-semibold">Yield</th>
                  <th className="px-6 py-4 font-semibold">Fertilizer Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recommendations.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{rec.crop}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${rec.suitabilityScore > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                          {rec.suitabilityScore}%
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${rec.suitabilityScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`} 
                            style={{ width: `${rec.suitabilityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${rec.expectedYield === 'High' ? 'bg-green-100 text-green-800' : 
                          rec.expectedYield === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {rec.expectedYield}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{rec.fertilizerAdvice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts & Graphs */}
        <div className="space-y-8">
           {/* Nutrient Chart */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Soil Nutrient Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nutrientData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <ReTooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">Measured in mg/kg</p>
           </div>

           {/* Profit Insight */}
           <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg text-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Market Insight</h3>
              </div>
              <p className="text-emerald-50 mb-4 text-sm leading-relaxed">
                {recommendations[0]?.profitEstimator || "Based on current trends, the recommended crops show strong market potential."}
              </p>
              <div className="pt-4 border-t border-white/20">
                <span className="text-xs uppercase tracking-wider text-emerald-200">Rotation Advice</span>
                <p className="font-medium mt-1">{recommendations[0]?.rotationAdvice}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;