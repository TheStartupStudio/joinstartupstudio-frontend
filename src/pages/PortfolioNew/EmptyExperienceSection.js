import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { EducationModal } from '../../components/Portfolio/Education/educationModal'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioSection from './PortfolioSection'
import { AccomplishmentModal } from '../../components/Portfolio/Accomplishment/accomplishmentModal'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
const EmptyEducationSection = () => {
  const [showAccompModal, setShowAccompModal] = useState(false)
  const [accomps, setAccomp] = useState([])
  const [currentAccomp, setCurrentAccomp] = useState([])

  useEffect(() => {
    getUserAccomplishments()
  }, [])

  useEffect(() => {
    if (currentAccomp.length !== 0) setShowAccompModal(true)
  }, [currentAccomp])

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
    <PortfolioSection title={'Education'}>
      {!accomps.length && (
        <>
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
        </>
      )}
    </PortfolioSection>
  )
}

export default EmptyEducationSection
