import React, { useEffect, useState } from 'react'
import { Col, Form, Modal } from 'react-bootstrap'
import Select from 'react-select'
import axiosInstance from '../../utils/AxiosInstance'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import './index.css'
import { useHistory } from 'react-router-dom'

const StudentOfInstructors = (props) => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedInstructors, setSelectedInstructors] = useState([])
  const [selectedInstructorsName, setSelectedInstructorsName] = useState([])
  const [isUniChosed, setUniChosed] = useState(0)
  const [totalNumber, setTotalNumber] = useState(-1)
  const [dashboardData, setDashboardData] = useState([])
  const [toShow, setStateToShow] = useState('none')
  const history = useHistory()

  const getData = async () => {
    await axiosInstance.get('/studentsInstructorss/init').then((res) => {
      setUniversities(res.data)
    })
    await axiosInstance.get('/dashboard').then((res) => {
      setDashboardData(res.data)
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
      .post('/studentsInstructorss/users-instructor/count', selectedInstructors)
      .then((responseData) => {
        setLoading(false)
        setTotalNumber(responseData.data.data)
        setSelectedInstructors([])
        setUniChosed(0)
        setSelectedInstructorsName([])
      })
  }

  useEffect(() => {
    if (props.allow) {
      getData()
    }
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const changeDashboard = async (value) => {
    await axiosInstance.put('/dashboard', dashboardData).then((res) => {
      res.data.updated
        ? toast.success('Data successfully updated')
        : toast.error('Data was not updated')
      history.go(0)
    })
  }

  return (
    <Modal
      show={props.onShow}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id=''
    >
      <Modal.Header className='contact-us-title my-auto general-modal-header p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2'>Admin panel</h3>
        <button
          type='button'
          className='btn-close me-1 mt-0 pt-1'
          aria-label='Close'
          onClick={() => {
            props.onHide()
            setStateToShow('none')
          }}
        />
      </Modal.Header>
      <Modal.Body style={{ minHeight: '150px' }}>
        <>
          <div className='row px-md-4 mt-md-4'>
            <div className='col-12 col-md-6 px-md-4'>
              <button
                className={`btn w-100  ${
                  toShow == 'CountStudent'
                    ? 'brand-button-active'
                    : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'CountStudent'
                    ? setStateToShow('none')
                    : setStateToShow('CountStudent')
                }
              >
                {toShow == 'CountStudent' ? 'Close' : 'Count student'}
              </button>
            </div>
            <div className='col-12 col-md-6 px-md-4'>
              <button
                className={`btn  w-100 brand-button ${
                  toShow == 'dashboard' ? 'brand-button-active' : 'brand-button'
                }`}
                onClick={() =>
                  toShow == 'dashboard'
                    ? setStateToShow('none')
                    : setStateToShow('dashboard')
                }
              >
                {toShow == 'dashboard' ? 'Close' : 'Edit dashboard'}
              </button>
            </div>
          </div>
        </>
        <div className='row'></div>
        {toShow != 'none' && <hr />}
        {toShow == 'dashboard' ? (
          <>
            <Form onSubmit={handleSubmit(changeDashboard)}>
              <div className='mb-4 py-2 px-md-2 row'>
                <Col sm={12} md={12}>
                  <label for='text' className='brand-text mt-3'>
                    Text to show
                  </label>
                  <textarea
                    className='mt-2 mb-2 col-12 p-md-2'
                    name='text'
                    rows={4}
                    placeholder={'Link'}
                    value={dashboardData ? dashboardData.text : ''}
                    {...register('text', {
                      required: true
                    })}
                    onChange={(e) =>
                      setDashboardData((old) => ({
                        ...old,
                        text: e.target.value
                      }))
                    }
                  />
                </Col>
                <Col sm={12} md={12}>
                  <label for='link' className='brand-text'>
                    Link to redirect
                  </label>
                  <input
                    className='mt-2 mb-2 col-12 p-md-2'
                    type='text'
                    name='link'
                    placeholder={'Link'}
                    {...register('link', {
                      required: true
                    })}
                    value={dashboardData ? dashboardData.link : ''}
                    onChange={(e) =>
                      setDashboardData((old) => ({
                        ...old,
                        link: e.target.value
                      }))
                    }
                  />
                </Col>
              </div>
              <button
                className='btn w-100 save-button add-new-note-button-text fw-bold brand-button'
                type='submit'
              >
                Submit
              </button>
            </Form>
          </>
        ) : (
          toShow == 'CountStudent' && (
            <>
              <div className='mb-4 py-2 px-md-2 row'>
                <>
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
                    {universities?.filter((uni) => uni.value == isUniChosed)[0]
                      ?.universityInstructors.length != 0 &&
                    !(
                      selectedInstructorsName.length == 0 &&
                      isUniChosed == 0 &&
                      totalNumber == -1
                    ) ? (
                      <>
                        <p className='text-starts fw-bold mb-3'>Instructors</p>
                      </>
                    ) : (
                      ''
                    )}
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
                              if (
                                selectedInstructors.includes(e.target.value)
                              ) {
                                const index = selectedInstructors.indexOf(
                                  e.target.value
                                )
                                if (index > -1) {
                                  // only splice array when item is found
                                  selectedInstructors.splice(index, 1) // 2nd parameter means remove one item only
                                }
                                const indexName =
                                  selectedInstructorsName.indexOf(e.target.name)
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
                      <p className={'w-100 py-0 mt-1 mb-0 text-start'}>
                        {instructor}
                      </p>
                    ))}
                  </div>
                </>
              </div>
            </>
          )
        )}
      </Modal.Body>
      <Modal.Footer style={{ border: '0px' }}>
        {toShow == 'CountStudent' && (
          <button
            className='float-end m-0 px-md-5 w-100 save-button add-new-note-button-text'
            onClick={submit}
          >
            {loading ? 'loading' : 'Show'}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default StudentOfInstructors
