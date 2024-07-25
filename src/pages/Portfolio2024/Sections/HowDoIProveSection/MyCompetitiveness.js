import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import AddMyMentor from '../../Components/Actions/AddMyMentor'
import MyMentor from '../WhoAmISection/MyMentor'

function MyCompetitiveness(props) {
  const [myCompetitiveness, setMyCompetitiveness] = useState([])

  const [isEditSection, setIsEditSection] = useState(false)

  useEffect(() => {
    if (props.data) setMyCompetitiveness(props.data)
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
        {myCompetitiveness?.map((mentor, index) => {
          return (
            <React.Fragment key={index}>
              <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
                <MyMentor
                  data={mentor}
                  isEditSection={isEditSection}
                  category={'my-competitiveness'}
                  modalTitle={'Edit Competitiveness'}
                />
              </div>
            </React.Fragment>
          )
        })}
        <div className={'col-md-4'}>
          {isEditSection && (
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
    </div>
  )
}

export default MyCompetitiveness
