import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Certification } from '../../../../components/Portfolio/Licenses_Certification/certification'
import axiosInstance from '../../../../utils/AxiosInstance'

export const EducationCertifications = (props) => {
  const userId = useSelector((state) => state.user.user.user.id)
  const [userCertification, setUserCertification] = useState([])

  useEffect(() => {
    !props.certificates
      ? getuserCertification()
      : setUserCertification(props.certificates)
  }, [])

  const getuserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      setUserCertification(res.data.UserCertificates)
    })
  }
  return (
    <>
      {userCertification?.length > 0 && (
        <>
          <div className='row mb-4 px-0'>
            <h4
              className={`preview_licenses_certification ${
                props.from_page !== 'preview' ? 'mt-5' : ''
              }`}
            >
              LICENSES & CERTIFICATIONS
            </h4>
            {userCertification?.map((data, index) => (
              <Certification data={data} key={index} />
            ))}
          </div>
        </>
      )}
    </>
  )
}
