import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Award, Briefcase, MessageCircle, Phone } from 'lucide-react';
import { mockServiceProviders } from '../data/mockData';
import { User } from '../types';

export default function ServiceProviders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<User['type'] | 'all'>('all');

  const providerTypes = [
    { value: 'all' as const, label: 'All Providers' },
    { value: 'recycler' as const, label: 'Recyclers' },
    { value: 'upcycler' as const, label: 'Upcyclers' },
    { value: 'energy_expert' as const, label: 'Energy Experts' },
  ];

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || provider.user.type === selectedType;
    return matchesSearch && matchesType;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
          <p className="text-gray-600">Connect with verified recyclers, upcyclers, and energy experts</p>
        </div>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Become a Provider
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search providers or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as User['type'] | 'all')}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
            >
              {providerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {provider.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{provider.user.name}</h3>
                    <p className="text-gray-600">{provider.user.company}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{provider.user.rating}</span>
                      {provider.user.verified && (
                        <Award className="w-4 h-4 text-green-500 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(provider.user.type)}`}>
                  {getTypeLabel(provider.user.type)}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{provider.user.location}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Services */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Capacity</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{provider.capacity}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {provider.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-green-500" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Portfolio Preview */}
              {provider.portfolio.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {provider.portfolio.slice(0, 2).map((item) => (
                      <div key={item.id} className="relative rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                          <div className="p-3 text-white">
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </button>
                <button className="px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all provider types.</p>
        </div>
      )}
    </div>
  );
}