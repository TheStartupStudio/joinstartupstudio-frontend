import React, { useEffect } from 'react'
import UserImage from '../UserImage'
import { useDispatch, useSelector } from 'react-redux'
import { getUserStory } from '../../../../redux/portfolio/Actions'

function SectionDescription(props) {
  const userStory = useSelector((state) => state.portfolio.whoSection.userStory)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserStory())
  }, [])

  return (
    <div className={' section-description-container'}>
      <div>
        <div className={'d-flex gap-3 align-items-center mb-3'}>
          <UserImage
            userImageUrl={userStory?.data?.userImageUrl}
            user={props.user}
            width={45}
            height={45}
          />
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
          alt='triangle-icon'
        />
      </div>
    </div>
  )
}

export default SectionDescription
