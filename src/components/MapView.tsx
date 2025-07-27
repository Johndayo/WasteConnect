import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Package, Users, Zap } from 'lucide-react';
import { mockWasteListings, mockServiceProviders } from '../data/mockData';
import { WasteListing, ServiceProvider } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  showWasteListings?: boolean;
  showServiceProviders?: boolean;
  selectedListing?: WasteListing | null;
  selectedProvider?: ServiceProvider | null;
}

// Custom icons for different marker types
const wasteIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="24" height="24">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const providerIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" width="24" height="24">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H13.5L19 8.5V9H21ZM12 7C14.76 7 17 9.24 17 12S14.76 17 12 17 7 14.76 7 12 9.24 7 12 7ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapController({ selectedListing, selectedProvider }: { selectedListing?: WasteListing | null; selectedProvider?: ServiceProvider | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedListing?.coordinates) {
      map.setView([selectedListing.coordinates.lat, selectedListing.coordinates.lng], 13);
    } else if (selectedProvider?.user.coordinates) {
      map.setView([selectedProvider.user.coordinates.lat, selectedProvider.user.coordinates.lng], 13);
    }
  }, [selectedListing, selectedProvider, map]);

  return null;
}

export default function MapView({ 
  showWasteListings = true, 
  showServiceProviders = true,
  selectedListing = null,
  selectedProvider = null 
}: MapViewProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to San Francisco if geolocation fails
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      // Default location if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      plastic: '#3b82f6',
      metal: '#6b7280',
      electronic: '#8b5cf6',
      organic: '#22c55e',
      paper: '#eab308',
      glass: '#06b6d4',
      textile: '#ec4899',
      construction: '#f97316',
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedListing={selectedListing} selectedProvider={selectedProvider} />

        {/* Waste Listings Markers */}
        {showWasteListings && mockWasteListings.map((listing) => {
          if (!listing.coordinates) return null;
          
          return (
            <Marker
              key={`waste-${listing.id}`}
              position={[listing.coordinates.lat, listing.coordinates.lng]}
              icon={wasteIcon}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Package className="w-3 h-3 mr-1" />
                          <span>{listing.quantity} {listing.unit}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{listing.location}</span>
                        </div>
                        {listing.price && (
                          <div className="text-xs font-semibold text-green-600">
                            ${listing.price}/{listing.unit}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getCategoryColor(listing.category) }}
                        >
                          {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Service Providers Markers */}
        {showServiceProviders && mockServiceProviders.map((provider) => {
          if (!provider.user.coordinates) return null;
          
          return (
            <Marker
              key={`provider-${provider.id}`}
              position={[provider.user.coordinates.lat, provider.user.coordinates.lng]}
              icon={providerIcon}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {provider.user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {provider.user.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {provider.user.company}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{provider.user.location}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{provider.capacity}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Zap className="w-3 h-3 mr-1" />
                          <span>Rating: {provider.user.rating}/5</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {provider.services.slice(0, 2).map((service, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}