import React from 'react'

const SensorStatusCard = ({ title, icon: Icon, value, unit, color, loading }) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    blue: 'text-blue-600 bg-blue-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    green: 'text-green-600 bg-green-50',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              <>
                {value}
                {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SensorStatusCard