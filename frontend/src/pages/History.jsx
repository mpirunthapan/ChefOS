import { useEffect, useState } from 'react'
import { getHistory } from '../services/api'

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getHistory()
        .then(res => setHistory(res.data.history))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <span className="text-white/40 animate-pulse">Loading history...</span>
        </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">Recipe <span className="text-orange-400">History</span></h1>
            <p className="text-white/40">Your past recipe sessions</p>
        </div>

        {history.length === 0 ? (
            <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🍽️</div>
            <p>No recipes yet. Go cook something!</p>
            </div>
        ) : (
            <div className="space-y-4">
            {history.map((session, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-white">
                    {session.selected_dish || 'Unknown dish'}
                    </h3>
                    <span className="text-xs text-white/30">
                    {new Date(session.created_at).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {session.ingredients?.map((ing, j) => (
                    <span key={j} className="text-xs bg-orange-400/10 border border-orange-400/20 text-orange-300 px-2 py-1 rounded-full">
                        {ing}
                    </span>
                    ))}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    )
}