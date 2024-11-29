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
import immersionImage from '../../../../assets/images/HS-Portfolio-Icons/immersion.png'
import workExperienceImage from '../../../../assets/images/HS-Portfolio-Icons/workexperience.png'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import CarouselComponent from '../../../../components/Carousel/CarouselComponent'

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
  const filteredUnshownData = (data) => {
    return data?.filter((data) => data.showSection)
  }
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
      isDisplayed:
        mode === 'edit' &&
        isEditImmersionSection === false &&
        immersions?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowImmersionModal(),
      isDisplayed: mode === 'edit' && immersions?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditImmersionSection(false),
      isDisplayed:
        mode === 'edit' &&
        isEditImmersionSection === true &&
        immersions?.length > 0
    }
  ]

  const workExperienceActions = [
    {
      type: 'edit',
      action: () => setIsEditWorkExperienceSection(true),
      isDisplayed:
        mode === 'edit' &&
        isEditWorkExperienceSection === false &&
        workExperiences?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowWorkExperienceModal(),
      isDisplayed: mode === 'edit' && workExperiences?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditWorkExperienceSection(false),
      isDisplayed:
        mode === 'edit' &&
        isEditWorkExperienceSection === true &&
        workExperiences?.length > 0
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
    isLoading,
    NoDataDisplay,
    containCarousel
  ) => {
    if (isLoading) {
      return <PortfolioSectionDataLoader />
    }

    return (
      <PortfolioDataContainer
        background={
          items?.length > 0
            ? '#fff'
            : 'transparent linear-gradient(231deg, #FFFFFF 0%, #E4E9F4 100%) 0% 0% no-repeat padding-box'
        }
        title={title}
        titleAlign={'start'}
        height={items?.length > 0 ? undefined : 440}
      >
        {items?.length > 0 ? (
          containCarousel ? (
            <CarouselComponent
              data={items}
              renderItems={(item) => {
                return (
                  <React.Fragment key={item.id}>
                    <ItemComponent data={item} isEditSection={isEditSection} />
                  </React.Fragment>
                )
              }}
              transitionDuration='0.5s'
            />
          ) : (
            items?.map((item) => (
              <React.Fragment key={item.id}>
                <ItemComponent data={item} isEditSection={isEditSection} />
              </React.Fragment>
            ))
          )
        ) : (
          NoDataDisplay
        )}
        <SectionActions actions={sectionActions} />
        {isEditSection && items?.length > 0 && (
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
      {' '}
      <div className={'immrs-render-caro'}>
        {renderSection(
          'Immersion',
          mode === 'edit' ? immersions : filteredUnshownData(immersions),
          ImmersionCard,
          isEditImmersionSection,
          immersionActions,
          handleShowImmersionModal,
          showImmersionModal,
          handleHideImmersionModal,
          'ADD IMMERSION EXPERIENCE',
          onSaveImmersion,
          ImmersionCardModal,
          loadingImmersions,
          <NoDataDisplay
            src={immersionImage}
            text={
              'You don’t have any immersion experiences yet! Click the button to add one.'
            }
          />,
          true
        )}
      </div>
      <div className={'mt-5'}>
        {renderSection(
          'Work Experience',
          mode === 'edit'
            ? workExperiences
            : filteredUnshownData(workExperiences),
          WorkExperienceCard,
          isEditWorkExperienceSection,
          workExperienceActions,
          handleShowWorkExperienceModal,
          showWorkExperienceModal,
          handleHideWorkExperienceModal,
          'ADD WORK EXPERIENCE',
          onSaveWorkExperience,
          WorkExperienceCardModal,
          loadingWorkExperiences,
          <NoDataDisplay
            src={workExperienceImage}
            text={
              'You don’t have any work experience yet! Click the button to add one.'
            }
          />,
          false
        )}
      </div>
    </>
  )
}

export default MyProductivity
