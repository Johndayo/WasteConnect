import React from 'react';
import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WasteListings from './components/WasteListings';
import ServiceProviders from './components/ServiceProviders';
import Connections from './components/Connections';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'listings':
        return <WasteListings />;
      case 'providers':
        return <ServiceProviders />;
      case 'connections':
        return <Connections />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
