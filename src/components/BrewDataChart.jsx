import React, { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts'
import { Calendar, BarChart3, ZoomIn, RotateCcw } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'

const BrewDataChart = () => {
  const [selectedBrew, setSelectedBrew] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [zoomDomain, setZoomDomain] = useState(null)
  const [enableZoom, setEnableZoom] = useState(true)

  const { data: brewnames, error: brewnamesError } = useQuery('brewnames', () => brewnodeAPI.getBrewnames())
  
  const { data: brewData, isLoading, error: brewDataError } = useQuery(
    ['brewData', selectedBrew, dateRange],
    () => brewnodeAPI.getBrewData(selectedBrew, dateRange),
    { 
      enabled: !!selectedBrew,
      refetchOnWindowFocus: false
    }
  )

  // Debug logging
  console.log('BrewDataChart debug:', { 
    brewnames: brewnames?.data, 
    brewnamesError, 
    selectedBrew, 
    brewData: brewData?.data, 
    brewDataError,
    isLoading 
  })

  // Additional debug logging for brew data structure
  if (brewData?.data) {
    console.log('BrewData structure:', {
      isArray: Array.isArray(brewData.data),
      length: brewData.data.length,
      firstItem: brewData.data[0],
      keys: brewData.data[0] ? Object.keys(brewData.data[0]) : []
    })
  }

  // Format data for chart
  const chartData = React.useMemo(() => {
    if (!brewData?.data) {
      console.log('No brewData.data available')
      return []
    }
    
    // Check if data is in Highcharts format
    if (brewData.data.highcharts && Array.isArray(brewData.data.highcharts)) {
      console.log('Processing Highcharts format data')
      const series = brewData.data.highcharts
      
      // Create a map to organize data by timestamp
      const timePointsMap = new Map()
      
      series.forEach(seriesItem => {
        const seriesName = seriesItem.name
        console.log(`Processing series: ${seriesName}`)
        
        if (Array.isArray(seriesItem.data)) {
          seriesItem.data.forEach(([timestamp, value]) => {
            const timeKey = new Date(timestamp).getTime()
            const timeStr = new Date(timestamp).toLocaleTimeString()
            
            if (!timePointsMap.has(timeKey)) {
              timePointsMap.set(timeKey, { time: timeStr })
            }
            
            const point = timePointsMap.get(timeKey)
            
            // Map series names to our expected field names
            switch (seriesName.toLowerCase()) {
              case 'temp kettle':
                point.kettleTemp = value
                break
              case 'temp mash':
                point.mashTemp = value
                break
              case 'temp fermenter':
                point.fermenterTemp = value
                break
              case 'temp glycol':
                point.glycolTemp = value
                break
              default:
                // Handle other temperature sensors dynamically
                const fieldName = seriesName.toLowerCase().replace(/[^a-z]/g, '') + 'Temp'
                point[fieldName] = value
            }
          })
        }
      })
      
      // Convert map to array and sort by timestamp
      const result = Array.from(timePointsMap.values()).sort((a, b) => 
        new Date('1970-01-01 ' + a.time).getTime() - new Date('1970-01-01 ' + b.time).getTime()
      )
      
      console.log('Processed chart data:', { 
        seriesCount: series.length, 
        dataPointsCount: result.length,
        samplePoint: result[0]
      })
      
      return result
    }
    
    // Fallback: handle legacy format if not Highcharts
    if (!Array.isArray(brewData.data)) {
      console.error('BrewData is not an array:', brewData.data)
      return []
    }
    
    console.log('Processing legacy format data, array length:', brewData.data.length)
    
    return brewData.data.map((point, index) => {
      // Handle different possible timestamp field names
      const timestamp = point.timestamp || point.time || point.date || point.created_at
      const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : `Point ${index}`
      
      // Handle different possible temperature field names
      return {
        time: timeStr,
        kettleTemp: point.kettleTemp || point.kettle_temp || point.KettleTemp || point['Kettle Temp'],
        mashTemp: point.mashTemp || point.mash_temp || point.MashTemp || point['Mash Temp'],
        fermenterTemp: point.fermenterTemp || point.fermenter_temp || point.FermenterTemp || point['Fermenter Temp'],
        glycolTemp: point.glycolTemp || point.glycol_temp || point.GlycolTemp || point['Glycol Temp'],
      }
    })
  }, [brewData])

  // Zoom functions
  const handleZoom = useCallback((domain) => {
    if (domain && domain.startIndex !== undefined && domain.endIndex !== undefined) {
      setZoomDomain(domain)
    }
  }, [])

  const resetZoom = useCallback(() => {
    setZoomDomain(null)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          Brew Data Chart
        </h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="datetime-local"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 sm:flex-initial"
            />
          </div>
          
          <div className="flex items-center space-x-2 justify-center sm:justify-start">
            <button
              onClick={() => setEnableZoom(!enableZoom)}
              className={`flex items-center space-x-1 px-3 py-2 text-xs rounded transition-colors ${
                enableZoom 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
              title={enableZoom ? 'Disable zoom' : 'Enable zoom'}
            >
              <ZoomIn className="w-3 h-3" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
            {zoomDomain && (
              <button
                onClick={resetZoom}
                className="flex items-center space-x-1 px-3 py-2 text-xs rounded bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
                title="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
          
          <select
            value={selectedBrew}
            onChange={(e) => setSelectedBrew(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 w-full sm:w-auto min-w-0 sm:min-w-[150px]"
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
        <div className="h-64 sm:h-80 lg:h-96">
          <p className="text-sm text-gray-600 mb-2">
            Showing {chartData.length} data points for {selectedBrew}
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              onMouseDown={(e) => enableZoom && e && setZoomDomain(null)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                domain={zoomDomain ? [zoomDomain.startIndex, zoomDomain.endIndex] : ['dataMin', 'dataMax']}
                type="category"
              />
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
              {enableZoom && chartData.length > 10 && (
                <Brush 
                  dataKey="time" 
                  height={30} 
                  stroke="#3b82f6"
                  fill="#dbeafe"
                  onChange={handleZoom}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default BrewDataChart