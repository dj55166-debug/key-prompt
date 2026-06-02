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
import PricingScreen from './screens/PricingScreen'
import ResetPassword from './screens/ResetPassword'
import NotFound from './screens/NotFound'

function PrivateRoute({ children, user }) {
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Safety timeout — if getSession() never resolves (broken client, network issue),
    // unblock the app after 5 seconds rather than spinning forever.
    const timeout = setTimeout(() => {
      console.warn('[App] getSession timed out after 5s — proceeding unauthenticated')
      setLoading(false)
    }, 5000)

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch(err => {
        clearTimeout(timeout)
        console.error('[App] getSession error:', err?.message)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => { clearTimeout(timeout); subscription.unsubscribe() }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen user={user} />} />
        <Route path="/search" element={<SearchResults user={user} />} />
        <Route path="/prompt/:id" element={<PromptDetail user={user} />} />
        <Route path="/creator/:username" element={<CreatorProfile user={user} />} />
        <Route path="/pricing" element={<PricingScreen user={user} />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <AuthScreen />}
        />

        <Route
          path="/submit"
          element={
            <PrivateRoute user={user}>
              <SubmitPromptForm user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/library"
          element={
            <PrivateRoute user={user}>
              <MyLibrary user={user} />
            </PrivateRoute>
          }
        />

        {/* Route aliases — common URL variants */}
        <Route path="/sign-in" element={<Navigate to="/login" replace />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/sign-up" element={<Navigate to="/login?mode=signup" replace />} />
        <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />
        <Route path="/register" element={<Navigate to="/login?mode=signup" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login?mode=forgot" replace />} />
        <Route path="/create" element={
          <PrivateRoute user={user}>
            <SubmitPromptForm user={user} />
          </PrivateRoute>
        } />

        {/* 404 — must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
