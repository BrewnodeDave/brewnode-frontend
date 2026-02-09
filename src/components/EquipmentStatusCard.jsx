import React from 'react'

const EquipmentStatusCard = ({ 
  name, 
  isActive, 
  powerConsumption, 
  icon: Icon, 
  loading = false,
  color = 'blue',
  onClick
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

  const CardContent = () => (
    <>
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue} shadow-sm`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="ml-2">
          <p className="text-xs font-black text-gray-900 capitalize">
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-xs font-bold text-gray-600 mt-0.5">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              getDisplayValue()
            )}
          </p>
        </div>
      </div>
      <div className={`px-2 py-1 text-xxs font-black rounded-full shadow-sm ${
        isActive && !loading
          ? 'bg-green-200 text-green-900' 
          : 'bg-gray-200 text-gray-700'
      }`}>
        {loading ? '...' : (isActive ? 'ACTIVE' : 'OFF')}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="bg-white rounded-lg shadow-xl p-2 border border-gray-100 hover:shadow-2xl hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer w-full"
      >
        <div className="flex items-center justify-between">
          <CardContent />
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-2 border border-gray-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between">
        <CardContent />
      </div>
    </div>
  )
}

export default EquipmentStatusCard