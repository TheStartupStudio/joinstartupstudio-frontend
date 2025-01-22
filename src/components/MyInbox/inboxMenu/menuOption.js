import { useHistory } from 'react-router-dom'
import useInboxContext from '../inboxContext'
import '../index.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setMyInboxHash } from '../../../redux/general/Actions'

function MenuOption({ allowedToShow, questionMenu, title, categoryOption }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { questionsMenuSelected, selectQuestionsMenu } = useInboxContext()

  // const handleClick = () => {
  //   selectQuestionsMenu(questionMenu)
  //   if (window.location.hash) {
  //     history.replace(
  //       '/my-inbox',
  //       document.title,
  //       window.location.pathname + window.location.search
  //     )
  //   }
  // }

  const handleClick = () => {
    selectQuestionsMenu(questionMenu);
    const newUrl = `/my-inbox#${questionMenu}`;
    history.replace(newUrl);
    
  };
  useEffect(() => {
    dispatch(setMyInboxHash(questionsMenuSelected))

  }, [dispatch, questionsMenuSelected ])


  return (
    <>
      {allowedToShow && (
        <div
          className={`menu-option d-flex justify-content-between ${questionsMenuSelected === `${questionMenu}` ? 'selected' : ''}`}
          onClick={handleClick}
        >
          <h5 className='my-auto'>{title}</h5>
          <div className='unread-tickets-number my-auto'>{categoryOption}</div>
        </div>
      )}
    </>
  )
}

export default MenuOption
