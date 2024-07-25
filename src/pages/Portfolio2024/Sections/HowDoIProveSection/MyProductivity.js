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
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'

function MyProductivity(props) {
  const {
    immersions: loadingImmersions,
    workExperiences: loadingWorkExperiences
  } = props.loadings ?? {}

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

  const renderSection = (
    title,
    items,
    ItemComponent,
    isEditSection,
    sectionActions,
    handleShowModal,
    showModal,
    handleHideModal,
    modalTitle,
    onSave,
    ModalComponent,
    isLoading
  ) => {
    if (isLoading) {
      return <PortfolioSectionDataLoader />
    }

    return (
      <PortfolioDataContainer
        background={'#fff'}
        title={title}
        titleAlign={'start'}
      >
        {items?.map((item) => (
          <React.Fragment key={item.id}>
            <ItemComponent data={item} isEditSection={isEditSection} />
          </React.Fragment>
        ))}
        <SectionActions actions={sectionActions} />
        {isEditSection && (
          <AddEntryButton
            title={`Add new ${title}`}
            onClick={handleShowModal}
          />
        )}
        {showModal && (
          <ModalComponent
            onHide={handleHideModal}
            show={showModal}
            title={modalTitle}
            onSave={onSave}
          />
        )}
      </PortfolioDataContainer>
    )
  }
  return (
    <>
      {renderSection(
        'Immersion',
        immersions,
        ImmersionCard,
        isEditImmersionSection,
        immersionActions,
        handleShowImmersionModal,
        showImmersionModal,
        handleHideImmersionModal,
        'ADD IMMERSION EXPERIENCE',
        onSaveImmersion,
        ImmersionCardModal,
        loadingImmersions
      )}
      <div className={'mt-5'}>
        {renderSection(
          'Work Experience',
          workExperiences,
          WorkExperienceCard,
          isEditWorkExperienceSection,
          workExperienceActions,
          handleShowWorkExperienceModal,
          showWorkExperienceModal,
          handleHideWorkExperienceModal,
          'ADD WORK EXPERIENCE',
          onSaveWorkExperience,
          WorkExperienceCardModal,
          loadingWorkExperiences
        )}
      </div>
    </>
  )
}

export default MyProductivity
