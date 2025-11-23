import React, { useState } from 'react'
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

const EquipmentControl = ({ fanStatus, pumpsStatus, valvesStatus, sensorData }) => {
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState('all')
  
  // Local states updated from API responses
  const [heaterStates, setHeaterStates] = useState({
    kettle: null,
    glycolHeat: null,
    glycolChill: null
  })
  
  const [fanState, setFanState] = useState(null)

  // Debug logging
  console.log('EquipmentControl props:', { fanStatus, pumpsStatus, valvesStatus, sensorData })
  
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
        setFanState(response.data)
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
          
          // Update local state immediately for instant UI feedback
          setHeaterStates(prev => ({ ...prev, kettle: powerValue }))
          
          // Invalidate queries to refresh sensor data
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
          setHeaterStates(prev => ({ ...prev, glycolHeat: response.data }))
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
          setHeaterStates(prev => ({ ...prev, glycolChill: response.data }))
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
    <div className="space-y-6">
      {/* Section Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {equipmentSections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-brewery-100 text-brewery-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
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
              // Use local state first, fall back to sensor data
              let fanPower = fanState !== null ? fanState : null
              
              if (fanPower === null && sensorData?.data) {
                if (typeof sensorData.data === 'object' && !Array.isArray(sensorData.data)) {
                  fanPower = sensorData.data.fan || 0
                } else if (Array.isArray(sensorData.data) && sensorData.data.length > 9) {
                  fanPower = sensorData.data[9] || 0
                }
              }
              
              return (fanPower || 0) > 0 ? "On" : "Off"
            })()}
            onToggle={(state) => fanMutation.mutate(state)}
            isLoading={fanMutation.isLoading}
            icon={Fan}
          />
        </EquipmentSection>
      )}

      {/* Pumps Control */}
      {shouldShowSection('pumps') && (
        <EquipmentSection title="Pump Control" icon={Droplets} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ControlCard
              name="Kettle Pump"
              status={(pumpsStatus?.data?.find(p => p.name === "Pump Kettle")?.value || 0) > 0 ? "On" : "Off"}
              onToggle={(state) => pumpMutations.kettle.mutate(state)}
              isLoading={pumpMutations.kettle.isLoading}
              icon={Droplets}
            />
            <ControlCard
              name="Mash Pump"
              status={(pumpsStatus?.data?.find(p => p.name === "Pump Mash")?.value || 0) > 0 ? "On" : "Off"}
              onToggle={(state) => pumpMutations.mash.mutate(state)}
              isLoading={pumpMutations.mash.isLoading}
              icon={Droplets}
            />
            <ControlCard
              name="Glycol Pump"
              status={(pumpsStatus?.data?.find(p => p.name === "Pump Glycol")?.value || 0) > 0 ? "On" : "Off"}
              onToggle={(state) => {
                console.log('Glycol pump toggle - current status:', pumpsStatus?.data?.find(p => p.name === "Pump Glycol")?.value, 'new state:', state)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ControlCard
              name="Kettle In"
              status={(valvesStatus?.data?.find(v => v.name === "Valve Kettle-in")?.value || 0) > 0 ? "Open" : "Close"}
              onToggle={(state) => valveMutations.kettlein.mutate(state)}
              isLoading={valveMutations.kettlein.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Mash In"
              status={(valvesStatus?.data?.find(v => v.name === "Valve Mash-in")?.value || 0) > 0 ? "Open" : "Close"}
              onToggle={(state) => valveMutations.mashin.mutate(state)}
              isLoading={valveMutations.mashin.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort In"
              status={(valvesStatus?.data?.find(v => v.name === "Valve Chiller wort-in")?.value || 0) > 0 ? "Open" : "Close"}
              onToggle={(state) => valveMutations.chillwortin.mutate(state)}
              isLoading={valveMutations.chillwortin.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort Out"
              status={(valvesStatus?.data?.find(v => v.name === "Valve Chiller wort-out")?.value || 0) > 0 ? "Open" : "Close"}
              onToggle={(state) => valveMutations.chillwortout.mutate(state)}
              isLoading={valveMutations.chillwortout.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
          </div>
        </EquipmentSection>
      )}

      {/* Heaters Control */}
      {shouldShowSection('heaters') && (
        <EquipmentSection title="Heater Control" icon={Flame} color="red">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ControlCard
              name="Kettle Heater"
              status={(() => {
                // Primary source: local state from API response (immediate feedback)
                if (heaterStates.kettle !== null) {
                  const power = heaterStates.kettle || 0
                  return power > 0 ? "On" : "Off"
                }
                
                // Fallback: parsed sensor data kettleHeaterPower
                if (sensorData?.data?.kettleHeaterPower !== undefined) {
                  const power = sensorData.data.kettleHeaterPower || 0
                  return power > 0 ? "On" : "Off"
                }
                
                // Last fallback: raw array access
                if (sensorData?.data?._rawArray?.[12] !== undefined) {
                  const power = sensorData.data._rawArray[12] || 0
                  return power > 0 ? "On" : "Off"
                }
                
                return "Off"
              })()}
              stateLabels={(() => {
                // Get current power for display labels - prioritize API response
                let power = 0
                if (heaterStates.kettle !== null) {
                  power = heaterStates.kettle || 0
                } else if (sensorData?.data?.kettleHeaterPower !== undefined) {
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
              icon={Flame}
            />
            <ControlCard
              name="Glycol Heater"
              status={(() => {
                const power = heaterStates.glycolHeat !== null ? heaterStates.glycolHeat : (Array.isArray(sensorData?.data) ? sensorData.data[10] : 0)
                return (power || 0) > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => heaterMutations.glycolHeat.mutate(state)}
              isLoading={heaterMutations.glycolHeat.isLoading}
              icon={Flame}
            />
            <ControlCard
              name="Glycol Chiller"
              status={(() => {
                const power = heaterStates.glycolChill !== null ? heaterStates.glycolChill : (Array.isArray(sensorData?.data) ? sensorData.data[11] : 0)
                return (power || 0) > 0 ? "On" : "Off"
              })()}
              onToggle={(state) => heaterMutations.glycolChill.mutate(state)}
              isLoading={heaterMutations.glycolChill.isLoading}
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
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center">
          <Icon className={`w-5 h-5 mr-2 ${colorClasses[color]}`} />
          {title}
        </h3>
      </div>
      <div className="p-6">
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
  icon: Icon,
  stateLabels = { on: 'On', off: 'Off' }
}) => {
  const isOn = status === 'On' || status === 'Open' || status === 'Active'
  const displayStatus = isOn ? (stateLabels.on || 'On') : (stateLabels.off || 'Off')

  const handleToggle = () => {
    // Always send 'On'/'Off' to the API regardless of display labels
    const newState = isOn ? 'Off' : 'On'
    onToggle(newState)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">{name}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isOn 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {displayStatus}
        </span>
      </div>

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
          isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isOn
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {isOn ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
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