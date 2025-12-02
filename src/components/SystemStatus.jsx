import React from 'react'
import { useQuery } from 'react-query'
import { Server, Wifi, AlertTriangle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const SystemStatus = ({ sensorData: propSensorData }) => {
  const { data: querySensorData, isLoading: sensorLoading, error: sensorError } = useQuery('sensorStatus', () => brewnodeAPI.getSensorStatus(), { refetchInterval: 2000 })
  
  // Use prop data if available, otherwise use query data
  const sensorData = propSensorData || querySensorData
  const { data: systemStatus } = useQuery('systemStatus', () => brewnodeAPI.getSystemStatus(), { refetchInterval: 30000 })

  // Debug logging
  console.log('SystemStatus sensorData:', sensorData, 'loading:', sensorLoading, 'error:', sensorError)
  if (sensorData?.data) {
    console.log('Sensor data array:', sensorData.data)
    console.log('Array.isArray check:', Array.isArray(sensorData.data))
    console.log('Data type:', typeof sensorData.data)
    console.log('Kettle heater power:', sensorData.data.kettleHeaterPower, 'from array[12]:', sensorData.data._rawArray?.[12])
    console.log('Parsed sensor keys:', Object.keys(sensorData.data).filter(k => !k.startsWith('_')))
  }

  const handleRestart = async () => {
    if (window.confirm('Are you sure you want to restart the server?')) {
      try {
        await brewnodeAPI.restart()
      } catch (error) {
        console.error('Failed to restart server:', error)
      }
    }
  }

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to delete all log files?')) {
      try {
        await brewnodeAPI.deleteLogs()
      } catch (error) {
        console.error('Failed to delete logs:', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black flex items-center">
          <Server className="w-8 h-8 mr-3 text-gray-600" />
          System Status
        </h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearLogs}
            className="flex items-center space-x-2 px-4 py-3 text-base font-bold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all shadow-md hover:scale-105"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear Logs</span>
          </button>
          
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 px-4 py-3 text-base font-bold bg-red-200 hover:bg-red-300 text-red-800 rounded-xl transition-all shadow-md hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Restart Server</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Hardware Status */}
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-xl shadow-md ${
            systemStatus?.data?.isHardware 
              ? 'bg-green-200' 
              : 'bg-orange-200'
          }`}>
            <Server className={`w-10 h-10 ${
              systemStatus?.data?.isHardware 
                ? 'text-green-700' 
                : 'text-orange-700'
            }`} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Hardware</p>
            <p className={`text-lg font-black ${
              systemStatus?.data?.isHardware 
                ? 'text-green-700' 
                : 'text-orange-700'
            }`}>
              {systemStatus?.data?.mode || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-green-200 rounded-xl shadow-md">
            <Wifi className="w-8 h-8 text-green-700" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Connection</p>
            <p className="text-lg font-black text-green-700">Connected</p>
          </div>
        </div>

        {/* System Health */}
        <div className="flex items-center space-x-5">
          <div className="p-5 bg-green-200 rounded-2xl shadow-md">
            <CheckCircle className="w-10 h-10 text-green-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">System Health</p>
            <p className="text-xl font-black text-green-700">Operational</p>
          </div>
        </div>

        {/* Alert Status */}
        <div className="flex items-center space-x-5">
          <div className="p-5 bg-yellow-200 rounded-2xl shadow-md">
            <AlertTriangle className="w-10 h-10 text-yellow-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Alerts</p>
            <p className="text-xl font-black text-yellow-700">0 Active</p>
          </div>
        </div>
      </div>

      {/* Detailed Status */}
      <div className="mt-8 border-t-2 pt-6 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
          <div>
            <h4 className="text-xl font-black text-gray-900 mb-3">Fan Status</h4>
            <p className="text-lg font-bold text-gray-700">{(() => {
                if (sensorLoading) return 'Loading...'
                if (sensorError) return 'Error'
                if (!sensorData?.data) return 'No Sensor Data'
                
                // Use the enhanced fanPower from our fixed API parsing
                const fanPower = sensorData.data.fanPower || 0
                return fanPower > 0 ? `On (${fanPower}W)` : 'Off (0W)'
              })()}
            </p>
          </div>
          
          <div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Pumps Active</h4>
            <p className="text-xl font-bold text-gray-700">{(() => {
                if (sensorLoading) return 'Loading...'
                if (sensorError) return 'Error'
                if (!sensorData?.data) return 'No Sensor Data'
                
                console.log('Processing pumps, sensorData.data:', sensorData.data)
                
                // Handle parsed object format (camelCase keys)
                if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  const pumpKeys = Object.keys(sensorData.data).filter(key => 
                    key.toLowerCase().includes('pump')
                  )
                  console.log('Found pump keys:', pumpKeys)
                  const activePumps = pumpKeys.filter(key => (sensorData.data[key] || 0) > 0)
                  const totalPumpPower = pumpKeys.reduce((sum, key) => sum + (sensorData.data[key] || 0), 0)
                  return pumpKeys.length > 0 ? `${activePumps.length} of ${pumpKeys.length} (${totalPumpPower}W)` : 'No Pumps Found'
                }
                
                return 'Invalid Data Format'
              })()}
            </p>
          </div>
          
          <div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Valves Open</h4>
            <p className="text-xl font-bold text-gray-700">{(() => {
                if (sensorLoading) return 'Loading...'
                if (sensorError) return 'Error'
                if (!sensorData?.data) return 'No Sensor Data'
                
                // Handle parsed object format (camelCase keys)
                if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  const valveKeys = Object.keys(sensorData.data).filter(key => 
                    key.toLowerCase().includes('valve')
                  )
                  console.log('Found valve keys:', valveKeys)
                  const openValves = valveKeys.filter(key => (sensorData.data[key] || 0) > 0)
                  const totalValvePower = valveKeys.reduce((sum, key) => sum + (sensorData.data[key] || 0), 0)
                  return valveKeys.length > 0 ? `${openValves.length} of ${valveKeys.length} (${totalValvePower}W)` : 'No Valves Found'
                }
                
                return 'Invalid Data Format'
              })()}
            </p>
          </div>
        </div>
        
        {/* Total Power Consumption */}
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="text-center">
            <h4 className="text-2xl font-black text-gray-900 mb-4">Total Power Consumption</h4>
            <p className="text-5xl font-black text-brewery-600">{(() => {
                if (sensorLoading) return 'Loading...'
                if (sensorError) return 'Error'
                if (!sensorData?.data) return 'No Data'
                
                let totalPower = 0
                
                if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  // Add fan power
                  totalPower += sensorData.data.fanPower || sensorData.data.fan || 0
                  
                  // Add pump power
                  const pumpKeys = Object.keys(sensorData.data).filter(key => 
                    key.toLowerCase().includes('pump')
                  )
                  pumpKeys.forEach(key => {
                    totalPower += sensorData.data[key] || 0
                  })
                  
                  // Add valve power  
                  const valveKeys = Object.keys(sensorData.data).filter(key => 
                    key.toLowerCase().includes('valve')
                  )
                  valveKeys.forEach(key => {
                    totalPower += sensorData.data[key] || 0
                  })
                  
                  // Add heater power using parsed sensor data
                  totalPower += sensorData.data.glycolHeaterPower || 0
                  totalPower += sensorData.data.glycolChillerPower || 0
                  totalPower += sensorData.data.kettleHeaterPower || 0
                  
                  // Also add any other heater keys that might exist
                  const heaterKeys = Object.keys(sensorData.data).filter(key => 
                    key.toLowerCase().includes('heater') && !key.includes('Power')
                  )
                  heaterKeys.forEach(key => {
                    totalPower += sensorData.data[key] || 0
                  })
                } else if (sensorData.data && typeof sensorData.data === 'object') {
                  // Use parsed power values if available
                  totalPower += sensorData.data.fanPower || 0
                  totalPower += sensorData.data.glycolHeaterPower || 0
                  totalPower += sensorData.data.glycolChillerPower || 0
                  totalPower += sensorData.data.kettleHeaterPower || 0
                  
                  // Fallback to raw array if parsed values not available
                  if (sensorData.data._rawArray && Array.isArray(sensorData.data._rawArray)) {
                    if (!sensorData.data.fanPower) totalPower += sensorData.data._rawArray[9] || 0
                    if (!sensorData.data.glycolHeaterPower) totalPower += sensorData.data._rawArray[10] || 0
                    if (!sensorData.data.glycolChillerPower) totalPower += sensorData.data._rawArray[11] || 0
                    if (!sensorData.data.kettleHeaterPower) totalPower += sensorData.data._rawArray[12] || 0
                  }
                } else if (Array.isArray(sensorData.data)) {
                  // Legacy: direct array access
                  totalPower += sensorData.data[9] || 0   // Fan
                  totalPower += sensorData.data[10] || 0  // Glycol heater
                  totalPower += sensorData.data[11] || 0  // Glycol chiller  
                  totalPower += sensorData.data[12] || 0  // Kettle heater
                  
                  // Pumps and valves from objects in array
                  sensorData.data.forEach(item => {
                    if (item && typeof item === 'object' && item.name && 
                        (item.name.includes('Pump') || item.name.includes('Valve'))) {
                      totalPower += item.value || 0
                    }
                  })
                }
                
                return `${totalPower}W`
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus