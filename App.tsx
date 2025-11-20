import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MockupGenerator } from './components/MockupGenerator';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MOCKUP);

  const renderView = () => {
    switch (currentView) {
      case AppView.MOCKUP:
        return <MockupGenerator />;
      case AppView.EDITOR:
        return <ImageEditor />;
      case AppView.GENERATOR:
        return <ImageGenerator />;
      default:
        return <MockupGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
