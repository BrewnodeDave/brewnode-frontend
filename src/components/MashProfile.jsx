import React, { useState } from 'react'
import { Plus, Minus, Thermometer, Clock } from 'lucide-react'

const MashProfile = ({ onClose, onSubmit }) => {
  const [steps, setSteps] = useState([
    { tempC: 65, mins: 60 }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit.mutate(steps)
    onClose()
  }

  const addStep = () => {
    setSteps([...steps, { tempC: 72, mins: 30 }])
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
    'Single Infusion': [{ tempC: 65, mins: 60 }],
    'Step Mash': [
      { tempC: 52, mins: 15 }, // Protein rest
      { tempC: 63, mins: 45 }, // Beta amylase
      { tempC: 72, mins: 30 }  // Alpha amylase
    ],
    'Decoction': [
      { tempC: 52, mins: 20 },
      { tempC: 63, mins: 40 },
      { tempC: 72, mins: 30 },
      { tempC: 78, mins: 10 }  // Mash out
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
              <Thermometer className="w-6 h-6 mr-2 text-orange-600" />
              Mash Profile
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
            {/* Mash Steps */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Mash Steps:</label>
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
                    <Clock className="w-4 h-4 text-blue-500" />
                    <input
                      type="number"
                      value={step.mins}
                      onChange={(e) => updateStep(index, 'mins', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="0"
                      max="100"
                      required
                    />
                    <span className="text-sm text-gray-500">mins</span>
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
              Add Mash Step
            </button>

            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Profile Summary:</h4>
              <div className="text-sm text-blue-800">
                <p>Total steps: {steps.length}</p>
                <p>Total time: {steps.reduce((sum, step) => sum + step.mins, 0)} minutes</p>
                <p>Temperature range: {Math.min(...steps.map(s => s.tempC))}°C - {Math.max(...steps.map(s => s.tempC))}°C</p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={onSubmit.isLoading}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium"
              >
                {onSubmit.isLoading ? 'Starting Mash...' : 'Start Mash'}
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

export default MashProfile