import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { AccomplishmentModal } from './accomplishmentModal'
import { AccomplishmentDetails } from './accomplishmentDetails'
import '../Experience/style.css'
import './style.css'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { faGlobe, faFile } from '@fortawesome/free-solid-svg-icons'

export const Accomplishment = (props) => {
  const [showAccompModal, setShowAccompModal] = useState(false)
  const [accomps, setAccomp] = useState([])
  const [currentAccomp, setCurrentAccomp] = useState([])
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    getUserAccomplishments()
  }, [])

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_accomplishments)
  }, [props.user])

  useEffect(() => {
    if (currentAccomp.length !== 0) setShowAccompModal(true)
  }, [currentAccomp])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)
    await axiosInstance
      .put(`/users`, {
        show_accomplishments: !oldPublishValue,
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const getUserAccomplishments = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/accomplishments`)
      .then((res) => {
        setAccomp(res.data)
      })
  }

  const updateAccomp = async (accomp) => {
    setAccomp(
      accomps.map((acmp) => {
        if (acmp.id === accomp.id) return (acmp = accomp)
        return acmp
      })
    )
  }

  const deleteBackground = (id) => {
    setAccomp(accomps.filter((accomp) => accomp.id !== id))
  }

  const addAccomp = async (accomp) => {
    setAccomp([...accomps, accomp])
  }

  return (
    <>
      <div className="experiences-container mx-0 mt-4">
        {/*<div className='d-flex m-3 experience-header'>*/}
        {/*  <h4 className='title p-0 my-auto float-start'>ACCOMPLISHMENTS</h4>*/}
        {/*  <span className='float-end my-auto pe-1 pe-md-0'>*/}
        {/*    <FontAwesomeIcon*/}
        {/*      icon={faPlus}*/}
        {/*      className=''*/}
        {/*      style={{ height: '25px', width: '25px', cursor: 'pointer' }}*/}
        {/*      onClick={() => setShowAccompModal(true)}*/}
        {/*    />*/}
        {/*  </span>*/}
        {/*  <div className='break-experience'></div>*/}
        {/*  <div className='d-flex show_in_portfolio'>*/}
        {/*    <p className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2'>*/}
        {/*      Show in My Portfolio*/}
        {/*    </p>*/}

        {/*    <label className='px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex'>*/}
        {/*      <input*/}
        {/*        type='checkbox'*/}
        {/*        checked={isPublished}*/}
        {/*        onChange={() => updateShowPreference()}*/}
        {/*      />*/}
        {/*      <i className='my-auto'></i>*/}
        {/*    </label>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {accomps.length !== 0 ? (
          <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 row experience-details gap-4">
            {accomps.map((accomp, index, { length }) => {
              return (
                <div
                  style={{
                    border: '1px solid #E5E5E5',
                    borderRadius: 6,
                    background: '#F8F8F8 0% 0% no-repeat padding-box',
                  }}
                >
                  <AccomplishmentDetails
                    accomp={accomp}
                    key={accomp.id}
                    index={index}
                    length={length}
                    setCurrentAccomp={(accomp) => setCurrentAccomp(accomp)}
                    editing={true}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <p className="no-experience-added">
              You haven’t added any accomplishments… yet! Click the box below to
              add one.
            </p>
            <div className="m-3 experiences-container d-flex justify-content-center">
              <FontAwesomeIcon
                icon={faPlus}
                className="my-5"
                style={{
                  height: '56px',
                  width: '56px',
                  cursor: 'pointer',
                  color: '#BBBDBF',
                }}
                onClick={() => setShowAccompModal(true)}
              />
            </div>
          </>
        )}
      </div>
      <AccomplishmentModal
        show={showAccompModal}
        onHide={() => {
          setCurrentAccomp([])
          setShowAccompModal(false)
        }}
        updateAccomp={(accomp) => updateAccomp(accomp)}
        deleteBackground={(id) => deleteBackground(id)}
        addAccomp={(accomp) => addAccomp(accomp)}
        currentAccomp={currentAccomp}
      />
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
    </>
  )
}
