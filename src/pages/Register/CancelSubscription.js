import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

function CancelSubscription() {
  const history = useHistory()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Subscription Cancelled</h1>
      <p style={styles.message}>
        You’ve successfully cancelled the subscription process. If this was
        accidental, don’t worry — you can restart anytime.
      </p>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => history.push('/subscribe')}
          style={styles.button}
        >
          Try Again
        </button>
        <button
          onClick={() => history.push('/dashboard')}
          style={styles.secondaryButton}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '80px',
    padding: '20px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#cc0000'
  },
  message: {
    fontSize: '1.2rem',
    margin: '20px 0'
  },
  buttonContainer: {
    marginTop: '30px'
  },
  button: {
    padding: '12px 24px',
    marginRight: '10px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default CancelSubscription
