import React, { useEffect, useState } from 'react'
import MyMentor from './MyMentor'
import { useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import AddMyMentor from '../../Components/Actions/AddMyMentor'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import mentorsImage from '../../../../assets/images/HS-Portfolio-Icons/mentors.png'

function MyMentors(props) {
  const [myMentors, setMyMentors] = useState([])

  const [isEditSection, setIsEditSection] = useState(false)

  useEffect(() => {
    if (props.data) setMyMentors(props.data)
  }, [props.data])
  const mode = useSelector((state) => state.portfolio.mode)

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed: mode === 'edit' && isEditSection === false
    },
    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

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
          {isEditSection && (
            <AddMyMentor
              title={`Add new "My Mentors" section`}
              isEditSection={isEditSection}
              data={myMentors?.data}
            />
          )}
        </div>
      </div>

      <SectionActions actions={actions} />
    </div>
  )
}

export default MyMentors
