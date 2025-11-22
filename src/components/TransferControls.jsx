import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { ArrowRight, Timer } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const TransferControls = ({ onClose }) => {
  const queryClient = useQueryClient()

  const transfers = [
    {
      id: 'k2m',
      name: 'Kettle → Mash Tun',
      description: 'Transfer contents from kettle to mash tun',
      icon: '🔥→🌾',
      handler: useMutation(
        (timeout) => brewnodeAPI.k2m(timeout),
        { onSuccess: () => queryClient.invalidateQueries() }
      )
    },
    {
      id: 'm2k',
      name: 'Mash Tun → Kettle',
      description: 'Transfer wort from mash tun back to kettle',
      icon: '🌾→🔥',
      handler: useMutation(
        (timeout) => brewnodeAPI.m2k(timeout),
        { onSuccess: () => queryClient.invalidateQueries() }
      )
    },
    {
      id: 'k2f',
      name: 'Kettle → Fermenter',
      description: 'Transfer cooled wort to fermenter',
      icon: '🔥→🧪',
      handler: useMutation(
        (timeout) => brewnodeAPI.k2f(timeout),
        { onSuccess: () => queryClient.invalidateQueries() }
      )
    }
  ]

  const handleTransfer = (transfer, timeout = 5) => {
    if (window.confirm(`Start transfer: ${transfer.name}?\n\nThis will activate pumps and valves automatically.`)) {
      transfer.handler.mutate(timeout)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <ArrowRight className="w-6 h-6 mr-2 text-purple-600" />
              Transfer Controls
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <div className="space-y-4">
            {transfers.map((transfer) => (
              <TransferCard 
                key={transfer.id}
                transfer={transfer}
                onStart={handleTransfer}
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
              <Timer className="w-4 h-4 mr-2" />
              Transfer Safety
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transfers include automatic flow timeout protection</li>
              <li>• Pumps and valves are controlled automatically</li>
              <li>• Monitor progress through sensor readings</li>
              <li>• Emergency stop available through pump controls</li>
            </ul>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TransferCard = ({ transfer, onStart }) => {
  const isLoading = transfer.handler.isLoading

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{transfer.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{transfer.name}</h4>
              <p className="text-sm text-gray-600">{transfer.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <label className="text-xs text-gray-500">Flow Timeout</label>
            <select
              disabled={isLoading}
              className="block w-20 text-sm border border-gray-300 rounded px-2 py-1"
              defaultValue="5"
              id={`timeout-${transfer.id}`}
            >
              <option value="3">3s</option>
              <option value="5">5s</option>
              <option value="10">10s</option>
              <option value="15">15s</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              const timeout = document.getElementById(`timeout-${transfer.id}`).value
              onStart(transfer, parseInt(timeout))
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Transferring...</span>
              </div>
            ) : (
              'Start Transfer'
            )}
          </button>
        </div>
      </div>
      
      {transfer.handler.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          Error: {transfer.handler.error.message}
        </div>
      )}
    </div>
  )
}

export default TransferControls