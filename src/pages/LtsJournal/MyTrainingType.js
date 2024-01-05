import React, { useEffect, useState } from 'react'
import searchIcon from '../../assets/images/search-icon.png'
import LtsEduLogo from '../../assets/images/LTS-EDU-logo.png'
import {
  Route,
  Switch,
  useHistory
} from 'react-router-dom/cjs/react-router-dom.min'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-bootstrap'
import axiosInstance from '../../utils/AxiosInstance'
import MyTrainingContent from './MyTrainingContent'

const MyTrainingType = (props) => {
  const history = useHistory()
  const [journals, setJournals] = useState([])

  useEffect(() => {
    async function getJournals() {
      try {
        await axiosInstance.get(`/my-training`).then(({ data }) => {
          setJournals([...data.data].sort((a, b) => a.id - b.id))
        })
      } catch (err) {}
    }
    getJournals()
  }, [])

  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-11 px-0">
            <div className="page-padding">
              <div className="d-flex justify-content-between">
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
                    MY TRAINING
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      font: 'normal normal 600 13px/16px Montserrat',
                      letterSpacing: 0,
                      color: '#333D3D83',
                      width: '100%'
                    }}
                  >
                    Welcome to your LTS Training. Here you will find support and
                    guidancce as you enter into this new type of classroom.
                  </div>
                </div>
                <div>
                  <img
                    src={LtsEduLogo}
                    style={{ width: 200, objectFit: 'contain' }}
                    alt={'learn-to-start-edu'}
                  />
                </div>
              </div>

              <div className="page-header">
                <h3 className="page-header__title">
                  {/*<IntlMessages id={titleMapping[props.category]} />*/}
                </h3>
                <p className="page-header__description">
                  {/*<IntlMessages id={descriptionMapping[props.category]} />*/}
                </p>
              </div>
              <div className="page-card page-card--reverse">
                <div
                  className="page-card__content styled-scrollbar col-lg-8 col-md-7"
                  // ref={contentContainer}
                >
                  <Switch>
                    <Route
                      path={`${props.match.url}/:id`}
                      render={(renderprops) => (
                        <>
                          <MyTrainingContent
                            {...renderprops}
                            journals={journals}
                            // contentContainer={contentContainer}
                            backRoute={props.match.url}
                            // saved={journalChanged}
                            // view={'task'}
                          />
                        </>
                      )}
                    />
                  </Switch>
                </div>{' '}
                {/* page-card__content */}
                <div
                  className="page-card__sidebar col-lg-4 col-md-5"
                  style={{ overflow: 'auto' }}
                >
                  <div className="page-card__sidebar-header">
                    <label className="search-input">
                      <img
                        className="search-input__icon"
                        src={searchIcon}
                        alt="#"
                      />

                      <FormattedMessage
                        id="my_journal.search_journals"
                        defaultMessage="my_journal.search_journals"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            className="search-input__input"
                            name="searchedNote"
                            placeholder={placeholder}
                            onChange={(e) => {
                              // handleJournalSearch(e)
                            }}
                          />
                        )}
                      </FormattedMessage>
                    </label>
                  </div>

                  {journals?.map((journalItem, journalItemIdx) => (
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

export default MyTrainingType
