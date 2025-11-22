import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Settings, 
  Play, 
  Gauge, 
  Droplets, 
  Zap,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const Simulator = () => {
  const [kettleVolume, setKettleVolume] = useState('')
  const [speedFactor, setSpeedFactor] = useState('')
  const queryClient = useQueryClient()

  const { data: currentSpeed } = useQuery(
    'simulationSpeed',
    () => brewnodeAPI.getSimulationSpeed(),
    { refetchInterval: 10000 }
  )

  const volumeMutation = useMutation(
    (litres) => brewnodeAPI.setKettleVolume(litres),
    {
      onSuccess: () => {
        queryClient.invalidateQueries()
        setKettleVolume('')
      }
    }
  )

  const speedMutation = useMutation(
    (factor) => brewnodeAPI.setSimulationSpeed(factor),
    {
      onSuccess: () => {
        queryClient.invalidateQueries()
        setSpeedFactor('')
      }
    }
  )

  const handleVolumeSubmit = (e) => {
    e.preventDefault()
    const litres = parseFloat(kettleVolume)
    if (litres >= 1 && litres <= 49) {
      volumeMutation.mutate(litres)
    }
  }

  const handleSpeedSubmit = (e) => {
    e.preventDefault()
    const factor = parseInt(speedFactor)
    if (factor >= 1 && factor <= 100) {
      speedMutation.mutate(factor)
    }
  }

  const presetVolumes = [
    { label: '20L (Small Batch)', value: 20 },
    { label: '25L (Standard)', value: 25 },
    { label: '30L (Large Batch)', value: 30 },
    { label: '40L (Maximum)', value: 40 }
  ]

  const presetSpeeds = [
    { label: '1x (Real Time)', value: 1, description: 'Normal brewing speed' },
    { label: '10x (Default)', value: 10, description: 'Good for testing' },
    { label: '50x (Fast)', value: 50, description: 'Rapid simulation' },
    { label: '100x (Maximum)', value: 100, description: 'Instant processes' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Simulator Controls</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Settings className="w-4 h-4" />
          <span>Hardware Simulation Settings</span>
        </div>
      </div>

      {/* Simulation Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Gauge className="w-5 h-5 mr-2 text-blue-600" />
          Current Simulation Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Speed Factor</p>
            <p className="text-2xl font-bold text-blue-900">
              {currentSpeed?.data?.factor || '--'}x
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Play className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-gray-600">Simulation Mode</p>
            <p className="text-lg font-semibold text-green-900">Active</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Hardware</p>
            <p className="text-lg font-semibold text-purple-900">Simulated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kettle Volume Control */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-600" />
              Kettle Volume Control
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <form onSubmit={handleVolumeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume (Litres)
                </label>
                <input
                  type="number"
                  value={kettleVolume}
                  onChange={(e) => setKettleVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brewery-500 focus:border-brewery-500"
                  placeholder="25"
                  min="1"
                  max="49"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: 1-49 litres
                </p>
              </div>
              
              <button
                type="submit"
                disabled={volumeMutation.isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  volumeMutation.isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {volumeMutation.isLoading ? 'Setting Volume...' : 'Set Kettle Volume'}
              </button>
            </form>

            {/* Preset Volume Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presetVolumes.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => volumeMutation.mutate(preset.value)}
                    disabled={volumeMutation.isLoading}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Speed Factor Control */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Simulation Speed
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            <form onSubmit={handleSpeedSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed Factor
                </label>
                <input
                  type="number"
                  value={speedFactor}
                  onChange={(e) => setSpeedFactor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brewery-500 focus:border-brewery-500"
                  placeholder="10"
                  min="1"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: 1-100x (higher = faster simulation)
                </p>
              </div>
              
              <button
                type="submit"
                disabled={speedMutation.isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  speedMutation.isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {speedMutation.isLoading ? 'Setting Speed...' : 'Set Speed Factor'}
              </button>
            </form>

            {/* Preset Speed Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed Presets:
              </label>
              <div className="space-y-2">
                {presetSpeeds.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => speedMutation.mutate(preset.value)}
                    disabled={speedMutation.isLoading}
                    className="w-full p-3 text-left bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-sm text-gray-600">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <Info className="w-5 h-5 mr-2 text-gray-600" />
            Simulation Information
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">About Hardware Simulation</h4>
            <p className="text-sm text-blue-800">
              When not running on a Raspberry Pi with physical brewing hardware, 
              all brewing processes are simulated. This allows the software to be 
              tested and debugged on any platform without requiring actual brewing equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Kettle Volume</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Simulates vessel liquid levels</li>
                <li>• Required for accurate transfer simulation</li>
                <li>• Prevents heating empty vessels</li>
                <li>• Affects process timing calculations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Speed Factor</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accelerates time-based processes</li>
                <li>• 10x default for reasonable testing</li>
                <li>• Higher values for rapid iteration</li>
                <li>• Does not affect safety checks</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Notes</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Simulation settings only affect virtual hardware behavior</li>
                  <li>• Real hardware operations ignore simulation settings</li>
                  <li>• Always verify settings match your actual equipment capacity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulator