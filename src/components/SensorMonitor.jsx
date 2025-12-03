import React from 'react'
import { Thermometer, Gauge, AlertCircle } from 'lucide-react'

const SensorMonitor = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse border-2 border-gray-100">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
        <div className="flex items-center justify-center text-gray-600">
          <AlertCircle className="w-10 h-10 mr-3" />
          <span className="text-xl font-bold">No sensor data available</span>
        </div>
      </div>
    )
  }

  // Group sensors by type - data is now flat with camelCase keys
  const temperatures = {}
  const equipment = {}
  const other = {}

  const seenEquipment = new Set();
  
  Object.entries(data.data).forEach(([key, value]) => {
    // Temperature sensors - check if key contains temperature-related terms
    if (key.toLowerCase().includes('temp') || 
        ['glycol', 'kettle', 'fermenter', 'mash', 'ambient'].includes(key)) {
      temperatures[key] = value
    } 
    // Equipment (pumps, valves, heaters) - avoid duplicates
    else if (key.toLowerCase().includes('pump') || 
             key.toLowerCase().includes('valve') || 
             key.toLowerCase().includes('heater') || 
             key.toLowerCase().includes('chiller') || 
             key === 'fan' ||
             ['mashPump', 'kettlePump', 'glycolPump', 'chillerWortOut', 'chillerWortIn', 
              'kettleIn', 'mashIn', 'kettleHeater', 'glycolHeater', 'glycolChiller'].includes(key)) {
      
      // For valve duplicates, prefer camelCase version over prefixed version
      if (key.startsWith('valve')) {
        const camelCaseKey = key.replace('valve', '').charAt(0).toLowerCase() + key.replace('valve', '').slice(1);
        if (data.data[camelCaseKey] !== undefined) {
          return; // Skip prefixed version if camelCase exists
        }
      }
      
      // Prevent showing the same equipment name twice
      const normalizedName = key.toLowerCase()
        .replace('valve', '')
        .replace(/^(.)/, match => match.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim();
      
      if (!seenEquipment.has(normalizedName)) {
        seenEquipment.add(normalizedName);
        equipment[key] = value;
      }
    } 
    // Other sensors (exclude internal fields)
    else if (value !== undefined && value !== null && value !== '' && 
             !key.startsWith('_') && !key.includes('Raw') && 
             typeof value !== 'object') {
      other[key] = value
    }
  })

  return (
    <div className="space-y-8">
      {/* Temperature Sensors */}
      {Object.keys(temperatures).length > 0 && (
        <div>
          <h3 className="text-2xl font-black mb-6 flex items-center">
            <Thermometer className="w-8 h-8 mr-3 text-red-600" />
            Temperature Sensors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(temperatures).map(([key, value]) => (
              <TemperatureCard key={key} name={key} value={value} data={data.data} />
            ))}
          </div>
        </div>
      )}

      {/* Equipment Status */}
      {Object.keys(equipment).length > 0 && (
        <div>
          <h3 className="text-2xl font-black mb-6 flex items-center">
            <Gauge className="w-8 h-8 mr-3 text-gray-600" />
            Equipment Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(equipment).map(([key, value]) => (
              <StatusCard key={key} name={key} value={value} />
            ))}
          </div>
        </div>
      )}




    </div>
  )
}

const TemperatureCard = ({ name, value, data }) => {
  const formatName = (name) => {
    // Convert camelCase to readable names
    const nameMap = {
      glycol: 'Glycol Temperature',
      kettle: 'Kettle Temperature', 
      fermenter: 'Fermenter Temperature',
      mash: 'Mash Temperature',
      ambient: 'Ambient Temperature',
      tempFermenter: 'Fermenter Temperature',
      tempGlycol: 'Glycol Temperature',
      tempKettle: 'Kettle Temperature',
      tempMash: 'Mash Temperature',
      tempAmbient: 'Ambient Temperature'
    }
    return nameMap[name] || name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getTemperatureColor = (temp) => {
    if (temp < 10) return 'text-blue-600'
    if (temp < 25) return 'text-green-600'
    if (temp < 50) return 'text-yellow-600'
    if (temp < 80) return 'text-orange-600'
    return 'text-red-600'
  }

  // Handle null/undefined values (sensor errors)
  const isValidTemp = value !== null && value !== undefined && !isNaN(parseFloat(value))
  const tempValue = isValidTemp ? parseFloat(value) : null
  
  // Get raw sensor value for debugging
  const rawValue = data?.[name + 'Raw']

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-gray-700">{formatName(name)}</h4>
        <Thermometer className={`w-6 h-6 ${
          isValidTemp ? getTemperatureColor(tempValue) : 'text-gray-400'
        }`} />
      </div>
      <div className="flex items-baseline">
        {isValidTemp ? (
          <>
            <span className={`text-3xl font-black ${getTemperatureColor(tempValue)}`}>
              {tempValue.toFixed(1)}
            </span>
            <span className="text-lg text-gray-500 ml-2">°C</span>
          </>
        ) : (
          <div className="flex flex-col">
            <span className="text-3xl font-black text-red-500">Error</span>
            {rawValue !== undefined && (
              <span className="text-sm text-gray-500 mt-1">
                Raw: {rawValue.toFixed(1)}°C
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Temperature range indicator - only show for valid temps */}
      {isValidTemp && (
        <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              tempValue < 10 ? 'bg-blue-500' :
              tempValue < 25 ? 'bg-green-500' :
              tempValue < 50 ? 'bg-yellow-500' :
              tempValue < 80 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, (tempValue / 100) * 100))}%` }}
          />
        </div>
      )}
      
      {/* Error indicator */}
      {!isValidTemp && (
        <div className="mt-3 text-sm font-bold text-red-500">
          Sensor disconnected or faulty
          {rawValue !== undefined && (
            <div className="text-gray-500">
              Check DS18B20 wiring/connection
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const StatusCard = ({ name, value }) => {
  const formatName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getStatusColor = (value) => {
    const numValue = parseFloat(value)
    const val = value?.toString().toLowerCase()
    
    // Handle power consumption values - any non-zero value means "on"
    if (!isNaN(numValue)) {
      return numValue > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }
    
    // Handle text values as fallback
    if (val === 'on' || val === 'open' || val === 'active' || val === 'true') {
      return 'bg-green-100 text-green-800'
    }
    if (val === 'off' || val === 'closed' || val === 'inactive' || val === 'false') {
      return 'bg-gray-100 text-gray-800'
    }
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <h4 className="text-base font-bold text-gray-700 mb-3">{formatName(name)}</h4>
      <div className="flex items-center justify-between">
        <span className={`px-4 py-2 rounded-full text-base font-bold ${getStatusColor(value)}`}>
          {value !== null && value !== undefined 
            ? (() => {
                const numValue = parseFloat(value)
                if (!isNaN(numValue)) {
                  return numValue > 0 ? `On (${numValue}W)` : 'Off'
                }
                return value.toString()
              })()
            : 'Unknown'}
        </span>
        <div className={`w-4 h-4 rounded-full shadow-sm ${
          (() => {
            const numValue = parseFloat(value)
            if (!isNaN(numValue)) {
              return numValue > 0 ? 'bg-green-500' : 'bg-gray-300'
            }
            const val = value?.toString().toLowerCase()
            return (val === 'on' || val === 'open' || val === 'active' || val === 'true')
              ? 'bg-green-500' 
              : 'bg-gray-300'
          })()
        }`} />
      </div>
    </div>
  )
}

const GenericSensorCard = ({ name, value }) => {
  const formatName = (name) => {
    // Special name mappings
    const nameMap = {
      fanPower: 'Fan Power',
      kettleHeaterPower: 'Kettle Heater Power',
      glycolHeaterPower: 'Glycol Heater Power',
      glycolChillerPower: 'Glycol Chiller Power'
    };
    
    if (nameMap[name]) return nameMap[name];
    
    return name
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatValue = (name, value) => {
    // Power values should show watts
    if (name.toLowerCase().includes('power') && typeof value === 'number') {
      return value > 0 ? `${value}W` : '0W';
    }
    
    // Arrays should not be displayed here
    if (Array.isArray(value)) {
      return 'Array Data';
    }
    
    return value !== null && value !== undefined ? value.toString() : '--';
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
      <h4 className="text-base font-bold text-gray-700 mb-3">{formatName(name)}</h4>
      <div className="text-2xl font-black text-gray-900">
        {formatValue(name, value)}
      </div>
    </div>
  )
}

export default SensorMonitor