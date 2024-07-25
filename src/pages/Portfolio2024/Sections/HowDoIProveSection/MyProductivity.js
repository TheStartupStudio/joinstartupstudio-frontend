import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMyImmersion,
  addMyWorkExperience,
  hideAddImmersionModal,
  hideAddWorkExperienceModal,
  showAddImmersionModal,
  showAddWorkExperienceModal
} from '../../../../redux/portfolio/Actions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import ImmersionCard from './ImmersionCard'
import ImmersionCardModal from './ImmersionCardModal'
import WorkExperienceCard from './WorkExperienceCard'
import WorkExperienceCardModal from './WorkExperienceCardModal'

function MyProductivity(props) {
  const dispatch = useDispatch()
  const immersions = props.data?.immersions?.data
  const workExperiences = props.data?.workExperiences?.data
  const [isEditImmersionSection, setIsEditImmersionSection] = useState(false)
  const [isEditWorkExperienceSection, setIsEditWorkExperienceSection] =
    useState(false)
  const mode = useSelector((state) => state.portfolio.mode)

  const showImmersionModal = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.immersions?.showAddModal
  )
  const showWorkExperienceModal = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.workExperiences?.showAddModal
  )

  const handleShowImmersionModal = () => {
    dispatch(showAddImmersionModal())
  }
  const handleHideImmersionModal = () => {
    dispatch(hideAddImmersionModal())
  }

  const handleShowWorkExperienceModal = () => {
    dispatch(showAddWorkExperienceModal())
  }
  const handleHideWorkExperienceModal = () => {
    dispatch(hideAddWorkExperienceModal())
  }

  const immersionActions = [
    {
      type: 'edit',
      action: () => setIsEditImmersionSection(true),
      isDisplayed: mode === 'edit' && isEditImmersionSection === false
    },
    {
      type: 'save',
      action: () => setIsEditImmersionSection(false),
      isDisplayed: mode === 'edit' && isEditImmersionSection === true
    }
  ]

  const workExperienceActions = [
    {
      type: 'edit',
      action: () => setIsEditWorkExperienceSection(true),
      isDisplayed: mode === 'edit' && isEditWorkExperienceSection === false
    },
    {
      type: 'save',
      action: () => setIsEditWorkExperienceSection(false),
      isDisplayed: mode === 'edit' && isEditWorkExperienceSection === true
    }
  ]

  const onSaveImmersion = (data) => {
    dispatch(addMyImmersion(data))
  }

  const onSaveWorkExperience = (data) => {
    dispatch(addMyWorkExperience(data))
  }
  return (
    <>
      <PortfolioDataContainer
        background={'#fff'}
        title={'Immersion'}
        titleAlign={'start'}
      >
        {immersions?.map((immersion, index) => {
          return (
            <React.Fragment key={immersion.id}>
              <ImmersionCard
                data={immersion}
                isEditSection={isEditImmersionSection}
              />
            </React.Fragment>
          )
        })}
        <SectionActions actions={immersionActions} />
        {isEditImmersionSection && (
          <AddEntryButton
            title={`Add new Immersion Experience`}
            onClick={handleShowImmersionModal}
          />
        )}
        {showImmersionModal && (
          <ImmersionCardModal
            onHide={handleHideImmersionModal}
            show={showImmersionModal}
            title={'ADD IMMERSION EXPERIENCE'}
            onSave={onSaveImmersion}
          />
        )}
      </PortfolioDataContainer>
      <div className={'mt-5'}>
        <PortfolioDataContainer
          background={'#fff'}
          title={'Work Experience'}
          titleAlign={'start'}
        >
          {workExperiences?.map((workExperience, index) => {
            return (
              <React.Fragment key={workExperience.id}>
                <WorkExperienceCard
                  data={workExperience}
                  isEditSection={isEditWorkExperienceSection}
                />
              </React.Fragment>
            )
          })}
          <SectionActions actions={workExperienceActions} />
          {isEditWorkExperienceSection && (
            <AddEntryButton
              title={`Add new Work Experience`}
              onClick={handleShowWorkExperienceModal}
            />
          )}
          {showWorkExperienceModal && (
            <WorkExperienceCardModal
              onHide={handleHideWorkExperienceModal}
              show={showWorkExperienceModal}
              title={'ADD WORK EXPERIENCE'}
              onSave={onSaveWorkExperience}
            />
          )}
        </PortfolioDataContainer>
      </div>
    </>
  )
}

export default MyProductivity
