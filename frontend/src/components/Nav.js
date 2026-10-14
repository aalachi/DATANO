import React from 'react';

function Nav({ activeTab = 'landing', onTabChange }) {
  const isLanding = activeTab === 'landing';
  
  return (
    <nav className={`navbar ${isLanding ? 'navbar-transparent' : ''}`}>
      <div 
        className="logo" 
        style={{ cursor: 'pointer' }}
        onClick={() => onTabChange && onTabChange('landing')}
      >
        DATANO
      </div>
      <ul className="nav-links">
        <div className="menu">
          <li>
            <a 
              href="#home" 
              className={activeTab === 'landing' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onTabChange && onTabChange('landing');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#demo" 
              className={activeTab === 'studio' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onTabChange && onTabChange('studio');
              }}
            >
              Demo
            </a>
          </li>
          <li>
            <a 
              href="#about"
              className={activeTab === 'about' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onTabChange && onTabChange('about');
              }}
            >
              About
            </a>
          </li>
        </div>
      </ul>

      <div className="nav-actions">
        <a 
          href="https://github.com/aalachi/DATANO" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-github-btn"
        >
          GitHub ↗
        </a>
        {activeTab !== 'studio' ? (
          <button 
            type="button" 
            className="nav-demo-btn"
            onClick={() => onTabChange && onTabChange('studio')}
          >
            Launch Studio ➔
          </button>
        ) : (
          <button 
            type="button" 
            className="nav-demo-btn nav-demo-btn-secondary"
            onClick={() => onTabChange && onTabChange('landing')}
          >
            Home ⌂
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
