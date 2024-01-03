import React from 'react'
import mySparkResponse from '../../../assets/icons/Group 1770.svg'
import {
  formatAIResponse,
  imageResolutionToPercentage
} from '../mySparkHelpersFuncs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

function ContentContainer(props) {
  // console.log(props)

  return (
    <div
      className={
        'my-spark_generate-page__content-generated_paragraph-container '
      }
    >
      <div className={'d-flex align-items-center position-relative'}>
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
          {props.title}
        </div>
        {!!props.containEdit && (
          <div
            onClick={(event) => {
              props.openEditBox(event)
            }}
            className={
              'position-absolute edit-pencil-container d-flex justify-content-end top-0 end-0 '
            }
            role="button"
          >
            <FontAwesomeIcon
              className={'z-3 ml-1 edit-pencil'}
              icon={faPencilAlt}
            />
          </div>
        )}
      </div>
      {props.archivedDocument?.type !== 'image' && (
        <div
          ref={props.htmlRef}
          className={`my-spark_generate-page__content-generated_paragraph ${
            props.type === 'myContent' ? '' : 'no-select'
          } `}
          dangerouslySetInnerHTML={{
            __html: formatAIResponse(props.content)
          }}
        />
      )}
      {props.archivedDocument?.type === 'image' && (
        <div className={'d-flex justify-content-center'}>
          <img
            src={props.archivedDocument?.imageUrl}
            alt={props.archivedDocument?.name}
            style={{
              width: imageResolutionToPercentage(
                props.archivedDocument?.imageResolution,
                'generate-page'
              ).width,
              height: imageResolutionToPercentage(
                props.archivedDocument?.imageResolution,
                'generate-page'
              ).height
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ContentContainer
