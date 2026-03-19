import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipe } from '../context/useRecipe'
import { suggestDishes } from '../services/api'
import { useAuth } from '@clerk/clerk-react'

export default function Home() {
    const [input, setInput] = useState('')
    const { ingredients, setIngredients, setDishes, setSessionId, setLoading, loading, setError, error, reset } = useRecipe()
    const navigate = useNavigate()
    const { userId } = useAuth()

    const addIngredient = () => {
        const trimmed = input.trim()
        if (trimmed && !ingredients.includes(trimmed)) {
        setIngredients([...ingredients, trimmed])
        }
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') addIngredient()
    }

    const removeIngredient = (item) => {
        setIngredients(ingredients.filter(i => i !== item))
    }

    const handleSubmit = async () => {
        if (ingredients.length === 0) return
        setLoading(true)
        setError(null)
        try {
        const res = await suggestDishes(ingredients, userId)
        setDishes(res.data.dishes)
        setSessionId(res.data.session_id)
        navigate('/suggestions')
        } catch {
        setError('Something went wrong. Please try again.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center px-4">
        {/* Hero */}
        <div className="text-center mb-10">
            <div className="text-6xl mb-4">🍳</div>
            <h1 className="text-5xl font-bold mb-3">
            What's in your <span className="text-orange-400">kitchen?</span>
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto">
            Add your ingredients and ChefOS will suggest delicious dishes you can make right now.
            </p>
        </div>

        {/* Input */}
        <div className="w-full max-w-xl">
            <div className="flex gap-2 mb-4">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. chicken, garlic, tomato..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
            />
            <button
                onClick={addIngredient}
                className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
                Add
            </button>
            </div>

            {/* Ingredient chips */}
            {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
                {ingredients.map(item => (
                <span
                    key={item}
                    className="flex items-center gap-2 bg-orange-400/10 border border-orange-400/20 text-orange-300 px-3 py-1 rounded-full text-sm"
                >
                    {item}
                    <button
                    onClick={() => removeIngredient(item)}
                    className="text-orange-300/60 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                    ×
                    </button>
                </span>
                ))}
            </div>
            )}

            {/* Error */}
            {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Submit */}
            <button
            onClick={handleSubmit}
            disabled={ingredients.length === 0 || loading}
            className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer"
            >
            {loading ? (
  <span className="flex items-center justify-center gap-2">
    <span className="animate-spin">⏳</span> Finding recipes... (first load may take ~60s)
  </span>
) : (
  '🔍 Find Recipes'
)}

            {ingredients.length > 0 && (
            <button
                onClick={reset}
                className="w-full mt-3 text-white/30 hover:text-white/60 text-sm py-2 transition-colors cursor-pointer"
            >
                Clear all
            </button>
            )}
        </div>
        </div>
    )
}