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
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className={`p-4 rounded-xl ${colorClasses[color] || colorClasses.blue} shadow-md`}>
          <Icon className="w-10 h-10" />
        </div>
        <div className="ml-5 flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold text-gray-700">{title}</p>
            {showStatusIndicator && (
              <div className={`px-3 py-1 text-sm font-black rounded-full shadow-sm ${
                isActive
                  ? 'bg-green-200 text-green-900' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {statusText || (isActive ? 'ON' : 'OFF')}
              </div>
            )}
          </div>
          <p className="text-3xl font-black text-gray-900 break-words">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              <>
                {value}
                {unit && <span className="text-xl font-bold text-gray-500 ml-2">{unit}</span>}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SensorStatusCard