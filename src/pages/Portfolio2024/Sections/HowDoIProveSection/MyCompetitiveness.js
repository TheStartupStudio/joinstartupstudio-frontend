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

function MyCompetitiveness(props) {
  const dispatch = useDispatch()
  const [myCompetitiveness, setMyCompetitiveness] = useState([])
  const showModal = useSelector(
    (state) =>
      state.portfolio.howSection.myCompetitiveness.showAddCompetitivenessModal
  )

  const [isEditSection, setIsEditSection] = useState(false)

  useEffect(() => {
    if (props.data) setMyCompetitiveness(props.data)
  }, [props.data])
  const mode = useSelector((state) => state.portfolio.mode)

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
      action: () => handleShowModal(),
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
      <div className={'row '}>
        {myCompetitiveness?.length > 0 ? (
          myCompetitiveness?.map((competitive, index) => {
            return (
              <React.Fragment key={competitive?.id}>
                <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
                  <MyMentor
                    data={competitive}
                    isEditSection={isEditSection}
                    category={'my-competitiveness'}
                  />
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <NoDataDisplay
            src={mentorsImage}
            classNames={'mt-5'}
            text={
              'You don’t have any mentor feedback yet! Click the button to add one.'
            }
          />
        )}
        <div className={'col-md-4'}>
          {myCompetitiveness?.length > 0 && isEditSection && (
            <AddMyMentor
              title={`Add new "My Competitiveness" section`}
              modalTitle={'Add Competitiveness'}
              isEditSection={isEditSection}
              category={'my-competitiveness'}
              type={'competitiveness'}
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
          category={'my-competitiveness'}
        />
      )}
    </div>
  )
}

export default MyCompetitiveness
