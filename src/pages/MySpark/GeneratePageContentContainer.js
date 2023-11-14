import React from 'react'
import mySparkResponse from '../../assets/icons/Group 1770.svg'
import { formatAIResponse } from './mySparkHelpersFuncs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

function GeneratePageContentContainer(props) {
  console.log(props.archivedDocument)
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

      {!!props.isImage ? (
        <div
          className={'my-spark_generate-page__content-generated_paragraph'}
          dangerouslySetInnerHTML={{
            __html: formatAIResponse(props.content)
          }}
        />
      ) : (
        <div className={'d-flex justify-content-center'}>
          <img
            src={props.archivedDocument?.mySparkContent}
            alt={props.archivedDocument?.name}
            style={{
              width: +props.archivedDocument?.resolution?.split('x')[0],
              height: +props.archivedDocument?.resolution?.split('x')[1]
            }}
          />
        </div>
      )}
    </div>
  )
}

export default GeneratePageContentContainer
