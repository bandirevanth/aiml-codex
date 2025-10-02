import React, { useState } from 'react';
import { Building2, Target, Heart, Users, AlertTriangle, Search } from 'lucide-react';
import { BrandProfile } from '../types';
import { BRAND_INDUSTRIES, BRAND_VALUES, SAMPLE_COMPETITORS } from '../constants';

interface BrandProfileSetupProps {
  onProfileComplete: (profile: BrandProfile) => void;
}

export const BrandProfileSetup: React.FC<BrandProfileSetupProps> = ({ onProfileComplete }) => {
  const [profile, setProfile] = useState<Partial<BrandProfile>>({
    brandName: '',
    industry: '',
    targetAudience: '',
    brandValues: [],
    competitorBrands: [],
    monitoringKeywords: [],
    alertThresholds: {
      sentiment: 0.3,
      mentions: 10,
      engagement: 5
    }
  });

  const [customCompetitor, setCustomCompetitor] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onProfileComplete(profile as BrandProfile);
    }
  };

  const isFormValid = () => {
    return profile.brandName && 
           profile.industry && 
           profile.targetAudience && 
           profile.brandValues && profile.brandValues.length > 0 &&
           profile.monitoringKeywords && profile.monitoringKeywords.length > 0;
  };

  const toggleBrandValue = (value: string) => {
    const currentValues = profile.brandValues || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setProfile({ ...profile, brandValues: newValues });
  };

  const addCompetitor = () => {
    if (customCompetitor.trim()) {
      const currentCompetitors = profile.competitorBrands || [];
      setProfile({
        ...profile,
        competitorBrands: [...currentCompetitors, customCompetitor.trim()]
      });
      setCustomCompetitor('');
    }
  };

  const removeCompetitor = (competitor: string) => {
    const currentCompetitors = profile.competitorBrands || [];
    setProfile({
      ...profile,
      competitorBrands: currentCompetitors.filter(c => c !== competitor)
    });
  };

  const addKeyword = () => {
    if (customKeyword.trim()) {
      const currentKeywords = profile.monitoringKeywords || [];
      setProfile({
        ...profile,
        monitoringKeywords: [...currentKeywords, customKeyword.trim()]
      });
      setCustomKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const currentKeywords = profile.monitoringKeywords || [];
    setProfile({
      ...profile,
      monitoringKeywords: currentKeywords.filter(k => k !== keyword)
    });
  };

  const addSuggestedCompetitor = (competitor: string) => {
    const currentCompetitors = profile.competitorBrands || [];
    if (!currentCompetitors.includes(competitor)) {
      setProfile({
        ...profile,
        competitorBrands: [...currentCompetitors, competitor]
      });
    }
  };

  const suggestedCompetitors = profile.industry && SAMPLE_COMPETITORS[profile.industry as keyof typeof SAMPLE_COMPETITORS] 
    ? SAMPLE_COMPETITORS[profile.industry as keyof typeof SAMPLE_COMPETITORS] 
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Brand Profile Setup</h2>
        <p className="text-gray-600">Configure your brand monitoring parameters and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Brand Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                value={profile.brandName || ''}
                onChange={(e) => setProfile({ ...profile, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your brand name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={profile.industry || ''}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select industry</option>
                {BRAND_INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <textarea
              value={profile.targetAudience || ''}
              onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your target audience demographics, interests, and characteristics"
              required
            />
          </div>
        </div>

        {/* Brand Values */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Brand Values *</h3>
          </div>
          
          <p className="text-gray-600 mb-4">Select the core values that define your brand</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {BRAND_VALUES.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => toggleBrandValue(value)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  profile.brandValues?.includes(value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Competitors */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Competitor Brands</h3>
          </div>
          
          <p className="text-gray-600 mb-4">Add competitor brands to monitor and compare against</p>
          
          {suggestedCompetitors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Suggested competitors for {profile.industry}:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedCompetitors.map(competitor => (
                  <button
                    key={competitor}
                    type="button"
                    onClick={() => addSuggestedCompetitor(competitor)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                    disabled={profile.competitorBrands?.includes(competitor)}
                  >
                    + {competitor}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customCompetitor}
              onChange={(e) => setCustomCompetitor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add competitor brand"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
            />
            <button
              type="button"
              onClick={addCompetitor}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {profile.competitorBrands && profile.competitorBrands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.competitorBrands.map(competitor => (
                <span
                  key={competitor}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {competitor}
                  <button
                    type="button"
                    onClick={() => removeCompetitor(competitor)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Monitoring Keywords */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Search className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Monitoring Keywords *</h3>
          </div>
          
          <p className="text-gray-600 mb-4">Add keywords and phrases to monitor in video content</p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Add monitoring keyword"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {profile.monitoringKeywords && profile.monitoringKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.monitoringKeywords.map(keyword => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Alert Thresholds */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Alert Thresholds</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentiment Threshold
              </label>
              <input
                type="number"
                min="-1"
                max="1"
                step="0.1"
                value={profile.alertThresholds?.sentiment || 0.3}
                onChange={(e) => setProfile({
                  ...profile,
                  alertThresholds: {
                    ...profile.alertThresholds!,
                    sentiment: parseFloat(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when sentiment drops below this value</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentions Threshold
              </label>
              <input
                type="number"
                min="1"
                value={profile.alertThresholds?.mentions || 10}
                onChange={(e) => setProfile({
                  ...profile,
                  alertThresholds: {
                    ...profile.alertThresholds!,
                    mentions: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when mentions exceed this number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engagement Threshold
              </label>
              <input
                type="number"
                min="1"
                value={profile.alertThresholds?.engagement || 5}
                onChange={(e) => setProfile({
                  ...profile,
                  alertThresholds: {
                    ...profile.alertThresholds!,
                    engagement: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when engagement rate changes significantly</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid()}
            className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Analysis Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
