import React from 'react'
import { Activity } from 'lucide-react'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-brewery-200 rounded-full flex items-center justify-center animate-pulse shadow-lg`}>
          <Activity className={`${size === 'small' ? 'w-5 h-5' : size === 'medium' ? 'w-10 h-10' : 'w-16 h-16'} text-brewery-700`} />
        </div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-brewery-600 border-t-transparent rounded-full animate-spin`}></div>
      </div>
      {text && (
        <p className="text-2xl font-bold text-gray-700 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner