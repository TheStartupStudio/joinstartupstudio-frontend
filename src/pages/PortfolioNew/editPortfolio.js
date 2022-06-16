import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import './style/editPortfolio.css'
import IntlMessages from '../../utils/IntlMessages'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import axiosInstance from '../../utils/AxiosInstance'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import { Recommendation } from '../../components/Portfolio/Recommendation'
import { IAMR } from '../../components/Portfolio/IAMR'
import Licenses_Certification from '../../components/Portfolio/Licenses_Certification'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import { toast } from 'react-toastify'
import './style/previewPortfolio.css'
import { IsUserLevelAuthorized } from '../../utils/helpers'

function EditPortfolio() {
  const [toggle, setToggle] = useState(0)
  const [user, setUser] = useState()
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [aggred, setAggred] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendationRequestId, setRecommendationRequestId] = useState()
  const dispatch = useDispatch()

  const authorizedLevel = IsUserLevelAuthorized()
  const paramId = useParams().id

  useEffect(() => {
    window.location.href.includes('recommendation') &&
      setRecommendationRequestId(paramId)
  }, [paramId])

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  const getUser = async () => {
    await axiosInstance
      .get(`/users`)
      .then(async (response) => {
        setUser(response.data)
        await axiosInstance.get('/portfolio').then((response) => {
          setToggle(response.data.is_published)
        })
      })
      .catch((err) => err)
  }

  const updateStatus = async () => {
    await axiosInstance
      .put(`/portfolio`, {
        is_published: !toggle
      })
      .then((response) => {
        toast.success(<IntlMessages id='alerts.success_change' />)
        setToggle(!toggle)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.success_change' />)
        setToggle(!toggle)
      })
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-lg-11 pe-lg-5 gx-0 gx-sm-auto'>
            <div className='page-padding'>
              <div className='row'>
                <div className='col-12 col-lg-7 col-xl-8'>
                  <span className='my_portfolio_title'>
                    <IntlMessages
                      id='register.my_portfolio'
                      className='title my_portfolio_title'
                    />
                  </span>
                  <span className='mx-2 my_portfolio_bar d-sm-inline'>|</span>
                  <span className='text-uppercase title_preview_portfolio d-block d-sm-inline'>
                    <Link to={'/preview-portfolio'}>
                      <IntlMessages id='portfolio.preview' />
                    </Link>
                  </span>
                  <p className='my_portfolio_edit'>
                    <IntlMessages id='portfolio.my_portfolio_edit' />
                  </p>
                </div>
                <div className='col-lg-5 col-xl-4 gx-lg-0'>
                  <div className='col-12 ps-md-0'>
                    <span className='my_portfolio_publish pe-xxl-0 '>
                      <IntlMessages id='portfolio.Publish.My.Portfolio' />
                      <label className='px-0 ps-sm-1 ps-md-1 form-switch'>
                        <input
                          type='checkbox'
                          checked={toggle}
                          onChange={() => {
                            if (toggle) {
                              updateStatus()
                            } else {
                              setShowPublishModal(true)
                            }
                          }}
                        />
                        <i></i>
                      </label>
                    </span>

                    <span className='ps-xl-0 d-block mt-1 mt-sm-1 publish_checkbox_info'>
                      <IntlMessages id='portfolio.publish_checkbox' />
                    </span>
                  </div>
                </div>
              </div>
              <PersonalBio />
              {user && (
                <div>
                  <IAMR user={user} />
                  <Skills user={user} />
                  <div className='box-group-title pt-md-4'>
                    <h3 style={{ fontWeight: 'bold' }}>EXPERIENCE</h3>
                    <Experience user={user} />
                  </div>
                  {authorizedLevel && (
                    <Recommendation
                      user={user}
                      requestId={recommendationRequestId}
                    />
                  )}
                  <div className='box-group-title pt-md-4'>
                    <h3 style={{ fontWeight: 'bold' }}>
                      EDUCATION & ACCOMPLISHMENTS
                    </h3>
                    <Education user={user} />
                    <Accomplishment user={user} />
                  </div>
                </div>
              )}
              <Licenses_Certification user={user} />
              <DeleteConfirmation
                showModal={showPublishModal}
                onHide={() => setShowPublishModal(false)}
                confirmModal={() => true}
                checkIfAggre={() => {
                  updateStatus()
                  setLoading(true)
                  setAggred(true)
                  setTimeout(() => {
                    setLoading(false)
                    setShowPublishModal(false)
                  }, 5000)
                }}
                loading={loading}
                setLoading={(data) => setLoading(data)}
                type={true}
                title={<IntlMessages id='portfolio.confirmation_modal' />}
                body={
                  <IntlMessages id='portfolio.confirmation_modal_second_part' />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EditPortfolio
