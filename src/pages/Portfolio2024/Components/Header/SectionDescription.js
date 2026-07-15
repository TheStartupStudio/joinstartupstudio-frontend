import React from 'react'

function SectionDescription(props) {
  return (
    <div className={' section-description-container'} style={{ marginBottom: '20px' }}>
      <div className='portf-section-maintitle' style={{ flexDirection: 'column' }}>
        <div
          className={
            'd-flex gap-3 align-items-center mb-3 portfolio-section-title'
          }
        >
          {props?.sectionIcon && (
            <img
              src={props.sectionIcon}
              alt=''
              className='section-nav-icon'
              style={{ width: 66, height: 66, objectFit: 'contain' }}
            />
          )}
          <div className={'section-title'} style={{ fontSize: '40px' }}>
            {props?.sectionTitle}
          </div>
        </div>
        <div
          className={'section-description'}
          dangerouslySetInnerHTML={{ __html: props?.sectionDescription }}
        />
      </div>
      <div className='triangle-icon-parent'>
        <img
          src={props?.triangleIcon}
          className={'triangle-icon portfolio-triangle-icon'}
          alt='triangle-icon'
        />
      </div>
    </div>
  )
}

export default SectionDescription
