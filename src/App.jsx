import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import QuizPage from './QuizPage'
import ResultsPage from './ResultsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  )
}