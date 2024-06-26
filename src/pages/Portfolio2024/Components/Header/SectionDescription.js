import React from 'react'
import UserImage from '../UserImage'

function SectionDescription(props) {
  return (
    <div className={' section-description-container'}>
      <div>
        <div className={'d-flex gap-3 align-items-center mb-3'}>
          <UserImage user={props.user} width={45} height={45} />
          <div className={'section-title'}>{props.sectionTitle}</div>
        </div>
        <div
          className={'section-description'}
          dangerouslySetInnerHTML={{ __html: props.sectionDescription }}
        />
      </div>
      <div>
        <img
          src={props.triangleIcon}
          className={'triangle-icon'}
          alt="triangle-icon"
        />
      </div>
    </div>
  )
}

export default SectionDescription
