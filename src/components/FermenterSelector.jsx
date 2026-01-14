import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Beaker, AlertCircle, Check } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const FermenterSelector = () => {
  const queryClient = useQueryClient()
  const [selectedFermenter, setSelectedFermenter] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch current active fermenter
  const { data: activeFermenterData, isLoading } = useQuery(
    'activeFermenter',
    brewnodeAPI.getActiveFermenter,
    {
      refetchInterval: 5000,
      onSuccess: (data) => {
        if (data?.data?.activeFermenter) {
          setSelectedFermenter(data.data.activeFermenter)
        }
      }
    }
  )

  // Mutation to set active fermenter
  const setActiveFermenterMutation = useMutation(
    (vessel) => brewnodeAPI.setActiveFermenter(vessel),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('activeFermenter')
        queryClient.invalidateQueries('sensorStatus')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
      onError: (error) => {
        console.error('Failed to set active fermenter:', error)
      }
    }
  )

  const handleFermenterChange = (vessel) => {
    if (vessel !== selectedFermenter) {
      setActiveFermenterMutation.mutate(vessel)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 relative">
      {showSuccess && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span className="text-sm font-semibold">Fermenter Updated</span>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6">
        <Beaker className="w-8 h-8 text-purple-600" />
        <h3 className="text-2xl font-black text-gray-800">Active Fermenter</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Select which fermenter is currently active for temperature monitoring and control
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* UniTank Option */}
          <button
            onClick={() => handleFermenterChange('UNI')}
            disabled={setActiveFermenterMutation.isLoading}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-200
              ${selectedFermenter === 'UNI'
                ? 'border-purple-600 bg-purple-50 shadow-lg transform scale-105'
                : 'border-gray-300 bg-white hover:border-purple-400 hover:shadow-md'
              }
              ${setActiveFermenterMutation.isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {selectedFermenter === 'UNI' && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col items-center gap-3">
              <Beaker className={`w-12 h-12 ${
                selectedFermenter === 'UNI' ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  selectedFermenter === 'UNI' ? 'text-purple-900' : 'text-gray-700'
                }`}>
                  UniTank
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Temp UniTank sensor
                </div>
              </div>
            </div>
          </button>

          {/* SS Brewtech Option */}
          <button
            onClick={() => handleFermenterChange('SS')}
            disabled={setActiveFermenterMutation.isLoading}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-200
              ${selectedFermenter === 'SS'
                ? 'border-blue-600 bg-blue-50 shadow-lg transform scale-105'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
              }
              ${setActiveFermenterMutation.isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {selectedFermenter === 'SS' && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col items-center gap-3">
              <Beaker className={`w-12 h-12 ${
                selectedFermenter === 'SS' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  selectedFermenter === 'SS' ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  SS Brewtech
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Temp SS sensor
                </div>
              </div>
            </div>
          </button>
        </div>

        {setActiveFermenterMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <div className="font-semibold mb-1">Failed to update fermenter</div>
              <div className="text-red-600">
                {setActiveFermenterMutation.error?.response?.data?.error || 
                 'An error occurred while updating the active fermenter'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FermenterSelector
