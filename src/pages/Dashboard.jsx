import React from 'react'
import { useQuery } from 'react-query'
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  AlertCircle,
  Clock,
  Server,
  Beaker 
} from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'
import SensorStatusCard from '../components/SensorStatusCard'
import BrewDataChart from '../components/BrewDataChart'
import SystemStatus from '../components/SystemStatus'

const Dashboard = () => {
  const { data: sensorData, isLoading: sensorsLoading } = useQuery(
    'sensorStatus',
    () => brewnodeAPI.getSensorStatus(),
    { refetchInterval: 5000 }
  )

  const { data: currentBrew } = useQuery(
    'currentBrew',
    () => brewnodeAPI.getCurrentBrew(),
    { 
      refetchInterval: 10000,
      retry: false,
      onError: (error) => {
        console.error('getCurrentBrew failed:', error)
        console.log('Error response:', error.response?.data)
      }
    }
  )

  const { data: brewnames } = useQuery(
    'brewnames',
    () => brewnodeAPI.getBrewnames()
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brewery-100 rounded-lg shadow-sm flex items-center justify-center">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-brewery-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Brewnode Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">{new Date().toLocaleString()}</span>
          <span className="sm:hidden">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Current Brew Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Beaker className="w-5 h-5 mr-2 text-brewery-600" />
          Current Brew
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Recipe</p>
            <p className="text-lg font-semibold">{currentBrew?.data?.recipeName || 'No active brew'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold">{currentBrew?.data?.status || 'System Ready'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Latest Brew</p>
            <p className="text-lg font-semibold">
              {brewnames?.data && brewnames.data.length > 0 
                ? brewnames.data[0] 
                : 'No brews found'
              }
            </p>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <SystemStatus />

      {/* Sensor Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SensorStatusCard
          title="Kettle Temperature"
          icon={Thermometer}
          value={sensorData?.data?.tempKettle !== null && sensorData?.data?.tempKettle !== undefined 
            ? sensorData.data.tempKettle.toFixed(1) 
            : sensorData?.data?.tempKettleRaw 
              ? `Error (${sensorData.data.tempKettleRaw.toFixed(1)}°C)` 
              : 'Error'}
          unit={sensorData?.data?.tempKettle !== null && sensorData?.data?.tempKettle !== undefined ? "°C" : ""}
          color="red"
          loading={sensorsLoading}
        />
        <SensorStatusCard
          title="Mash Temperature"
          icon={Thermometer}
          value={sensorData?.data?.tempMash !== null && sensorData?.data?.tempMash !== undefined 
            ? sensorData.data.tempMash.toFixed(1) 
            : sensorData?.data?.tempMashRaw 
              ? `Error (${sensorData.data.tempMashRaw.toFixed(1)}°C)` 
              : 'Error'}
          unit={sensorData?.data?.tempMash !== null && sensorData?.data?.tempMash !== undefined ? "°C" : ""}
          color="orange"
          loading={sensorsLoading}
        />
        <SensorStatusCard
          title="Fermenter Temperature"
          icon={Thermometer}
          value={sensorData?.data?.tempFermenter !== null && sensorData?.data?.tempFermenter !== undefined 
            ? sensorData.data.tempFermenter.toFixed(1) 
            : sensorData?.data?.tempFermenterRaw 
              ? `Error (${sensorData.data.tempFermenterRaw.toFixed(1)}°C)` 
              : 'Error'}
          unit={sensorData?.data?.tempFermenter !== null && sensorData?.data?.tempFermenter !== undefined ? "°C" : ""}
          color="blue"
          loading={sensorsLoading}
        />
        <SensorStatusCard
          title="Glycol Temperature"
          icon={Droplets}
          value={sensorData?.data?.tempGlycol !== null && sensorData?.data?.tempGlycol !== undefined 
            ? sensorData.data.tempGlycol.toFixed(1) 
            : 'Error'}
          unit="°C"
          color="cyan"
          loading={sensorsLoading}
        />
        <SensorStatusCard
          title="Ambient Temperature"
          icon={Thermometer}
          value={sensorData?.data?.tempAmbient !== null && sensorData?.data?.tempAmbient !== undefined 
            ? sensorData.data.tempAmbient.toFixed(1) 
            : 'Error'}
          unit="°C"
          color="green"
          loading={sensorsLoading}
        />
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2 text-gray-600" />
            Equipment Status
          </h3>
          <div className="space-y-3">
            {sensorData?.data && Object.entries(sensorData.data).map(([key, value]) => {
              if (key.includes('pump') || key.includes('heater') || key.includes('valve')) {
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      value === 'On' || value === 'Open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {value || 'Off'}
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
            Recent Brews
          </h3>
          <div className="space-y-2">
            {brewnames?.data?.slice(0, 5).map((name, index) => (
              <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-b-0">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brew Data Chart */}
      <BrewDataChart />
    </div>
  )
}

export default Dashboard