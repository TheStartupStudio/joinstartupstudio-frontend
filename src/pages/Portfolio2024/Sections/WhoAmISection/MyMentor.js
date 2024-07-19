import React, { useEffect, useState } from 'react'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import MyMentorModal from '../../Components/Modals/MyMentorModal'
import {
  hideEditMentorModal,
  showEditMentorModal
} from '../../../../redux/portfolio/Actions'

function MyMentor(props) {
  const dispatch = useDispatch()
  const [myMentor, setMyMentor] = useState({})
  const mode = useSelector((state) => state.portfolio.mode)
  const showMentorModalId = useSelector(
    (state) => state.portfolio.whoSection.myMentors.showEditMentorModal
  )

  const handleShowMentorModal = (id) => {
    dispatch(showEditMentorModal(id))
  }
  const handleHideMentorModal = () => {
    dispatch(hideEditMentorModal())
  }

  useEffect(() => {
    if (props.data) {
      setMyMentor(props.data)
    }
  }, [props.data])

  const actions = [
    {
      type: 'edit',
      action: () => handleShowMentorModal(myMentor?.id),
      isDisplayed: mode === 'edit' && props.isEditSection === true
    }
  ]

  return (
    <div className={'my-mentors-container position-relative'}>
      <img
        className={'my-mentors-image'}
        alt={'submission-image'}
        src={myMentor?.mentorImage ? myMentor?.mentorImage : imagePlaceholder}
      />

      <div className={'mentor-info-box'}>
        <div className={'mentor-name'}>{myMentor?.mentorName}</div>
        <div className={'mentor-role'}>{myMentor?.mentorRole}</div>
        <div className={'mentor-company'}>{myMentor?.mentorCompany}</div>
        <div
          className={'mentor-description'}
          dangerouslySetInnerHTML={{ __html: myMentor?.mentorDescription }}
        />
      </div>
      <SectionActions actions={actions} />
      <MyMentorModal
        onHide={handleHideMentorModal}
        show={showMentorModalId === myMentor?.id}
        title={'Edit Mentor'}
        data={myMentor}
      />
    </div>
  )
}

export default MyMentor
