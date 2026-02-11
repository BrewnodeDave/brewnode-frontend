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
      <div className="flex items-center flex-1">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue} shadow-md`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-base font-black text-gray-900 capitalize">
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </p>
          <p className="text-sm font-bold text-gray-600 mt-1">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              getDisplayValue()
            )}
          </p>
        </div>
      </div>
      <div className={`px-3 py-2 text-sm font-black rounded-full shadow-sm ml-3 ${
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
        className="bg-white rounded-xl shadow-xl p-4 border-2 border-gray-100 hover:shadow-2xl hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer w-full"
      >
        <div className="flex items-center justify-between">
          <CardContent />
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-gray-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between">
        <CardContent />
      </div>
    </div>
  )
}

export default EquipmentStatusCard