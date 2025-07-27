import React, { useState } from 'react';
import { Recycle, Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'listings', label: 'Waste Listings' },
    { id: 'providers', label: 'Service Providers' },
    { id: 'connections', label: 'My Connections' },
    { id: 'messaging', label: 'Messages' },
  ];

  const notifications = [
    { id: 1, title: 'New connection request', message: 'GreenCycle Solutions wants to process your HDPE waste', time: '2h ago', unread: true },
    { id: 2, title: 'Listing approved', message: 'Your electronic components listing is now live', time: '4h ago', unread: true },
    { id: 3, title: 'Project completed', message: 'Organic waste biogas conversion finished', time: '1d ago', unread: false },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
              <Recycle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden xs:block sm:block">
              <h1 className="text-sm sm:text-xl font-bold text-gray-900">WasteConnect</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Circular Economy Platform</p>
            </div>
            <div className="block xs:hidden">
              <h1 className="text-sm font-bold text-gray-900">WC</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  currentView === item.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 transition-colors relative"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        E
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">EcoTech Manufacturing</h3>
                        <p className="text-xs text-gray-600">Waste Generator</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      <span onClick={() => onViewChange('profile')}>View Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      Billing
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      Help & Support
                    </button>
                    <hr className="my-2" />
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-3 sm:px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentView === item.id
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        ></div>
      )}
    </header>
  );
}