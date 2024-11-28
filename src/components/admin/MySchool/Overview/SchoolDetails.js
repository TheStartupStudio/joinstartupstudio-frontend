import React, { useEffect, useState } from 'react'
import { InfoBox } from '../ContentItems'
import { Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import schoolIcon from '../../../../assets/images/myschool-college.svg'
import axiosInstance from '../../../../utils/AxiosInstance'
import CustomSpinner from '../../../CustomSpinner'
import { CustomInput } from '../../../../ui/ContentItems'

const SchoolDetails = ({ schoolDetails, onSuccess, universityId }) => {
  const [mode, setMode] = useState('view')
  const [newName, setNewName] = useState(schoolDetails.school_details?.name)
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNewName(schoolDetails.school_details?.name)
    setHasChanges(false)
  }, [schoolDetails])

  const handleInputChange = (e) => {
    setNewName(e.target.value)
    setHasChanges(e.target.value !== schoolDetails.school_details?.name)
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      await axiosInstance.patch(
        `/my-school/overview/university/${universityId}/details`,
        { name: newName }
      )
      onSuccess()
      setHasChanges(false)
      setMode('view')
      setLoading(false)
    } catch (error) {
      console.error('Error saving changes:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <InfoBox
      isEditable
      style={{ minHeight: '330px' }}
      setMode={setMode}
      hasChanges={hasChanges}
      onSaveChanges={handleSaveChanges}
    >
      {loading ? (
        <div
          style={{ height: '300px' }}
          className='d-flex align-items-center justify-content-center'
        >
          <CustomSpinner />
        </div>
      ) : (
        <>
          <Row className='justify-content-center align-items-center '>
            <Col md='7' sm='12'>
              <div className='item-profile__details'>
                <div
                  style={{
                    height: '36px',
                    width: '46px',
                    borderRadius: '50%',
                    padding: '5px',
                    background: '#C8CDD880',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px'
                  }}
                >
                  {/* <FontAwesomeIcon icon={schoolIcon} /> */}
                  <img src={schoolIcon} width={100} height={100}></img>
                </div>
                <p className='schooldetails-font p-0 m-0'>School Details</p>
              </div>
            </Col>
            <Col md='5' sm='12'>
              <div className='d-flex align-items-center item-profile__details'>
                <span className='dot me-2'></span>
                Active
              </div>
            </Col>
          </Row>
          <Col className='schoolname-column-padd py-3'>
            <label htmlFor='' className='schoolname-font pb-2'>
              School Name
            </label>
            {mode === 'edit' ? (
              <CustomInput
                type='text'
                name='newname'
                value={newName}
                handleChange={handleInputChange}
              />
            ) : (
              <p className='schoolnamedetail-font p-0 m-0'>
                {schoolDetails.school_details?.name}
              </p>
            )}
          </Col>
          <Col className='py-1'>
            <label htmlFor='' className=' pb-2'>
              Specialist
            </label>
            <p className='specialistname-font p-0 m-0'>
              {schoolDetails.school_details?.specialist.name}
            </p>
            <p className='specialistemail-font p-0 m-0'>
              {schoolDetails.school_details?.specialist?.email}
            </p>
          </Col>
        </>
      )}
    </InfoBox>
  )
}

export default SchoolDetails
