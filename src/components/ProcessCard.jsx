import React from 'react'

const ProcessCard = ({ process, onClick, isLoading }) => {
  const Icon = process.icon
  
  const colorClasses = {
    red: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200',
    green: 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200',
    cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200 hover:bg-cyan-200',
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full p-6 sm:p-8 border-2 rounded-xl transition-all duration-200 min-h-[140px] sm:min-h-[160px]
        ${colorClasses[process.color] || colorClasses.blue}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105 active:scale-95'}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-4 h-full">
        <div className="p-4 rounded-full bg-white bg-opacity-60">
          {isLoading ? (
            <div className="w-10 h-10 animate-spin rounded-full border-3 border-current border-t-transparent" />
          ) : (
            <Icon className="w-10 h-10" />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="font-bold text-xl mb-2">{process.name}</h3>
          <p className="text-base opacity-80">{process.description}</p>
        </div>
        
        {isLoading && (
          <div className="text-base font-semibold">
            Processing...
          </div>
        )}
      </div>
    </button>
  )
}

export default ProcessCard