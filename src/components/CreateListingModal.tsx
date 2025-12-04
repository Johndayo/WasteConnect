import React, { useState } from 'react';
import { X, Upload, MapPin, Clock, Package, MessageSquare, Camera } from 'lucide-react';
import { WasteCategory } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: any) => void;
}

export default function CreateListingModal({ isOpen, onClose, onSubmit }: CreateListingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '' as WasteCategory | '',
    images: [] as string[],
    location: '',
    useGPS: false,
    pickupTime: '',
    customDate: '',
    quantity: '',
    instructions: '',
  });

  const wasteCategories = [
    { value: 'plastic' as WasteCategory, label: 'Plastic', icon: '♻️' },
    { value: 'paper' as WasteCategory, label: 'Paper', icon: '📄' },
    { value: 'metal' as WasteCategory, label: 'Metal', icon: '🔩' },
    { value: 'organic' as WasteCategory, label: 'Organic', icon: '🌱' },
    { value: 'electronic' as WasteCategory, label: 'E-waste', icon: '💻' },
    { value: 'other' as WasteCategory, label: 'Mixed waste', icon: '🗂️' },
  ];

  const pickupTimes = [
    { value: 'asap', label: 'ASAP (less than 3 hours)' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'custom', label: 'Choose date/time' },
  ];

  const quantities = [
    { value: 'small', label: 'Small (1 bag)' },
    { value: 'medium', label: 'Medium (2–3 bags)' },
    { value: 'large', label: 'Large (sack or bin)' },
    { value: 'extra-large', label: 'Extra large (bulk/SME)' },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = () => {
    // Simulate image upload with placeholder
    const placeholderImages = [
      'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg',
      'https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg',
    ];
    
    const newImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    setFormData({
      ...formData,
      images: [...formData.images, newImage].slice(0, 3)
    });
  };

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            useGPS: true
          });
        },
        () => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = () => {
    const newListing = {
      id: Date.now().toString(),
      title: `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Waste Pickup`,
      description: formData.instructions || `${formData.category} waste ready for pickup`,
      category: formData.category,
      quantity: getQuantityValue(formData.quantity),
      unit: 'bags',
      location: formData.location,
      images: formData.images.length > 0 ? formData.images : ['https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg'],
      availableFrom: getPickupDate(),
      tags: [formData.category, formData.quantity].filter(Boolean),
      status: 'available' as const,
      environmentalImpact: {
        co2Saved: Math.random() * 2,
        wasteReduced: getQuantityValue(formData.quantity),
      },
    };

    onSubmit(newListing);
    onClose();
    resetForm();
  };

  const getQuantityValue = (quantity: string) => {
    const values = { small: 1, medium: 2.5, large: 5, 'extra-large': 10 };
    return values[quantity as keyof typeof values] || 1;
  };

  const getPickupDate = () => {
    const today = new Date();
    switch (formData.pickupTime) {
      case 'asap':
      case 'today':
        return today;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      case 'custom':
        return formData.customDate ? new Date(formData.customDate) : today;
      default:
        return today;
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      category: '',
      images: [],
      location: '',
      useGPS: false,
      pickupTime: '',
      customDate: '',
      quantity: '',
      instructions: '',
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.category !== '';
      case 2: return true; // Images are optional
      case 3: return formData.location !== '';
      case 4: return formData.pickupTime !== '';
      case 5: return true; // Quantity is optional
      case 6: return true; // Instructions are optional
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Post Waste Pickup</h2>
            <p className="text-sm text-gray-500">Step {currentStep} of 6</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Waste Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                What type of waste do you want to dispose?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {wasteCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setFormData({ ...formData, category: category.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.category === category.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload Photos */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Upload a photo of the waste
                <span className="text-sm text-gray-500 font-normal block">1–3 photos</span>
              </h3>
              
              <div className="space-y-4">
                {/* Upload Area */}
                <div 
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Tap to take photo or upload</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
                </div>

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index)
                          })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your Pickup Location
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleGPSLocation}
                  className="w-full p-4 border-2 border-green-500 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Auto-detect GPS
                </button>
                
                <div className="text-center text-gray-500 font-medium">OR</div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Enter address manually"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value, useGPS: false })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pickup Time */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Preferred Pickup Time
              </h3>
              
              <div className="space-y-3">
                {pickupTimes.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setFormData({ ...formData, pickupTime: time.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.pickupTime === time.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3" />
                      {time.label}
                    </div>
                  </button>
                ))}
                
                {formData.pickupTime === 'custom' && (
                  <div className="mt-4">
                    <input
                      type="datetime-local"
                      value={formData.customDate}
                      onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Quantity */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Estimated Quantity
                <span className="text-sm text-gray-500 font-normal block">Optional</span>
              </h3>
              
              <div className="space-y-3">
                {quantities.map((qty) => (
                  <button
                    key={qty.value}
                    onClick={() => setFormData({ ...formData, quantity: qty.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.quantity === qty.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-3" />
                      {qty.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Instructions */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Special Instructions
                <span className="text-sm text-gray-500 font-normal block">Optional</span>
              </h3>
              
              <div>
                <textarea
                  rows={4}
                  placeholder="Any special instructions for pickup? (e.g., gate code, specific location, handling requirements)"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Pickup Summary:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><strong>Type:</strong> {formData.category}</div>
                  <div><strong>Location:</strong> {formData.location}</div>
                  <div><strong>Time:</strong> {pickupTimes.find(t => t.value === formData.pickupTime)?.label}</div>
                  {formData.quantity && <div><strong>Quantity:</strong> {quantities.find(q => q.value === formData.quantity)?.label}</div>}
                  {formData.images.length > 0 && <div><strong>Photos:</strong> {formData.images.length} uploaded</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Pickup Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}