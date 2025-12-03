import React, { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts'
import { Calendar, BarChart3, ZoomIn, RotateCcw } from 'lucide-react'
import { brewnodeAPI } from '../services/brewnode'
import LoadingSpinner from './LoadingSpinner'

const BrewDataChart = () => {
  const [selectedBrew, setSelectedBrew] = useState('')
  const [zoomDomain, setZoomDomain] = useState(null)
  const [enableZoom, setEnableZoom] = useState(true)

  const { data: brewnames, error: brewnamesError } = useQuery('brewnames', () => brewnodeAPI.getBrewnames())
  
  const { data: brewData, isLoading, error: brewDataError } = useQuery(
    ['brewData', selectedBrew],
    () => brewnodeAPI.getBrewData(selectedBrew, ''),
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
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-2xl font-black flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-gray-600" />
          Brew Data Chart
        </h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <button
              onClick={() => setEnableZoom(!enableZoom)}
              className={`flex items-center space-x-2 px-5 py-4 text-lg font-bold rounded-2xl transition-all shadow-md hover:scale-105 ${
                enableZoom 
                  ? 'bg-blue-200 text-blue-900 border-4 border-blue-400' 
                  : 'bg-gray-200 text-gray-700 border-4 border-gray-400'
              }`}
              title={enableZoom ? 'Disable zoom' : 'Enable zoom'}
            >
              <ZoomIn className="w-6 h-6" />
              <span>Zoom</span>
            </button>
            {zoomDomain && (
              <button
                onClick={resetZoom}
                className="flex items-center space-x-2 px-5 py-4 text-lg font-bold rounded-2xl bg-gray-200 text-gray-700 border-4 border-gray-400 hover:bg-gray-300 transition-all shadow-md hover:scale-105"
                title="Reset zoom"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Reset</span>
              </button>
            )}
          </div>
          
          <select
            value={selectedBrew}
            onChange={(e) => setSelectedBrew(e.target.value)}
            className="text-xl font-bold border-4 border-gray-300 rounded-2xl px-4 py-3 w-full sm:w-auto min-w-0 sm:min-w-[200px] focus:ring-4 focus:ring-brewery-200 focus:border-brewery-500"
          >
            <option value="">Select a brew...</option>
            {brewnames?.data?.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedBrew ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p className="text-2xl font-bold">Select a brew to view temperature data</p>
        </div>
      ) : isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner text="Loading brew data..." />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p className="text-2xl font-bold">No data available for selected brew</p>
        </div>
      ) : (
        <div className="h-80 sm:h-96 lg:h-[32rem]">
          <p className="text-xl font-bold text-gray-700 mb-4">
            Showing {chartData.length} data points for {selectedBrew}
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              onMouseDown={(e) => enableZoom && e && setZoomDomain(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeWidth={2} />
              <XAxis 
                dataKey="time" 
                domain={zoomDomain ? [zoomDomain.startIndex, zoomDomain.endIndex] : ['dataMin', 'dataMax']}
                type="category"
                tick={{ fontSize: 16, fontWeight: 'bold' }}
              />
              <YAxis 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 18, fontWeight: 'bold' } }} 
                tick={{ fontSize: 16, fontWeight: 'bold' }}
              />
              <Tooltip contentStyle={{ fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: '3px solid #ccc' }} />
              <Legend wrapperStyle={{ fontSize: '18px', fontWeight: 'bold' }} />
              <Line 
                type="monotone" 
                dataKey="kettleTemp" 
                stroke="#ef4444" 
                name="Kettle"
                strokeWidth={4}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="mashTemp" 
                stroke="#f97316" 
                name="Mash"
                strokeWidth={4}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="fermenterTemp" 
                stroke="#3b82f6" 
                name="Fermenter"
                strokeWidth={4}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="glycolTemp" 
                stroke="#06b6d4" 
                name="Glycol"
                strokeWidth={4}
                dot={false}
              />
              {enableZoom && chartData.length > 10 && (
                <Brush 
                  dataKey="time" 
                  height={40} 
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