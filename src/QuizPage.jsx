import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles.css'
import localData from './questions.json'

export default function QuizPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [started, setStarted] = useState(false) // ✅ Track quiz start
  const [loading, setLoading] = useState(false)

  async function fetchQuestions() {
    setLoading(true)

    // ✅ First try cached questions
    const cached = localStorage.getItem('quizQuestions')
    if (cached) {
      setQuestions(JSON.parse(cached))
      setLoading(false)
      return
    }

    if (navigator.onLine) {
      try {
        const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple')

        if (res.status === 429) {
          console.warn('Too many requests to API, using local JSON fallback.')
          setQuestions(localData)
          setLoading(false)
          return
        }

        const data = await res.json()

        if (data.results && data.results.length > 0) {
          const normalized = data.results.map((q, i) => {
            const options = [...q.incorrect_answers]
            const answerIndex = Math.floor(Math.random() * 4)
            options.splice(answerIndex, 0, q.correct_answer)
            return {
              id: i,
              question: q.question,
              options,
              answerIndex,
            }
          })
          setQuestions(normalized)
          localStorage.setItem('quizQuestions', JSON.stringify(normalized))
          setLoading(false)
          return
        }
      } catch (e) {
        console.warn('API fetch failed, falling back to local JSON.', e)
      }
    }

    setQuestions(localData)
    setLoading(false)
  }

  function handleAnswer(idx) {
    const updated = [...answers]
    updated[current] = idx
    setAnswers(updated)
  }

  function next() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
    } else {
      localStorage.removeItem('quizQuestions') // clear cache for new quiz
      navigate('/results', { state: { questions, answers } })
    }
  }

  // ✅ If quiz not started yet
  if (!started) {
    return (
      <div className="container start-screen">
        <h1>Welcome to the Quiz</h1>
        <p>Test your knowledge with 10 fun questions!</p>
        <button
          onClick={() => {
            setStarted(true)
            fetchQuestions()
          }}
        >
          Start Quiz
        </button>
      </div>
    )
  }

  if (loading) return <p style={{ color: '#fff' }}>Loading questions...</p>
  if (!questions.length) return <p style={{ color: '#fff' }}>No questions available.</p>

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="container">
      <div className="progress">
        <div className="progress-bar" style={{ width: progress + '%' }}></div>
      </div>
      <h2 dangerouslySetInnerHTML={{ __html: q.question }} />
      {q.options.map((opt, i) => (
        <label
          key={i}
          className={answers[current] === i ? 'selected' : ''}
        >
          <input
            type="radio"
            name="option"
            checked={answers[current] === i}
            onChange={() => handleAnswer(i)}
          />
          <span dangerouslySetInnerHTML={{ __html: opt }} />
        </label>
      ))}
      <button onClick={next}>
        {current + 1 === questions.length ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
