import { useNavigate } from 'react-router-dom'
import { useRecipe } from '../context/useRecipe'
import { getRecipe } from '../services/api'

const difficultyColor = {
    Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
    }

    export default function Suggestions() {
    const { dishes, ingredients, setSelectedDish, setRecipe, setLoading, loading } = useRecipe()
    const navigate = useNavigate()

    const handleSelect = async (dish) => {
        setLoading(true)
        setSelectedDish(dish)
        try {
        const res = await getRecipe(dish.name, ingredients)
        setRecipe(res.data.recipe)
        navigate('/recipe')
        } catch {
        alert('Failed to load recipe. Please try again.')
        } finally {
        setLoading(false)
        }
    }

    if (!dishes || dishes.length === 0) {
        navigate('/')
        return null
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold mb-2">
            Here's what you can <span className="text-orange-400">make</span>
            </h2>
            <p className="text-white/50">Pick a dish to see the full recipe</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dishes.map((dish, i) => (
            <button
                key={i}
                onClick={() => handleSelect(dish)}
                disabled={loading}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-400/30 rounded-2xl p-6 transition-all disabled:opacity-50 group cursor-pointer"
            >
                <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {dish.name}
                </h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${difficultyColor[dish.difficulty] || difficultyColor.Medium}`}>
                    {dish.difficulty}
                </span>
                </div>
                <p className="text-white/50 text-sm mb-4 leading-relaxed">{dish.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/40">
                <span>⏱ {dish.time}</span>
                <span className="text-orange-400/60 group-hover:text-orange-400 transition-colors">
                    View recipe →
                </span>
                </div>
            </button>
            ))}
        </div>

        <button
            onClick={() => navigate('/')}
            className="mt-8 text-white/30 hover:text-white/60 text-sm transition-colors block mx-auto cursor-pointer"
        >
            ← Change ingredients
        </button>
        </div>
    )
}