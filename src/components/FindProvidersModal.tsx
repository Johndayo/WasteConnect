import React, { useState } from 'react';
import { X, Search, MapPin, Star, Award, MessageCircle, Phone } from 'lucide-react';
import { mockServiceProviders } from '../data/mockData';
import { User } from '../types';

interface FindProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindProvidersModal({ isOpen, onClose }: FindProvidersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<User['type'] | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('');

  const providerTypes = [
    { value: 'all' as const, label: 'All Providers' },
    { value: 'recycler' as const, label: 'Recyclers' },
    { value: 'upcycler' as const, label: 'Upcyclers' },
    { value: 'energy_expert' as const, label: 'Energy Experts' },
  ];

  const locations = [
    'All Locations',
    'San Francisco, CA',
    'Portland, OR',
    'Austin, TX',
    'Denver, CO',
    'Seattle, WA',
    'Los Angeles, CA',
  ];

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || provider.user.type === selectedType;
    const matchesLocation = !selectedLocation || selectedLocation === 'All Locations' || 
                           provider.user.location.includes(selectedLocation.split(',')[0]);
    return matchesSearch && matchesType && matchesLocation;
  });

  const getTypeColor = (type: User['type']) => {
    const colors = {
      recycler: 'bg-blue-100 text-blue-800',
      upcycler: 'bg-purple-100 text-purple-800',
      energy_expert: 'bg-orange-100 text-orange-800',
      generator: 'bg-green-100 text-green-800',
    };
    return colors[type];
  };

  const getTypeLabel = (type: User['type']) => {
    const labels = {
      recycler: 'Recycler',
      upcycler: 'Upcycler',
      energy_expert: 'Energy Expert',
      generator: 'Generator',
    };
    return labels[type];
  };

  const handleContact = (provider: any) => {
    // In a real app, this would open the messaging system or contact form
    alert(`Contacting ${provider.user.name}...`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Find Service Providers</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search providers or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as User['type'] | 'all')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {providerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Provider Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        {provider.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{provider.user.name}</h3>
                        <p className="text-sm text-gray-600">{provider.user.company}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(provider.user.type)}`}>
                      {getTypeLabel(provider.user.type)}
                    </span>
                  </div>

                  {/* Location and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{provider.user.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{provider.user.rating}</span>
                      {provider.user.verified && (
                        <Award className="w-4 h-4 text-green-500 ml-2" />
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 2).map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{provider.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Capacity:</strong> {provider.capacity}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleContact(provider)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact
                    </button>
                    <button className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}