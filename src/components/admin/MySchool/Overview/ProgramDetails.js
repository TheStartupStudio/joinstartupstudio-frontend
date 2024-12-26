import React, { useEffect, useState } from 'react'
import { InfoBox, SkillBox } from '../ContentItems'
import { Col, Row } from 'react-bootstrap'
import DefaultImage from '../../../../assets/images/myschool-logo.svg'
import axiosInstance from '../../../../utils/AxiosInstance'
import CustomSpinner from '../../../CustomSpinner'

const ProgramDetails = ({
  schoolDetails,
  programs,
  universityId,
  onSuccess
}) => {
  const [selectedPrograms, setSelectedPrograms] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('view')

  useEffect(() => {
    if (schoolDetails?.program_details?.programsImplemented) {
      const initialPrograms =
        schoolDetails.program_details.programsImplemented.map(
          (program) => program.id
        )
      setSelectedPrograms(initialPrograms)
    }
  }, [schoolDetails])

  const handleCheckboxChange = (programId) => {
    setSelectedPrograms((prevSelected) => {
      let updatedSelected
      if (prevSelected.includes(programId)) {
        updatedSelected = prevSelected.filter((id) => id !== programId)
      } else {
        updatedSelected = [...prevSelected, programId]
      }

      setHasChanges(true)
      return updatedSelected
    })
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      await axiosInstance.patch(
        `/my-school/overview/university/${universityId}/programs`,
        {
          programIds: selectedPrograms
        }
      )
      onSuccess()
      setHasChanges(false)
      setMode('view')
      setLoading(false)
    } catch (error) {
      console.error('Error saving changes:', error)
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
          <Col className='justify-content-center align-items-center'>
            <div className='item-profile__details'>
              <div
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '50%',
                  padding: '5px',
                  background: '#C8CDD880',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '10px'
                }}
              >
                <img
                  src={DefaultImage}
                  alt='Profile'
                  style={{
                    width: '23px',
                    height: '23px'
                  }}
                />
              </div>
              <p className='schooldetails-font p-0 m-0'>Program Details</p>
            </div>
          </Col>
          <Col className='schoolname-column-padd py-3'>
            <label htmlFor='' className='schoolname-font pb-2'>
              Number of Instructors
            </label>
            <p className='schoolnamedetail-font p-0 m-0'>
              {schoolDetails.program_details?.numberOfInstructors}
            </p>
          </Col>
          <Col>
            <label htmlFor='' className='pb-2'>
              Programs Implemented
            </label>
            <Row>
              {mode === 'edit' ? (
                <>
                  {programs?.length ? (
                    programs.map((program) => (
                      <SkillBox
                        key={program.id}
                        className='d-flex align-items-center justify-content-between'
                        color={
                          selectedPrograms.includes(program.id)
                            ? 'green'
                            : 'red'
                        }
                        text={
                          <>
                            <input
                              type='checkbox'
                              className='agGrid-customFilters__checkbox '
                              onChange={() => handleCheckboxChange(program.id)}
                              checked={selectedPrograms.includes(program.id)}
                            />
                            <span className='ml-2'>{program.name}</span>
                          </>
                        }
                      />
                    ))
                  ) : (
                    <SkillBox
                      className='d-flex align-items-center justify-content-center'
                      color={'green'}
                      text={'No programs available'}
                    />
                  )}
                </>
              ) : schoolDetails.program_details?.programsImplemented?.length ? (
                schoolDetails.program_details.programsImplemented.map((program, index) => {
                  const colors = ['green', 'blue', 'red'];
                  return (
                    <SkillBox
                      key={program.id}
                      className='d-flex align-items-center justify-content-center'
                      color={colors[index % colors.length]}
                      text={program.name}
                    />
                  )
                })
              ) : (
                <SkillBox
                  className='d-flex align-items-center justify-content-center'
                  color={'green'}
                  text={'No programs'}
                />
              )}
            </Row>
          </Col>
        </>
      )}
    </InfoBox>
  )
}

export default ProgramDetails
