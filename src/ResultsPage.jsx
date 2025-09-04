import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './styles.css'

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) return <p>No results.</p>

  const { questions, answers } = state
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0), 0)

  return (
    <div className="container">
      <div className="score">🎉 You scored {score}/{questions.length} 🎉</div>
      {questions.map((q, i) => (
        <div
          key={i}
          className={
            answers[i] === q.answerIndex
              ? 'result-item correct'
              : 'result-item incorrect'
          }
        >
          <p dangerouslySetInnerHTML={{__html: q.question}} />
          <p><strong>Your answer:</strong> {q.options[answers[i]] || 'Skipped'}</p>
          <p><strong>Correct:</strong> {q.options[q.answerIndex]}</p>
        </div>
      ))}
      <button onClick={() => navigate('/')}>🔄 Restart Quiz</button>
    </div>
  )
}