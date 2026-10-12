import React, { useState } from 'react';
import Nav from './components/Nav';
import Main from './components/Main';
import About from './components/About';
import { INITIAL_INSTRUCTIONS } from './data/instructions';
import './App.css';

function App() {
  const [collection] = useState(INITIAL_INSTRUCTIONS);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="App">
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="datano-container">
        {activeTab === 'home' && (
          <Main data={collection} />
        )}

        {activeTab === 'about' && (
          <About onBackToStudio={() => setActiveTab('home')} />
        )}
      </main>
    </div>
  );
}

export default App;