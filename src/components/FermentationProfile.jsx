import React, { useState } from 'react'
import { Plus, Minus, Thermometer, Calendar } from 'lucide-react'

const FermentationProfile = ({ onClose, onSubmit }) => {
  const [steps, setSteps] = useState([
    { tempC: 18, days: 7 }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit.mutate(steps)
    onClose()
  }

  const addStep = () => {
    setSteps([...steps, { tempC: 20, days: 3 }])
  }

  const updateStep = (index, field, value) => {
    const newSteps = [...steps]
    newSteps[index][field] = parseInt(value)
    setSteps(newSteps)
  }

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const presetProfiles = {
    'Ale Primary': [{ tempC: 18, days: 7 }],
    'Lager Primary': [{ tempC: 10, days: 14 }],
    'Two-Stage Ale': [
      { tempC: 18, days: 4 }, // Primary
      { tempC: 20, days: 3 }  // Diacetyl rest
    ],
    'Lager Full': [
      { tempC: 10, days: 14 }, // Primary
      { tempC: 18, days: 2 },  // Diacetyl rest
      { tempC: 2, days: 21 }   // Lagering
    ]
  }

  const loadPreset = (presetName) => {
    setSteps([...presetProfiles[presetName]])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Thermometer className="w-6 h-6 mr-2 text-green-600" />
              Fermentation Profile
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets:</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(presetProfiles).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fermentation Steps */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Fermentation Steps:</label>
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-600 w-12">
                    Step {index + 1}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <input
                      type="number"
                      value={step.tempC}
                      onChange={(e) => updateStep(index, 'tempC', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="0"
                      max="100"
                      required
                    />
                    <span className="text-sm text-gray-500">°C</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <input
                      type="number"
                      value={step.days}
                      onChange={(e) => updateStep(index, 'days', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="0"
                      max="30"
                      required
                    />
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addStep}
              className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 rounded-lg flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fermentation Step
            </button>

            {/* Summary */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">Profile Summary:</h4>
              <div className="text-sm text-green-800">
                <p>Total steps: {steps.length}</p>
                <p>Total time: {steps.reduce((sum, step) => sum + step.days, 0)} days</p>
                <p>Temperature range: {Math.min(...steps.map(s => s.tempC))}°C - {Math.max(...steps.map(s => s.tempC))}°C</p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={onSubmit.isLoading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {onSubmit.isLoading ? 'Starting Fermentation...' : 'Start Fermentation'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FermentationProfile