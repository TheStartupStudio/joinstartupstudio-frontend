import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

function GoToJournal() {
  const history = useHistory()

  function goToJournal() {
    history.push('/dashboard')
  }

  goToJournal()

  return <></>
}

export default GoToJournal
