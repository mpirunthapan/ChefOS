import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipe } from '../context/useRecipe'

export default function RecipeDetail() {
    const { recipe, ingredients } = useRecipe()
    const navigate = useNavigate()
    const [checkedSteps, setCheckedSteps] = useState([])
    const [showAddons, setShowAddons] = useState(false)

    if (!recipe) {
        navigate('/')
        return null
    }

    const toggleStep = (i) => {
        setCheckedSteps(prev =>
        prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i]
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
            <button
            onClick={() => navigate('/suggestions')}
            className="text-white/30 hover:text-white/60 text-sm mb-4 transition-colors cursor-pointer"
            >
            ← Back to suggestions
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">
            {recipe.dish_name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
            {ingredients.map(ing => (
                <span key={ing} className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded-full">
                {ing}
                </span>
            ))}
            </div>
        </div>

        {/* Steps */}
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-orange-400">Steps</h2>
            <div className="space-y-3">
            {recipe.steps.map((step, i) => (
                <div
                key={i}
                onClick={() => toggleStep(i)}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    checkedSteps.includes(i)
                    ? 'bg-orange-400/5 border-orange-400/20 opacity-50'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                >
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    checkedSteps.includes(i)
                    ? 'bg-orange-400 border-orange-400'
                    : 'border-white/20'
                }`}>
                    {checkedSteps.includes(i) && (
                    <span className="text-black text-xs font-bold">✓</span>
                    )}
                </div>
                <div>
                    <span className="text-xs text-white/30 font-medium">Step {step.step_number}</span>
                    <p className={`text-sm mt-0.5 leading-relaxed ${checkedSteps.includes(i) ? 'line-through text-white/30' : 'text-white/80'}`}>
                    {step.instruction}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
            <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-orange-400">💡 Tips</h2>
            <div className="bg-orange-400/5 border border-orange-400/10 rounded-xl p-5 space-y-2">
                {recipe.tips.map((tip, i) => (
                <p key={i} className="text-sm text-white/70 flex gap-2">
                    <span className="text-orange-400">•</span> {tip}
                </p>
                ))}
            </div>
            </div>
        )}

        {/* Add-ons */}
        {recipe.addons && recipe.addons.length > 0 && (
            <div className="mb-10">
            <button
                onClick={() => setShowAddons(!showAddons)}
                className="flex items-center gap-2 text-xl font-bold text-orange-400 mb-4 hover:text-orange-300 transition-colors cursor-pointer"
            >
                ✨ Add-ons & Substitutes
                <span className="text-base">{showAddons ? '▲' : '▼'}</span>
            </button>
            {showAddons && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recipe.addons.map((addon, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="font-semibold text-white text-sm mb-1">{addon.name}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{addon.description}</p>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}

        {/* Progress */}
        <div className="sticky bottom-4 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm text-white/50">
            {checkedSteps.length} / {recipe.steps.length} steps done
            </span>
            <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full bg-orange-400 rounded-full transition-all"
                style={{ width: `${(checkedSteps.length / recipe.steps.length) * 100}%` }}
            />
            </div>
            {checkedSteps.length === recipe.steps.length && (
            <span className="text-green-400 text-sm font-semibold">🎉 Done!</span>
            )}
        </div>
        </div>
    )
}