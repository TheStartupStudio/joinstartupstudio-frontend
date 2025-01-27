import React, { useEffect, useState } from 'react'
import {
  NavLink,
  Route,
  Switch,
  useHistory,
  useRouteMatch
} from 'react-router-dom'
import MyTrainingContent from './MyTrainingContent'
import searchIcon from '../../assets/images/search-icon.png'
import { FormattedMessage } from 'react-intl'
import axiosInstance from '../../utils/AxiosInstance'
import LtsEduLogo from '../../assets/images/LTS-EDU-logo.png'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment/moment'
import { changeSidebarState } from '../../redux'
import { useDispatch } from 'react-redux'

const MyTraining = (props) => {
  const [trainings, setTrainings] = useState([])
  const match = useRouteMatch()
  const history = useHistory()
  let [journalActive, setJournalActive] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  async function getTrainings(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/my-training/`, {
        params: {
          category: props.category,

          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      })
      setTrainings([...data.data].sort((a, b) => a.id - b.id))
    } catch (err) {}
  }
  useEffect(() => {
    if (trainings.length) {
      const taskId = trainings.length > 0 ? trainings[0].id : ''
      history.push(`/${props.match?.url?.split('/')[1]}/${taskId}`)
    }
  }, [trainings])

  useEffect(() => {
    getTrainings()
  }, [])

  const [filteredJournals, setFilteredJournals] = useState(trainings)

  useEffect(() => {
    setFilteredJournals(trainings)
  }, [trainings])

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleJournalSearch = (e) => {
    e.preventDefault()
    const keyword = e.target.value.toLowerCase()
    setSearchKeyword(keyword)

    let filteredData = trainings.filter((task) =>
      task.title.toLowerCase().includes(keyword)
    )
    setFilteredJournals(filteredData)
  }

  const journalTitle = () => {
    let journalData

    if (props.category === 'my-training') {
      journalData = {
        title: 'MY TRAINING',
        description: `Welcome to your LTS Training. Here you will find support and guidance as you enter into this new type of classroom.`
      }
    }
    return journalData
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-11 px-0'>
            <div className='page-padding'>
              <div className='d-flex justify-content-between'>
                <div>
                  <div
                    style={{
                      fontSize: 27,
                      font: 'normal normal 600 30px/30px Montserrat',
                      letterSpacing: 0,
                      color: '#231F20',
                      marginBottom: 4
                    }}
                  >
                    {journalTitle()?.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      font: 'normal normal 600 13px/16px Montserrat',
                      letterSpacing: 0,
                      color: '#333D3D83',
                      width: '80%'
                    }}
                  >
                    {journalTitle()?.description}
                  </div>
                </div>
                <div>
                  <img
                    src={LtsEduLogo}
                    style={{ width: 180, objectFit: 'contain' }}
                    alt={'learn-to-start-edu'}
                  />
                </div>
              </div>

              <div className='page-header'>
                <h3 className='page-header__title'>
                  {/*<IntlMessages id={titleMapping[props.category]} />*/}
                </h3>
                <p className='page-header__description'>
                  {/*<IntlMessages id={descriptionMapping[props.category]} />*/}
                </p>
              </div>
              <div className='page-card page-card--reverse'>
                <div
                  className='page-card__content styled-scrollbar col-lg-8 col-md-7'
                  // ref={contentContainer}
                >
                  {
                    <Switch>
                      <Route
                        path={`${props.match.url}/:id`}
                        render={(renderprops) => (
                          <>
                            <MyTrainingContent
                              {...renderprops}
                              trainings={trainings}
                              backRoute={props.match.url}
                              view={'task'}
                            />
                          </>
                        )}
                      />
                    </Switch>
                  }
                </div>{' '}
                {/* page-card__content */}
                <div
                  className='page-card__sidebar col-lg-4 col-md-5'
                  style={{ overflow: 'auto' }}
                >
                  <div className='page-card__sidebar-header'>
                    <label className='search-input'>
                      <img
                        className='search-input__icon'
                        src={searchIcon}
                        alt='#'
                      />

                      <FormattedMessage
                        id='my_journal.search_journals'
                        defaultMessage='my_journal.search_journals'
                      >
                        {(placeholder) => (
                          <input
                            type='text'
                            className='search-input__input'
                            name='searchedNote'
                            placeholder={placeholder}
                            onChange={(e) => {
                              handleJournalSearch(e)
                            }}
                          />
                        )}
                      </FormattedMessage>
                    </label>
                  </div>

                  {filteredJournals.map((journalItem, journalItemIdx) => (
                    <div
                      key={journalItem.id}
                      className={`accordion-menu__item text-uppercase`}
                    >
                      <NavLink to={`${props.match.url}/${journalItem.id}`}>
                        <span
                          style={{
                            font: 'normal normal 500 14px/16px Montserrat',
                            letterSpacing: 0.56
                          }}
                        >
                          {journalItem.title}
                        </span>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTraining
