import React from 'react'
import { useNavigate } from 'react-router-dom';

function ExternalNav() {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
    <button
      className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
      onClick={() => navigate('/external')}
    >
      Send Emails
    </button>
    <button
      className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
      onClick={() => navigate('/contactdata')}
    >
      User Data
    </button>
    <button
      className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
      onClick={() => navigate('/template')}
    >
      Email Templates
    </button>
  </div>
      )
}

export default ExternalNav