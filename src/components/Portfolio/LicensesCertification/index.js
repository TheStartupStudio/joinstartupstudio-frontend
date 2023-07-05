import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import IntlMessages from '../../../utils/IntlMessages'
import { Certification } from './certification.js'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'
import '../Experience/style.css'
import AddCertification from './addCertification'
import RemoveCertification from './removeCertifications'
import { toast } from 'react-toastify'
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'
import EmptyCertificationSection from '../../../pages/PortfolioNew/EmptyCertificationSection'
import addCertification from './addCertification'

export default function LicencesCertification(props) {
  const general = useSelector((state) => state.general)
  const userId = useSelector((state) => state.user.user.user.id)

  const [userCertification, setUserCertification] = useState([])
  const [addCertficateModal, setAddCertificateModal] = useState(false)
  // const [certificateImage, setCertificateImage] = useState()
  const [certificateData, setCertifieData] = useState()
  const [removeCertification, setRemoveCertification] = useState(false)
  const [certificatedToRemove, setCertificatedToRemove] = useState([])
  console.log(certificatedToRemove)
  console.log(userCertification)
  console.log('certificateData', certificateData)
  // const [uploadedImage, setUploadedImage] = useState()
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getuserCertification()
  }, [])

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_certifications)
  }, [props.user])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)
    await axiosInstance
      .put(`/users`, {
        show_certifications: !oldPublishValue
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }
  const removeCertificate = async () => {
    await axiosInstance
      .delete('/userCertificates/multiple', { data: certificatedToRemove })
      .then((res) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        let data = userCertification.filter(
          (item) => !certificatedToRemove.includes(item.id)
        )

        setUserCertification(data)
        setCertificatedToRemove([])
        setRemoveCertification(false)
        setIsLoading(false)
        // if (data) {
        //   getuserCertification()
        // }
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
        setCertificatedToRemove([])
        setRemoveCertification(false)
        // getuserCertification()
      })
  }

  const getuserCertification = async () => {
    setIsLoading(true)

    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      // setTimeout(() => {
      setUserCertification(res.data.UserCertificates)
      setIsLoading(false)
      // }, 2000)
    })
  }

  const editRevmoveCertification = (id) => {
    let array = certificatedToRemove
    const index = array.indexOf(id)
    if (index > -1) {
      array.splice(index, 1)
    }
    setCertificatedToRemove(array)
  }

  const save = async (event) => {
    setLoading(true)

    let image = null

    if (general.croppedImage) {
      const formData = new FormData()
      formData.append('img', general.croppedImage)

      await axiosInstance
        .post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (response) => {
          image = response.data.fileLocation
        })
    }

    if (certificateData) {
      await axiosInstance
        .post('/userCertificates', {
          ...certificateData,
          image: image
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

  const handleAddCertification = (certification) => {
    setUserCertification((data) => [...data, certification])
  }
  // console.log('isLoading', isLoading)

  // console.log(!isLoading, userCertification?.length)
  return (
    <>
      {!isLoading ? (
        userCertification?.length ? (
          <PortfolioSection
            title={'LICENSES & CERTIFICATIONS'}
            showInMyPortfolio={true}
            isAdd={true}
            isEdit={true}
            handleShowInPortfolio={updateShowPreference}
            isShownInPortfolio={isPublished}
            onAdd={() => setAddCertificateModal(true)}
            onEdit={() => setRemoveCertification(true)}
          >
            <div className="my-account rounded mx-0 mt-4">
              <div className="mx-3 mt-4 mb-4">
                {/*{userCertification.length > 0 ? (*/}
                <div
                  className="row"
                  style={{
                    rowGap: 20
                  }}
                >
                  {userCertification?.map((data, index) => (
                    <div
                      className="col-md-4 d-flex justify-content-center align-items-center"
                      key={index}
                    >
                      <Certification data={data} />
                    </div>
                  ))}
                </div>
                {/*// ) : (*/}
                {/*//   <div*/}
                {/*//     className="border rounded px-5"*/}
                {/*//     style={{ width: '140px', height: '180px' }}*/}
                {/*//     onClick={() => setAddCertificateModal(true)}*/}
                {/*//   >*/}
                {/*//     <FontAwesomeIcon*/}
                {/*//       icon={faPlus}*/}
                {/*//       className="w-100 h-100 skills-button"*/}
                {/*//       style={{*/}
                {/*//         cursor: 'pointer',*/}
                {/*//         // border: '1px solid #BBBDBF'*/}
                {/*//       }}*/}
                {/*//     />*/}
                {/*//   </div>*/}
                {/*// )*/}
              </div>
            </div>
          </PortfolioSection>
        ) : (
          <PortfolioSection title={'LICENSES & CERTIFICATIONS'}>
            {
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
                      cursor: 'pointer'
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
            }
          </PortfolioSection>
        )
      ) : (
        <></>
      )}{' '}
      <RemoveCertification
        show={removeCertification}
        onHide={() => setRemoveCertification(false)}
        data={userCertification}
        setCertificatedToRemove={(data) => setCertificatedToRemove(data)}
        editRevmoveCertification={(id) => editRevmoveCertification(id)}
        onSave={() => removeCertificate()}
      />
      <AddCertification
        show={addCertficateModal}
        onHide={() => {
          // setCertificateImage('')
          setAddCertificateModal(false)
        }}
        // uploadedImage={uploadedImage}
        // setCertificateImage={(data) => setCertificateImage(data)}
        // certificateImage={certificateImage}
        onSave={() => {
          save()
        }}
        loading={loading}
        setCertifieData={(data) => setCertifieData(data)}
      />
    </>
  )
}
