import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Gauge, 
  Thermometer, 
  Power, 
  Settings,
  Fan,
  Droplets,
  Zap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'
import EquipmentControl from '../components/EquipmentControl'
import SensorMonitor from '../components/SensorMonitor'
import I2CControl from '../components/I2CControl'

const SensorControl = () => {
  const [activeTab, setActiveTab] = useState('sensors')

  const { data: sensorData, isLoading } = useQuery(
    'sensorStatus',
    () => brewnodeAPI.getSensorStatus(),
    { refetchInterval: 2000 }
  )



  const tabs = [
    { id: 'sensors', name: 'Sensors', icon: Thermometer },
    { id: 'equipment', name: 'Equipment', icon: Settings },
    { id: 'i2c', name: 'I2C Control', icon: Zap },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sensors':
        return <SensorMonitor data={sensorData} isLoading={isLoading} />
      case 'equipment':
        return (
          <EquipmentControl 
            sensorData={sensorData}
          />
        )
      case 'i2c':
        return <I2CControl />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Sensor & Equipment Control</h1>
        <div className="flex items-center space-x-3 text-base text-gray-600">
          <Gauge className="w-6 h-6" />
          <span className="hidden sm:inline font-bold">Real-time Monitoring</span>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatusCard
          title="Temperature Sensors"
          value={sensorData?.data ? Object.keys(sensorData.data).filter(k => k.includes('temp')).length : 0}
          icon={Thermometer}
          color="red"
          loading={isLoading}
        />
        <StatusCard
          title="Active Pumps"
          value={(() => {
            if (!sensorData?.data) return 0
            if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
              const pumpKeys = Object.keys(sensorData.data).filter(key => 
                key.toLowerCase().includes('pump')
              )
              return pumpKeys.filter(key => (sensorData.data[key] || 0) > 0).length
            }
            return 0
          })()}
          icon={Droplets}
          color="blue"
          loading={isLoading}
        />
        <StatusCard
          title="Open Valves"
          value={(() => {
            if (!sensorData?.data) return 0
            if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
              const valveKeys = Object.keys(sensorData.data).filter(key => 
                key.toLowerCase().includes('valve')
              )
              return valveKeys.filter(key => (sensorData.data[key] || 0) > 0).length
            }
            return 0
          })()}
          icon={Power}
          color="green"
          loading={isLoading}
        />
        <StatusCard
          title="Fan Status"
          value={(() => {
            if (!sensorData?.data) return 'Loading...'
            
            // Use the enhanced fanPower from our fixed API parsing
            const fanPower = sensorData.data.fanPower || 0
            return fanPower > 0 ? `On (${fanPower}W)` : 'Off (0W)'
          })()}
          icon={Fan}
          color="purple"
          loading={isLoading}
          isText={true}
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-2 border-b-4 font-bold text-lg transition-all
                  ${isActive
                    ? 'border-brewery-500 text-brewery-700 scale-105'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-6 h-6 mr-3" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

const StatusCard = ({ title, value, icon: Icon, color, loading, isText = false }) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className={`p-4 rounded-xl shadow-md ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="ml-4">
          <p className="text-base font-bold text-gray-700 mb-1">{title}</p>
          <p className="text-2xl font-black text-gray-900">
            {loading ? (
              <span className="animate-pulse">--</span>
            ) : (
              isText ? value : value
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SensorControl