import React from 'react'

function internalNav() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <div className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center">
        Pairing
      </div>
      <div className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center">
        Points
      </div>
      <div className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center">
        Task
      </div>
    </div>  )
}

export default internalNav