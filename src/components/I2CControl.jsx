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
    <div className="space-y-8">
      {/* I2C Control Form */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b-2 border-gray-200">
          <h3 className="text-2xl font-black flex items-center">
            <Zap className="w-8 h-8 mr-3 text-yellow-600" />
            I2C Pin Control
          </h3>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Bit Number
                </label>
                <input
                  type="number"
                  value={bit}
                  onChange={(e) => setBit(e.target.value)}
                  className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl text-xl font-bold focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
                  placeholder="0-4294967295"
                  min="0"
                  max="4294967295"
                  required
                />
                <p className="text-sm font-bold text-gray-600 mt-2">
                  Enter bit position (0x0 to 0xFFFFFFFF)
                </p>
              </div>
              
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  Value
                </label>
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-5 py-4 border-3 border-gray-300 rounded-xl text-xl font-bold focus:ring-4 focus:ring-brewery-400 focus:border-brewery-500 shadow-md"
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
              className={`w-full flex items-center justify-center space-x-3 py-5 px-6 rounded-xl text-xl font-black transition-all shadow-lg ${
                i2cMutation.isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {i2cMutation.isLoading ? (
                <>
                  <div className="w-6 h-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  <span>Setting...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>Set I2C Pin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preset Controls */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b-2 border-gray-200">
          <h3 className="text-2xl font-black flex items-center">
            <RotateCcw className="w-8 h-8 mr-3 text-blue-600" />
            Preset Controls
          </h3>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {presetControls.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePreset(preset)}
                disabled={i2cMutation.isLoading}
                className="p-6 border-3 border-gray-200 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all text-left disabled:opacity-50 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-black text-gray-900">{preset.name}</h4>
                  <span className="text-base font-bold text-gray-600">
                    Bit: {preset.bit}, Val: {preset.value}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-600">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Command History */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b-2 border-gray-200">
          <h3 className="text-2xl font-black flex items-center">
            <Info className="w-8 h-8 mr-3 text-gray-600" />
            Command History
          </h3>
        </div>
        
        <div className="p-8">
          {history.length === 0 ? (
            <p className="text-gray-600 text-center py-6 text-xl font-bold">
              No commands sent yet
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-5 rounded-xl ${
                    entry.success ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-base font-mono font-bold">
                      Bit: {entry.bit}, Value: {entry.value}
                    </span>
                    {!entry.success && (
                      <span className="text-base font-bold text-red-600">
                        Error: {entry.error}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 text-sm font-black rounded-full ${
                      entry.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.success ? 'Success' : 'Failed'}
                    </span>
                    <span className="text-base font-bold text-gray-600">
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
      <div className="bg-yellow-50 border-3 border-yellow-300 rounded-2xl p-6 shadow-md">
        <div className="flex items-start space-x-4">
          <Info className="w-8 h-8 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-black text-yellow-900">Safety Warning</h4>
            <p className="text-base font-bold text-yellow-800 mt-2">
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