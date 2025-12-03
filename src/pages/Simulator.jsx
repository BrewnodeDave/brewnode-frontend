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

  const { data: systemStatus } = useQuery(
    'systemStatus',
    () => brewnodeAPI.getSystemStatus(),
    { refetchInterval: 30000 }
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900">Simulator Controls</h1>
        <div className="flex items-center space-x-3 text-xl font-bold text-gray-600">
          <Settings className="w-8 h-8" />
          <span>Hardware Simulation Settings</span>
        </div>
      </div>

      {/* Simulation Status */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
        <h2 className="text-2xl font-black mb-6 flex items-center">
          <Gauge className="w-8 h-8 mr-3 text-blue-600" />
          Current Simulation Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
            <Clock className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <p className="text-base font-bold text-gray-700">Speed Factor</p>
            <p className="text-3xl font-black text-blue-900">
              {currentSpeed?.data?.factor || '--'}x
            </p>
          </div>
          
          <div className={`text-center p-6 rounded-2xl border-2 ${
            systemStatus?.data?.isSimulation ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
          }`}>
            <Play className={`w-12 h-12 mx-auto mb-3 ${
              systemStatus?.data?.isSimulation ? 'text-green-600' : 'text-gray-400'
            }`} />
            <p className="text-base font-bold text-gray-700">Simulation Mode</p>
            <p className="text-xl font-black text-green-900">
              {systemStatus?.data?.isSimulation ? 'Active' : 'Inactive'}
            </p>
          </div>
          
          <div className={`text-center p-6 rounded-2xl border-2 ${
            systemStatus?.data?.isHardware ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
          }`}>
            <Zap className={`w-12 h-12 mx-auto mb-3 ${
              systemStatus?.data?.isHardware ? 'text-green-600' : 'text-orange-600'
            }`} />
            <p className="text-base font-bold text-gray-700">Hardware Status</p>
            <p className={`text-xl font-black ${
              systemStatus?.data?.isHardware ? 'text-green-900' : 'text-orange-900'
            }`}>
              {systemStatus?.data?.mode || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kettle Volume Control */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
          <div className="px-8 py-6 border-b-2 border-gray-200">
            <h3 className="text-2xl font-black flex items-center">
              <Droplets className="w-8 h-8 mr-3 text-blue-600" />
              Kettle Volume Control
            </h3>
          </div>
          
          <div className="p-8 space-y-6">
            <form onSubmit={handleVolumeSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Volume (Litres)
                </label>
                <input
                  type="number"
                  value={kettleVolume}
                  onChange={(e) => setKettleVolume(e.target.value)}
                  className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl text-xl font-bold focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
                  placeholder="25"
                  min="1"
                  max="49"
                />
                <p className="text-sm font-bold text-gray-600 mt-2">
                  Range: 1-49 litres
                </p>
              </div>
              
              <button
                type="submit"
                disabled={volumeMutation.isLoading}
                className={`w-full py-5 px-6 rounded-xl text-xl font-black transition-all shadow-lg ${
                  volumeMutation.isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                }`}
              >
                {volumeMutation.isLoading ? 'Setting Volume...' : 'Set Kettle Volume'}
              </button>
            </form>

            {/* Preset Volume Buttons */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Quick Presets:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {presetVolumes.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => volumeMutation.mutate(preset.value)}
                    disabled={volumeMutation.isLoading}
                    className="px-4 py-4 text-base font-bold bg-gray-100 hover:bg-gray-200 hover:scale-105 text-gray-800 rounded-xl disabled:opacity-50 transition-all shadow-md border-2 border-gray-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Speed Factor Control */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
          <div className="px-8 py-6 border-b-2 border-gray-200">
            <h3 className="text-2xl font-black flex items-center">
              <Clock className="w-8 h-8 mr-3 text-orange-600" />
              Simulation Speed
            </h3>
          </div>
          
          <div className="p-8 space-y-6">
            <form onSubmit={handleSpeedSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Speed Factor
                </label>
                <input
                  type="number"
                  value={speedFactor}
                  onChange={(e) => setSpeedFactor(e.target.value)}
                  className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl text-xl font-bold focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
                  placeholder="10"
                  min="1"
                  max="100"
                />
                <p className="text-sm font-bold text-gray-600 mt-2">
                  Range: 1-100x (higher = faster simulation)
                </p>
              </div>
              
              <button
                type="submit"
                disabled={speedMutation.isLoading}
                className={`w-full py-5 px-6 rounded-xl text-xl font-black transition-all shadow-lg ${
                  speedMutation.isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105'
                }`}
              >
                {speedMutation.isLoading ? 'Setting Speed...' : 'Set Speed Factor'}
              </button>
            </form>

            {/* Preset Speed Buttons */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Speed Presets:
              </label>
              <div className="space-y-3">
                {presetSpeeds.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => speedMutation.mutate(preset.value)}
                    disabled={speedMutation.isLoading}
                    className="w-full p-5 text-left bg-gray-100 hover:bg-gray-200 hover:scale-105 text-gray-800 rounded-xl disabled:opacity-50 transition-all shadow-md border-2 border-gray-200"
                  >
                    <div className="text-lg font-black">{preset.label}</div>
                    <div className="text-base font-bold text-gray-600">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b-2 border-gray-200">
          <h3 className="text-2xl font-black flex items-center">
            <Info className="w-8 h-8 mr-3 text-gray-600" />
            Simulation Information
          </h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h4 className="text-lg font-black text-blue-900 mb-3">About Hardware Simulation</h4>
            <p className="text-base font-bold text-blue-800">
              When not running on a Raspberry Pi with physical brewing hardware, 
              all brewing processes are simulated. This allows the software to be 
              tested and debugged on any platform without requiring actual brewing equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-black text-gray-900 mb-3">Kettle Volume</h4>
              <ul className="text-base font-bold text-gray-700 space-y-2">
                <li>• Simulates vessel liquid levels</li>
                <li>• Required for accurate transfer simulation</li>
                <li>• Prevents heating empty vessels</li>
                <li>• Affects process timing calculations</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black text-gray-900 mb-3">Speed Factor</h4>
              <ul className="text-base font-bold text-gray-700 space-y-2">
                <li>• Accelerates time-based processes</li>
                <li>• 10x default for reasonable testing</li>
                <li>• Higher values for rapid iteration</li>
                <li>• Does not affect safety checks</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-3 border-yellow-300 rounded-2xl p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-black text-yellow-900">Important Notes</h4>
                <ul className="text-base font-bold text-yellow-800 mt-2 space-y-2">
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