import React from 'react';
import { TrendingUp, Users, Package, Zap, ArrowUpRight, Star } from 'lucide-react';
import { mockWasteListings, mockServiceProviders, mockConnections } from '../data/mockData';

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Listings',
      value: mockWasteListings.length.toString(),
      change: '+12%',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Service Providers',
      value: mockServiceProviders.length.toString(),
      change: '+8%',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Connections Made',
      value: mockConnections.length.toString(),
      change: '+24%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'CO₂ Saved',
      value: '2.4T',
      change: '+15%',
      icon: Zap,
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'connection',
      title: 'New connection request',
      description: 'GreenCycle Solutions wants to process your HDPE waste',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'listing',
      title: 'Listing approved',
      description: 'Your electronic components listing is now live',
      time: '4 hours ago',
      status: 'success',
    },
    {
      id: '3',
      type: 'completion',
      title: 'Project completed',
      description: 'Organic waste biogas conversion finished successfully',
      time: '1 day ago',
      status: 'success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to WasteConnect
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Connect with recyclers, upcyclers, and green energy experts to transform waste into valuable resources.
            Together, we're building a circular economy.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Post New Listing
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Find Providers
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                {stat.change}
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Service Providers</h2>
          <div className="space-y-4">
            {mockServiceProviders.slice(0, 3).map((provider) => (
              <div key={provider.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {provider.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{provider.user.name}</h3>
                  <p className="text-sm text-gray-600">{provider.services[0]}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{provider.user.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{provider.capacity}</p>
                  <p className="text-xs text-gray-500">Capacity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}