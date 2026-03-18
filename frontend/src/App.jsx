import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Suggestions from './pages/Suggestions'
import RecipeDetail from './pages/RecipeDetail'
import History from './pages/History'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <Suggestions />
          </ProtectedRoute>
        } />
        <Route path="/recipe" element={
          <ProtectedRoute>
            <RecipeDetail />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}