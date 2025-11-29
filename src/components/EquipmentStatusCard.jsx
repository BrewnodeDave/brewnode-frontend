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
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50', 
    blue: 'text-blue-600 bg-blue-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
  }

  const getDisplayValue = () => {
    if (loading) return 'Loading...'
    
    if (name.toLowerCase().includes('valve')) {
      return isActive ? `Open${powerConsumption > 0 ? ` (${powerConsumption}W)` : ''}` : 'Closed'
    }
    
    return isActive ? `On${powerConsumption > 0 ? ` (${powerConsumption}W)` : ''}` : 'Off'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-medium text-gray-900 capitalize">
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-sm text-gray-500">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                getDisplayValue()
              )}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
          isActive && !loading
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {loading ? '...' : (isActive ? 'Active' : 'Inactive')}
        </div>
      </div>
    </div>
  )
}

export default EquipmentStatusCard