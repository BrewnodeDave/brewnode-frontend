import api from './api'

// Brewnode API endpoints
export const brewnodeAPI = {
  // Core Brewnode endpoints
  getBrewData: (brewname, since) => 
    api.get('/brewdata', { params: { brewname, since } }),
  
  getCurrentBrew: () => 
    api.get('/currentbrew'),
  
  setBrewname: (name) => 
    api.put('/brewname', { name }),
  
  deleteLogs: () => 
    api.delete('/logs'),
  
  getBrewnames: () => 
    api.get('/mysql/brewnames'),
  
  restart: () => 
    api.put('/restart'),
  
  streamLog: () => 
    api.get('/streamLog'),

  // Sensor status and controls
  getSensorStatus: async (name = 'All') => {
    const response = await api.get('/sensorStatus', { params: { name } });
    
    // Parse the sensor data array into a more usable object
    const parsedData = {};
    
    if (Array.isArray(response.data)) {
      response.data.forEach(item => {
        if (item && typeof item === 'object' && item.name && item.value !== undefined) {
          // Convert sensor names to camelCase keys while preserving uniqueness
          const key = item.name
            .toLowerCase()
            .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Convert spaces to camelCase
            .replace(/[^\w]/g, ''); // Remove special characters
          
          let value = item.value;
          
          // Handle temperature sensor errors (extremely low values likely indicate sensor issues)
          if (item.name.toLowerCase().includes('temp') && value < -200) {
            // Store both the raw value and mark as error for debugging
            parsedData[key + 'Raw'] = value;
            value = null; // Mark as unavailable rather than showing error values
          }
          
          parsedData[key] = value;
        }
      });
    }
    
    return {
      ...response,
      data: parsedData
    };
  },
  
  getFanStatus: () => 
    api.get('/fan/status'),
  
  setFan: (onOff) => 
    api.put('/fan', { onOff }),
  
  getPumpsStatus: () => 
    api.get('/pumps/status'),
  
  getValvesStatus: () => 
    api.get('/valves/status'),
  
  setI2C: (bit, value) => 
    api.put('/i2c', null, { params: { bit, value } }),

  // Process controls
  boil: (mins) => 
    api.put('/boil', null, { params: { mins } }),
  
  chill: (profile) => 
    api.put('/chill', null, { params: { profile: JSON.stringify(profile) } }),
  
  ferment: (step) => 
    api.put('/ferment', null, { params: { step: JSON.stringify(step) } }),
  
  fill: (litres) => 
    api.put('/fill', null, { params: { litres } }),
  
  k2f: (flowTimeoutSecs = 5) => 
    api.put('/k2f', null, { params: { flowTimeoutSecs } }),
  
  k2m: (flowTimeoutSecs = 5) => 
    api.put('/k2m', null, { params: { flowTimeoutSecs } }),
  
  m2k: (flowTimeoutSecs = 5) => 
    api.put('/m2k', null, { params: { flowTimeoutSecs } }),
  
  mash: (steps) => 
    api.put('/mash', null, { params: { steps: JSON.stringify(steps) } }),
  
  setKettleTemp: (temp, mins) => 
    api.put('/kettleTemp', null, { params: { temp, mins } }),

  // Kettle controls
  setHeat: (onOff) => 
    api.put('/heat', { onOff }),
  
  setKettlePump: (onOff) => 
    api.put('/pump/kettle', { onOff }),
  
  setKettleInValve: (onOff) => 
    api.put('/valve/kettlein', { onOff }),

  // Glycol controls
  setGlycolChill: (onOff) => 
    api.put('/glycol/chill', { onOff }),
  
  setGlycolHeat: (onOff) => 
    api.put('/glycol/heat', { onOff }),
  
  setGlycolPump: (onOff) => 
    api.put('/pump/glycol', { onOff }),

  // Mash tun controls
  setMashPump: (onOff) => 
    api.put('/pump/mash', { onOff }),
  
  setMashInValve: (onOff) => 
    api.put('/valve/mashin', { onOff }),

  // Chiller valve controls
  setChillWortInValve: (onOff) => 
    api.put('/valve/chillwortin', { onOff }),
  
  setChillWortOutValve: (onOff) => 
    api.put('/valve/chillwortout', { onOff }),

  // Simulator controls
  setKettleVolume: (litres) => 
    api.put('/kettleVolume', null, { params: { litres } }),
  
  setSimulationSpeed: (factor) => 
    api.put('/speedFactor', null, { params: { factor } }),
  
  getSimulationSpeed: () => 
    api.get('/speedFactor'),

  // System status
  getSystemStatus: () =>
    api.get('/systemStatus'),
}