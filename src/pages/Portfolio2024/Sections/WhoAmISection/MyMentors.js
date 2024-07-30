import React, { useEffect, useState } from 'react'
import MyMentor from './MyMentor'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import AddMyMentor from '../../Components/Actions/AddMyMentor'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import mentorsImage from '../../../../assets/images/HS-Portfolio-Icons/mentors.png'
import MyMentorModal from '../../Components/Modals/MyMentorModal'
import {
  hideAddCompetitivenessModal,
  hideAddMentorModal,
  showAddCompetitivenessModal,
  showAddMentorModal
} from '../../../../redux/portfolio/Actions'

function MyMentors(props) {
  const dispatch = useDispatch()
  const [myMentors, setMyMentors] = useState([])

  const [isEditSection, setIsEditSection] = useState(false)
  const showModal = useSelector(
    (state) => state.portfolio.whoSection.myMentors.showAddMentorModal
  )

  useEffect(() => {
    if (props.data) setMyMentors(props.data)
  }, [props.data])
  const mode = useSelector((state) => state.portfolio.mode)

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed:
        mode === 'edit' && isEditSection === false && myMentors?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowModal(),
      isDisplayed: mode === 'edit' && myMentors?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed:
        mode === 'edit' && isEditSection === true && myMentors?.length > 0
    }
  ]

  const handleShowModal = () => {
    dispatch(showAddMentorModal())
  }

  const handleHideModal = () => {
    dispatch(hideAddMentorModal())
  }

  return (
    <div className={'container'}>
      <div className={'row '}>
        {myMentors?.length > 0 ? (
          myMentors?.map((mentor, index) => {
            return (
              <React.Fragment key={mentor?.id}>
                <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
                  <MyMentor data={mentor} isEditSection={isEditSection} />
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <NoDataDisplay
            src={mentorsImage}
            classNames={'mt-5'}
            text={
              'You don’t have any mentors yet! Click the button to add one.'
            }
          />
        )}
        <div className={'col-md-4'}>
          {myMentors?.length > 0 && isEditSection && (
            <AddMyMentor
              title={`Add new "My Mentors" section`}
              isEditSection={isEditSection}
              data={myMentors?.data}
            />
          )}
        </div>
      </div>

      <SectionActions actions={actions} />
      {showModal && (
        <MyMentorModal
          onHide={handleHideModal}
          show={showModal}
          title={`Add ${props.type ?? 'mentor'}`}
          category={'my-mentors'}
        />
      )}
    </div>
  )
}

export default MyMentors
