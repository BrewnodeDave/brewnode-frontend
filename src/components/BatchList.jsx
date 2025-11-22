import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Calendar, Edit, Eye, BarChart3, User, Clock } from 'lucide-react'
import { brewfatherAPI } from '../services/brewfather'

const BatchList = ({ searchTerm, statusFilter }) => {
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [editingBatch, setEditingBatch] = useState(null)
  const queryClient = useQueryClient()

  const { data: batches, isLoading } = useQuery(
    ['batches', statusFilter],
    () => brewfatherAPI.getBatches({
      status: statusFilter || undefined,
      limit: 20,
      complete: true
    }),
    { refetchInterval: 30000 }
  )

  const updateBatchMutation = useMutation(
    ({ id, updates }) => brewfatherAPI.updateBatch(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['batches'])
        setEditingBatch(null)
      }
    }
  )

  const filteredBatches = batches?.data?.filter(batch =>
    batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.recipe?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleUpdateBatch = (id, updates) => {
    updateBatchMutation.mutate({ id, updates })
  }

  const getStatusColor = (status) => {
    const colors = {
      Planning: 'bg-gray-100 text-gray-800',
      Brewing: 'bg-orange-100 text-orange-800',
      Fermenting: 'bg-blue-100 text-blue-800',
      Conditioning: 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-green-100 text-green-800',
      Archived: 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Batches ({filteredBatches.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredBatches.map((batch) => (
            <div key={batch._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {batch.brewer || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {batch.brewDate ? new Date(batch.brewDate).toLocaleDateString() : 'Not scheduled'}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {batch.recipe?.name || 'No recipe'}
                    </div>
                  </div>

                  {batch.measuredOg && batch.measuredFg && (
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span>OG: {batch.measuredOg}</span>
                      <span>FG: {batch.measuredFg}</span>
                      <span>ABV: {((batch.measuredOg - batch.measuredFg) * 131).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedBatch(batch)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingBatch(batch)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Edit Batch"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Detail Modal */}
      {selectedBatch && (
        <BatchDetailModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <BatchEditModal
          batch={editingBatch}
          onClose={() => setEditingBatch(null)}
          onSave={handleUpdateBatch}
          isLoading={updateBatchMutation.isLoading}
        />
      )}
    </div>
  )
}

const BatchDetailModal = ({ batch, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{batch.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1">{batch.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Recipe</label>
              <p className="mt-1">{batch.recipe?.name || 'N/A'}</p>
            </div>
          </div>
          
          {batch.notes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <p className="mt-1 text-gray-600">{batch.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

const BatchEditModal = ({ batch, onClose, onSave, isLoading }) => {
  const [status, setStatus] = useState(batch.status || '')
  const [measuredOg, setMeasuredOg] = useState(batch.measuredOg || '')
  const [measuredFg, setMeasuredFg] = useState(batch.measuredFg || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const updates = {}
    if (status !== batch.status) updates.status = status
    if (measuredOg !== batch.measuredOg) updates.measuredOg = parseFloat(measuredOg)
    if (measuredFg !== batch.measuredFg) updates.measuredFg = parseFloat(measuredFg)
    
    onSave(batch._id, updates)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit {batch.name}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Planning">Planning</option>
                <option value="Brewing">Brewing</option>
                <option value="Fermenting">Fermenting</option>
                <option value="Conditioning">Conditioning</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Original Gravity</label>
              <input
                type="number"
                step="0.001"
                value={measuredOg}
                onChange={(e) => setMeasuredOg(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1.050"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Final Gravity</label>
              <input
                type="number"
                step="0.001"
                value={measuredFg}
                onChange={(e) => setMeasuredFg(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1.010"
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-brewery-600 text-white py-2 px-4 rounded-md hover:bg-brewery-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BatchList