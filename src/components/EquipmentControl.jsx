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
  
  // All status information comes from sensorData - no local state needed

  // Clear transition states when sensor data updates
  useEffect(() => {
    // Clear all transition states after a delay to allow sensor data to update
    const timeouts = Object.keys(transitionStates).map(key => 
      setTimeout(() => {
        setTransitionStates(prev => ({ ...prev, [key]: false }))
      }, 3000) // Clear after 3 seconds max
    )
    
    return () => timeouts.forEach(clearTimeout)
  }, [sensorData])
  
  // Debug logging
  console.log('EquipmentControl props:', { sensorData })
  
  // Debug logging
  console.log('EquipmentControl - Kettle heater power:', sensorData?.data?.kettleHeaterPower)

  // Mutation handlers
  const fanMutation = useMutation(
    (state) => {
      console.log('Fan mutation - sending state:', state)
      return brewnodeAPI.setFan(state)
    },
    { 
      onSuccess: (response) => {
        console.log('Fan response:', response.data)
        // Set transition state
        setTransitionStates(prev => ({ ...prev, fan: true }))
        // Invalidate queries to refresh all status from central sensorStatus
        queryClient.invalidateQueries('fanStatus')
        queryClient.invalidateQueries('sensorStatus')
      },
      onError: (error) => {
        console.error('Fan control failed:', error)
        alert(`Fan control failed: ${error.message || 'Unknown error'}`)
      }
    }
  )

  const pumpMutations = {
    kettle: useMutation(
      (state) => brewnodeAPI.setKettlePump(state),
      { 
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, kettlePump: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, mashPump: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, glycolPump: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, kettleInValve: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, mashInValve: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, chillWortInValve: true }))
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
        onSuccess: () => {
          setTransitionStates(prev => ({ ...prev, chillWortOutValve: true }))
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
        onSuccess: (response) => {
          // Response.data is a number representing power consumption (0 = off, >0 = on)
          const powerValue = Number(response.data) || 0
          console.log('Kettle heater updated to:', powerValue + 'W')
          
          setTransitionStates(prev => ({ ...prev, kettleHeater: true }))
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
        onSuccess: (response) => {
          console.log('Glycol heater response:', response.data)
          setTransitionStates(prev => ({ ...prev, glycolHeater: true }))
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
        onSuccess: (response) => {
          console.log('Glycol chiller response:', response.data)
          setTransitionStates(prev => ({ ...prev, glycolChiller: true }))
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
              onToggle={(state) => {
                console.log('Glycol pump toggle - new state:', state)
                pumpMutations.glycol.mutate(state)
              }}
              isLoading={pumpMutations.glycol.isLoading}
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
  stateLabels = { on: 'On', off: 'Off' }
}) => {
  const isOn = status === 'On' || status === 'Open' || status === 'Active'
  const displayStatus = isTransitioning ? 'Updating...' : (isOn ? (stateLabels.on || 'On') : (stateLabels.off || 'Off'))

  const handleToggle = () => {
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