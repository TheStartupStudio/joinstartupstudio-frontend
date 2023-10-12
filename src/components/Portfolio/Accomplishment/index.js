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
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'
import EmptyAccomplishmentSection from '../../../pages/PortfolioNew/EmptyAccomplishmentSection'

export const Accomplishment = (props) => {
  const [showAccompModal, setShowAccompModal] = useState(false)
  const [accomps, setAccomp] = useState([])
  const [currentAccomp, setCurrentAccomp] = useState([])
  const [isPublished, setIsPublished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(null)

  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])

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
        show_accomplishments: !oldPublishValue
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const getUserAccomplishments = async () => {
    setIsLoading(true)
    await axiosInstance
      .get(`/userBackground/by-type/accomplishments/user/${props.user.id}`)
      .then((res) => {
        setAccomp(res.data)
        setIsLoading(false)
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

  return !isLoading ? (
    accomps.length ? (
      <PortfolioSection
        title={'ACCOMPLISHMENTS'}
        isAdd={true}
        showInMyPortfolio={true}
        onAdd={() => setShowAccompModal(true)}
        isShownInPortfolio={isPublished}
        handleShowInPortfolio={updateShowPreference}
        isPreview={isPreview}
      >
        <div className="experiences-container mx-0 mt-4">
          <div className="w-100 mx-auto  px-md-0 mx-md-0 row experience-details gap-4">
            {accomps.map((accomp, index, { length }) => {
              return (
                <div
                  key={index}
                  style={{
                    border: '1px solid #E5E5E5',
                    borderRadius: 6,
                    background: '#F8F8F8 0% 0% no-repeat padding-box'
                  }}
                >
                  <AccomplishmentDetails
                    accomp={accomp}
                    key={accomp.id}
                    index={index}
                    length={length}
                    setCurrentAccomp={(accomp) => setCurrentAccomp(accomp)}
                    editing={true}
                    isPreview={isPreview}
                  />
                </div>
              )
            })}
          </div>
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
      </PortfolioSection>
    ) : (
      <EmptyAccomplishmentSection
        addAccomplishment={addAccomp}
        user={props.user}
      />
    )
  ) : (
    <></>
  )
}
