import api from './api'

// Brewnode API endpoints
export const brewnodeAPI = {
  // Core Brewnode endpoints
  getBrewData: (brewname, since) => {
    const params = { brewname }
    if (since && since.trim() !== '') {
      params.since = since
    }
    return api.get('/brewdata', { params })
  },
  
  getCurrentBrew: () => 
    api.get('/brewing'),
  
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
      // First, extract power values from known indices in the original array
      if (response.data.length > 9) {
        if (typeof response.data[9] === 'number') parsedData['fanPower'] = response.data[9];
        if (typeof response.data[10] === 'number') parsedData['glycolHeaterPower'] = response.data[10];
        if (typeof response.data[11] === 'number') parsedData['glycolChillerPower'] = response.data[11];
        if (typeof response.data[12] === 'number') parsedData['kettleHeaterPower'] = response.data[12];
        console.log('Extracted power values:', {
          fanPower: parsedData['fanPower'],
          glycolHeaterPower: parsedData['glycolHeaterPower'],
          glycolChillerPower: parsedData['glycolChillerPower'],
          kettleHeaterPower: parsedData['kettleHeaterPower']
        });
      }
      
      // Then, deduplicate valve items based on normalized valve names
      const seenValves = new Set();
      const filteredData = response.data.filter((item) => {
        if (item === "" || item === null || item === undefined) {
          return false;
        }
        
        if (item && typeof item === 'object' && item.name && item.value !== undefined && item.name.toLowerCase().includes('valve')) {
          const originalName = item.name.toLowerCase();
          let normalizedName = '';
          
          if (originalName.includes('mash') && originalName.includes('in')) {
            normalizedName = 'mashin';
          } else if (originalName.includes('kettle') && originalName.includes('in')) {
            normalizedName = 'kettlein';
          } else if (originalName.includes('chiller') && originalName.includes('wort') && originalName.includes('in')) {
            normalizedName = 'chillerwortin';
          } else if (originalName.includes('chiller') && originalName.includes('wort') && originalName.includes('out')) {
            normalizedName = 'chillerwortout';
          } else {
            normalizedName = originalName.replace('valve ', '').replace(/[-\s]+/g, '');
          }
          
          if (seenValves.has(normalizedName)) {
            return false; // Skip duplicate
          }
          seenValves.add(normalizedName);
        }
        
        return true;
      });

      
      filteredData.forEach((item, index) => {
        // Skip empty strings and null/undefined values
        if (item === "" || item === null || item === undefined) {
          return;
        }
        
        if (item && typeof item === 'object' && item.name && item.value !== undefined) {
          // Convert sensor names to camelCase keys while preserving uniqueness
          let key = item.name
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
          
          // For valves, we'll handle key creation in the valve-specific section below
          // For other items, create the standard camelCase key
          if (!item.name.toLowerCase().includes('valve')) {
            parsedData[key] = value;
          }
          
          // Also create more specific keys for equipment status checks
          if (item.name.toLowerCase().includes('pump')) {
            // Create a standardized pump key
            const pumpName = item.name.toLowerCase().replace('pump ', '').replace(/\s+/g, '');
            parsedData[`pump${pumpName.charAt(0).toUpperCase() + pumpName.slice(1)}`] = value;
          } else if (item.name.toLowerCase().includes('valve')) {
            // Normalize valve names to prevent duplicates
            const originalName = item.name.toLowerCase();
            let normalizedName = '';
            
            // Standardize common valve names to prevent duplicates
            if (originalName.includes('mash') && originalName.includes('in')) {
              normalizedName = 'MashIn';
            } else if (originalName.includes('kettle') && originalName.includes('in')) {
              normalizedName = 'KettleIn';
            } else if (originalName.includes('chiller') && originalName.includes('wort') && originalName.includes('in')) {
              normalizedName = 'ChillerWortIn';
            } else if (originalName.includes('chiller') && originalName.includes('wort') && originalName.includes('out')) {
              normalizedName = 'ChillerWortOut';
            } else {
              // Fallback: clean the name generically
              normalizedName = originalName
                .replace('valve ', '')
                .replace(/[-\s]+/g, '')
                .replace(/^(.)/, (match) => match.toUpperCase());
            }
            
            // Use a single consistent key format to prevent duplicates
            const valveKey = `valve${normalizedName}`;
            const compatKey = normalizedName.charAt(0).toLowerCase() + normalizedName.slice(1);
            
            // Only create keys if they don't already exist (first occurrence wins)
            if (!parsedData[valveKey] && !parsedData[compatKey]) {
              parsedData[valveKey] = value;
              parsedData[compatKey] = value;
            }
          }
          
        } else if (typeof item === 'number') {
          // Skip numeric values as they're processed upfront by index
          // This prevents overwriting the correct power mappings
        }
      });
      
      // Also preserve the raw array for components that need it
      // Convert objects to strings to avoid [object Object] display
      const cleanRawArray = filteredData.map(item => {
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
    api.get('/fan/status'),

  setFan: (onOff) => 
    api.put(`/fan?onOff=${onOff}`, null, { headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
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
    api.put('/fill', null, { params: { litres }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
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
    api.put('/heat', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setKettlePump: (onOff) => 
    api.put('/pump/kettle', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setKettleInValve: (onOff) => 
    api.put('/valve/kettlein', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Glycol controls
  setGlycolChill: (onOff) => 
    api.put('/glycol/chill', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setGlycolHeat: (onOff) => 
    api.put('/glycol/heat', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setGlycolPump: (onOff) => 
    api.put('/pump/glycol', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Mash tun controls
  setMashPump: (onOff) => 
    api.put('/pump/mash', null, { params: { onOff }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setMashInValve: (onOff) => 
    api.put('/valve/mashin', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

  // Chiller valve controls
  setChillWortInValve: (onOff) => 
    api.put('/valve/chillwortin', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),
  
  setChillWortOutValve: (onOff) => 
    api.put('/valve/chillwortout', null, { params: { onOff: onOff === 'On' ? 'Open' : 'Close' }, headers: { 'accept': '*/*', 'Content-Type': undefined } }),

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