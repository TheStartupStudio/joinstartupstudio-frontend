import React, { useEffect, useState } from 'react'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import {
  editWhoSection,
  getMyRelationships,
  getUserStory,
  saveMyRelationships,
  saveUserStory
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import LabeledInput from '../../Components/DisplayData/LabeledInput'

function MyRelationships(props) {
  const [isEditSection, setIsEditSection] = useState(false)
  const [teamRole, setTeamRole] = useState('')
  const [collaborationStyle, setCollaborationStyle] = useState('')
  const [leadershipPhilosophy, setLeadershipPhilosophy] = useState('')
  const [id, setId] = useState(null)
  const dispatch = useDispatch()

  const mode = useSelector((state) => state.portfolio.mode)

  useEffect(() => {
    if (props.data) {
      setTeamRole(props?.data?.teamRole)
      setCollaborationStyle(props?.data?.collaborationStyle)
      setLeadershipPhilosophy(props?.data?.leadershipPhilosophy)
      setId(props.data?.id)
    }
    setIsEditSection(false)
  }, [props.data])
  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed:
        // mode === 'edit' && whoSection?.myRelationships?.showEditButton
        mode === 'edit' && isEditSection === false
    },
    {
      type: 'save',
      action: () =>
        dispatch(
          saveMyRelationships(
            {
              teamRole,
              collaborationStyle,
              leadershipPhilosophy
            },
            id
          )
        ),

      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  return (
    <>
      {isEditSection && mode === 'edit' ? (
        <div className={'row'}>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              title={'Team role'}
              titleClassNames="text-center py-3 text-uppercase"
              titleHeight={70}
              inputHeight={120}
              value={teamRole}
              onChange={(value) => setTeamRole(value)}
            />
          </div>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              title={'Collaboration style'}
              titleClassNames="text-center py-3 text-uppercase"
              titleHeight={70}
              inputHeight={120}
              value={collaborationStyle}
              onChange={(value) => setCollaborationStyle(value)}
            />
          </div>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              title={'Leadership philsophy'}
              titleClassNames="text-center py-3 text-uppercase"
              titleHeight={70}
              inputHeight={120}
              value={leadershipPhilosophy}
              onChange={(value) => setLeadershipPhilosophy(value)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className={'row'}>
            <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
              <PortfolioInfoBox
                height={190}
                titleHeight={40}
                inputHeight={120}
                title={'Team role'}
                content={teamRole}
              />
            </div>
            <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
              <PortfolioInfoBox
                height={190}
                titleHeight={40}
                inputHeight={120}
                title={'Collaboration style'}
                content={collaborationStyle}
              />
            </div>
            <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
              <PortfolioInfoBox
                height={190}
                titleHeight={40}
                inputHeight={120}
                title={'Leadership philsophy'}
                content={leadershipPhilosophy}
              />
            </div>
          </div>
        </>
      )}

      <SectionActions actions={actions} />
    </>
  )
}

export default MyRelationships
