import { Col, Form } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const BriefingComponent = (props) => {
  const [briefing, setBriefing] = useState({
    date: '',
    title: '',
    source: '',
    synopsis: '',
    discussionQuestion: '',
    discussionPoints: '',
  })

  useEffect(() => {
    if (props.briefing) {
      setBriefing({
        ...props.briefing,
        date: new Date(props?.briefing?.date).toISOString().substring(0, 10),
      })
    }
  }, [props.briefing])

  useEffect(() => {
    props.handleChange({ ...briefing, id: briefing.id })
  }, [briefing])

  const onChangeBriefing = (name, value) => {
    setBriefing({ ...briefing, [name]: value })
  }
  return (
    <>
      <>
        <Form>
          <div className="mb-4 py-2 px-md-2 row">
            <Col sm={12} md={6}>
              <label htmlFor="title" className="brand-text">
                Date
              </label>
              <input
                type="date"
                name="date"
                className="mt-2 mb-2 col-12  p-md-2 w-100"
                placeholder={'Date'}
                value={briefing.date}
                onChange={(e) => onChangeBriefing('date', e.target.value)}
              />
            </Col>
            <Col sm={12} md={6}>
              <label htmlFor="title" className="brand-text">
                Source
              </label>
              <input
                name="source"
                className="mt-2 mb-2 col-12  p-md-2 w-100"
                placeholder={'Source'}
                style={{ resize: 'none' }}
                value={briefing.source}
                onChange={(e) => onChangeBriefing('source', e.target.value)}
              />
            </Col>
            <Col sm={12} md={6}>
              <label htmlFor="link" className="brand-text">
                Title
              </label>
              <input
                className="mt-2 mb-2 col-12 p-md-2"
                type="text"
                name="title"
                placeholder={'Title'}
                value={briefing.title}
                onChange={(e) => onChangeBriefing('title', e.target.value)}
              />
            </Col>
            <Col sm={12} md={6}>
              <label htmlFor="link" className="brand-text">
                Synopsis
              </label>
              <input
                className="mt-2 mb-2 col-12 p-md-2"
                type="text"
                name="synopsis"
                placeholder={'Synopsis'}
                value={briefing.synopsis}
                onChange={(e) => onChangeBriefing('synopsis', e.target.value)}
              />
            </Col>
            <Col sm={12} md={6}>
              <label htmlFor="link" className="brand-text">
                Discussion question
              </label>
              <input
                className="mt-2 mb-2 col-12 p-md-2"
                type="text"
                name="discussionQuestion"
                placeholder={'Discussion question'}
                value={briefing.discussionQuestion}
                onChange={(e) =>
                  onChangeBriefing('discussionQuestion', e.target.value)
                }
              />
            </Col>
            <Col sm={12} md={6}>
              <label htmlFor="link" className="brand-text">
                Discussion points
              </label>
              <input
                className="mt-2 mb-2 col-12 p-md-2"
                type="text"
                name="discussionPoints"
                placeholder={'Discussion points'}
                value={briefing.discussionPoints}
                onChange={(e) =>
                  onChangeBriefing('discussionPoints', e.target.value)
                }
              />
            </Col>
          </div>
        </Form>
      </>
    </>
  )
}
export default BriefingComponent
