import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function UserNavBar() {
  return (
    <nav className="bg-gray-800 w-64 min-h-screen p-4">
      <div className="flex flex-col items-start space-y-6">
        <Link to="/external" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Send Email</Link>
        <Link to="/contactdata" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Contact Data</Link>
        <Link to="/template" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Email Template</Link>
      </div>
    </nav>
  );
}

export default UserNavBar;
