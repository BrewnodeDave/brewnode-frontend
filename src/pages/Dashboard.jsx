import React from 'react'
import { useQuery } from 'react-query'
import { 
  Thermometer, 
  Droplets, 
  AlertCircle,
  Clock,
  Server,
  Beaker,
  Fan
} from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'
import SensorStatusCard from '../components/SensorStatusCard'
import EquipmentStatusCard from '../components/EquipmentStatusCard'
import BrewDataChart from '../components/BrewDataChart'
import SystemStatus from '../components/SystemStatus'

const Dashboard = () => {
  const { data: sensorData, isLoading: sensorsLoading, refetch: refetchSensors } = useQuery(
    'sensorStatus',
    () => brewnodeAPI.getSensorStatus(),
    { refetchInterval: 2000 }
  )

  const handleToggleEquipment = async (key, currentValue) => {
    try {
      const isActive = typeof currentValue === 'number' ? currentValue > 0 : (currentValue === 'On' || currentValue === 'Open')
      const newState = isActive ? 'Off' : 'On'
      
      // Map equipment keys to API functions
      const keyLower = key.toLowerCase()
      
      if (keyLower.includes('fan')) {
        await brewnodeAPI.setFan(newState)
      } else if (keyLower.includes('kettlepump') || keyLower.includes('pump') && keyLower.includes('kettle')) {
        await brewnodeAPI.setKettlePump(newState)
      } else if (keyLower.includes('mashpump') || keyLower.includes('pump') && keyLower.includes('mash')) {
        await brewnodeAPI.setMashPump(newState)
      } else if (keyLower.includes('glycolpump') || keyLower.includes('pump') && keyLower.includes('glycol')) {
        await brewnodeAPI.setGlycolPump(newState)
      } else if (keyLower.includes('kettleheater') || keyLower.includes('heat') && !keyLower.includes('glycol')) {
        await brewnodeAPI.setHeat(newState)
      } else if (keyLower.includes('glycolheater') || keyLower.includes('glycol') && keyLower.includes('heat')) {
        await brewnodeAPI.setGlycolHeat(newState)
      } else if (keyLower.includes('glycolchiller') || keyLower.includes('glycol') && keyLower.includes('chill')) {
        await brewnodeAPI.setGlycolChill(newState)
      } else if (keyLower.includes('kettlein') || keyLower.includes('kettle') && keyLower.includes('in')) {
        await brewnodeAPI.setKettleInValve(newState)
      } else if (keyLower.includes('mashin') || keyLower.includes('mash') && keyLower.includes('in')) {
        await brewnodeAPI.setMashInValve(newState)
      } else if (keyLower.includes('chillwortin') || keyLower.includes('chillerwortin')) {
        await brewnodeAPI.setChillWortInValve(newState)
      } else if (keyLower.includes('chillwortout') || keyLower.includes('chillerwortout')) {
        await brewnodeAPI.setChillWortOutValve(newState)
      }
      
      // Refetch sensor data immediately after toggle
      setTimeout(() => refetchSensors(), 500)
    } catch (error) {
      console.error('Failed to toggle equipment:', error)
    }
  }

  const handleToggleFan = async () => {
    try {
      const isActive = (sensorData?.data?.fanPower || 0) > 0
      const newState = isActive ? 'Off' : 'On'
      await brewnodeAPI.setFan(newState)
      setTimeout(() => refetchSensors(), 500)
    } catch (error) {
      console.error('Failed to toggle fan:', error)
    }
  }

  const { data: currentBrew } = useQuery(
    'currentBrew',
    () => brewnodeAPI.getCurrentBrew(),
    { 
      refetchInterval: 10000,
      retry: false,
      onError: (error) => {
        // Silently handle 400 errors (no active brew) - this is expected
        if (error.response?.status !== 400) {
          console.error('getCurrentBrew failed:', error)
        }
      }
    }
  )

  const { data: brewnames } = useQuery(
    'brewnames',
    () => brewnodeAPI.getBrewnames()
  )

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brewery-100 to-brewery-200 rounded-2xl shadow-lg flex items-center justify-center">
            <img src="/logo-40x40.png" alt="Brewnode" className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Brewnode Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4 text-xl text-gray-600">
          <Clock className="w-8 h-8" />
          <span className="hidden sm:inline font-bold">{new Date().toLocaleString()}</span>
          <span className="sm:hidden font-bold">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Current Brew Status */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-brewery-100">
        <h2 className="text-2xl font-black mb-6 flex items-center">
          <Beaker className="w-8 h-8 mr-3 text-brewery-600" />
          Current Brew
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md">
            <p className="text-lg font-bold text-gray-700 mb-2">Recipe</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 break-words overflow-wrap-anywhere">{currentBrew?.data?.name || 'No active brew'}</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md">
            <p className="text-xl font-bold text-gray-700 mb-3">Status</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 break-words">
              {currentBrew?.data ? 'Brewing/Fermenting' : 'System Ready'}
            </p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-md">
            <p className="text-xl font-bold text-gray-700 mb-3">Latest Brew</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 break-words overflow-wrap-anywhere">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

      {/* Fan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EquipmentStatusCard
          name="Fan"
          isActive={(sensorData?.data?.fanPower || 0) > 0}
          powerConsumption={sensorData?.data?.fanPower || 0}
          icon={Fan}
          color="purple"
          loading={sensorsLoading}
          onClick={handleToggleFan}
        />
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-4 border-gray-100">
          <h3 className="text-2xl font-black mb-8 flex items-center">
            <Server className="w-10 h-10 mr-4 text-gray-600" />
            Equipment Status
          </h3>
          <div className="space-y-4">{sensorData?.data && (() => {
              const equipmentEntries = Object.entries(sensorData.data);
              const shownEquipment = new Set();
              
              return equipmentEntries.filter(([key, value]) => {
                // Show equipment (pumps, heaters, valves, fan)
                if (key.includes('pump') || key.includes('heater') || key.includes('fan') ||
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
                  } else if (key.includes('fan')) {
                    displayValue = isActive ? `On (${value}W)` : 'Off';
                  }
                } else if (typeof value === 'string') {
                  isActive = value === 'On' || value === 'Open';
                  displayValue = value || 'Off';
                }
                
                return (
                  <button
                    key={key}
                    onClick={() => handleToggleEquipment(key, value)}
                    className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 active:bg-gray-200 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span className="text-xl font-bold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`px-5 py-3 text-lg font-black rounded-full shadow-sm transition-colors ${
                      isActive
                        ? 'bg-green-200 text-green-900' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {displayValue}
                    </span>
                  </button>
                )
              });
            })()}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-4 border-gray-100">
          <h3 className="text-2xl font-black mb-8 flex items-center">
            <AlertCircle className="w-10 h-10 mr-4 text-gray-600" />
            Recent Brews
          </h3>
          <div className="space-y-4">
            {brewnames?.data?.slice(0, 5).map((name, index) => (
              <div key={index} className="text-xl font-bold text-gray-700 py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm">
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