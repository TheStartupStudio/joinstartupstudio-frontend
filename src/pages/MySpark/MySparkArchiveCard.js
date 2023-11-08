import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import mySparkArticle from '../../assets/icons/Notebook.svg'
import mySparkPrompt from '../../assets/icons/comment-alt-lines.svg'
import mySparkResponse from '../../assets/icons/Group 1770.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import mySparkConversation from '../../assets/icons/comments-alt.svg'

const MySparkArchiveCard = (props) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef()
  const history = useHistory()

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

  function formatText(text) {
    text = text.replace(/\n\n/g, '<br/><br/>')
    text = text.replace(/\n/g, '<br/>')
    return text
  }

  const timeAgo = moment(props?.document?.updated_at).fromNow()
  const goToDetailsPage = () => {
    history.push(`/my-spark/generate-page/${props?.document?.id}`, {
      responseData: props?.document,
      widgetType: 'document',
      widgetTitle: 'any'
    })
  }
  return (
    <div className={'archive__card-container'}>
      <div className={'archive__card-header'}>
        <img
          className="my-spark-type__icon me-3"
          src={mySparkArticle}
          alt={'my spark icon'}
        />
        <div className="header-title">Article</div>
      </div>
      <div className={'archive__card-prompt-container'}>
        <img
          className="prompt-icon me-3"
          src={mySparkPrompt}
          alt={'my spark icon'}
        />
        <div className="prompt-text">
          {props.document?.name}
          {/*Lorem ipsum dolor sit amet, consectetuer adipiscing elit?*/}
        </div>
      </div>
      <div className={'response-section__container'}>
        <div className={'response-section__header'}>
          <img
            className="card-icon me-3"
            src={mySparkResponse}
            alt={'my spark icon'}
          />
          <div className={'content-title'}>Content</div>
        </div>
        <div className="response-section">
          <div className={'response__content-container d-flex'}>
            <div
              className={'response-content'}
              ref={containerRef}
              onScroll={() => setScrollPosition(containerRef.current.scrollTop)}
            >
              {/*<div className={'response-text'}>*/}
              {/*  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed*/}
              {/*  diam nonummy nibh euismod tincidunt ut laoreet dolore magna*/}
              {/*  aliquam erat volutpat.*/}
              {/*</div>*/}
              <div
                className={'response-text'}
                dangerouslySetInnerHTML={{
                  __html: formatText(props?.document?.result)
                }}
              />
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
        <div
          onClick={() => goToDetailsPage()}
          className={'response-section__full-content__container'}
        >
          View full content
          <span className={'view-full-content__icon-container'}>
            <img
              src={mySparkConversation}
              className="view-full-content__icon"
              alt={'my spark icon'}
              width={'20px'}
            />
          </span>
        </div>
      </div>
      <div className={'archive-card__footer'}>
        <div className={'time-ago'}>{timeAgo}</div>
        <div>
          <FontAwesomeIcon icon={faTrash} className="me-2 me-md-0 trash-icon" />
        </div>
      </div>
    </div>
  )
}

export default MySparkArchiveCard
