import { InboxProvider } from '../../components/MyInbox/inboxContext'
import EvaluationMenu from '../../components/MyEvaluation/evaluationMenu/index'
// import InboxTickets from '../../components/IAMRinbox/inboxTickets'

// import './index.css'
import { useState } from 'react'
import Students from '../../components/MyEvaluation/students'

const EvaluationContainer = () => {
  const [journalSelectedId, setJournalSelectedId] = useState('')
  const [journalSelected, setJournalSelected] = useState('')

  console.log(journalSelected, 'EvaluationContainer')

  return (
    <div className='row iamr-inbox p-0 m-0'>
      <EvaluationMenu
        setJournalSelectedId={setJournalSelectedId}
        setJournalSelected={setJournalSelected}
        journalSelected={journalSelected}
      />
      <Students
        journalSelectedId={journalSelectedId}
        journalSelected={journalSelected}
      />
    </div>
  )
}

function MyEvaluation() {
  return (
    // <InboxProvider>
    <EvaluationContainer />
    // {/* </InboxProvider> */}
  )
}

export default MyEvaluation
