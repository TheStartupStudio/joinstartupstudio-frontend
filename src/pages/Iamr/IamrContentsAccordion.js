import React from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Accordion, AccordionToggle } from 'react-bootstrap'
import './index.css'
import ImrContent from './ImrContent'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import ImrSubContent from './ImrSubContent'
import InstructionsQuestions from './Instructions&Questions'
const accordionData = [
  {
    id: 1,
    title: 'Section 1',
    links: [
      { id: 1, url: 'google0.com', title: 'google', type: 'question' },
      {
        id: 2,
        url: 'google1.com',
        title: 'google',
        type: 'InstructionsQuestions'
      },
      {
        id: 3,
        url: 'google.com',
        title: 'google',
        type: 'InstructionsQuestions'
      },
      {
        id: 4,
        url: 'google.com',
        title: 'google',
        type: 'InstructionsQuestions'
      }
    ]
  },
  {
    id: 2,
    title: 'Section 2',
    content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
    reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
    quaerat iure quos dolorum accusantium ducimus in illum vero commodi
    pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
    quidem maiores doloremque est numquam praesentium eos voluptatem amet!
    Repudiandae, mollitia id reprehenderit a ab odit!`,
    links: []
  },
  {
    id: 3,
    title: 'Section 3',
    content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
    quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
    dolor ut sequi minus iste? Quas?`,
    links: []
  }
]
const IamrContentsAccordion = (props) => {
  const { contentId, section } = useParams()
  const history = useHistory()
  return (
    <>
      <div className="col-12 col-md-6 border-end min-vh-100 ps-5 pt-4">
        <div className="pb-2">
          <span className="text-uppercase fw-bold">
            market -ready certification 1 skills
          </span>
        </div>

        <div className="row d-row accordion-data" id="accordionExample0">
          {accordionData.map((data, index) => (
            <div className="accordion-item accordion-data-item px-0">
              <h2
                className="accordion-header"
                id="headingTwo"
                onClick={() => {
                  history.push(`/iamr/${data.id}`)
                }}
              >
                <button
                  className="accordion-button collapsed accordion_button accordion-button-inner "
                  type="button"
                  style={{ minHeight: '40px' }}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse_inner${index}`}
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <span
                    className="iamr-status-point me-2"
                    style={{ backgroundColor: 'red' }}
                  ></span>
                  {data.title}
                </button>
              </h2>
              <div
                id={`collapse_inner${index}`}
                className="accordion-collapse collapse ps-4"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample0"
              >
                <div className="accordion-body py-0">
                  <div className="mt-0 pt-0">
                    {data?.links?.map((links) => (
                      <Link
                        onClick={() =>
                          history.push(
                            `/iamr/${data.id}/${links.type}/${links.url}`
                          )
                        }
                        className={'d-block'}
                      >
                        {links.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-12 col-md-6 px-md-3 pt-4 single-iamr-section">
        <Route exact path={`/iamr/:id`} component={ImrContent} />
        <Route
          exact
          path={`/iamr/:id/questions/`}
          component={InstructionsQuestions}
        />
        <Route
          exact
          path={`/iamr/:id/journal/`}
          component={InstructionsQuestions}
        />
        <Route
          exact
          path={`/iamr/:id/studentUploads/`}
          component={InstructionsQuestions}
        />
        <Route
          exact
          path={`/iamr/:id/feedback/`}
          component={InstructionsQuestions}
        />

        <Route path="/iamr/:id/:type" component={ImrSubContent} />
      </div>
    </>
  )
}

export default IamrContentsAccordion
