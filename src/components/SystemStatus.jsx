import React from 'react'
import { useQuery } from 'react-query'
import { Server, Wifi, AlertTriangle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const SystemStatus = () => {
  const { data: fanStatus } = useQuery('fanStatus', () => brewnodeAPI.getFanStatus(), { refetchInterval: 5000 })
  const { data: pumpsStatus } = useQuery('pumpsStatus', () => brewnodeAPI.getPumpsStatus(), { refetchInterval: 5000 })
  const { data: valvesStatus } = useQuery('valvesStatus', () => brewnodeAPI.getValvesStatus(), { refetchInterval: 5000 })
  const { data: systemStatus } = useQuery('systemStatus', () => brewnodeAPI.getSystemStatus(), { refetchInterval: 30000 })

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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Server className="w-5 h-5 mr-2 text-gray-600" />
          System Status
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearLogs}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
          
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Server</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hardware Status */}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            systemStatus?.data?.isHardware 
              ? 'bg-green-100' 
              : 'bg-orange-100'
          }`}>
            <Server className={`w-5 h-5 ${
              systemStatus?.data?.isHardware 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Hardware</p>
            <p className={`text-sm ${
              systemStatus?.data?.isHardware 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {systemStatus?.data?.mode || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Wifi className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Connection</p>
            <p className="text-sm text-green-600">Connected</p>
          </div>
        </div>

        {/* System Health */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">System Health</p>
            <p className="text-sm text-green-600">Operational</p>
          </div>
        </div>

        {/* Alert Status */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Alerts</p>
            <p className="text-sm text-yellow-600">0 Active</p>
          </div>
        </div>
      </div>

      {/* Detailed Status */}
      <div className="mt-6 border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Fan Status</h4>
            <p className="text-gray-600">{fanStatus?.data?.status || 'Unknown'}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Pumps Active</h4>
            <p className="text-gray-600">
              {pumpsStatus?.data ? 
                Object.values(pumpsStatus.data).filter(status => status === 'On').length : 0
              } of {pumpsStatus?.data ? Object.keys(pumpsStatus.data).length : 0}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Valves Open</h4>
            <p className="text-gray-600">
              {valvesStatus?.data ? 
                Object.values(valvesStatus.data).filter(status => status === 'Open').length : 0
              } of {valvesStatus?.data ? Object.keys(valvesStatus.data).length : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus