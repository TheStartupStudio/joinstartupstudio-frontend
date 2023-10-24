import React, { useRef, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import {
  faAngleDown,
  faAngleUp,
  faBars,
  faBook,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import mySparkArticle from '../../assets/icons/Notebook.svg'
import mySparkPrompt from '../../assets/icons/comment-alt-lines.svg'
import mySparkResponse from '../../assets/icons/Group 1770.svg'
import mySparkBlack from '../../assets/icons/Asset 1.svg'

const MySparkArchiveCard = (props) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef()

  const handleScroll = (direction) => {
    const container = containerRef.current
    const scrollHeight = container.scrollHeight - container.clientHeight
    let newPosition = scrollPosition

    if (direction === 'up') {
      newPosition = Math.max(newPosition - 39, 0)
    } else if (direction === 'down') {
      newPosition = Math.min(newPosition + 39, scrollHeight)
    }

    container.scrollTo({
      top: newPosition,
      behavior: 'smooth'
    })

    if (newPosition !== scrollPosition) {
      setScrollPosition(newPosition)
    }
  }
  return (
    <div className={'my-spark-archive__card-container'}>
      <div className={'my-spark-archive__card-header'}>
        <img
          className="my-spark-archive__card-icon me-3"
          src={mySparkArticle}
          alt={'my spark icon'}
        />
        <div className="my-spark-archive__card-title">Article</div>
      </div>
      <div className={'my-spark-archive__card-prompt-container'}>
        <img
          className="my-spark-archive__card-prompt-icon me-3"
          src={mySparkPrompt}
          alt={'my spark icon'}
        />
        <div className="my-spark-archive__card-prompt">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit?
        </div>
      </div>
      <div className={'my-spark-archive__card-response-container'}>
        <div className={'my-spark-archive__card-response-icon__container'}>
          <img
            className="my-spark-archive__card-response-icon me-3"
            src={mySparkResponse}
            alt={'my spark icon'}
          />
          <div className={'my-spark-archive__card-response__content-title'}>
            Content
          </div>
        </div>
        <div className="my-spark-archive__card-response">
          <div
            className={
              'my-spark-archive__card-response-content_container d-flex'
            }
          >
            <div
              className={'response-content'}
              ref={containerRef}
              onScroll={() => setScrollPosition(containerRef.current.scrollTop)}
              style={{
                // width: '300px',
                height: '39px',
                overflow: 'hidden'
                // border: '1px solid #ccc'
              }}
            >
              <div className={'response-text'}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat.
              </div>
            </div>

            <div className={'response-buttons'}>
              <div
                className={'response-button'}
                onClick={() => handleScroll('up')}
              >
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="me-2 me-md-0 response-arrow "
                />
              </div>
              <div
                className={'response-button'}
                onClick={() => handleScroll('down')}
              >
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="me-2 me-md-0 response-arrow "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'my-spark-archive__card-footer'}></div>
    </div>
  )
}

function MySparkArchivePage(props) {
  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">
                  MY SPARK | <span class={'rose-text'}>Archive</span>
                </h3>
              </div>
            </div>
            <div className="row ps-2">
              <div className="col-md-12 mt-4">
                <div className={'my-spark-archive__container'}>
                  <div className={'my-spark-archive__header-text'}>
                    <div className={'content-text'}>Content</div>
                    <div className={'archive-content-text'}>
                      Archive content
                    </div>
                  </div>
                  <div className={'row my-spark-archive__filters'}>
                    <div className={'col-md-2'}>
                      <div className={'dropdown-filter'}>
                        <div className={'dropdown-text'}>All (5)</div>
                        <div className={'dropdown-buttons'}>
                          <div className={'dropdown-button'}>
                            <FontAwesomeIcon
                              icon={faAngleUp}
                              className="me-2 me-md-0 dropdown-arrow"
                            />
                          </div>
                          <div className={'dropdown-button'}>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className="me-2 me-md-0 dropdown-arrow"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={'col-md-10'}>
                      <div className={'my-spark-archive__search-filter'}>
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="me-2 me-md-0 search-icon"
                        />
                        <div>
                          <input
                            placeholder={'Search Content'}
                            className={'search-input'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'row my-spark-archive__cards'}>
                    <div className={'col-md-3'}>
                      <MySparkArchiveCard />
                    </div>
                    <div className={'col-md-3'}>2</div>
                    <div className={'col-md-3'}>3</div>
                    <div className={'col-md-3'}>4</div>
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

export default MySparkArchivePage
