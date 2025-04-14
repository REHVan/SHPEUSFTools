import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function UserNavBar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className="flex space-x-4">
                    <li><Link to="/external" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Send Email</Link></li>
                    <li><Link to="/contactdata" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Contact Data</Link></li>
                    <li><Link to="/template" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Email Template</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default UserNavBar;
