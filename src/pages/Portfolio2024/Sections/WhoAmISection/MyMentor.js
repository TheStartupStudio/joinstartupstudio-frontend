import React, { useEffect, useState } from 'react'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import MyMentorModal from '../../Components/Modals/MyMentorModal'
import {
  hideEditCompetitivenessModal,
  hideEditMentorModal,
  showEditCompetitivenessModal,
  showEditMentorModal
} from '../../../../redux/portfolio/Actions'

function MyMentor(props) {
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const mode = useSelector((state) => state.portfolio.mode)

  const showModalId = useSelector((state) =>
    props.category === 'my-competitiveness'
      ? state.portfolio.howSection.myCompetitiveness
          .showEditCompetitivenessModal
      : state.portfolio.whoSection.myMentors.showEditMentorModal
  )

  const handleShowModal = (id) => {
    if (props.category === 'my-competitiveness') {
      dispatch(showEditCompetitivenessModal(id))
    } else {
      dispatch(showEditMentorModal(id))
    }
  }

  const handleHideModal = () => {
    if (props.category === 'my-competitiveness') {
      dispatch(hideEditCompetitivenessModal())
    } else {
      dispatch(hideEditMentorModal())
    }
  }

  useEffect(() => {
    if (props.data) {
      setData(props.data)
    }
  }, [props.data])

  const actions = [
    {
      type: 'edit',
      action: () => handleShowModal(data?.id),
      isDisplayed: mode === 'edit' && props.isEditSection === true
    },
    {
      type: 'open',
      action: () => handleShowModal(data?.id),
      isDisplayed: mode === 'preview'
    }
  ]

  return (
    <div className={'my-mentors-container position-relative'}>
      <img
        className={'my-mentors-image'}
        alt={'submission-image'}
        src={data?.mentorImage ? data?.mentorImage : imagePlaceholder}
      />

      <div className={'mentor-info-box'}>
        <div className={'mentor-name'}>{data?.mentorName}</div>
        <div className={'mentor-role'}>{data?.mentorRole}</div>
        {/*<div className={'mentor-company'}>{data?.mentorCompany}</div>*/}
        {/*<div*/}
        {/*  className={'mentor-description'}*/}
        {/*  dangerouslySetInnerHTML={{ __html: data?.mentorDescription }}*/}
        {/*/>*/}
      </div>
      <SectionActions actions={actions} />
      {showModalId === data?.id && (
        <MyMentorModal
          onHide={handleHideModal}
          show={showModalId === data?.id}
          title={
            mode === 'preview'
              ? `Preview ${props.type ?? 'mentor'}`
              : `Edit ${props.type ?? 'mentor'}`
          }
          data={data}
          category={props.category}
          mode={mode}
        />
      )}
    </div>
  )
}

export default MyMentor
