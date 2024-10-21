import React, { useEffect, useState } from 'react'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import {
  saveMyRelationships,
  toggleMyRelationships,
  toggleUserStory
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import LabeledInput from '../../Components/DisplayData/LabeledInput'
import LabeledSwitchInput from '../../Components/Actions/LabeledSwitchInput'

function MyRelationships(props) {
  const [isEditSection, setIsEditSection] = useState(false)
  const [teamRole, setTeamRole] = useState('')
  const [collaborationStyle, setCollaborationStyle] = useState('')
  const [leadershipPhilosophy, setLeadershipPhilosophy] = useState('')
  const [showSection, setShowSection] = useState(false)
  const [id, setId] = useState(null)
  const dispatch = useDispatch()

  const mode = useSelector((state) => state.portfolio.mode)
  const isTogglingSection = useSelector(
    (state) => state.portfolio.whoSection.myRelationships.isTogglingSection
  )
  useEffect(() => {
    if (props.data) {
      setTeamRole(props?.data?.teamRole)
      setCollaborationStyle(props?.data?.collaborationStyle)
      setLeadershipPhilosophy(props?.data?.leadershipPhilosophy)
      setShowSection(props?.data?.showRelationships)
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

  const onToggleSection = (showRelationships) => {
    dispatch(
      toggleMyRelationships(
        {
          showRelationships: showRelationships
        },
        id
      )
    )
  }
  const isValidContent = (content) =>
    content !== null && content !== undefined && content.trim() !== ''

  const displayContent = (content, clickEditText, noThingAddedText) => {
    if (mode === 'edit' && !isEditSection && !isValidContent(content)) {
      return clickEditText
    } else if (mode === 'edit' && !isEditSection) {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    } else if (mode === 'preview') {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    }
  }

  return (
    <>
      {isEditSection && mode === 'edit' && (
        <LabeledSwitchInput
          label={'Show section'}
          labelDirection={'left'}
          value={!showSection}
          onChange={(value) => {
            onToggleSection(value)
          }}
          name={'show-relationships-section'}
          id={'show-relationships-section'}
          isToggling={isTogglingSection}
          styles={{ position: 'absolute', right: 70, top: 30 }}
        />
      )}
      {isEditSection && mode === 'edit' ? (
        <div className={'row '}>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              containerClassNames={'my-relationships '}
              title={'Team role'}
              titleClassNames='text-center py-3 text-uppercase'
              titleHeight={70}
              inputHeight={120}
              value={teamRole}
              onChange={(value) => setTeamRole(value)}
              placeholder={
                isEditSection ? 'Explain the role you play on a team.' : ''
              }
            />
          </div>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              containerClassNames={'my-relationships'}
              title={'Collaboration style'}
              titleClassNames='text-center py-3 text-uppercase'
              titleHeight={70}
              inputHeight={120}
              value={collaborationStyle}
              onChange={(value) => setCollaborationStyle(value)}
              placeholder={
                isEditSection ? 'Explain how you collaborate with others.' : ''
              }
            />
          </div>
          <div className={'col-lg-4 col-md-6 col-sm-12 mb-3'}>
            <LabeledInput
              containerClassNames={'my-relationships'}
              title={'Leadership philosophy'}
              titleClassNames='text-center py-3 text-uppercase'
              titleHeight={70}
              inputHeight={120}
              value={leadershipPhilosophy}
              onChange={(value) => setLeadershipPhilosophy(value)}
              placeholder={
                isEditSection ? 'Explain how you act as a leader.' : ''
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className={'row'}>
            <div
              className={'col-lg-4 col-md-6 col-sm-12 mb-3 relationship-story'}
            >
              <PortfolioInfoBox
                height={170}
                titleHeight={40}
                inputHeight={120}
                title={'Team role:'}
                titleClasses={'text-center mt-3'}
                content={displayContent(
                  teamRole,
                  'Click the edit button to add team role.'
                )}
                contentClasses={'text-center portfolio-nowidth-info'}
              />
            </div>

            <div
              className={'col-lg-4 col-md-6 col-sm-12 mb-3 relationship-story'}
            >
              <PortfolioInfoBox
                height={170}
                titleHeight={40}
                inputHeight={120}
                title={'Collaboration style:'}
                titleClasses={'text-center mt-3'}
                content={displayContent(
                  collaborationStyle,
                  'Click the edit button to add a collaboration style'
                )}
                contentClasses={'text-center portfolio-nowidth-info'}
              />
            </div>

            <div
              className={'col-lg-4 col-md-6 col-sm-12 mb-3 relationship-story'}
            >
              <PortfolioInfoBox
                height={170}
                titleHeight={40}
                inputHeight={120}
                title={'Leadership philosophy:'}
                titleClasses={'text-center mt-3'}
                content={displayContent(
                  leadershipPhilosophy,
                  'Click the edit button to add a leadership philosophy'
                )}
                contentClasses={'text-center portfolio-nowidth-info'}
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
