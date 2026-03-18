import { useContext } from 'react'
import { RecipeContext } from './RecipeContext'

export const useRecipe = () => useContext(RecipeContext)