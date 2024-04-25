import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { Button, Col, Form, Row } from 'react-bootstrap'
import axiosInstance from '../../../utils/AxiosInstance'

function AddOccupationItemForm() {
  const nameInputRef = useRef(null)
  const { occupationGroupId } = useParams()
  const [name, setName] = useState('')
  const [job_summary, setSummary] = useState('')
  const [quick_facts, setQuick_facts] = useState([
    { title: '2022 Median Pay', text: '' },
    {
      title: 'Typical Entry-Level Education',
      text: 'High school diploma or equivalent'
    },
    { title: 'Work Experience in a Related Occupation', text: 'None' },
    { title: 'On-the-job Training', text: 'Moderate-term on-the-job training' },
    { title: 'Number of Jobs, 2022', text: '' },
    { title: 'Job Outlook, 2022-32', text: '' },
    { title: 'Employment Change, 2022-32', text: '' }
  ])
  const [details, setContent] = useState([
    { title: '', text: '' },
    { title: 'Work Environment', text: '' },
    { title: '', text: '' },
    { title: 'Pay', text: '' },
    { title: 'Job Outlook', text: '' },
    { title: 'State & Area Data', text: '' },
    { title: 'Similar Occupations', text: '' },
    { title: 'More Information, Including Links to O*NET', text: '' }
  ])

  const handleTitleChange = (index, value) => {
    const newContent = [...details]
    newContent[index].title = value
    setContent(newContent)
  }
  const handleTitleChangeQuickFact = (index, value) => {
    const newQuickFact = [...quick_facts]
    newQuickFact[index].title = value
    setQuick_facts(newQuickFact)
  }

  const handleTextChange = (index, value) => {
    const newContent = [...details]
    newContent[index].text = value
    setContent(newContent)
  }
  const handleTextChangeQuickFact = (index, value) => {
    const newQuickFact = [...quick_facts]
    newQuickFact[index].text = value
    setQuick_facts(newQuickFact)
  }

  // const addNewItem = () => {
  //   setContent([...details, { title: '', text: '' }])
  // }

  // const addNewQuickFact = () => {
  //   setQuick_facts([...quick_facts, { titile: '', text: '' }])
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axiosInstance
      .post('/pathways/occupation-jobs', {
        name,
        occupation_group_id: occupationGroupId,
        job_summary,
        details,
        quick_facts
      })
      .then(() => {
        setName('')
        setSummary('')
        setContent([
          { title: '', text: '' },
          { title: 'Work Environment', text: '' },
          { title: '', text: '' },
          { title: 'Pay', text: '' },
          { title: 'Job Outlook', text: '' },
          { title: 'State & Area Data', text: '' },
          { title: 'Similar Occupations', text: '' },
          { title: 'More Information, Including Links to O*NET', text: '' }
        ])
        setQuick_facts([
          { title: '2022 Median Pay', text: '' },
          {
            title: 'Typical Entry-Level Education',
            text: 'High school diploma or equivalent'
          },
          { title: 'Work Experience in a Related Occupation', text: 'None' },
          {
            title: 'On-the-job Training',
            text: 'Moderate-term on-the-job training'
          },
          { title: 'Number of Jobs, 2022', text: '' },
          { title: 'Job Outlook, 2022-32', text: '' },
          { title: 'Employment Change, 2022-32', text: '' }
        ])
        // alert('Occupation item saved successfully!')
      })
      .catch((error) => {
        console.error('Error saving occupation item:', error)
        alert('Error saving occupation item. Please try again.')
      })
  }

  const handleSaveButtonClick = () => {
    nameInputRef.current.focus()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md="2"></Col>
        <Col md="8">
          <Col md="12">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
                ref={nameInputRef}
              />
              <Form.Text className="text-muted">
                We'll never share your name with anyone else.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md="12">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summary"
                value={job_summary}
                onChange={(e) => setSummary(e.target.value.trim())}
              />
              <Form.Text className="text-muted">
                We'll never share your name with anyone else.
              </Form.Text>
            </Form.Group>
          </Col>
          {quick_facts.map((item, index) => (
            <Row key={index}>
              <Col md="6">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Quick fact title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={item.title}
                    onChange={(e) =>
                      handleTitleChangeQuickFact(index, e.target.value.trim())
                    }
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Quick fact content</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder=""
                    value={item.text}
                    onChange={(e) =>
                      handleTextChangeQuickFact(index, e.target.value.trim())
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
          {/* <Col className="pb-3">
            <Button type="button" onClick={addNewQuickFact}>
              Add Quick fact
            </Button>
          </Col> */}
          {details.map((item, index) => (
            <Row key={index}>
              <Col md="6">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Details title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={item.title}
                    onChange={(e) =>
                      handleTitleChange(index, e.target.value.trim())
                    }
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Details content</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder=""
                    value={item.text}
                    onChange={(e) =>
                      handleTextChange(index, e.target.value.trim())
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
          {/* <Col>
            <Button type="button" onClick={addNewItem}>
              Add Detail
            </Button>
          </Col> */}

          <Col className="mb-5">
            <Button type="submit" onClick={handleSaveButtonClick}>
              Save Item
            </Button>
          </Col>
        </Col>
        <Col md="2"></Col>
      </Row>
    </Form>
  )
}

export default AddOccupationItemForm
