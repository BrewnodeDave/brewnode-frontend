import React from 'react'

const ProcessCard = ({ process, onClick, isLoading }) => {
  const Icon = process.icon
  
  const colorClasses = {
    red: 'bg-red-200 text-red-800 border-red-400 hover:bg-red-300',
    orange: 'bg-orange-200 text-orange-800 border-orange-400 hover:bg-orange-300',
    yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400 hover:bg-yellow-300',
    green: 'bg-green-200 text-green-800 border-green-400 hover:bg-green-300',
    blue: 'bg-blue-200 text-blue-800 border-blue-400 hover:bg-blue-300',
    purple: 'bg-purple-200 text-purple-800 border-purple-400 hover:bg-purple-300',
    cyan: 'bg-cyan-200 text-cyan-800 border-cyan-400 hover:bg-cyan-300',
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full p-6 sm:p-8 border-3 rounded-2xl transition-all duration-200 min-h-[160px] sm:min-h-[180px] shadow-lg
        ${colorClasses[process.color] || colorClasses.blue}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105 active:scale-95 hover:shadow-xl'}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-4 h-full">
        <div className="p-5 rounded-xl bg-white shadow-md">
          {isLoading ? (
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-current border-t-transparent" />
          ) : (
            <Icon className="w-12 h-12" />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="font-black text-xl mb-2">{process.name}</h3>
          <p className="text-lg font-bold opacity-90">{process.description}</p>
        </div>
        
        {isLoading && (
          <div className="text-xl font-black">
            Processing...
          </div>
        )}
      </div>
    </button>
  )
}

export default ProcessCard