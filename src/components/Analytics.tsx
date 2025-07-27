import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Leaf, Zap, Users, Package, Award } from 'lucide-react';
import { mockAnalytics } from '../data/mockData';

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Analytics() {
  const stats = [
    {
      title: 'Total Waste Processed',
      value: `${mockAnalytics.totalWasteProcessed.toLocaleString()} kg`,
      change: `+${mockAnalytics.monthlyGrowth}%`,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'CO₂ Emissions Saved',
      value: `${mockAnalytics.co2Saved} tons`,
      change: '+12.3%',
      icon: Leaf,
      color: 'bg-green-500',
    },
    {
      title: 'Active Connections',
      value: mockAnalytics.activeConnections.toString(),
      change: '+8.7%',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Energy Saved',
      value: `${mockAnalytics.environmentalImpact.energySaved.toLocaleString()} kWh`,
      change: '+15.2%',
      icon: Zap,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your environmental impact and business performance</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>All time</option>
          </select>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Export Report
          </button>
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
                <TrendingUp className="w-4 h-4 ml-1" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="waste" stroke="#22c55e" strokeWidth={2} name="Waste (kg)" />
              <Line type="monotone" dataKey="co2" stroke="#3b82f6" strokeWidth={2} name="CO₂ Saved (tons)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Waste by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Waste by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockAnalytics.wasteByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {mockAnalytics.wasteByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Impact */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Environmental Impact</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Trees Equivalent</h3>
                  <p className="text-sm text-gray-600">CO₂ absorption equivalent</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.environmentalImpact.treesEquivalent.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Energy Saved</h3>
                  <p className="text-sm text-gray-600">Kilowatt hours</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {mockAnalytics.environmentalImpact.energySaved.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Landfill Diverted</h3>
                  <p className="text-sm text-gray-600">Kilograms</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {mockAnalytics.environmentalImpact.landfillDiverted.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Service Providers</h2>
          <div className="space-y-4">
            {mockAnalytics.topProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{provider.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{provider.projects}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mockAnalytics.monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="waste" fill="#22c55e" name="Waste Processed (kg)" />
            <Bar dataKey="connections" fill="#3b82f6" name="New Connections" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}