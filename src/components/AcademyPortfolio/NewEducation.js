import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaRegCalendarAlt } from 'react-icons/fa'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Switch from 'react-switch'
import { Button, Modal, ModalBody } from 'reactstrap'
import educationIcon from '../../assets/images/academy-icons/svg/education&ac.svg'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import ModalInput from '../ModalInput/ModalInput'

function NewEducation({ isOpen, setIsOpen }) {
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isCurrentStudent, setIsCurrentStudent] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} toggle={() => setIsOpen((prev) => !prev)}>
        <ModalBody>
          <img src={educationIcon} alt='user' className='mb-3' />
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
              Add New Education
            </h3>
          </div>

          <form action=''>
            <div
              className='mt-5 d-grid gap-5'
              style={{ gridTemplateColumns: '4fr 2fr' }}
            >
              <div>
                <h4 className='fs-15'>School Details</h4>
                <div className='d-flex flex-column gap-3'>
                  <ModalInput
                    id={'schoolname'}
                    labelTitle={'School Name'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'schoolUrl'}
                    labelTitle={'School Url'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'degree'}
                    labelTitle={'Degree'}
                    imgSrc={penIcon}
                  />
                </div>
              </div>
              <div>
                <h4 className='fs-15'>School Logo</h4>
                <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                  <img
                    className='trash-icon align-self-end'
                    src={trashIcon}
                    alt='trash'
                  />
                  <img
                    className='rounded-circle profile-container-pic'
                    src={universityFlorida}
                    alt='profile'
                  />
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <div className='d-flex gap-3 justify-content-between'>
                <div className='w-100 d-flex flex-column gap-2'>
                  <label className='fs-15 fw-medium'>Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className='form-control'
                    customInput={
                      <div className='d-flex align-items-center gap-2'>
                        <FaRegCalendarAlt className='calendar-icon' />
                        <input
                          className='cursor-pointer'
                          placeholder='Choose Date'
                          readOnly
                          value={
                            startDate
                              ? startDate.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : ''
                          }
                          style={{ background: 'transparent' }}
                        />
                      </div>
                    }
                  />
                </div>
                <div className='w-100 d-flex flex-column gap-2'>
                  <label className='fs-15 fw-medium'>End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className='form-control'
                    customInput={
                      <div className='d-flex align-items-center gap-2'>
                        <FaRegCalendarAlt className='calendar-icon' />
                        <input
                          className='cursor-pointer'
                          placeholder='Choose Date'
                          readOnly
                          value={
                            endDate
                              ? endDate.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : ''
                          }
                          style={{ background: 'transparent' }}
                        />
                      </div>
                    }
                  />
                </div>
                <div className='flex flex-col items-center'>
                  <label
                    className='fs-15 fw-medium white-space-no-wrap'
                    style={{ marginBottom: '.75rem' }}
                  >
                    Current Student
                  </label>
                  <Switch
                    checked={isCurrentStudent}
                    onChange={setIsCurrentStudent}
                    onColor='#4CAF50'
                    uncheckedIcon={false}
                    checkedIcon={false}
                  />
                </div>
              </div>
              <div className='mt-5'>
                <h4 className='fs-15'>Description</h4>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image']
                    ]
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-end mt-3 ms-2'>
              <div className='d-flex gap-3'>
                <Button
                  className='close-btn'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  CANCEL
                </Button>
                <button className='modal-save-btn'>SAVE</button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default NewEducation
