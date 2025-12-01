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
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    blue: 'text-blue-600 bg-blue-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    green: 'text-green-600 bg-green-50',
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
      <div className="flex items-center">
        <div className={`p-4 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-10 h-10" />
        </div>
        <div className="ml-6 flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-lg font-medium text-gray-600">{title}</p>
            {showStatusIndicator && (
              <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
                isActive
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {statusText || (isActive ? 'On' : 'Off')}
              </div>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              <>
                {value}
                {unit && <span className="text-lg font-normal text-gray-500 ml-1">{unit}</span>}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SensorStatusCard