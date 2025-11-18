import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Tag, Eye, MessageCircle, Map } from 'lucide-react';
import { mockWasteListings } from '../data/mockData';
import { WasteCategory } from '../types';
import MapView from './MapView';
import CreateListingModal from './CreateListingModal';

export default function WasteListings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | 'all'>('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateListing, setShowCreateListing] = useState(false);

  const categories: { value: WasteCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'metal', label: 'Metal' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'organic', label: 'Organic' },
    { value: 'paper', label: 'Paper' },
    { value: 'glass', label: 'Glass' },
    { value: 'textile', label: 'Textile' },
    { value: 'construction', label: 'Construction' },
  ];

  const filteredListings = mockWasteListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: WasteCategory) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800',
      metal: 'bg-gray-100 text-gray-800',
      electronic: 'bg-purple-100 text-purple-800',
      organic: 'bg-green-100 text-green-800',
      paper: 'bg-yellow-100 text-yellow-800',
      glass: 'bg-cyan-100 text-cyan-800',
      textile: 'bg-pink-100 text-pink-800',
      construction: 'bg-orange-100 text-orange-800',
      hazardous: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  const handleCreateListing = (newListing: any) => {
    // In a real app, this would save to the backend
    console.log('New listing created:', newListing);
    // You could add it to mockWasteListings or trigger a refresh
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waste Listings</h1>
          <p className="text-gray-600">Discover available waste materials for recycling and upcycling</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCreateListing(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Post New Listing
          </button>
        </div>
        <button 
          onClick={() => setShowMap(!showMap)}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
            showMap 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Map className="w-4 h-4 mr-2" />
          {showMap ? 'Hide Map' : 'Show Map'}
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
              placeholder="Search waste listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as WasteCategory | 'all')}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Listings Map</h2>
          <MapView 
            showWasteListings={true} 
            showServiceProviders={false}
            selectedListing={selectedListing}
          />
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div 
            key={listing.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedListing(listing)}
          >
            {/* Image */}
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
                  {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                </span>
              </div>
              {listing.price && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${listing.price}/{listing.unit}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  <span>{listing.quantity} {listing.unit}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Available from {listing.availableFrom.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Generator Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {listing.generator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{listing.generator.name}</p>
                    <p className="text-xs text-gray-500">Verified Generator</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
        </div>
      )}

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
        onSubmit={handleCreateListing}
      />
    </div>
  );
}