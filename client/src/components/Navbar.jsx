// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          <li><Link to="/profile" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
