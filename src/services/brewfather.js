import api from './api'

// Brewfather API endpoints
export const brewfatherAPI = {
  // Batch management
  getBatches: (params = {}) => 
    api.get('/batches', { params }),
  
  getBatch: (id, include) => 
    api.get(`/batches/${id}`, { params: { include } }),
  
  updateBatch: (id, updates) => 
    api.patch(`/batches/${id}`, null, { params: updates }),
  
  getBatchBrewTracker: (id) => 
    api.get(`/batches/${id}/brewtracker`),
  
  getAllBatchReadings: (id) => 
    api.get(`/batches/${id}/readings`),
  
  getLastBatchReading: (id) => 
    api.get(`/batches/${id}/readings/last`),

  // Recipe management
  getRecipes: (params = {}) => 
    api.get('/batches/recipes', { params }),
  
  getRecipe: (id, include) => 
    api.get(`/recipes/${id}`, { params: { include } }),

  // Inventory management
  getInventory: () => 
    api.get('/inventory'),

  // Fermentables
  getFermentables: (params = {}) => 
    api.get('/inventory/fermentables', { params }),
  
  getFermentable: (id, include) => 
    api.get(`/inventory/fermentables/${id}`, { params: { include } }),
  
  updateFermentable: (id, updates) => 
    api.patch(`/inventory/fermentables/${id}`, null, { params: updates }),

  // Hops
  getHops: (params = {}) => 
    api.get('/inventory/hops', { params }),
  
  getHop: (id, include) => 
    api.get(`/inventory/hops/${id}`, { params: { include } }),
  
  updateHop: (id, updates) => 
    api.patch(`/inventory/hops/${id}`, null, { params: updates }),

  // Miscs
  getMiscs: (params = {}) => 
    api.get('/inventory/miscs', { params }),
  
  getMisc: (id, include) => 
    api.get(`/inventory/miscs/${id}`, { params: { include } }),
  
  updateMisc: (id, updates) => 
    api.patch(`/inventory/miscs/${id}`, null, { params: updates }),

  // Yeasts
  getYeasts: (params = {}) => 
    api.get('/inventory/yeasts', { params }),
  
  getYeast: (id, include) => 
    api.get(`/inventory/yeasts/${id}`, { params: { include } }),
  
  updateYeast: (id, updates) => 
    api.patch(`/inventory/yeasts/${id}`, null, { params: updates }),

  // Streaming data
  postStreamData: (id, data) => 
    api.post(`/stream/${id}`, null, { params: data }),
}