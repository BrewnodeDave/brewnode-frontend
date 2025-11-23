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

  const { data: fanStatus } = useQuery(
    'fanStatus',
    () => brewnodeAPI.getFanStatus(),
    { refetchInterval: 5000 }
  )

  const { data: pumpsStatus } = useQuery(
    'pumpsStatus',
    () => brewnodeAPI.getPumpsStatus(),
    { refetchInterval: 5000 }
  )

  const { data: valvesStatus } = useQuery(
    'valvesStatus',
    () => brewnodeAPI.getValvesStatus(),
    { refetchInterval: 5000 }
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
            fanStatus={fanStatus}
            pumpsStatus={pumpsStatus}
            valvesStatus={valvesStatus}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sensor & Equipment Control</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Gauge className="w-4 h-4" />
          <span>Real-time Monitoring & Control</span>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            // Debug: Check all possible fan-related keys
            const sensorKeys = sensorData?.data ? Object.keys(sensorData.data).filter(k => k.toLowerCase().includes('fan')) : []
            console.log('Fan-related sensor keys:', sensorKeys)
            console.log('Fan value from sensorData:', sensorData?.data?.fan)
            console.log('FanStatus API response:', fanStatus)
            
            const fanValue = sensorData?.data?.fan
            if (fanValue !== null && fanValue !== undefined) {
              const numValue = parseFloat(fanValue)
              if (!isNaN(numValue)) {
                return numValue > 0 ? `On (${numValue}W)` : 'Off'
              }
            }
            return fanStatus?.data?.status || 'Unknown'
          })()}
          icon={Fan}
          color="purple"
          loading={!fanStatus && isLoading}
          isText={true}
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-brewery-500 text-brewery-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
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
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">
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