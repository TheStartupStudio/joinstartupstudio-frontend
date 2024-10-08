import React, { useEffect, useState } from 'react'
import './style/editPortfolio.css'
import IntlMessages from '../../utils/IntlMessages'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import { Skills } from '../../components/Portfolio/Skills'
import LicencesCertification from '../../components/Portfolio/LicensesCertification'
import { Link } from 'react-router-dom'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import { toast } from 'react-toastify'

function EditPortfolio() {
  const [toggle, setToggle] = useState(0)
  const [user, setUser] = useState()
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [aggred, setAggred] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  const checkIfAggre = () => {
    if (aggred) {
      updateStatus()
    }
  }

  const getUser = async () => {
    await axiosInstance
      .get(`/users`)
      .then((response) => {
        setUser(response.data)
        setToggle(response.data.is_published)
      })
      .catch((err) => err)
  }

  const updateStatus = async () => {
    await axiosInstance
      .put(`/users`, {
        is_published: !toggle,
      })
      .then(() => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => err)
  }

  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-11 pe-lg-5 gx-0 gx-sm-auto">
            <div className="page-padding">
              <div className="row">
                <div className="col-12 col-md-8">
                  <span className="my_portfolio_title">
                    <IntlMessages
                      id="register.my_portfolio"
                      className="title my_portfolio_title"
                    />
                  </span>
                  <span className="mx-2 my_portfolio_bar d-sm-inline">|</span>
                  <span className="text-uppercase title_preview_portfolio d-block d-sm-inline">
                    <Link to={'/preview-portfolio'}>
                      <IntlMessages id="portfolio.preview" />
                    </Link>
                  </span>
                  <p className="my_portfolio_edit">
                    <IntlMessages id="portfolio.my_portfolio_edit" />
                  </p>
                </div>
                <div className="col-lg-4 gx-lg-0">
                  <div className="col-12 ps-md-0">
                    <span className="  my_portfolio_publish pe-xxl-0 ">
                      <IntlMessages id="portfolio.Publish.My.Portfolio" />
                      <label className="px-0 ps-sm-1 ps-md-1  form-switch ">
                        <input
                          type="checkbox"
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

                    <span className="ps-xl-0 d-block mt-1 mt-1 float-xxl-end mt-sm-1 publish_checkbox_info ">
                      <IntlMessages id="portfolio.publish_checkbox" />
                    </span>
                  </div>
                </div>
              </div>
              <PersonalBio />
              <Skills user={user} />
              <LicencesCertification />
              <DeleteConfirmation
                showModal={showPublishModal}
                onHide={() => setShowPublishModal(false)}
                confirmModal={true}
                checkIfAggre={() => {
                  setLoading(true)
                  setAggred(true)
                  checkIfAggre()
                  setTimeout(() => {
                    setLoading(false)
                    setShowPublishModal(false)
                  }, 5000)
                }}
                loading={loading}
                setLoading={(data) => setLoading(data)}
                type={true}
                title={<IntlMessages id="portfolio.confirmation_modal" />}
                body={
                  <IntlMessages id="portfolio.confirmation_modal_second_part" />
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
