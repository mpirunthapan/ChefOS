import { useAuth, SignIn } from '@clerk/clerk-react'

export default function ProtectedRoute({ children }) {
    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <span className="text-white/40 animate-pulse">Loading...</span>
        </div>
        )
    }

    if (!isSignedIn) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center mb-4">
            <div className="text-5xl mb-3">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to continue</h2>
            <p className="text-white/40">You need an account to view recipes and history</p>
            </div>
            <SignIn routing="hash" />
        </div>
        )
    }

    return children
}