import { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const RecipeContext = createContext()

export function RecipeProvider({ children }) {
    const [ingredients, setIngredients] = useState([])
    const [dishes, setDishes] = useState([])
    const [sessionId, setSessionId] = useState(null)
    const [selectedDish, setSelectedDish] = useState(null)
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const reset = () => {
        setIngredients([])
        setDishes([])
        setSessionId(null)
        setSelectedDish(null)
        setRecipe(null)
        setError(null)
    }

    return (
        <RecipeContext.Provider value={{
        ingredients, setIngredients,
        dishes, setDishes,
        sessionId, setSessionId,
        selectedDish, setSelectedDish,
        recipe, setRecipe,
        loading, setLoading,
        error, setError,
        reset
        }}>
        {children}
        </RecipeContext.Provider>
    )
}
