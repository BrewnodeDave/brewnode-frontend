import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Beaker, Package, Bot, FileText, Plus, Search, Filter } from 'lucide-react'
import { brewfatherAPI } from '../services/brewfather'
import BatchList from '../components/BatchList'
import RecipeList from '../components/RecipeList'
import InventoryManager from '../components/InventoryManager'

const Brewfather = () => {
  const [activeTab, setActiveTab] = useState('batches')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const tabs = [
    { id: 'batches', name: 'Batches', icon: Beaker },
    { id: 'recipes', name: 'Recipes', icon: FileText },
    { id: 'inventory', name: 'Inventory', icon: Package },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'batches':
        return <BatchList searchTerm={searchTerm} statusFilter={statusFilter} />
      case 'recipes':
        return <RecipeList searchTerm={searchTerm} />
      case 'inventory':
        return <InventoryManager searchTerm={searchTerm} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Brewfather Integration</h1>
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-brewery-600" />
          <span className="text-sm text-gray-600">Connected to Brewfather API</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-brewery-500 text-brewery-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-brewery-500 focus:border-brewery-500"
            />
          </div>
          
          {activeTab === 'batches' && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-brewery-500 focus:border-brewery-500"
              >
                <option value="">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Brewing">Brewing</option>
                <option value="Fermenting">Fermenting</option>
                <option value="Conditioning">Conditioning</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

export default Brewfather