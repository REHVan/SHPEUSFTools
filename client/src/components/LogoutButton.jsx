import React from 'react';

function LogoutButton() {
  return (
    <form action="/logout" method="POST">
      <button 
        type="submit" 
        className="bg-blue-500 text-white hover:bg-gray-700 px-3 py-2 rounded" // Use Tailwind classes
      >
        Logout
      </button>
    </form>
  );
}

export default LogoutButton;
