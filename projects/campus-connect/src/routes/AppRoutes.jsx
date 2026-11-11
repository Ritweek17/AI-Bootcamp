import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { EventDetailPage } from '../pages/EventDetailPage'
import { MyEventsPage } from '../pages/MyEventsPage'
import { AdminDashboard } from '../pages/AdminDashboard'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/my-events" element={<MyEventsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

