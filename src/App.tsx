import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTelegram } from './hooks/useTelegram'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import EventDetailPage from './pages/EventDetailPage'
import LoginPage from './pages/LoginPage'
import CreateTrainingPage from './pages/CreateTrainingPage'
import EditTrainingPage from './pages/EditTrainingPage'
import TestEventsPage from './pages/TestEventsPage'
import SharedStorageTest from './components/SharedStorageTest'

function App() {
  const { user, isReady } = useTelegram()

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка приложения...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/:id/edit" element={<EditTrainingPage />} />
        <Route path="/create-training" element={<CreateTrainingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/test-events" element={<TestEventsPage />} />
      </Routes>
      <SharedStorageTest />
    </Layout>
  )
}

export default App 