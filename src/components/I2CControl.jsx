import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { Zap, Send, RotateCcw, Info } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const I2CControl = () => {
  const [bit, setBit] = useState('')
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])

  const i2cMutation = useMutation(
    ({ bit, value }) => brewnodeAPI.setI2C(bit, value),
    {
      onSuccess: (data, variables) => {
        setHistory(prev => [
          {
            bit: variables.bit,
            value: variables.value,
            timestamp: new Date().toLocaleTimeString(),
            success: true
          },
          ...prev.slice(0, 9) // Keep last 10 entries
        ])
        setBit('')
        setValue('')
      },
      onError: (error, variables) => {
        setHistory(prev => [
          {
            bit: variables.bit,
            value: variables.value,
            timestamp: new Date().toLocaleTimeString(),
            success: false,
            error: error.message
          },
          ...prev.slice(0, 9)
        ])
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const bitNum = parseInt(bit)
    const val = parseInt(value)
    
    if (isNaN(bitNum) || isNaN(val) || val < 0 || val > 1) {
      alert('Please enter valid bit number and value (0 or 1)')
      return
    }
    
    i2cMutation.mutate({ bit: bitNum, value: val })
  }

  const presetControls = [
    { name: 'All Off', bit: 0, value: 0, description: 'Turn off all I2C outputs' },
    { name: 'Reset', bit: 0xFFFFFFFF, value: 0, description: 'Reset all bits' },
    { name: 'Test Bit 1', bit: 1, value: 1, description: 'Test individual bit control' },
    { name: 'Test Bit 2', bit: 2, value: 1, description: 'Test individual bit control' },
  ]

  const handlePreset = (preset) => {
    if (window.confirm(`Execute preset: ${preset.name}?`)) {
      i2cMutation.mutate({ bit: preset.bit, value: preset.value })
    }
  }

  return (
    <div className="space-y-6">
      {/* I2C Control Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            I2C Pin Control
          </h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bit Number
                </label>
                <input
                  type="number"
                  value={bit}
                  onChange={(e) => setBit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brewery-500 focus:border-brewery-500"
                  placeholder="0-4294967295"
                  min="0"
                  max="4294967295"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter bit position (0x0 to 0xFFFFFFFF)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brewery-500 focus:border-brewery-500"
                  required
                >
                  <option value="">Select value...</option>
                  <option value="0">0 (Low/Off)</option>
                  <option value="1">1 (High/On)</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={i2cMutation.isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                i2cMutation.isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {i2cMutation.isLoading ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Setting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Set I2C Pin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preset Controls */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <RotateCcw className="w-5 h-5 mr-2 text-blue-600" />
            Preset Controls
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetControls.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePreset(preset)}
                disabled={i2cMutation.isLoading}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{preset.name}</h4>
                  <span className="text-sm text-gray-500">
                    Bit: {preset.bit}, Val: {preset.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Command History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <Info className="w-5 h-5 mr-2 text-gray-600" />
            Command History
          </h3>
        </div>
        
        <div className="p-6">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No commands sent yet
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.success ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono">
                      Bit: {entry.bit}, Value: {entry.value}
                    </span>
                    {!entry.success && (
                      <span className="text-sm text-red-600">
                        Error: {entry.error}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      entry.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.success ? 'Success' : 'Failed'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Safety Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Safety Warning</h4>
            <p className="text-sm text-yellow-700 mt-1">
              I2C pin control directly manipulates hardware. Incorrect usage may damage equipment 
              or cause unexpected behavior. Only use if you understand the hardware configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default I2CControl