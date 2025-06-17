import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors duration-200"
          >
            <span className="nav-heading text-xl font-bold">ItemManager</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {/* <Link 
              to="/groups" 
              className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive('/groups') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Groups</span>
            </Link> */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;