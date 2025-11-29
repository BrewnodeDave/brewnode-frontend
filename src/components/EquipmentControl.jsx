import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { 
  Power, 
  Fan, 
  Droplets, 
  Flame, 
  Snowflake,
  ToggleLeft,
  ToggleRight,
  Settings
} from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const EquipmentControl = ({ sensorData }) => {
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState('all')
  
  // Transition states to show between button press and sensor data update
  const [transitionStates, setTransitionStates] = useState({
    fan: false,
    kettlePump: false,
    mashPump: false,
    glycolPump: false,
    kettleInValve: false,
    mashInValve: false,
    chillWortInValve: false,
    chillWortOutValve: false,
    kettleHeater: false,
    glycolHeater: false,
    glycolChiller: false
  })
  
  // Track expected states after button presses
  const [expectedStates, setExpectedStates] = useState({})
  
  // Track when transitions started to enforce minimum duration
  const [transitionStartTimes, setTransitionStartTimes] = useState({})
  
  // All status information comes from sensorData - no local state needed

  // Clear transition states when sensor data matches expected states
  useEffect(() => {
    if (!sensorData?.data) return
    
    const updates = {}
    
    // Check each transitioning equipment against sensor data
    Object.keys(transitionStates).forEach(key => {
      if (transitionStates[key]) {
        // Force clear fan transition if it's been stuck too long
        if (key === 'fan' && transitionStartTimes[key]) {
          const elapsed = Date.now() - transitionStartTimes[key];
          if (elapsed > 5000) { // Clear after 5 seconds for fan
            updates[key] = false;
            console.log(`Force clearing stuck fan transition after ${elapsed}ms`);
            return;
          }
        }
        
        if (expectedStates[key] !== undefined) {
        let currentState = false
        
        // Get current state from sensor data
        switch(key) {
          case 'fan':
            const fanPower = sensorData.data.fanPower || sensorData.data.fan || (Array.isArray(sensorData.data) ? sensorData.data[9] : 0) || 0
            currentState = fanPower > 0
            console.log(`Fan transition check: fanPower=${fanPower}, currentState=${currentState}, expectedState=${expectedStates[key]}`)
            break
          case 'kettlePump':
            const kettlePump = sensorData.data.pumpKettle || sensorData.data.kettlePump || 0
            currentState = kettlePump > 0
            break
          case 'mashPump':
            const mashPump = sensorData.data.pumpMash || sensorData.data.mashPump || 0
            currentState = mashPump > 0
            break
          case 'glycolPump':
            const glycolPump = sensorData.data.pumpGlycol || sensorData.data.glycolPump || 0
            currentState = glycolPump > 0
            break
          case 'kettleInValve':
            const kettleInValve = sensorData.data.valveKettleIn || sensorData.data.kettleIn || 0
            currentState = kettleInValve > 0
            break
          case 'mashInValve':
            const mashInValve = sensorData.data.valveMashIn || sensorData.data.mashIn || 0
            currentState = mashInValve > 0
            break
          case 'chillWortInValve':
            const chillWortIn = sensorData.data.valveChillerWortIn || sensorData.data.chillWortIn || 0
            currentState = chillWortIn > 0
            break
          case 'chillWortOutValve':
            const chillWortOut = sensorData.data.valveChillerWortOut || sensorData.data.chillWortOut || 0
            currentState = chillWortOut > 0
            break
          case 'kettleHeater':
            const kettleHeater = sensorData.data.kettleHeaterPower || (sensorData.data._rawArray ? sensorData.data._rawArray[12] : 0) || 0
            currentState = kettleHeater > 0
            break
          case 'glycolHeater':
            const glycolHeater = sensorData.data.glycolHeaterPower || (sensorData.data._rawArray ? sensorData.data._rawArray[10] : 0) || 0
            currentState = glycolHeater > 0
            break
          case 'glycolChiller':
            const glycolChiller = sensorData.data.glycolChillerPower || (sensorData.data._rawArray ? sensorData.data._rawArray[11] : 0) || 0
            currentState = glycolChiller > 0
            break
        }
        
        // If sensor data matches expected state, check if minimum duration has passed
        if (currentState === expectedStates[key]) {
          const transitionStartTime = transitionStartTimes[key]
          const minDuration = 2000 // Minimum 2 seconds transition display
          const elapsed = transitionStartTime ? Date.now() - transitionStartTime : minDuration
          
          console.log(`${key}: currentState=${currentState}, expectedState=${expectedStates[key]}, elapsed=${elapsed}ms`)
          
          if (elapsed >= minDuration) {
            updates[key] = false
            console.log(`Clearing transition for ${key} after ${elapsed}ms`)
          } else {
            console.log(`${key} transition too short (${elapsed}ms), keeping active`)
          }
        } else {
          // Clear stuck transitions after 10 seconds
          const transitionStartTime = transitionStartTimes[key]
          const maxDuration = 10000 // Maximum 10 seconds transition
          const elapsed = transitionStartTime ? Date.now() - transitionStartTime : maxDuration
          
          if (elapsed >= maxDuration) {
            updates[key] = false
            console.log(`Force clearing stuck transition for ${key} after ${elapsed}ms (currentState=${currentState}, expectedState=${expectedStates[key]})`)
          }
        }
      }
    })
    
    // Update transition states
    if (Object.keys(updates).length > 0) {
      setTransitionStates(prev => ({ ...prev, ...updates }))
      // Clear corresponding expected states and timestamps
      setExpectedStates(prev => {
        const newExpected = { ...prev }
        Object.keys(updates).forEach(key => {
          delete newExpected[key]
        })
        return newExpected
      })
      setTransitionStartTimes(prev => {
        const newTimes = { ...prev }
        Object.keys(updates).forEach(key => {
          delete newTimes[key]
        })
        return newTimes
      })
    }
  }, [sensorData, transitionStates, expectedStates])
  
  // Fallback timeout to clear stuck transitions after 10 seconds
  useEffect(() => {
    const timeouts = Object.keys(transitionStates).map(key => {
      if (transitionStates[key]) {
        return setTimeout(() => {
          console.log(`Fallback timeout clearing transition for ${key}`)
          setTransitionStates(prev => ({ ...prev, [key]: false }))
          setExpectedStates(prev => {
            const newExpected = { ...prev }
            delete newExpected[key]
            return newExpected
          })
          setTransitionStartTimes(prev => {
            const newTimes = { ...prev }
            delete newTimes[key]
            return newTimes
          })
        }, 10000) // 10 second fallback
      }
      return null
    }).filter(Boolean)
    
    return () => timeouts.forEach(clearTimeout)
  }, [transitionStates])
  
  // Debug logging
  console.log('EquipmentControl props:', { sensorData })
  console.log('Transition states:', transitionStates)
  console.log('Expected states:', expectedStates)
  console.log('Transition start times:', transitionStartTimes)
  
  // Debug logging
  console.log('EquipmentControl - Kettle heater power:', sensorData?.data?.kettleHeaterPower)

  // Mutation handlers
  // Function to clear fan transition manually
  const clearFanTransition = () => {
    setTransitionStates(prev => ({ ...prev, fan: false }))
    setExpectedStates(prev => ({ ...prev, fan: undefined }))
    setTransitionStartTimes(prev => ({ ...prev, fan: undefined }))
  }

  const fanMutation = useMutation(
    (state) => {
      console.log('Fan mutation - sending state:', state)
      return brewnodeAPI.setFan(state)
    },
    { 
      onSuccess: (response, variables) => {
        console.log('Fan response:', response.data)
        // Set transition state and expected state
        const expectedOn = variables === 'On'
        console.log(`Fan transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
        setTransitionStates(prev => ({ ...prev, fan: true }))
        setExpectedStates(prev => ({ ...prev, fan: expectedOn }))
        setTransitionStartTimes(prev => ({ ...prev, fan: Date.now() }))
        window.fanTransitionStart = Date.now() // Track globally for override
        // Invalidate queries to refresh all status from central sensorStatus
        queryClient.invalidateQueries('fanStatus')
        queryClient.invalidateQueries('sensorStatus')
      },
      onError: (error) => {
        console.error('Fan control failed:', error)
        alert(`Fan control failed: ${error.message || 'Unknown error'}`)
        // Clear transition on error
        clearFanTransition()
      }
    }
  )

  const pumpMutations = {
    kettle: useMutation(
      (state) => brewnodeAPI.setKettlePump(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Kettle pump transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, kettlePump: true }))
          setExpectedStates(prev => ({ ...prev, kettlePump: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, kettlePump: Date.now() }))
          queryClient.invalidateQueries('pumpsStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Kettle pump control failed:', error)
          alert(`Kettle pump control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    mash: useMutation(
      (state) => brewnodeAPI.setMashPump(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Mash pump transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, mashPump: true }))
          setExpectedStates(prev => ({ ...prev, mashPump: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, mashPump: Date.now() }))
          queryClient.invalidateQueries('pumpsStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Mash pump control failed:', error)
          alert(`Mash pump control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    glycol: useMutation(
      (state) => brewnodeAPI.setGlycolPump(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Glycol pump transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, glycolPump: true }))
          setExpectedStates(prev => ({ ...prev, glycolPump: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, glycolPump: Date.now() }))
          queryClient.invalidateQueries('pumpsStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Glycol pump control failed:', error)
          alert(`Glycol pump control failed: ${error.message || 'Unknown error'}`)
        }
      }
    )
  }

  const valveMutations = {
    kettlein: useMutation(
      (state) => brewnodeAPI.setKettleInValve(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Kettle In valve transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, kettleInValve: true }))
          setExpectedStates(prev => ({ ...prev, kettleInValve: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, kettleInValve: Date.now() }))
          queryClient.invalidateQueries('valvesStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Kettle In valve control failed:', error)
          alert(`Kettle In valve control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    mashin: useMutation(
      (state) => brewnodeAPI.setMashInValve(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Mash In valve transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, mashInValve: true }))
          setExpectedStates(prev => ({ ...prev, mashInValve: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, mashInValve: Date.now() }))
          queryClient.invalidateQueries('valvesStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Mash In valve control failed:', error)
          alert(`Mash In valve control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    chillwortin: useMutation(
      (state) => brewnodeAPI.setChillWortInValve(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Chill Wort In valve transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, chillWortInValve: true }))
          setExpectedStates(prev => ({ ...prev, chillWortInValve: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, chillWortInValve: Date.now() }))
          queryClient.invalidateQueries('valvesStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Chill Wort In valve control failed:', error)
          alert(`Chill Wort In valve control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    chillwortout: useMutation(
      (state) => brewnodeAPI.setChillWortOutValve(state),
      { 
        onSuccess: (response, variables) => {
          const expectedOn = variables === 'On'
          console.log(`Chill Wort Out valve transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, chillWortOutValve: true }))
          setExpectedStates(prev => ({ ...prev, chillWortOutValve: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, chillWortOutValve: Date.now() }))
          queryClient.invalidateQueries('valvesStatus')
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Chill Wort Out valve control failed:', error)
          alert(`Chill Wort Out valve control failed: ${error.message || 'Unknown error'}`)
        }
      }
    )
  }

  const heaterMutations = {
    kettle: useMutation(
      (state) => {
        console.log('Kettle heater mutation - sending state:', state)
        return brewnodeAPI.setHeat(state)
      },
      { 
        onSuccess: (response, variables) => {
          // Response.data is a number representing power consumption (0 = off, >0 = on)
          const powerValue = Number(response.data) || 0
          console.log('Kettle heater updated to:', powerValue + 'W')
          
          const expectedOn = variables === 'On'
          console.log(`Kettle heater transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, kettleHeater: true }))
          setExpectedStates(prev => ({ ...prev, kettleHeater: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, kettleHeater: Date.now() }))
          // Invalidate queries to refresh all status from central sensorStatus
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Kettle heater control failed:', error)
          alert(`Kettle heater control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    glycolHeat: useMutation(
      (state) => {
        console.log('Glycol heater mutation - sending state:', state)
        return brewnodeAPI.setGlycolHeat(state)
      },
      { 
        onSuccess: (response, variables) => {
          console.log('Glycol heater response:', response.data)
          const expectedOn = variables === 'On'
          console.log(`Glycol heater transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, glycolHeater: true }))
          setExpectedStates(prev => ({ ...prev, glycolHeater: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, glycolHeater: Date.now() }))
          // Invalidate queries to refresh all status from central sensorStatus
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Glycol heater control failed:', error)
          alert(`Glycol heater control failed: ${error.message || 'Unknown error'}`)
        }
      }
    ),
    glycolChill: useMutation(
      (state) => {
        console.log('Glycol chiller mutation - sending state:', state)
        return brewnodeAPI.setGlycolChill(state)
      },
      { 
        onSuccess: (response, variables) => {
          console.log('Glycol chiller response:', response.data)
          const expectedOn = variables === 'On'
          console.log(`Glycol chiller transition started: expecting ${expectedOn ? 'ON' : 'OFF'}`)
          setTransitionStates(prev => ({ ...prev, glycolChiller: true }))
          setExpectedStates(prev => ({ ...prev, glycolChiller: expectedOn }))
          setTransitionStartTimes(prev => ({ ...prev, glycolChiller: Date.now() }))
          // Invalidate queries to refresh all status from central sensorStatus
          queryClient.invalidateQueries('sensorStatus')
        },
        onError: (error) => {
          console.error('Glycol chiller control failed:', error)
          alert(`Glycol chiller control failed: ${error.message || 'Unknown error'}`)
        }
      }
    )
  }

  const equipmentSections = [
    { id: 'all', name: 'All Equipment', icon: Settings },
    { id: 'pumps', name: 'Pumps', icon: Droplets },
    { id: 'valves', name: 'Valves', icon: Power },
    { id: 'heaters', name: 'Heaters', icon: Flame },
    { id: 'fan', name: 'Fan', icon: Fan }
  ]

  const shouldShowSection = (sectionId) => {
    return activeSection === 'all' || activeSection === sectionId
  }

  return (
    <div className="space-y-8">
      {/* Section Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3">
          {equipmentSections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-brewery-100 text-brewery-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {section.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Fan Control */}
      {shouldShowSection('fan') && (
        <EquipmentSection title="Fan Control" icon={Fan} color="purple">
          <ControlCard
            name="Extractor Fan"
            status={(() => {
              // Get fan status from central sensor data only
              let fanPower = 0
              
              if (sensorData?.data) {
                if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  fanPower = sensorData.data.fanPower || sensorData.data.fan || 0
                } else if (Array.isArray(sensorData.data) && sensorData.data.length > 9) {
                  fanPower = sensorData.data[9] || 0
                }
              }
              
              return (fanPower || 0) > 0 ? "On" : "Off"
            })()}
            onToggle={(state) => fanMutation.mutate(state)}
            isLoading={fanMutation.isLoading}
            isTransitioning={transitionStates.fan}
            expectedState={expectedStates.fan}
            icon={Fan}
          />
        </EquipmentSection>
      )}

      {/* Pumps Control */}
      {shouldShowSection('pumps') && (
        <EquipmentSection title="Pump Control" icon={Droplets} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ControlCard
              name="Kettle Pump"
              status={(() => {
                // Get kettle pump status from sensor data
                let pumpPower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  pumpPower = sensorData.data.pumpKettle || sensorData.data.kettlePump || 0
                }
                return pumpPower > 0 ? "On" : "Off"
              })()} 
              onToggle={(state) => pumpMutations.kettle.mutate(state)}
              isLoading={pumpMutations.kettle.isLoading}
              isTransitioning={transitionStates.kettlePump}
              expectedState={expectedStates.kettlePump}
              icon={Droplets}
            />
            <ControlCard
              name="Mash Pump"
              status={(() => {
                // Get mash pump status from sensor data
                let pumpPower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  pumpPower = sensorData.data.pumpMash || sensorData.data.mashPump || 0
                }
                return pumpPower > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => pumpMutations.mash.mutate(state)}
              isLoading={pumpMutations.mash.isLoading}
              isTransitioning={transitionStates.mashPump}
              expectedState={expectedStates.mashPump}
              icon={Droplets}
            />
            <ControlCard
              name="Glycol Pump"
              status={(() => {
                // Get glycol pump status from sensor data  
                let pumpPower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  pumpPower = sensorData.data.pumpGlycol || sensorData.data.glycolPump || 0
                }
                return pumpPower > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => pumpMutations.glycol.mutate(state)}
              isLoading={pumpMutations.glycol.isLoading}
              isTransitioning={transitionStates.glycolPump}
              expectedState={expectedStates.glycolPump}
              icon={Droplets}
            />
          </div>
        </EquipmentSection>
      )}

      {/* Valves Control */}
      {shouldShowSection('valves') && (
        <EquipmentSection title="Valve Control" icon={Power} color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ControlCard
              name="Kettle In"
              status={(() => {
                // Get kettle in valve status from sensor data
                let valvePower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  valvePower = sensorData.data.valveKettleIn || sensorData.data.kettleIn || 0
                }
                return valvePower > 0 ? "Open" : "Close"
              })()}
              onToggle={(state) => valveMutations.kettlein.mutate(state)}
              isLoading={valveMutations.kettlein.isLoading}
              isTransitioning={transitionStates.kettleInValve}
              expectedState={expectedStates.kettleInValve}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Mash In"
              status={(() => {
                // Get mash in valve status from sensor data
                let valvePower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  valvePower = sensorData.data.valveMashIn || sensorData.data.mashIn || 0
                }
                return valvePower > 0 ? "Open" : "Close"
              })()}
              onToggle={(state) => valveMutations.mashin.mutate(state)}
              isLoading={valveMutations.mashin.isLoading}
              isTransitioning={transitionStates.mashInValve}
              expectedState={expectedStates.mashInValve}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort In"
              status={(() => {
                // Get chill wort in valve status from sensor data
                let valvePower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  valvePower = sensorData.data.valveChillerWortIn || sensorData.data.chillWortIn || 0
                }
                return valvePower > 0 ? "Open" : "Close"
              })()}
              onToggle={(state) => valveMutations.chillwortin.mutate(state)}
              isLoading={valveMutations.chillwortin.isLoading}
              isTransitioning={transitionStates.chillWortInValve}
              expectedState={expectedStates.chillWortInValve}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort Out"
              status={(() => {
                // Get chill wort out valve status from sensor data
                let valvePower = 0
                if (sensorData?.data && typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  valvePower = sensorData.data.valveChillerWortOut || sensorData.data.chillWortOut || 0
                }
                return valvePower > 0 ? "Open" : "Close"
              })()}
              onToggle={(state) => valveMutations.chillwortout.mutate(state)}
              isLoading={valveMutations.chillwortout.isLoading}
              isTransitioning={transitionStates.chillWortOutValve}
              expectedState={expectedStates.chillWortOutValve}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
          </div>
        </EquipmentSection>
      )}

      {/* Heaters Control */}
      {shouldShowSection('heaters') && (
        <EquipmentSection title="Heater Control" icon={Flame} color="red">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ControlCard
              name="Kettle Heater"
              status={(() => {
                // Get kettle heater status from central sensor data only
                let power = 0
                
                if (sensorData?.data?.kettleHeaterPower !== undefined) {
                  power = sensorData.data.kettleHeaterPower || 0
                } else if (sensorData?.data?._rawArray?.[12] !== undefined) {
                  power = sensorData.data._rawArray[12] || 0
                }
                
                return power > 0 ? "On" : "Off"
              })()}
              stateLabels={(() => {
                // Get current power for display labels from sensor data
                let power = 0
                
                if (sensorData?.data?.kettleHeaterPower !== undefined) {
                  power = sensorData.data.kettleHeaterPower || 0
                } else if (sensorData?.data?._rawArray?.[12] !== undefined) {
                  power = sensorData.data._rawArray[12] || 0
                }
                
                return {
                  on: power > 0 ? 'On (' + power + 'W)' : 'On',
                  off: 'Off'
                }
              })()}
              onToggle={(state) => heaterMutations.kettle.mutate(state)}
              isLoading={heaterMutations.kettle.isLoading}
              isTransitioning={transitionStates.kettleHeater}
              expectedState={expectedStates.kettleHeater}
              icon={Flame}
            />
            <ControlCard
              name="Glycol Heater"
              status={(() => {
                // Get glycol heater status from central sensor data only
                let power = 0
                if (sensorData?.data?.glycolHeaterPower !== undefined) {
                  power = sensorData.data.glycolHeaterPower || 0
                } else if (sensorData?.data?._rawArray?.[10] !== undefined) {
                  power = sensorData.data._rawArray[10] || 0
                }
                return power > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => heaterMutations.glycolHeat.mutate(state)}
              isLoading={heaterMutations.glycolHeat.isLoading}
              isTransitioning={transitionStates.glycolHeater}
              expectedState={expectedStates.glycolHeater}
              icon={Flame}
            />
            <ControlCard
              name="Glycol Chiller"
              status={(() => {
                // Get glycol chiller status from central sensor data only
                let power = 0
                if (sensorData?.data?.glycolChillerPower !== undefined) {
                  power = sensorData.data.glycolChillerPower || 0
                } else if (sensorData?.data?._rawArray?.[11] !== undefined) {
                  power = sensorData.data._rawArray[11] || 0
                }
                return power > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => heaterMutations.glycolChill.mutate(state)}
              isLoading={heaterMutations.glycolChill.isLoading}
              isTransitioning={transitionStates.glycolChiller}
              expectedState={expectedStates.glycolChiller}
              icon={Snowflake}
            />
          </div>
        </EquipmentSection>
      )}
    </div>
  )
}

const EquipmentSection = ({ title, icon: Icon, color, children }) => {
  const colorClasses = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-8 py-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold flex items-center">
          <Icon className={`w-6 h-6 mr-3 ${colorClasses[color]}`} />
          {title}
        </h3>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  )
}

const ControlCard = ({ 
  name, 
  status, 
  onToggle, 
  isLoading, 
  isTransitioning = false,
  icon: Icon,
  stateLabels = { on: 'On', off: 'Off' },
  expectedState = null
}) => {
  // During transition, use expected state; otherwise use current sensor status
  const isOn = isTransitioning && expectedState !== null 
    ? expectedState 
    : (status === 'On' || status === 'Open' || status === 'Active')
    
  const displayStatus = isTransitioning ? 'Updating...' : (isOn ? (stateLabels.on || 'On') : (stateLabels.off || 'Off'))

  const handleToggle = () => {
    // Allow toggle even during transition if it's been stuck for more than 3 seconds
    if (isTransitioning) {
      const transitionTime = Date.now() - (window.fanTransitionStart || 0);
      if (transitionTime < 3000) return; // Still wait 3 seconds before allowing override
    }
    
    // Always send 'On'/'Off' to the API regardless of display labels
    const newState = isOn ? 'Off' : 'On'
    onToggle(newState)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-medium text-gray-900">{name}</span>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          isTransitioning
            ? 'bg-yellow-100 text-yellow-800'
            : isOn 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {displayStatus}
        </span>
      </div>

      <button
        onClick={handleToggle}
        disabled={isLoading || isTransitioning}
        className={`w-full flex items-center justify-center space-x-3 py-3 px-6 rounded-md text-lg font-medium transition-colors ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isTransitioning
            ? 'bg-yellow-500 text-white cursor-not-allowed'
            : isOn
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Processing...</span>
          </>
        ) : isTransitioning ? (
          <>
            <div className="w-6 h-6 animate-pulse">
              <div className="w-full h-full bg-white rounded-full opacity-60"></div>
            </div>
            <span>Updating...</span>
          </>
        ) : (
          <>
            {isOn ? (
              <ToggleRight className="w-6 h-6" />
            ) : (
              <ToggleLeft className="w-6 h-6" />
            )}
            <span>
              {isOn ? stateLabels.off || 'Off' : stateLabels.on || 'On'}
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default EquipmentControl