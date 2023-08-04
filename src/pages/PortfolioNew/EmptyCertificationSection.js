import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { EducationModal } from '../../components/Portfolio/Education/educationModal'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioSection from './PortfolioSection'
import { AccomplishmentModal } from '../../components/Portfolio/Accomplishment/accomplishmentModal'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import AddCertification from '../../components/Portfolio/LicensesCertification/addCertification'
import { useSelector } from 'react-redux'
const EmptyEducationSection = () => {
  const general = useSelector((state) => state.general)
  const userId = useSelector((state) => state.user.user.user.id)

  const [userCertification, setUserCertification] = useState([])
  const [addCertficateModal, setAddCertificateModal] = useState(false)
  const [certificateData, setCertifieData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getuserCertification()
  }, [])

  const getuserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      setTimeout(() => {
        setUserCertification(res.data.UserCertificates)
      }, 2000)
    })
  }

  const save = async (event) => {
    setLoading(true)

    let image = null

    if (general.croppedImage) {
      const formData = new FormData()
      formData.append('img', general.croppedImage)

      await axiosInstance
        .post('/upload/img-transform', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(async (response) => {
          image = response.data.fileLocation
        })
    }

    if (certificateData) {
      await axiosInstance
        .post('/userCertificates', {
          ...certificateData,
          image: image,
        })
        .then((res) => {
          toast.success(<IntlMessages id="alerts.success_change" />)
          setLoading(false)
          setAddCertificateModal(false)
          // setCertificateImage()
          setUserCertification((data) => [...data, res.data])
        })
        .catch((err) => {
          setAddCertificateModal(false)
          setLoading(false)
          // setCertificateImage()
          toast.error(<IntlMessages id="alerts.something_went_wrong" />)
        })
    }
  }
  return (
    <PortfolioSection title={'Education'}>
      {!userCertification.length && (
        <>
          <div
            className="border rounded px-5"
            style={{ width: '140px', height: '180px' }}
            onClick={() => setAddCertificateModal(true)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="w-100 h-100 skills-button"
              style={{
                cursor: 'pointer',
                // border: '1px solid #BBBDBF'
              }}
            />
          </div>
          <AddCertification
            show={addCertficateModal}
            onHide={() => {
              setAddCertificateModal(false)
            }}
            onSave={() => {
              save()
            }}
            loading={loading}
            setCertifieData={(data) => setCertifieData(data)}
          />
        </>
      )}
    </PortfolioSection>
  )
}

export default EmptyEducationSection
