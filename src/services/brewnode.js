import api from './api'

// Brewnode API endpoints
export const brewnodeAPI = {
  // Core Brewnode endpoints
  getBrewData: (brewname, since) => {
    const params = { brewname }
    if (since && since.trim() !== '') {
      params.since = since
    }
    return api.get('/api/brewdata', { params })
  },
  
  getCurrentBrew: () => 
    // Temporarily return mock data until backend endpoint is implemented
    Promise.resolve({ 
      data: { 
        recipeName: null, 
        status: 'No active brew', 
        progress: '0%' 
      } 
    }),
  
  setBrewname: (name) => 
    api.put('/api/brewname', { name }),
  
  deleteLogs: () => 
    api.delete('/api/logs'),
  
  getBrewnames: () => 
    api.get('/api/mysql/brewnames'),
  
  restart: () => 
    api.put('/api/restart'),
  
  streamLog: () => 
    api.get('/api/streamLog'),

  // Sensor status and controls
  getSensorStatus: async (name = 'All') => {
    const response = await api.get('/api/sensorStatus', { params: { name } });
    
    // Parse the sensor data array into a more usable object
    const parsedData = {};
    
    if (Array.isArray(response.data)) {
      response.data.forEach((item, index) => {
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
        } else if (typeof item === 'number') {
          // Handle raw numeric values (like heater power consumption)
          // Map known indices to meaningful names
          if (index === 9) parsedData['fanPower'] = item;
          if (index === 10) parsedData['glycolHeaterPower'] = item;
          if (index === 11) parsedData['glycolChillerPower'] = item;
          if (index === 12) parsedData['kettleHeaterPower'] = item;
        }
      });
      
      // Also preserve the raw array for components that need it
      // Convert objects to strings to avoid [object Object] display
      const cleanRawArray = response.data.map(item => {
        if (item && typeof item === 'object' && item.name && item.value !== undefined) {
          return `${item.name}: ${item.value}`;
        }
        return item;
      });
      parsedData._rawArray = cleanRawArray;
    }
    
    return {
      ...response,
      data: parsedData
    };
  },
  
  getFanStatus: () =>
    api.get('/api/fan/status'),

  setFan: (onOff) => 
    api.put('/api/fan', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  getPumpsStatus: () =>
    api.get('/api/pumps/status'),

  getValvesStatus: () =>
    api.get('/api/valves/status'),

  setI2C: (bit, value) => 
    api.put('/api/i2c', null, { params: { bit, value } }),

  // Process controls
  boil: (mins) => 
    api.put('/api/boil', null, { params: { mins } }),
  
  chill: (profile) => 
    api.put('/api/chill', null, { params: { profile: JSON.stringify(profile) } }),
  
  ferment: (step) => 
    api.put('/api/ferment', null, { params: { step: JSON.stringify(step) } }),
  
  fill: (litres) => 
    api.put('/api/fill', null, { params: { litres } }),
  
  k2f: (flowTimeoutSecs = 5) => 
    api.put('/api/k2f', null, { params: { flowTimeoutSecs } }),
  
  k2m: (flowTimeoutSecs = 5) => 
    api.put('/api/k2m', null, { params: { flowTimeoutSecs } }),
  
  m2k: (flowTimeoutSecs = 5) => 
    api.put('/api/m2k', null, { params: { flowTimeoutSecs } }),
  
  mash: (steps) => 
    api.put('/api/mash', null, { params: { steps: JSON.stringify(steps) } }),
  
  setKettleTemp: (temp, mins) => 
    api.put('/api/kettleTemp', null, { params: { temp, mins } }),

  // Kettle controls
  setHeat: (onOff) => 
    api.put('/api/heat', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setKettlePump: (onOff) => 
    api.put('/api/pump/kettle', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setKettleInValve: (onOff) => 
    api.put('/api/valve/kettlein', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Glycol controls
  setGlycolChill: (onOff) => 
    api.put('/api/glycol/chill', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setGlycolHeat: (onOff) => 
    api.put('/api/glycol/heat', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setGlycolPump: (onOff) => 
    api.put('/api/pump/glycol', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Mash tun controls
  setMashPump: (onOff) => 
    api.put('/api/pump/mash', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setMashInValve: (onOff) => 
    api.put('/api/valve/mashin', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Chiller valve controls
  setChillWortInValve: (onOff) => 
    api.put('/api/valve/chillwortin', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setChillWortOutValve: (onOff) => 
    api.put('/api/valve/chillwortout', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Simulator controls
  setKettleVolume: (litres) => 
    api.put('/api/kettleVolume', null, { params: { litres } }),
  
  setSimulationSpeed: (factor) => 
    api.put('/api/speedFactor', null, { params: { factor } }),
  
  getSimulationSpeed: () => 
    api.get('/api/speedFactor'),

  // System status
  getSystemStatus: () =>
    api.get('/api/systemStatus'),
}