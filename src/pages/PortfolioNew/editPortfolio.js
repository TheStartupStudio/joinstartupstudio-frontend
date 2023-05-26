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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import novaeLogo from '../../assets/images/novae-logo-horz.png'
import avatar from '../../assets/images/profile-image.png'
import EditBio from '../../components/Portfolio/PersonalBio/EditBio'

const ActionIcon = (props) => {
  return (
    <div
      style={{
        cursor: 'pointer',
        backgroundColor: 'rgba(229,229,229,0.57)',
        // borderRadius: '0px 6px 6px 0px',
        height: '50px',
        width: '50px',
        padding: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={props.handleOnClick}
    >
      <FontAwesomeIcon
        className="edit-pencil "
        icon={props.icon}
        style={{
          height: '25px',
          width: '25px',
        }}
      />
    </div>
  )
}

const PortfolioSection = (props) => {
  const [toggle, setToggle] = useState(0)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const updateStatus = async () => {
    await axiosInstance
      .put(`/portfolio`, {
        is_published: !toggle,
      })
      .then((response) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
  }

  return (
    <div
      style={{
        // height: 100,
        borderRadius: 6,
        border: '1px solid #BBBDBF',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        margin: '30px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: props.title ? 'space-between' : 'flex-end',
          height: 50,
        }}
      >
        {props.title ? (
          <div
            style={{
              textAlign: 'left',
              font: 'normal normal 600 22px/27px Montserrat',
              letterSpacing: 0,
              color: '#231F20',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 15,
            }}
          >
            {props.title}
          </div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {props.showInMyPortfolio ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className="my_portfolio_publish pe-xxl-0"
                style={{
                  font: 'normal normal 600 17px/20px Montserrat',
                  color: '#707070',
                }}
              >
                Show in my portfolio
                {/*<IntlMessages id="portfolio.Publish.My.Portfolio" />*/}
                <label className="px-0 ps-sm-1 ps-md-1 form-switch">
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
            </div>
          ) : null}
          {props.showLinkToProjects ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className="my_portfolio_publish pe-xxl-0"
                style={{
                  font: 'normal normal 600 17px/20px Montserrat',
                  color: '#707070',
                }}
              >
                Show link to my projects in my portfolio
                {/*<IntlMessages id="portfolio.Publish.My.Portfolio" />*/}
                <label className="px-0 ps-sm-1 ps-md-1 form-switch">
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
            </div>
          ) : null}
          {props.isAdd ? (
            <ActionIcon handleOnClick={props.onAdd} icon={faPlus} />
          ) : null}
          {props.isEdit ? (
            <ActionIcon handleOnClick={props.onEdit} icon={faPencilAlt} />
          ) : null}
        </div>
      </div>
      <div style={{ padding: '0 15px 30px 15px' }}>{props.children}</div>
    </div>
  )
}

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
        is_published: !toggle,
      })
      .then((response) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
  }

  const [showEditBioModal, setShowEditBioModal] = useState(false)
  const [showSkillBoxModal, setShowSkillBoxModal] = useState(false)
  const [showRemoveSkill, setShowRemoveSkill] = useState(false)

  const handleOpenEditBioModal = () => {
    setShowEditBioModal(true)
  }
  const handleCloseEditBioModal = () => {
    setShowEditBioModal(false)
  }
  const handleOpenSkillBoxModal = () => {
    setShowSkillBoxModal(true)
  }
  const handleCloseSkillBoxModal = () => {
    setShowSkillBoxModal(false)
  }
  const handleOpenRemoveSkillModal = () => {
    setShowRemoveSkill(true)
  }
  const handleCloseRemoveSkillModal = () => {
    setShowRemoveSkill(false)
  }

  const VerifyButton = () => {
    return (
      <div
        style={{
          border: '1px solid #F2359D',
          borderRadius: 3,
          color: '#F2359D',
          width: '75%',
          textAlign: 'center',
          padding: '10px 4px',
          height: 35,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F2359D' // Change background color on hover
          e.target.style.color = '#FFFFFF' // Change text color on hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent' // Revert background color on mouse leave
          e.target.style.color = '#F2359D' // Revert text color on mouse leave
        }}
      >
        Verify
      </div>
    )
  }

  return (
    <div style={{ padding: '30px 10px', width: '88%' }}>
      <div>
        <div>
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
      </div>
      <div
        style={{
          background: '#F8F7F7 0% 0% no-repeat padding-box',
          opacity: 1,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '30%' }}>
            <span className="my_portfolio_publish pe-xxl-0 ">
              <IntlMessages id="portfolio.Publish.My.Portfolio" />
              <label className="px-0 ps-sm-1 ps-md-1 form-switch">
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

            <span className="ps-xl-0 d-block mt-1 mt-sm-1 publish_checkbox_info">
              <IntlMessages id="portfolio.publish_checkbox" />
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <img
              style={{
                objectFit: 'contain',
                width: 170,
                height: 50,
                marginRight: -10,
                marginTop: -15,
              }}
              src={novaeLogo}
            />
            {/*<div*/}
            {/*  style={{*/}
            {/*    marginTop: -5,*/}
            {/*    font: 'normal normal 300 13px/14px Montserrat',*/}
            {/*    color: '#333D3D83',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Verify your portfolio through novae360.*/}
            {/*</div>*/}
          </div>
        </div>
        <PortfolioSection
          isEdit={true}
          isAdd={false}
          onEdit={handleOpenEditBioModal}
        >
          <PersonalBio
            showEditBioModal={showEditBioModal}
            onHide={handleCloseEditBioModal}
          />
        </PortfolioSection>
        {user && (
          <PortfolioSection showLinkToProjects={true}>
            <div
              style={{
                textAlign: 'end',
                marginRight: 40,
                textTransform: 'uppercase',
                font: 'normal normal 600 20px/24px Montserrat',
                letterSpacing: 0,
                color: '#51C7DF',
              }}
            >
              Edit my projects
            </div>
            <IAMR user={user} />
          </PortfolioSection>
        )}
        <PortfolioSection
          title={'Market-ready certified skills'}
          isEdit={true}
          isAdd={true}
          onAdd={handleOpenSkillBoxModal}
          onEdit={handleOpenRemoveSkillModal}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ width: '85%' }}>
              <Skills
                closeRemoveSkill={handleCloseRemoveSkillModal}
                removeSkillModal={showRemoveSkill}
                closeSkillBox={handleCloseSkillBoxModal}
                showSkillModal={showSkillBoxModal}
              />
            </div>
            <div
              className={'py-2'}
              style={{
                width: '15%',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'end',
              }}
            >
              <VerifyButton />
            </div>
          </div>
        </PortfolioSection>
        <div>
          <div
            style={{
              font: 'normal normal 600 24px Montserrat',
              letterSpacing: 0,
              color: '#231F20',
              marginLeft: 10,
            }}
          >
            EXPERIENCE
          </div>
          <PortfolioSection
            title={'Experience'}
            isAdd={true}
            showInMyPortfolio={true}
          >
            <Experience />
          </PortfolioSection>
        </div>
      </div>
    </div>

    // <div id='main-body'>
    //   <div className='container-fluid'>
    //     <div className='row'>
    //       <div className='col-12 col-lg-11 pe-lg-5 gx-0 gx-sm-auto'>
    //         <div className='page-padding'>
    //           <div className='row mx-0'>
    //             <div className='col-12 col-lg-7 col-xl-8 m-0 p-0'>
    //               <span className='my_portfolio_title'>
    //                 <IntlMessages
    //                   id='register.my_portfolio'
    //                   className='title my_portfolio_title'
    //                 />
    //               </span>
    //               <span className='mx-2 my_portfolio_bar d-sm-inline'>|</span>
    //               <span className='text-uppercase title_preview_portfolio d-block d-sm-inline'>
    //                 <Link to={'/preview-portfolio'}>
    //                   <IntlMessages id='portfolio.preview' />
    //                 </Link>
    //               </span>
    //               <p className='my_portfolio_edit'>
    //                 <IntlMessages id='portfolio.my_portfolio_edit' />
    //               </p>
    //             </div>
    //             <div className='col-lg-5 col-xl-4 gx-lg-0 m-0 p-0'>
    //               <div className='col-12 ps-md-0'>
    //                 <span className='my_portfolio_publish pe-xxl-0 '>
    //                   <IntlMessages id='portfolio.Publish.My.Portfolio' />
    //                   <label className='px-0 ps-sm-1 ps-md-1 form-switch'>
    //                     <input
    //                       type='checkbox'
    //                       checked={toggle}
    //                       onChange={() => {
    //                         if (toggle) {
    //                           updateStatus()
    //                         } else {
    //                           setShowPublishModal(true)
    //                         }
    //                       }}
    //                     />
    //                     <i></i>
    //                   </label>
    //                 </span>
    //
    //                 <span className='ps-xl-0 d-block mt-1 mt-sm-1 publish_checkbox_info'>
    //                   <IntlMessages id='portfolio.publish_checkbox' />
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //           <PersonalBio />
    //           {user && (
    //             <div>
    //               <IAMR user={user} />
    //               <Skills user={user} />
    //               <div className='box-group-title pt-md-4'>
    //                 <h3 style={{ fontWeight: 'bold' }}>EXPERIENCE</h3>
    //                 <Experience user={user} />
    //               </div>
    //               {authorizedLevel && (
    //                 <Recommendation
    //                   user={user}
    //                   requestId={recommendationRequestId}
    //                 />
    //               )}
    //               <div className='box-group-title pt-md-4'>
    //                 <h3 style={{ fontWeight: 'bold' }}>
    //                   EDUCATION & ACCOMPLISHMENTS
    //                 </h3>
    //                 <Education user={user} />
    //                 <Accomplishment user={user} />
    //               </div>
    //             </div>
    //           )}
    //           <Licenses_Certification user={user} />
    //           <DeleteConfirmation
    //             showModal={showPublishModal}
    //             onHide={() => setShowPublishModal(false)}
    //             confirmModal={() => true}
    //             checkIfAggre={() => {
    //               updateStatus()
    //               setLoading(true)
    //               setAggred(true)
    //               setTimeout(() => {
    //                 setLoading(false)
    //                 setShowPublishModal(false)
    //               }, 5000)
    //             }}
    //             loading={loading}
    //             setLoading={(data) => setLoading(data)}
    //             type={true}
    //             title={<IntlMessages id='portfolio.confirmation_modal' />}
    //             body={
    //               <IntlMessages id='portfolio.confirmation_modal_second_part' />
    //             }
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
export default EditPortfolio
