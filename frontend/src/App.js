import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './components/Nav';
import Main from './components/Main';
import './App.css';

function App() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/Instructions/';
      const res = await axios.get(apiUrl);
      setCollection(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch instructions:', err);
      setError('Could not connect to DATANO API. Please ensure the Django backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="datano-container">
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="datano-spinner" />
            <p style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Loading DATANO dataset...
            </p>
          </div>
        )}

        {error && (
          <div className="datano-alert datano-alert-warning">
            <h5 className="datano-alert-heading">Connection Notice</h5>
            <p style={{ marginBottom: '12px', fontSize: '14px' }}>{error}</p>
            <button 
              type="button"
              className="datano-btn datano-btn-outline-dark" 
              onClick={fetchInstructions}
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && (
          <Main data={collection} />
        )}
      </main>
    </div>
  );
}

export default App;