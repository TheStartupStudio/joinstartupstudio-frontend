import useIamrInboxContext from '../iamrInboxContext'
import '../index.css'

function MenuOption({ allowedToShow, questionMenu, title, categoryOption }) {
  const { questionsMenuSelected, selectQuestionsMenu } = useIamrInboxContext()
  console.log('questionsMenuSelected', questionsMenuSelected)
  return (
    <>
      {allowedToShow && (
        <div
          className={`menu-option d-flex justify-content-between ${
            questionsMenuSelected === `${questionMenu}` ? 'selected' : ''
          }`}
          onClick={() => selectQuestionsMenu(questionMenu)}
        >
          <h5 className="my-auto">{title}</h5>
          <div className="unread-tickets-number my-auto">{categoryOption}</div>
        </div>
      )}
    </>
  )
}

export default MenuOption
