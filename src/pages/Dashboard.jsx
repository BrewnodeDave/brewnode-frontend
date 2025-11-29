import React from 'react'
import { useQuery } from 'react-query'
import { 
  Thermometer, 
  Droplets, 
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
    { refetchInterval: 2000 }
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brewery-100 rounded-xl shadow-sm flex items-center justify-center">
            <img src="/logo192.png" alt="Brewnode" className="w-8 h-8 sm:w-10 sm:h-10" onError={(e) => e.target.src = '/brewnode-logo.png'} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Brewnode Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3 text-base sm:text-lg text-gray-500">
          <Clock className="w-6 h-6" />
          <span className="hidden sm:inline">{new Date().toLocaleString()}</span>
          <span className="sm:hidden">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Current Brew Status */}
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center">
          <Beaker className="w-8 h-8 mr-3 text-brewery-600" />
          Current Brew
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-600 mb-2">Recipe</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{currentBrew?.data?.recipeName || 'No active brew'}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-600 mb-2">Status</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{currentBrew?.data?.status || 'System Ready'}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-600 mb-2">Latest Brew</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {brewnames?.data && brewnames.data.length > 0 
                ? brewnames.data[0] 
                : 'No brews found'
              }
            </p>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <SystemStatus sensorData={sensorData} />

      {/* Sensor Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Server className="w-7 h-7 mr-3 text-gray-600" />
            Equipment Status
          </h3>
          <div className="space-y-4">
            {sensorData?.data && (() => {
              const equipmentEntries = Object.entries(sensorData.data);
              const shownEquipment = new Set();
              
              return equipmentEntries.filter(([key, value]) => {
                // Show equipment (pumps, heaters, valves)
                if (key.includes('pump') || key.includes('heater') || 
                    key.includes('valve') || key.includes('In') || key.includes('Out')) {
                  
                  // For valve duplicates, prefer camelCase version over prefixed version
                  if (key.startsWith('valve')) {
                    const camelCaseKey = key.replace('valve', '').charAt(0).toLowerCase() + key.replace('valve', '').slice(1);
                    if (sensorData.data[camelCaseKey] !== undefined) {
                      return false; // Skip prefixed version if camelCase exists
                    }
                  }
                  
                  // Prevent showing the same equipment name twice
                  const normalizedName = key.toLowerCase()
                    .replace('valve', '')
                    .replace(/^(.)/, match => match.toUpperCase())
                    .replace(/([A-Z])/g, ' $1')
                    .trim();
                  
                  if (shownEquipment.has(normalizedName)) {
                    return false;
                  }
                  shownEquipment.add(normalizedName);
                  
                  return true;
                }
                return false;
              }).map(([key, value]) => {
                // Determine if equipment is active/on/open
                let isActive = false;
                let displayValue = 'Off';
                
                if (typeof value === 'number') {
                  isActive = value > 0;
                  if (key.toLowerCase().includes('valve') || key.includes('In') || key.includes('Out')) {
                    displayValue = isActive ? `Open (${value}W)` : 'Closed';
                  } else if (key.includes('pump')) {
                    displayValue = isActive ? `On (${value}W)` : 'Off';
                  } else if (key.includes('heater')) {
                    displayValue = isActive ? `On (${value}W)` : 'Off';
                  }
                } else if (typeof value === 'string') {
                  isActive = value === 'On' || value === 'Open';
                  displayValue = value || 'Off';
                }
                
                return (
                  <div key={key} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                    <span className="text-base font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      isActive
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {displayValue}
                    </span>
                  </div>
                )
              });
            })()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <AlertCircle className="w-7 h-7 mr-3 text-gray-600" />
            Recent Brews
          </h3>
          <div className="space-y-3">
            {brewnames?.data?.slice(0, 5).map((name, index) => (
              <div key={index} className="text-base font-medium text-gray-700 py-3 px-4 bg-gray-50 rounded-lg">
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