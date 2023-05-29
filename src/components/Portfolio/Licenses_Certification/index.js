import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import IntlMessages from '../../../utils/IntlMessages'
import { Certification } from './certification.js'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'
import '../Experience/style.css'
import AddCertification from './addCertification'
import RemoveCertification from './removeCertifications'
import { toast } from 'react-toastify'

export default function Licenses_Certification(pr) {
  const general = useSelector((state) => state.general)
  const userId = useSelector((state) => state.user.user.user.id)

  const [userCertification, setUserCertification] = useState([])
  const [addCertficateModal, setAddCertificateModal] = useState(false)
  // const [certificateImage, setCertificateImage] = useState()
  const [certificateData, setCertifieData] = useState()
  const [removeCertification, setRemoveCertification] = useState(false)
  const [certificatedToRemove, setCertificatedToRemove] = useState([])
  // const [uploadedImage, setUploadedImage] = useState()
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    getuserCertification()
  }, [])

  useEffect(() => {
    pr.user !== undefined && setIsPublished(pr.user?.show_certifications)
  }, [pr.user])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)
    await axiosInstance
      .put(`/users`, {
        show_certifications: !oldPublishValue,
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
        // getuserCertification()
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
        setCertificatedToRemove([])
        setRemoveCertification(false)
        getuserCertification()
      })
  }

  const getuserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      setTimeout(() => {
        setUserCertification(res.data.UserCertificates)
      }, 2000)
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
    <>
      <div className="my-account rounded mx-0 mt-4">
        {/*<div className='experiences-container' style={{ border: '0' }}>*/}
        {/*  <div className='d-flex m-3 experience-header'>*/}
        {/*    <h4*/}
        {/*      className='title p-0 my-auto float-start'*/}
        {/*      style={{ width: '0' }}*/}
        {/*    >*/}
        {/*      LICENSES & CERTIFICATIONS*/}
        {/*    </h4>*/}
        {/*    <span className='float-end my-auto px-2 ms-auto'>*/}
        {/*      <FontAwesomeIcon*/}
        {/*        icon={faPlus}*/}
        {/*        className='mx-3'*/}
        {/*        style={{ height: '25px', width: '25px', cursor: 'pointer' }}*/}
        {/*        onClick={() => setAddCertificateModal(true)}*/}
        {/*      />*/}
        {/*    </span>*/}
        {/*    {userCertification.length > 0 && (*/}
        {/*      <span className='float-end my-auto pe-1 pe-md-0'>*/}
        {/*        <FontAwesomeIcon*/}
        {/*          icon={faPencilAlt}*/}
        {/*          className='icon'*/}
        {/*          style={{ height: '25px', width: '25px', cursor: 'pointer' }}*/}
        {/*          onClick={() => {*/}
        {/*            setRemoveCertification(true)*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      </span>*/}
        {/*    )}*/}
        {/*    <div className='break-experience'></div>*/}
        {/*    <div className='d-flex show_in_portfolio'>*/}
        {/*      <p className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2'>*/}
        {/*        Show in My Portfolio*/}
        {/*      </p>*/}

        {/*      <label className='px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex'>*/}
        {/*        <input*/}
        {/*          type='checkbox'*/}
        {/*          checked={isPublished}*/}
        {/*          onChange={() => updateShowPreference()}*/}
        {/*        />*/}
        {/*        <i className='my-auto'></i>*/}
        {/*      </label>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* <h4 className='m-3'>
          <IntlMessages id='portfolio.LICENSES_CERTIFICATIONS' />
          <span className='float-end'>
            <FontAwesomeIcon
              icon={faPlus}
              className='mx-4 icon'
              onClick={() => setAddCertificateModal(true)}
            />
            <FontAwesomeIcon
              icon={faPencilAlt}
              className='icon'
              onClick={() => {
                setRemoveCertification(true)
              }}
            />
          </span>
        </h4> */}
        <div className="mx-3 mt-4 mb-4">
          {userCertification.length > 0 ? (
            <div className="row">
              {userCertification?.map((data, index) => (
                <div
                  className="col-md-4 d-flex

                  justify-content-center align-items-center"
                  key={index}
                >
                  <Certification data={data} />
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </div>
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
