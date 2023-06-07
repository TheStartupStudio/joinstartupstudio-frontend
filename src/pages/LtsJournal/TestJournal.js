import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  NavLink,
  Link,
  useParams,
  useHistory,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import searchIcon from '../../assets/images/search-icon.png'
import triangleIcon from '../../../src/assets/images/triangle.png'
import testOne from '../../../src/assets/images/test-1.PNG'

import TestJournalContent from './TestJournalContent'
import BreakdownTextAccordion from './BreakdownTextAccordion'
import './BreakdownTextAccordion.css'
import axiosInstance from '../../utils/AxiosInstance'
import LtsJournalContent from './content'

const AccordionImage = (props) => {
  return (
    <img
      src={props.image}
      alt={'test1'}
      className={'accordion-content-image'}
    />
  )
}

const SidebarMenuItem = (props) => {
  return (
    <div className={`accordion-menu__item`}>
      <NavLink
        className={
          window.location.pathname.includes('lts-journal') ||
          window.location.pathname.includes('personal-finance-journal')
            ? 'accordion-menu__item-toggle'
            : ''
        }
        to={`${props.toUrl}`}
      >
        <span className={'text-uppercase'}>{props.title}</span>
      </NavLink>
    </div>
  )
}
function TestJournal(props) {
  const [journals, setJournals] = useState([])
  // console.log(journals)
  // console.log(props)
  const getJournals = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions2')
      .then(({ data }) => {
        const filteredData = data.filter((d) => d.category === props.category)
        // debugger

        setJournals(filteredData)
        // setFetchingJournals(false)
      })
      .catch((e) => e)
  }
  async function getJournals2(redir = true) {
    try {
      let { data } = await axiosInstance.get(`/ltsJournals/`, {
        params: {
          category: props.category,
          platform:
            props.category === 'market-ready' ? 'student' : 'instructor',
        },
      })
      setJournals(data)

      // if (data.length > 0 && redir) {
      //   if (data[0].children && data[0].children.length > 0) {
      //     history.push(`${props.match.url}/${data[0].children[0].id}`)
      //   } else {
      //     history.push(`${props.match.url}/${data[0].id}`)
      //   }
      // }

      // if (journalActive == 'no') activeteFirstJournal()
    } catch (err) {}
  }

  useEffect(() => {
    getJournals()
    getJournals2()
  }, [])

  const history = useHistory()
  const params = useParams()

  const journalId = +history?.location?.pathname?.match(/\/(\d+)$/)[1]
  // console.log(journalId)
  //
  // console.log(journalId)
  // console.log(params)
  // console.log(history)
  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-11 px-0">
            <div className="page-padding">
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
                      path={`${props.match.url}/:journalId`}
                      render={(renderprops) => (
                        <>
                          <TestJournalContent
                            {...renderprops}
                            journals={journals}
                            // contentContainer={contentContainer}
                            backRoute={props.match.url}
                            // saved={journalChanged}
                          />
                        </>
                      )}
                    />
                  </Switch>
                  {/*<>*/}
                  {/*  {journals?.map((journal, index) => {*/}
                  {/*    return (*/}
                  {/*      journal.id === journalId && (*/}
                  {/*        <>*/}
                  {/*          <div*/}
                  {/*            style={{*/}
                  {/*              borderBottom: '1px solid #e3e3e3',*/}
                  {/*              padding: '15px 10px',*/}
                  {/*              textTransform: 'uppercase',*/}
                  {/*              font: 'normal normal bold 20px Montserrat',*/}
                  {/*              letterSpacing: 0.96,*/}
                  {/*              color: '#231F20',*/}
                  {/*            }}*/}
                  {/*          >*/}
                  {/*            {journal?.title}*/}
                  {/*          </div>*/}
                  {/*          <div*/}
                  {/*            className={'d-flex justify-content-between w-100'}*/}
                  {/*          >*/}
                  {/*            <div*/}
                  {/*              style={{*/}
                  {/*                width: '60%',*/}
                  {/*                backgroundColor: '#fff',*/}
                  {/*              }}*/}
                  {/*            >*/}
                  {/*              Video*/}
                  {/*            </div>*/}
                  {/*            <div style={{ width: '40%' }}>*/}
                  {/*              <img*/}
                  {/*                alt={'triangleIcon'}*/}
                  {/*                src={triangleIcon}*/}
                  {/*                style={{ width: 200, height: 200 }}*/}
                  {/*              />*/}
                  {/*            </div>*/}
                  {/*          </div>*/}
                  {/*          <div*/}
                  {/*            className={'my-4'}*/}
                  {/*            style={{*/}
                  {/*              font: 'normal normal 300 13px/16px Montserrat',*/}
                  {/*              letterSpacing: 0.52,*/}
                  {/*              color: '#333D3D',*/}
                  {/*            }}*/}
                  {/*          >*/}
                  {/*            {journal?.paragraph}*/}
                  {/*          </div>*/}

                  {/*          {journal?.breakdowns?.map((breakdown, index) => {*/}
                  {/*            return (*/}
                  {/*              <BreakdownTextAccordion*/}
                  {/*                title={breakdown?.title}*/}
                  {/*                content={breakdown?.content}*/}
                  {/*              />*/}
                  {/*            )*/}
                  {/*          })}*/}
                  {/*        </>*/}
                  {/*      )*/}
                  {/*    )*/}
                  {/*  })}*/}
                  {/*</>*/}
                </div>{' '}
                {/* page-card__content */}
                <div className="page-card__sidebar col-lg-4 col-md-5">
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
                  <div
                    style={{
                      background: '#51C7DF 0% 0% no-repeat padding-box',
                      border: '1px solid #51C7DF',
                      color: '#fff',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontSize: 12,
                      padding: '4px 10px',
                    }}
                  >
                    Change view
                  </div>
                  <div className="page-card__sidebar-content styled-scrollbar">
                    {journals.map((journal) => {
                      return (
                        <SidebarMenuItem
                          toUrl={`${props.match.url}/${journal.id}`}
                          title={journal.title}
                        />
                      )
                    })}
                  </div>
                </div>
                {/* page-card__sidebar */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(TestJournal, {
  withRef: false,
})
