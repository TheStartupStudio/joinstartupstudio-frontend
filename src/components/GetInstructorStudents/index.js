import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axiosInstance from '../../utils/AxiosInstance'

const StudentOfInstructors = (props) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedInstructors, setSelectedInstructors] = useState([])
  const [selectedInstructorsName, setSelectedInstructorsName] = useState([])
  const [isUniChosed, setUniChosed] = useState(0)
  const [totalNumber, setTotalNumber] = useState(-1)
  const getData = async () => {
    await axiosInstance.get('/resources/init').then((res) => {
      setUniversities(res.data)
    })
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided
    })
  }

  const submit = async () => {
    setLoading(true)
    await axiosInstance
      .post('/resources/users-instructor/count', selectedInstructors)
      .then((responseData) => {
        setLoading(false)
        setTotalNumber(responseData.data.data)
        setSelectedInstructors([])
        setUniChosed(0)
        setSelectedInstructorsName([])
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Modal
      show={props.onShow}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id=''
    >
      <Modal.Header className='contact-us-title my-auto general-modal-header p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>Admin panel</h3>
        <button
          type='button'
          className='btn-close me-1 mt-0 pt-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='mb-4 py-2 px-md-2 row'>
          <Select
            placeholder={'Select Uni'}
            options={universities}
            name='year'
            styles={{
              ...customStyles,
              menu: (provided) => ({
                ...provided,
                zIndex: 9999
              })
            }}
            className={`my-auto py-auto add-student-select col-12 mt-2 px-0 px-md-auto mb-4`}
            onChange={(e) => {
              setUniChosed(e.value)
              setSelectedInstructors([])
              setSelectedInstructorsName([])
              setTotalNumber(-1)
            }}
          />
          <div className='row col-12 col-md-7'>
            {universities
              .filter((univerity) => univerity.value == isUniChosed)[0]
              ?.universityInstructors.map((instructor, index) => (
                <div className='mb-2'>
                  <label for={`instructor ${instructor.User.id}`}>
                    {instructor.User.name}
                  </label>
                  <input
                    style={{ fontSize: '19px' }}
                    type='checkbox'
                    key={index + instructor.User.id}
                    id={`instructor ${instructor.User.id}`}
                    name={`${instructor.User.name}`}
                    value={`${instructor.instructorId}`}
                    className='my-auto float-end px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex'
                    onChange={(e) => {
                      if (selectedInstructors.includes(e.target.value)) {
                        const index = selectedInstructors.indexOf(
                          e.target.value
                        )
                        if (index > -1) {
                          // only splice array when item is found
                          selectedInstructors.splice(index, 1) // 2nd parameter means remove one item only
                        }
                        const indexName = selectedInstructorsName.indexOf(
                          e.target.name
                        )
                        if (indexName > -1) {
                          // only splice array when item is found
                          selectedInstructorsName.splice(indexName, 1) // 2nd parameter means remove one item only
                        }
                        setSelectedInstructorsName((old) => [
                          ...selectedInstructorsName
                        ])
                        setSelectedInstructors((old) => [
                          ...old,
                          selectedInstructors
                        ])
                      } else {
                        setSelectedInstructorsName((old) => [
                          ...old,
                          e.target.name
                        ])
                        setSelectedInstructors((old) => [
                          ...old,
                          e.target.value
                        ])
                      }
                    }}
                  />
                </div>
              ))}
          </div>
          {totalNumber != -1 ? (
            <p className='fw-bolder text-center w-100'>
              Total active students: {totalNumber}
            </p>
          ) : (
            ''
          )}
          {universities?.filter((uni) => uni.value == isUniChosed)[0]
            ?.universityInstructors.length == 0 ? (
            <p className='text-center fw-bold'>
              This university don't have any instructor
            </p>
          ) : (
            ''
          )}
          {selectedInstructorsName.length == 0 &&
          isUniChosed == 0 &&
          totalNumber == -1 ? (
            <p className='text-center fw-bold'>
              You don't have selected anything
            </p>
          ) : (
            ''
          )}
          <div className='col-12 col-md-5 text-center '>
            {selectedInstructorsName?.length != 0 ? (
              <span className='fw-bolder'>Selected Users</span>
            ) : (
              ''
            )}

            {selectedInstructorsName?.map((instructor) => (
              <p className={'w-100 py-0 mt-1 mb-0 text-start'}>{instructor}</p>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ border: '0px' }}>
        <button
          className='float-end m-0 px-md-5 w-100 save-button add-new-note-button-text'
          onClick={submit}
        >
          {loading ? 'loading' : 'Show'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default StudentOfInstructors
