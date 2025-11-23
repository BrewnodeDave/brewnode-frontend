import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <img 
          src="/logo192.svg" 
          alt="Brewnode" 
          className={`${sizeClasses[size]} animate-pulse`}
        />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-brewery-600 border-t-transparent rounded-full animate-spin`}></div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner