import { useSelector } from 'react-redux'
import { Accordion } from 'react-bootstrap'
import '../index.css'
import MenuList from './menuList'
import MenuOption from './menuOption'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'

function EvaluationMenu(props) {
  const { isAdmin } = useSelector((state) => state.user.user)
  const [activeEventKey, setActiveEventKey] = useState('0') // Default to null

  const [journalCategory, setJournalCategory] = useState('')
  const [journalCategoryOptions, setJournalCategoryOptions] = useState([])

  const getUserTitles = async (category) => {
    try {
      const { data } = await axiosInstance.get(
        `/ltsJournals/fromInstructorAllJournals`,
        {
          params: {
            category: category,
            platform: 'instructor'
          }
        }
      )

      let journalOptions = []

      if (data && data.length > 0 && category !== 'student-wellnes') {
        for (let i = 0; i < data.length; i++) {
          const section = data[i]
          journalOptions = [...journalOptions, ...section.children]
        }
      } else {
        journalOptions = [...data]
      }

      setJournalCategoryOptions(journalOptions)
    } catch (err) {
      console.log(err, 'error')
    }
  }

  useEffect(() => {
    if (journalCategory && journalCategory.length > 0) {
      getUserTitles(journalCategory)
    }
  }, [journalCategory])

  const handleClick = (data) => {
    if (data.category === 'student-portfolio') {
      props.setJournalSelected('PORTFOLIO')
    }

    if (data.category === 'student-certificate') {
      props.setJournalSelected('CERTIFICATE')
    }

    if (data.category === journalCategory) {
      setJournalCategory('')
      setActiveEventKey(null) // Close the accordion
    } else {
      setJournalCategory(data.category)
      setActiveEventKey(data.journalId) // Open the accordion
    }
  }

  return (
    <div className='col-12 col-lg-3 inbox-menu'>
      <h4>My Evaluation</h4>
      <Accordion
        activeKey={activeEventKey}
        onSelect={(e) => setActiveEventKey(e)}
      >
        <MenuList
          title={'LTS JOURNAL'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'0'}
          handleClick={handleClick}
          category={'student-lts'}
          journalId={'0'}
        >
          {journalCategoryOptions &&
            journalCategoryOptions.length > 0 &&
            journalCategoryOptions.map((journal) => (
              <MenuOption
                key={journal.id}
                setJournalSelectedId={props.setJournalSelectedId}
                setJournalSelected={props.setJournalSelected}
                selectedJournal={props.journalSelected}
                allowedToShow={true}
                title={journal.title}
                id={journal.id}
              />
            ))}
        </MenuList>
        <MenuList
          title={'MENTORSHIP JOURNAL'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'1'}
          handleClick={handleClick}
          category={'my-mentorship'}
          journalId={'1'}
        >
          {journalCategoryOptions &&
            journalCategoryOptions.length > 0 &&
            journalCategoryOptions.map((journal) => (
              <MenuOption
                key={journal.id}
                allowedToShow={true}
                setJournalSelectedId={props.setJournalSelectedId}
                setJournalSelected={props.setJournalSelected}
                selectedJournal={props.journalSelected}
                title={journal.title}
                id={journal.id}
              />
            ))}
        </MenuList>
        <MenuList
          title={'PERSONAL FINANCE JOURNAL'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'2'}
          handleClick={handleClick}
          category={'student-personal-finance'}
          journalId={'2'}
        >
          {journalCategoryOptions &&
            journalCategoryOptions.length > 0 &&
            journalCategoryOptions.map((journal) => (
              <MenuOption
                key={journal.id}
                allowedToShow={true}
                setJournalSelectedId={props.setJournalSelectedId}
                setJournalSelected={props.setJournalSelected}
                selectedJournal={props.journalSelected}
                title={journal.title}
                id={journal.id}
              />
            ))}
        </MenuList>
        <MenuList
          title={'LEADERSHIP JOURNAL'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'3'}
          handleClick={handleClick}
          category={'student-leadership'}
          journalId={'3'}
        >
          {journalCategoryOptions &&
            journalCategoryOptions.length > 0 &&
            journalCategoryOptions.map((journal) => (
              <MenuOption
                key={journal.id}
                allowedToShow={true}
                setJournalSelectedId={props.setJournalSelectedId}
                setJournalSelected={props.setJournalSelected}
                selectedJournal={props.journalSelected}
                title={journal.title}
                id={journal.id}
              />
            ))}
        </MenuList>
        <MenuList
          title={'WELLNESS JOURNAL'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'4'}
          handleClick={handleClick}
          category={'student-wellnes'}
          journalId={'4'}
        >
          {journalCategoryOptions &&
            journalCategoryOptions.length > 0 &&
            journalCategoryOptions.map((journal) => (
              <MenuOption
                key={journal.id}
                allowedToShow={true}
                setJournalSelectedId={props.setJournalSelectedId}
                setJournalSelected={props.setJournalSelected}
                selectedJournal={props.journalSelected}
                title={journal.title}
                id={journal.id}
              />
            ))}
        </MenuList>
        {/* <MenuList
          title={'PORTFOLIO'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'5'}
          handleClick={handleClick}
          category={'student-portfolio'}
          journalId={'5'}
        ></MenuList>
        <MenuList
          title={'CERTIFICATE'}
          iconStyles={'me-2 me-md-0'}
          eventKey={'6'}
          handleClick={handleClick}
          category={'student-certificate'}
          journalId={'6'}
        ></MenuList> */}
      </Accordion>
    </div>
  )
}

export default EvaluationMenu
