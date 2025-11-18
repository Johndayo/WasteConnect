import React, { useState } from 'react';
import { User, Star, MapPin, Calendar, Award, Globe, Phone, Mail, Edit3, Save, X } from 'lucide-react';
import { mockUsers } from '../data/mockData';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(mockUsers[0]); // Current user profile

  const [editForm, setEditForm] = useState({
    name: user.name,
    company: user.company || '',
    description: user.description || '',
    website: user.website || '',
    phone: user.phone || '',
    location: user.location,
  });

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      company: user.company || '',
      description: user.description || '',
      website: user.website || '',
      phone: user.phone || '',
      location: user.location,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              
              {!isEditing ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-2">{user.company}</p>
                </>
              ) : (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-semibold"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                    placeholder="Company Name"
                  />
                </div>
              )}

              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-gray-900">{user.rating}</span>
                <span className="text-gray-600">({user.completedProjects} projects)</span>
              </div>

              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {!isEditing ? (
                  <span>{user.location}</span>
                ) : (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                    placeholder="Location"
                  />
                )}
              </div>

              <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {user.joinedDate.toLocaleDateString()}</span>
              </div>

              {user.verified && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Verified Account</span>
                </div>
              )}

              <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user.type.charAt(0).toUpperCase() + user.type.slice(1).replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            {!isEditing ? (
              <p className="text-gray-600 leading-relaxed">
                {user.description || 'No description provided.'}
              </p>
            ) : (
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about your company and services..."
              />
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                {!isEditing ? (
                  <span className="text-gray-600">{user.phone || 'Not provided'}</span>
                ) : (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                {!isEditing ? (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    {user.website || 'Not provided'}
                  </a>
                ) : (
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Website URL"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.completedProjects}</div>
                <div className="text-sm text-gray-600">Completed Projects</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((Date.now() - user.joinedDate.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}