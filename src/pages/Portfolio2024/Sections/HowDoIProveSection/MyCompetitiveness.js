import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import AddMyMentor from '../../Components/Actions/AddMyMentor'
import MyMentor from '../WhoAmISection/MyMentor'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import mentorsImage from '../../../../assets/images/HS-Portfolio-Icons/mentors.png'
import {
  hideAddCompetitivenessModal,
  showAddCompetitivenessModal
} from '../../../../redux/portfolio/Actions'
import MyMentorModal from '../../Components/Modals/MyMentorModal'
import CarouselComponent from '../../../../components/Carousel/CarouselComponent'

function MyCompetitiveness(props) {
  const dispatch = useDispatch()
  const [myCompetitiveness, setMyCompetitiveness] = useState([])
  const [isEditSection, setIsEditSection] = useState(false)

  const showModal = useSelector(
    (state) =>
      state.portfolio.howSection.myCompetitiveness.showAddCompetitivenessModal
  )
  const mode = useSelector((state) => state.portfolio.mode)

  console.log('showModal', showModal)
    console.log(`'mode === 'edit' && myCompetitiveness?.length > 0 && isEditSection'`, mode === 'edit', myCompetitiveness?.length > 0, isEditSection)

  const filteredUnshownData = (data) => {
    return data?.filter((data)=>data.showSection)
  }
  useEffect(() => {
    if (props.data) setMyCompetitiveness(props.data)
  }, [props.data])

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed:
        mode === 'edit' &&
        isEditSection === false &&
        myCompetitiveness?.length > 0
    },
    {
      type: 'add',
      action: () => {
        handleShowModal()
        setIsEditSection(true)
      },
      isDisplayed: mode === 'edit' && myCompetitiveness?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed:
        mode === 'edit' &&
        isEditSection === true &&
        myCompetitiveness?.length > 0
    }
  ]

  const handleShowModal = () => {
    dispatch(showAddCompetitivenessModal())
  }

  const handleHideModal = () => {
    dispatch(hideAddCompetitivenessModal())
  }

  return (
    <div className={'container'}>
      {myCompetitiveness?.length > 0 ? (
        <>
          <CarouselComponent
            data={myCompetitiveness}
            itemsToShow={3}
            renderItems={(item) => {
              return (
                <>
                  <MyMentor
                    data={item}
                    isEditSection={isEditSection}
                    category={'my-competitiveness'}
                  />
                </>
              )
            }}
            breakPoints={[
              { width: 500, itemsToShow: 1 },
              { width: 768, itemsToShow: 2 },
              { width: 1200, itemsToShow: 3 },
              { width: 1600, itemsToShow: 4 }
            ]}
            transitionDuration='0.5s'
            transitionTimingFunction='ease-in-out'
          />
        </>
      ) : (
        <>
          <NoDataDisplay
            src={mentorsImage}
            // classNames={'mt-5'}
            text={
              'You don’t have any competitiveness yet! Click the button to add one.'
            }
          />
        </>
      )}

      <div className={'col-md-4'} style={{ marginLeft: 90 }}>
        {mode === 'edit' && myCompetitiveness?.length > 0 && isEditSection && (
          <AddMyMentor
            title={`Add new "My Competitiveness" section`}
            modalTitle={'Add Competitiveness'}
            isEditSection={isEditSection}
            category={'my-competitiveness'}
            type={'competitiveness'}
          />
        )}
        {mode === 'edit' && showModal && (
          <MyMentorModal
            onHide={handleHideModal}
            show={showModal}
            title={`Add competitiveness`}
            category={'my-competitiveness'}
          />
        )}

      </div>

      <SectionActions actions={actions} />
    </div>
  )
}

export default MyCompetitiveness
