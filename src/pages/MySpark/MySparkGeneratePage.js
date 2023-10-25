import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faHamburger,
  faTv,
  faBook,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import mySparkArticle from '../../assets/icons/Notebook.svg'
import mySparkPrompt from '../../assets/icons/comment-alt-lines.svg'
import mySparkResponse from '../../assets/icons/Group 1770.svg'
import mySparkConversation from '../../assets/icons/comments-alt.svg'

function MySparkWidgetDetails(props) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [subheadings, setSubheadings] = useState('')
  const [length, setLength] = useState('')

  const location = useLocation()

  const handleSubmit = (event) => {
    event.preventDefault()

    // Create a new article object with the form data
    const article = {
      name: name,
      title: title,
      keywords: keywords,
      subheadings: subheadings,
      length: length
    }

    // Save the article to the database or send it to a backend API
    // ...

    // Clear the form
    setName('')
    setTitle('')
    setKeywords('')
    setSubheadings('')
    setLength('')
  }

  const handleAdvancedClick = () => {
    // Open an advanced form dialog or show additional form fields
    // ...
  }

  const handleGenerateClick = () => {
    // Generate an article based on the form data
    // ...
  }

  const CircledIcon = (props) => {
    return (
      <div
        className="my-spark_generate-page__circled-icon"
        style={{ backgroundColor: props.circleColor }}
      >
        <img
          className="generate-page-type__icon "
          src={props.icon}
          style={{ color: props.color }}
        />
      </div>
    )
  }

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">MY SPARK</h3>
              </div>
            </div>

            <div className={'my-spark_generate-page__container'}>
              <div
                className={
                  'my-spark_generate-page__header_container d-flex justify-content-between'
                }
              >
                <div
                  className={`
                    grayish-blue-bg
                    my-spark_generate-page__icon-container
                    border-none
                    p-4
                    `}
                >
                  <CircledIcon
                    icon={mySparkArticle}
                    color={'#fff'}
                    circleColor={'#51C7DF'}
                  />
                </div>
                <div
                  className={
                    'my-spark_generate-page__header_title my-spark-generate-page__border d-flex align-items-center justify-content-between'
                  }
                  style={{ flex: 1 }}
                >
                  {/*<div className={'my-spark_generate-page__icon-container'}>*/}
                  {/*  <FontAwesomeIcon*/}
                  {/*    className="my-spark_generate-page__icon"*/}
                  {/*    icon={faBars}*/}
                  {/*    color={'#BBBDBF'}*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div className={'my-spark_generate-page__title ms-5'}>
                    {location.state.widgetTitle.toUpperCase()}
                  </div>
                  <div></div>
                </div>
              </div>
              <div
                className={'grayish-blue-bg my-spark_generate-page__content'}
              >
                <div
                  className={'my-spark_generate-page__generated-content-card'}
                >
                  <div
                    className={
                      'white-bg my-spark_generate-page__content-title_container'
                    }
                  >
                    <img
                      className="prompt-icon me-3"
                      src={mySparkPrompt}
                      alt={'my spark icon'}
                    />
                    <div
                      className={`my-spark_generate-page__content-title
                                ms-4 
                                d-flex 
                                align-items-center`}
                    >
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit?
                    </div>
                  </div>
                  <div
                    className={
                      'my-spark_generate-page__content-generated_paragraph-container'
                    }
                  >
                    <div className={'d-flex align-items-center'}>
                      <img
                        className="response-icon me-3"
                        src={mySparkResponse}
                        alt={'my spark icon'}
                      />
                      <div
                        className={
                          'my-spark_generate-page__content-generated_paragraph-title'
                        }
                      >
                        Content
                      </div>
                    </div>
                    <div
                      className={
                        'my-spark_generate-page__content-generated_paragraph'
                      }
                    >
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                      sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                      magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                      quis nostrud exerci tation ullamcorper suscipit lobortis
                      nisl ut aliquip ex ea commodo consequat. Duis autem vel
                      eum iriure dolor in hendrerit in vulputate velit esse
                      molestie consequat, vel illum dolore eu feugiat
                    </div>
                  </div>
                  <div
                    className={
                      'white-bg my-spark_generate-page__content-footer'
                    }
                  >
                    <div className={'time-ago'}>6 Minutes Ago</div>

                    <FontAwesomeIcon
                      icon={faTrash}
                      className="me-2 me-md-0 trash-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkWidgetDetails
