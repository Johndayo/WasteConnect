import React, { useState } from 'react';
import { MessageCircle, Clock, CheckCircle, XCircle, Eye, Calendar, DollarSign, User } from 'lucide-react';
import { mockConnections } from '../data/mockData';
import { Connection } from '../types';

export default function Connections() {
  const [selectedStatus, setSelectedStatus] = useState<Connection['status'] | 'all'>('all');

  const statusOptions = [
    { value: 'all' as const, label: 'All Connections' },
    { value: 'pending' as const, label: 'Pending' },
    { value: 'accepted' as const, label: 'Accepted' },
    { value: 'in_progress' as const, label: 'In Progress' },
    { value: 'completed' as const, label: 'Completed' },
  ];

  const filteredConnections = mockConnections.filter(connection => 
    selectedStatus === 'all' || connection.status === selectedStatus
  );

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Connection['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Connection['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Connections</h1>
          <p className="text-gray-600">Manage your waste processing connections and collaborations</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Connection['status'] | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = mockConnections.filter(c => c.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                {getStatusIcon(status.value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connections List */}
      <div className="space-y-4">
        {filteredConnections.map((connection) => (
          <div key={connection.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {connection.provider.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {connection.wasteListing.title}
                    </h3>
                    <p className="text-gray-600">
                      Connection with {connection.provider.user.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connection.status)}`}>
                    {getStatusLabel(connection.status)}
                  </span>
                  {getStatusIcon(connection.status)}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waste Listing Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Waste Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={connection.wasteListing.images[0]}
                        alt={connection.wasteListing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Quantity:</span>
                        <span className="ml-2">{connection.wasteListing.quantity} {connection.wasteListing.unit}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">{connection.wasteListing.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Available from {connection.wasteListing.availableFrom.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider & Connection Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Provider & Proposal</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {connection.provider.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{connection.provider.user.name}</p>
                        <p className="text-sm text-gray-600">{connection.provider.user.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Services:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {connection.provider.services[0]}
                        </span>
                      </div>
                      
                      {connection.proposedPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Proposed Price:</span>
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {connection.proposedPrice}/{connection.wasteListing.unit}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Message:</p>
                        <p className="text-sm text-gray-900 bg-white p-3 rounded border">
                          {connection.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>Created {connection.createdAt.toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-3">
                  {connection.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Decline
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Accept
                      </button>
                    </>
                  )}
                  
                  {connection.status === 'accepted' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Start Process
                    </button>
                  )}
                  
                  {connection.status === 'in_progress' && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Mark Complete
                    </button>
                  )}
                  
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? 'Start connecting with service providers to see your collaborations here.'
              : `No ${selectedStatus} connections at the moment.`
            }
          </p>
        </div>
      )}
    </div>
  );
}