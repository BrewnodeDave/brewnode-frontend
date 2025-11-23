import api from './api'

// Brewfather API endpoints
export const brewfatherAPI = {
  // Batch management
  getBatches: (params = {}) => 
    api.get('/api/batches', { params }),
  
  getBatch: (id, include) => 
    api.get(`/api/batches/${id}`, { params: { include } }),
  
  updateBatch: (id, updates) => 
    api.patch(`/api/batches/${id}`, null, { params: updates }),
  
  getBatchBrewTracker: (id) => 
    api.get(`/api/batches/${id}/brewtracker`),
  
  getAllBatchReadings: (id) => 
    api.get(`/api/batches/${id}/readings`),
  
  getLastBatchReading: (id) => 
    api.get(`/api/batches/${id}/readings/last`),

  // Recipe management
  getRecipes: (params = {}) => 
    api.get('/api/batches/recipes', { params }),
  
  getRecipe: (id, include) => 
    api.get(`/api/recipes/${id}`, { params: { include } }),

  // Inventory management
  getInventory: () => 
    api.get('/api/inventory'),

  // Fermentables
  getFermentables: (params = {}) => 
    api.get('/api/inventory/fermentables', { params }),
  
  getFermentable: (id, include) => 
    api.get(`/api/inventory/fermentables/${id}`, { params: { include } }),
  
  updateFermentable: (id, updates) => 
    api.patch(`/api/inventory/fermentables/${id}`, null, { params: updates }),

  // Hops
  getHops: (params = {}) => 
    api.get('/api/inventory/hops', { params }),
  
  getHop: (id, include) => 
    api.get(`/api/inventory/hops/${id}`, { params: { include } }),
  
  updateHop: (id, updates) => 
    api.patch(`/api/inventory/hops/${id}`, null, { params: updates }),

  // Miscs
  getMiscs: (params = {}) => 
    api.get('/api/inventory/miscs', { params }),
  
  getMisc: (id, include) => 
    api.get(`/api/inventory/miscs/${id}`, { params: { include } }),
  
  updateMisc: (id, updates) => 
    api.patch(`/api/inventory/miscs/${id}`, null, { params: updates }),

  // Yeasts
  getYeasts: (params = {}) => 
    api.get('/api/inventory/yeasts', { params }),
  
  getYeast: (id, include) => 
    api.get(`/api/inventory/yeasts/${id}`, { params: { include } }),
  
  updateYeast: (id, updates) => 
    api.patch(`/api/inventory/yeasts/${id}`, null, { params: updates }),

  // Streaming data
  postStreamData: (id, data) => 
    api.post(`/api/stream/${id}`, null, { params: data }),
}