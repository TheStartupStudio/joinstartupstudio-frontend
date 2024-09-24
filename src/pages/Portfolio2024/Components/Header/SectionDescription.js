import React, { useEffect } from 'react'
import UserImage from '../UserImage'
import { useDispatch, useSelector } from 'react-redux'
import { getUserBasicInfo } from '../../../../redux/portfolio/Actions'

// function SectionDescription({
//   userStory,
//   sectionTitle,
//   sectionDescription,
//   triangleIcon
// })
// {
function SectionDescription(props) {
  // const userStory = useSelector((state) => state.portfolio.whoSection.userStory)
  //
  // const dispatch = useDispatch()
  //
  // useEffect(() => {
  //   dispatch(getUserStory())
  // }, [])

  return (
    <div className={' section-description-container'}>
      <div>
        <div
          className={
            'd-flex gap-3 align-items-center mb-3 portfolio-section-title'
          }
          // style={{ width: 'max-content' }}
        >
          <UserImage
            userImageUrl={props?.user?.data?.userImageUrl}
            width={60}
            height={60}
          />
          <div className={'section-title'} style={{ fontSize: '40px' }}>
            {props?.sectionTitle}
          </div>
        </div>
        <div
          className={'section-description'}
          dangerouslySetInnerHTML={{ __html: props?.sectionDescription }}
        />
      </div>
      <div>
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
