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
          onClick={() => history.push('/https://academy.learntostart.com/')}
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
    marginBottom: '100%',
    padding: '20px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#51c7df' // Changed from red to brand blue
  },
  message: {
    fontSize: '1.2rem',
    margin: '20px 0',
    color: '#333d3d' // Added brand text color
  },
  buttonContainer: {
    marginTop: '30px'
  },
  button: {
    padding: '12px 24px',
    marginRight: '10px',
    fontSize: '1rem',
    backgroundColor: '#51c7df', // Changed to brand blue
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px', // Matching brand style
    cursor: 'pointer',
    textTransform: 'uppercase', // Brand button style
    fontWeight: '600'
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#a7ca42', // Changed to brand green
    color: '#ffffff',
    border: 'none', 
    borderRadius: '10px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontWeight: '600'
  }
}

export default CancelSubscription
