import React from 'react';

function Nav({ activeTab = 'home', onTabChange }) {
  return (
    <nav className="navbar">
      <div className="logo">DATANO</div>
      <ul className="nav-links">
        <div className="menu">
          <li>
            <a 
              id="hom" 
              href="#home" 
              className={activeTab === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onTabChange && onTabChange('home');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              id="abt" 
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
    </nav>
  );
}

export default Nav;
