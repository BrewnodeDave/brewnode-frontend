import React from 'react'
import { Beaker } from 'lucide-react'

const FermenterSelector = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Beaker className="w-8 h-8 text-purple-600" />
        <h3 className="text-2xl font-black text-gray-800">Fermenter</h3>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-purple-600 bg-purple-50">
        <Beaker className="w-10 h-10 text-purple-600" />
        <div>
          <div className="text-lg font-bold text-purple-900">Fermenter</div>
          <div className="text-xs text-gray-500 mt-1">Temperature monitoring and control</div>
        </div>
      </div>
    </div>
  )
}

export default FermenterSelector
