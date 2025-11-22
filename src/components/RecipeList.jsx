import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { FileText, Eye, User, Calendar, BarChart3 } from 'lucide-react'
import { brewfatherAPI } from '../services/brewfather'

const RecipeList = ({ searchTerm }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const { data: recipes, isLoading } = useQuery(
    'recipes',
    () => brewfatherAPI.getRecipes({ limit: 50, complete: false }),
    { refetchInterval: 60000 }
  )

  const filteredRecipes = recipes?.data?.filter(recipe =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.style?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recipes ({filteredRecipes.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{recipe.name}</h4>
                  
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {recipe.author || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {recipe.style?.name || 'No style'}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {recipe.type || 'All Grain'}
                    </div>
                  </div>

                  {recipe.og && recipe.fg && (
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span>OG: {recipe.og}</span>
                      <span>FG: {recipe.fg}</span>
                      <span>ABV: {recipe.abv?.toFixed(1)}%</span>
                      <span>IBU: {recipe.ibu?.toFixed(0)}</span>
                      <span>SRM: {recipe.color?.toFixed(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View Recipe"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  )
}

const RecipeDetailModal = ({ recipe, onClose }) => {
  const { data: fullRecipe, isLoading } = useQuery(
    ['recipe', recipe._id],
    () => brewfatherAPI.getRecipe(recipe._id, 'fermentation,mash'),
    { enabled: !!recipe._id }
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{recipe.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recipe Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Original Gravity</label>
                  <p className="mt-1 text-lg font-semibold">{recipe.og}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Final Gravity</label>
                  <p className="mt-1 text-lg font-semibold">{recipe.fg}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ABV</label>
                  <p className="mt-1 text-lg font-semibold">{recipe.abv?.toFixed(1)}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IBU</label>
                  <p className="mt-1 text-lg font-semibold">{recipe.ibu?.toFixed(0)}</p>
                </div>
              </div>

              {/* Description */}
              {recipe.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1 text-gray-600">{recipe.notes}</p>
                </div>
              )}

              {/* Fermentables */}
              {fullRecipe?.data?.fermentables && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Fermentables</h4>
                  <div className="bg-gray-50 rounded p-3">
                    {fullRecipe.data.fermentables.map((fermentable, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span>{fermentable.name}</span>
                        <span className="text-sm text-gray-600">
                          {fermentable.amount}kg ({fermentable.percentage?.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hops */}
              {fullRecipe?.data?.hops && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Hops</h4>
                  <div className="bg-gray-50 rounded p-3">
                    {fullRecipe.data.hops.map((hop, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span>{hop.name}</span>
                        <span className="text-sm text-gray-600">
                          {hop.amount}g - {hop.time}min ({hop.use})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeList