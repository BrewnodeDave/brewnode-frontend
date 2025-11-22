import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Calendar, BarChart3 } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const BrewDataChart = () => {
  const [selectedBrew, setSelectedBrew] = useState('')
  const [dateRange, setDateRange] = useState('')

  const { data: brewnames } = useQuery('brewnames', () => brewnodeAPI.getBrewnames())
  
  const { data: brewData, isLoading } = useQuery(
    ['brewData', selectedBrew, dateRange],
    () => brewnodeAPI.getBrewData(selectedBrew, dateRange),
    { 
      enabled: !!selectedBrew,
      refetchOnWindowFocus: false
    }
  )

  // Format data for chart
  const chartData = React.useMemo(() => {
    if (!brewData?.data) return []
    
    return brewData.data.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      kettleTemp: point.kettleTemp,
      mashTemp: point.mashTemp,
      fermenterTemp: point.fermenterTemp,
      glycolTemp: point.glycolTemp,
    }))
  }, [brewData])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Brew Data Chart
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="datetime-local"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          
          <select
            value={selectedBrew}
            onChange={(e) => setSelectedBrew(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="">Select a brew...</option>
            {brewnames?.data?.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedBrew ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Select a brew to view temperature data</p>
        </div>
      ) : isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brewery-600"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No data available for selected brew</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="kettleTemp" 
                stroke="#ef4444" 
                name="Kettle"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="mashTemp" 
                stroke="#f97316" 
                name="Mash"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="fermenterTemp" 
                stroke="#3b82f6" 
                name="Fermenter"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="glycolTemp" 
                stroke="#06b6d4" 
                name="Glycol"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default BrewDataChart