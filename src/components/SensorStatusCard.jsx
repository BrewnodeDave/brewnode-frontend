 import React from 'react'

const SensorStatusCard = ({ 
  title, 
  icon: Icon, 
  value, 
  unit, 
  color, 
  loading, 
  isActive, 
  statusText, 
  showStatusIndicator = false 
}) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100',
    blue: 'text-blue-600 bg-blue-100',
    cyan: 'text-cyan-600 bg-cyan-100',
    green: 'text-green-600 bg-green-100',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue} shadow-md`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-700 mb-1">{title}</p>
            <p className="text-2xl font-black text-gray-900">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <>
                  {value}
                  {unit && <span className="text-lg font-bold text-gray-500 ml-1">{unit}</span>}
                </>
              )}
            </p>
          </div>
        </div>
        {showStatusIndicator && (
          <div className={`px-3 py-1.5 text-sm font-black rounded-full shadow-sm ml-2 ${
            isActive
              ? 'bg-green-200 text-green-900' 
              : 'bg-gray-200 text-gray-700'
          }`}>
            {statusText || (isActive ? 'ON' : 'OFF')}
          </div>
        )}
      </div>
    </div>
  )
}

export default SensorStatusCard