import React, { useState } from 'react';
import Nav from './components/Nav';
import Landing from './components/Landing';
import Main from './components/Main';
import About from './components/About';
import { INITIAL_INSTRUCTIONS } from './data/instructions';
import './App.css';

function App() {
  const [collection] = useState(INITIAL_INSTRUCTIONS);
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="App">
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'landing' && (
        <Landing 
          onLaunchDemo={() => setActiveTab('studio')} 
          onNavigateAbout={() => setActiveTab('about')} 
        />
      )}

      <main className="datano-container">
        {activeTab === 'studio' && (
          <Main data={collection} />
        )}

        {activeTab === 'about' && (
          <About onBackToStudio={() => setActiveTab('studio')} />
        )}
      </main>
    </div>
  );
}

export default App;