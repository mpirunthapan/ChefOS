import { Link, useLocation } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'

export default function Navbar() {
    const location = useLocation()
    const { isSignedIn } = useAuth()

    const links = [
        { path: '/', label: 'Home' },
        { path: '/history', label: 'History' },
    ]

    return (
        <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-bold text-orange-400 tracking-tight">ChefOS</span>
        </Link>

        <div className="flex items-center gap-6">
            {links.map(link => (
            <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                    ? 'text-orange-400'
                    : 'text-white/60 hover:text-white'
                }`}
            >
                {link.label}
            </Link>
            ))}

            {isSignedIn ? (
            <UserButton
                appearance={{
                elements: {
                    avatarBox: 'w-8 h-8',
                }
                }}
            />
            ) : (
            <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                <button className="text-sm text-white/60 hover:text-white transition-colors">
                    Sign in
                </button>
                </SignInButton>
                <SignUpButton mode="modal">
                <button className="text-sm bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">
                    Sign up
                </button>
                </SignUpButton>
            </div>
            )}
        </div>
        </nav>
    )
}