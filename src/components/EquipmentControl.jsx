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

const EquipmentControl = ({ fanStatus, pumpsStatus, valvesStatus }) => {
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState('all')

  // Mutation handlers
  const fanMutation = useMutation(
    (state) => brewnodeAPI.setFan(state),
    { onSuccess: () => queryClient.invalidateQueries() }
  )

  const pumpMutations = {
    kettle: useMutation(
      (state) => brewnodeAPI.setKettlePump(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    mash: useMutation(
      (state) => brewnodeAPI.setMashPump(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    glycol: useMutation(
      (state) => brewnodeAPI.setGlycolPump(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    )
  }

  const valveMutations = {
    kettlein: useMutation(
      (state) => brewnodeAPI.setKettleInValve(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    mashin: useMutation(
      (state) => brewnodeAPI.setMashInValve(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    chillwortin: useMutation(
      (state) => brewnodeAPI.setChillWortInValve(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    chillwortout: useMutation(
      (state) => brewnodeAPI.setChillWortOutValve(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    )
  }

  const heaterMutations = {
    kettle: useMutation(
      (state) => brewnodeAPI.setHeat(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    glycolHeat: useMutation(
      (state) => brewnodeAPI.setGlycolHeat(state),
      { onSuccess: () => queryClient.invalidateQueries() }
    ),
    glycolChill: useMutation(
      (state) => brewnodeAPI.setGlycolChill(state),
      { onSuccess: () => queryClient.invalidateQueries() }
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
            status={fanStatus?.data?.status}
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
              status={pumpsStatus?.data?.kettlePump}
              onToggle={(state) => pumpMutations.kettle.mutate(state)}
              isLoading={pumpMutations.kettle.isLoading}
              icon={Droplets}
            />
            <ControlCard
              name="Mash Pump"
              status={pumpsStatus?.data?.mashPump}
              onToggle={(state) => pumpMutations.mash.mutate(state)}
              isLoading={pumpMutations.mash.isLoading}
              icon={Droplets}
            />
            <ControlCard
              name="Glycol Pump"
              status={pumpsStatus?.data?.glycolPump}
              onToggle={(state) => pumpMutations.glycol.mutate(state)}
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
              status={valvesStatus?.data?.kettleInValve}
              onToggle={(state) => valveMutations.kettlein.mutate(state)}
              isLoading={valveMutations.kettlein.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Mash In"
              status={valvesStatus?.data?.mashInValve}
              onToggle={(state) => valveMutations.mashin.mutate(state)}
              isLoading={valveMutations.mashin.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort In"
              status={valvesStatus?.data?.chillWortInValve}
              onToggle={(state) => valveMutations.chillwortin.mutate(state)}
              isLoading={valveMutations.chillwortin.isLoading}
              icon={Power}
              stateLabels={{ on: 'Open', off: 'Close' }}
            />
            <ControlCard
              name="Chill Wort Out"
              status={valvesStatus?.data?.chillWortOutValve}
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
              status="Off" // Would come from sensor data
              onToggle={(state) => heaterMutations.kettle.mutate(state)}
              isLoading={heaterMutations.kettle.isLoading}
              icon={Flame}
            />
            <ControlCard
              name="Glycol Heater"
              status="Off" // Would come from sensor data
              onToggle={(state) => heaterMutations.glycolHeat.mutate(state)}
              isLoading={heaterMutations.glycolHeat.isLoading}
              icon={Flame}
            />
            <ControlCard
              name="Glycol Chiller"
              status="Off" // Would come from sensor data
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
    const newState = isOn ? stateLabels.off || 'Off' : stateLabels.on || 'On'
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
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-green-600 text-white hover:bg-green-700'
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
              Turn {isOn ? stateLabels.off || 'Off' : stateLabels.on || 'On'}
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default EquipmentControl