import { useHistory } from 'react-router-dom'
import useInboxContext from '../inboxContext'
import '../index.css'

function MenuOption({ allowedToShow, questionMenu, title, categoryOption }) {
  const history = useHistory()
  const { questionsMenuSelected, selectQuestionsMenu } = useInboxContext()

  const handleClick = () => {
    selectQuestionsMenu(questionMenu)
    if (window.location.hash) {
      history.replace(
        '/my-inbox',
        document.title,
        window.location.pathname + window.location.search
      )
    }
  }

  return (
    <>
      {allowedToShow && (
        <div
          className={`menu-option d-flex justify-content-between ${
            questionsMenuSelected === `${questionMenu}` ? 'selected' : ''
          }`}
          onClick={handleClick}
        >
          <h5 className="my-auto">{title}</h5>
          <div className="unread-tickets-number my-auto">{categoryOption}</div>
        </div>
      )}
    </>
  )
}

export default MenuOption
