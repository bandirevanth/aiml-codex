import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ParsedAnalysisResponse, AnalysisSection, AnalysisResultItem, AnalysisChartDataPoint } from '../types';
import { IconMap, getIconByName } from './icons'; // Assuming icons.tsx is created

interface ResultsDisplayProps {
  analysisResult: ParsedAnalysisResponse;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-2 border border-gray-600 rounded shadow-lg text-sm">
        <p className="label text-gray-200">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const renderChart = (chartData: AnalysisChartDataPoint[], chartType?: 'bar' | 'pie') => {
  if (!chartData || chartData.length === 0) return <p className="text-gray-500 text-sm">No chart data available.</p>;

  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            stroke="#4A5568" // bg-gray-700
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Default to bar chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="name" tick={{ fill: '#A0AEC0', fontSize: '0.75rem' }} />
        <YAxis tick={{ fill: '#A0AEC0', fontSize: '0.75rem' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};


const ItemCard: React.FC<{ item: AnalysisResultItem }> = ({ item }) => (
    <div className="bg-gray-700 bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center mb-3">
        <div className="text-purple-400 mr-3 w-10 h-10 flex items-center justify-center flex-shrink-0">
          {getIconByName(item.iconKeyword)}
        </div>
        <h4 className="text-md font-semibold text-gray-100 break-words">{item.name}</h4>
      </div>
      {item.details && (
        <p className="text-xs text-gray-400 mb-1">
          {Array.isArray(item.details) ? item.details.join(', ') : item.details}
        </p>
      )}
      {item.description && (
        <p className="text-sm text-gray-300 flex-grow">{item.description}</p>
      )}
      {item.value !== undefined && (
         <p className="text-xs text-purple-300 mt-auto pt-2">Value/Score: {item.value}</p>
      )}
    </div>
  );


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return <p className="text-center text-gray-400">No analysis results to display.</p>;
  }

  return (
    <div className="space-y-8 w-full">
      <header className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-red-400 mb-2">
          {analysisResult.title || 'Video Analysis Results'}
        </h2>
        {analysisResult.overallSummary && (
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">{analysisResult.overallSummary}</p>
        )}
      </header>

      {analysisResult.sections.map((section, index) => (
        <section key={index} className="p-4 sm:p-6 bg-gray-800 bg-opacity-80 rounded-xl shadow-xl backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-purple-300 mb-4 pb-2 border-b border-gray-700">
            {section.title}
          </h3>
          
          {section.summary && <p className="text-sm text-gray-400 mb-4">{section.summary}</p>}

          {section.items && section.items.length > 0 && (
            <div className={`grid gap-4 ${section.layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {section.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {section.chartData && section.chartData.length > 0 && (
            <div className="mt-6">
              {renderChart(section.chartData, section.chartType)}
            </div>
          )}
          
          {!section.items?.length && !section.chartData?.length && !section.summary && (
            <p className="text-gray-500 text-sm">No specific data for this section.</p>
          )}
        </section>
      ))}
    </div>
  );
};
