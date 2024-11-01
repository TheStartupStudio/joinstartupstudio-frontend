import React, { useEffect, useState } from 'react'
import MyMentor from './MyMentor'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import AddMyMentor from '../../Components/Actions/AddMyMentor'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import mentorsImage from '../../../../assets/images/HS-Portfolio-Icons/mentors.png'
import MyMentorModal from '../../Components/Modals/MyMentorModal'
import {
  hideAddMentorModal,
  showAddMentorModal
} from '../../../../redux/portfolio/Actions'
import CarouselComponent from '../../../../components/Carousel/CarouselComponent'

function MyMentors(props) {
  const dispatch = useDispatch()
  const [myMentors, setMyMentors] = useState([])

  const [isEditSection, setIsEditSection] = useState(false)
  const showModal = useSelector(
    (state) => state.portfolio.whoSection.myMentors.showAddMentorModal
  )

  useEffect(() => {
    if (props.data) setMyMentors([...props.data, { category: 'my-mentors', isAddBox: true }])
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
      <div className={'row gap-4'}>
        {myMentors?.length === 1 && myMentors[0].isAddBox && !isEditSection ? (
          <NoDataDisplay
            src={mentorsImage}
            classNames={'mt-5'}
            text={
              'You don’t have any mentors yet! Click the button to add one.'
            }
          />
        ) : (
          <CarouselComponent
            data={mode === 'edit' && isEditSection ? myMentors : myMentors?.filter((mentor) => !mentor.isAddBox)}
            itemsToShow={3}
            renderItems={(item) => {
              if (!item.isAddBox) {
                return (
                  <MyMentor data={item} isEditSection={isEditSection} />
                );
              } else {
                return mode === 'edit' && isEditSection ? (
                  <AddMyMentor
                    title={`Add new "My Mentors" section`}
                    isEditSection={isEditSection}
                    data={myMentors?.data}
                  />
                ) : null;
              }
            }}
            breakPoints={[
              { width: 500, itemsToShow: 1 },
              { width: 768, itemsToShow: 2 },
              { width: 1200, itemsToShow: 3 },
            ]}
            transitionDuration="0.5s"
            transitionTimingFunction="ease-in-out"
            initialActiveIndex={0}
          />
        )}

      </div>
      <div className={'col-md-4'} style={{ marginLeft: 90 }}>
        {mode === 'edit' && showModal && (
          <MyMentorModal
            onHide={handleHideModal}
            show={showModal}
            title={`Add mentors`}
            category={'my-mentors'}
          />
        )}
      </div>
      <SectionActions actions={actions} />
    </div>
  )
}

export default MyMentors
