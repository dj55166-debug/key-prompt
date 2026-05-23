import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import HomeScreen from './screens/HomeScreen'
import PromptDetail from './screens/PromptDetail'
import CreatorProfile from './screens/CreatorProfile'
import AuthScreen from './screens/AuthScreen'
import SubmitPromptForm from './screens/SubmitPromptForm'
import MyLibrary from './screens/MyLibrary'
import SearchResults from './screens/SearchResults'

function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])
  if (user === undefined) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/prompt/:id" element={<PromptDetail />} />
        <Route path="/creator/:username" element={<CreatorProfile />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <AuthScreen />} />
        <Route path="/submit" element={<PrivateRoute><SubmitPromptForm /></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><MyLibrary /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}