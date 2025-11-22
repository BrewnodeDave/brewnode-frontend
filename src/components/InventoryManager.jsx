import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Package, Plus, Minus, Edit } from 'lucide-react'
import { brewfatherAPI } from '../services/brewfather'

const InventoryManager = ({ searchTerm }) => {
  const [activeTab, setActiveTab] = useState('fermentables')
  const [editingItem, setEditingItem] = useState(null)
  const queryClient = useQueryClient()

  const tabs = [
    { id: 'fermentables', name: 'Fermentables' },
    { id: 'hops', name: 'Hops' },
    { id: 'yeasts', name: 'Yeasts' },
    { id: 'miscs', name: 'Miscellaneous' },
  ]

  const renderInventorySection = () => {
    switch (activeTab) {
      case 'fermentables':
        return <InventorySection type="fermentables" searchTerm={searchTerm} />
      case 'hops':
        return <InventorySection type="hops" searchTerm={searchTerm} />
      case 'yeasts':
        return <InventorySection type="yeasts" searchTerm={searchTerm} />
      case 'miscs':
        return <InventorySection type="miscs" searchTerm={searchTerm} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-brewery-500 text-brewery-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {renderInventorySection()}
      </div>
    </div>
  )
}

const InventorySection = ({ type, searchTerm }) => {
  const queryClient = useQueryClient()
  const [editingItem, setEditingItem] = useState(null)

  // Map API functions
  const apiMap = {
    fermentables: {
      get: brewfatherAPI.getFermentables,
      update: brewfatherAPI.updateFermentable
    },
    hops: {
      get: brewfatherAPI.getHops,
      update: brewfatherAPI.updateHop
    },
    yeasts: {
      get: brewfatherAPI.getYeasts,
      update: brewfatherAPI.updateYeast
    },
    miscs: {
      get: brewfatherAPI.getMiscs,
      update: brewfatherAPI.updateMisc
    }
  }

  const { data: items, isLoading } = useQuery(
    [type],
    () => apiMap[type].get({ limit: 50, inventory_exists: true }),
    { refetchInterval: 60000 }
  )

  const updateMutation = useMutation(
    ({ id, updates }) => apiMap[type].update(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([type])
        setEditingItem(null)
      }
    }
  )

  const filteredItems = items?.data?.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleUpdateInventory = (id, adjustment) => {
    updateMutation.mutate({ id, updates: { inventory_adjust: adjustment } })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>Stock: {item.inventory || 0} {item.unit || 'kg'}</span>
                {item.costPerAmount && (
                  <span>Cost: ${item.costPerAmount.toFixed(2)}/{item.unit || 'kg'}</span>
                )}
                {item.supplier && (
                  <span>Supplier: {item.supplier}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleUpdateInventory(item._id, -0.1)}
                disabled={updateMutation.isLoading}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Decrease inventory"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-16 text-center text-sm font-medium">
                {item.inventory?.toFixed(1) || '0.0'}
              </span>
              
              <button
                onClick={() => handleUpdateInventory(item._id, 0.1)}
                disabled={updateMutation.isLoading}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Increase inventory"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setEditingItem(item)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Edit item"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditInventoryModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(id, updates) => updateMutation.mutate({ id, updates })}
          isLoading={updateMutation.isLoading}
        />
      )}
    </div>
  )
}

const EditInventoryModal = ({ item, onClose, onSave, isLoading }) => {
  const [inventory, setInventory] = useState(item.inventory || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(item._id, { inventory: parseFloat(inventory) })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit {item.name}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inventory ({item.unit || 'kg'})
              </label>
              <input
                type="number"
                step="0.1"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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

export default InventoryManager