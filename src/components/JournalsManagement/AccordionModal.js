import React, { useState, useEffect } from 'react'
import ModalWrapper from '../Modals/Spotlight/ModalWrapper'
import axios from 'axios'
import axiosInstance from '../../utils/AxiosInstance'
import InterviewedMentorModal from './InterviewedMentorModal'
import LtsButton from '../LTSButtons/LTSButton'

function AccordionModal(props) {
  const [showInterviewedMentorModal, setShowInterviewedMentorModal] =
    useState(false)
  const handleShowInterviewedMentorModal = (row) => {
    setShowInterviewedMentorModal(true)
  }
  const handleHideInterviewedMentorModal = () => {
    setShowInterviewedMentorModal(false)
  }

  const [title, setTitle] = useState('')

  const isEdit = () => !!props.selectedAccordion?.id

  useEffect(() => {
    if (props.show) {
      setTitle(props.selectedAccordion ? props.selectedAccordion.title : '')
    }
  }, [props.show, props.selectedAccordion])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit()) {
        await axiosInstance
          .put(`/manageJournals/accordion/${props.selectedAccordion.id}`, {
            title
          })
          .then((res) => {
            props.onUpdateAccordion(res.data)
            props.onHide()
          })
      } else {
        await axiosInstance
          .post('/manageJournals/accordion', {
            title,
            journalId: props.selectedJournal?.value?.id
          })
          .then((res) => {
            props.onAddAccordion(res.data)
            props.onHide()
          })
      }
      // props.onSuccess()
    } catch (error) {
      console.error('Error saving accordion:', error)
    }
  }

  return (
    <ModalWrapper
      onHide={props.onHide}
      show={props.show}
      title={isEdit() ? 'Update Accordion' : 'Create Accordion'}
    >
      <div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={'my-2'}>
          <LtsButton
            type={'submit'}
            name={'Save'}
            align={'end'}
            width={'30%'}
            onClick={handleSubmit}
          />
        </div>
      </div>
      {isEdit() && (
        <LtsButton
          name={'Interviewed Mentor'}
          onClick={handleShowInterviewedMentorModal}
        />
      )}
      <InterviewedMentorModal
        onHide={handleHideInterviewedMentorModal}
        show={showInterviewedMentorModal}
        selectedAccordion={props.selectedAccordion}
        setSelectedAccordion={props.setSelectedAccordion}
      />
    </ModalWrapper>
  )
}

export default AccordionModal
