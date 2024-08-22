import React, { useState } from 'react'
import { faDownload, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Modal, Row } from 'react-bootstrap'
import { SubmitButton } from '../ContentItems'
import template from '../../../../assets/files/CSV_LEARNERS_TEMPLATE.csv'
import '../Instructors/style.css'
import LtsFileDropzone from '../../../../ui/LtsFileDropzone'
import { Auth } from 'aws-amplify'
import { toast } from 'react-toastify'
import axiosInstance from '../../../../utils/AxiosInstance'
import csvToArrayLearners from '../../../CSVUpload/csvToArrayLearners'

const AddStudentBulkModal = ({ show, onHide, onSuccess }) => {
  const [csvLoading, setCsvLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUploaded, setUploaded] = useState(false)
  const [file, setFile] = useState(null)

  const csvSubmit = () => {
    if (!file) {
      toast.error('You need to upload a CSV file before submitting.')
      return
    }
    setCsvLoading(true)

    const reader = new FileReader()

    reader.onload = function (e) {
      try {
        const results = csvToArrayLearners(e.target.result, ',')
        submitHandler(results)
      } catch (error) {
        setCsvLoading(false)
        setUploaded(false)
        return toast.error(error.message)
      }
    }

    reader.readAsText(file)
  }

  const handleFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setFile(file)
      setUploaded(true)
    }
  }

  const submitHandler = async (results) => {
    setLoading(true)

    try {
      for (let student of results) {
        const { email, password, name } = student

        const res = await Auth.signUp({
          username: email,
          password: password,
          attributes: {
            'custom:universityCode': 'dev2020',
            'custom:isVerified': '1',
            'custom:language': 'en',
            'custom:email': email,
            'custom:password': password,
            name: name
          }
        })

        let payload = {
          ...student,
          cognito_Id: res.userSub,
          stripe_subscription_id: 'true',
          payment_type: 'school',
          is_active: 1
        }

        await axiosInstance.post('/instructor/add-users', payload)
      }

      setLoading(false)
      toast.success('Student(s) added successfully!')
      onSuccess()
      setCsvLoading(false)
      onHide()
    } catch (err) {
      setLoading(false)
      console.log('err', err)
      toast.error('Error adding student(s)')
      setCsvLoading(false)
    }
  }

  return (
    <>
      <Modal
        show={show}
        className={''}
        onHide={() => {
          onHide()
        }}
        centered
      >
        <Modal.Header className='position-relative p-3'>
          <Modal.Title
            className='px-3 py-3 d-flex fw-normal flex-column'
            style={{ fontSize: '16px' }}
          >
            <div
              className='d-flex align-items-center justify-content-center mb-3'
              style={{
                width: '36px',
                height: '36px',
                background: '#C8CDD880',
                fontSize: '15px',
                borderRadius: '50%'
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            Bulk Add New Student(s)
          </Modal.Title>
          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <Col>
            <a
              href={`${template}`}
              download
              className='d-flex align-items-center download'
            >
              <FontAwesomeIcon icon={faDownload} className='pe-2' />
              Download blank CSV template here
            </a>
          </Col>
          <Col>
            <LtsFileDropzone id='csvFile' onDrop={handleFileDrop} />
          </Col>
          <Col md='12' className='d-flex justify-content-end'>
            <Row className='m-0 col-5 justify-content-evenly'>
              <SubmitButton
                text={'CANCEL'}
                width={'100px'}
                background={'transparent'}
                color={'#000'}
                border={'1px solid #ccc'}
                onClick={() => onHide()}
              />
              <SubmitButton
                text={
                  csvLoading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'ADD STUDENT(S)'
                  )
                }
                background={'#52C7DE'}
                color={'#fff'}
                border={'none'}
                onClick={
                  isUploaded
                    ? () => {
                        setCsvLoading(true)
                        csvSubmit()
                      }
                    : () => {
                        toast.error(
                          'You need to upload a csv file before submit'
                        )
                      }
                }
              />
            </Row>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddStudentBulkModal
