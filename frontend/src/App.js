import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './components/Nav';
import Main from './components/Main';
import './components/Left.css';
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
      const res = await axios.get('/api/Instructions/');
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
    <>
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container-fluid px-3">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading DATANO dataset...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-warning text-center mx-auto my-4" style={{ maxWidth: '700px' }}>
            <h5 className="alert-heading">Connection Notice</h5>
            <p className="mb-2">{error}</p>
            <button 
              className="btn btn-outline-dark btn-sm" 
              onClick={fetchInstructions}
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && (
          <div className="row">
            <Main data={collection} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;