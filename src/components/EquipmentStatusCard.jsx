import React from 'react'

const EquipmentStatusCard = ({ 
  name, 
  isActive, 
  powerConsumption, 
  icon: Icon, 
  loading = false,
  color = 'blue'
}) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100', 
    blue: 'text-blue-600 bg-blue-100',
    cyan: 'text-cyan-600 bg-cyan-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
  }

  const getDisplayValue = () => {
    if (loading) return 'Loading...'
    
    if (name.toLowerCase().includes('valve')) {
      return isActive ? `Open${powerConsumption > 0 ? ` (${powerConsumption}W)` : ''}` : 'Closed'
    }
    
    return isActive ? `On${powerConsumption > 0 ? ` (${powerConsumption}W)` : ''}` : 'Off'
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-4 border-gray-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-4 rounded-2xl ${colorClasses[color] || colorClasses.blue} shadow-md`}>
            <Icon className="w-10 h-10" />
          </div>
          <div className="ml-5">
            <p className="text-xl font-black text-gray-900 capitalize">
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-lg font-bold text-gray-600 mt-1">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                getDisplayValue()
              )}
            </p>
          </div>
        </div>
        <div className={`px-5 py-3 text-lg font-black rounded-full shadow-sm ${
          isActive && !loading
            ? 'bg-green-200 text-green-900' 
            : 'bg-gray-200 text-gray-700'
        }`}>
          {loading ? '...' : (isActive ? 'ACTIVE' : 'OFF')}
        </div>
      </div>
    </div>
  )
}

export default EquipmentStatusCard