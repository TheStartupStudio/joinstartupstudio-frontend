import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import EducationCardModal from './EducationCardModal'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  addMyCredential,
  addMyEducation,
  hideAddCredentialModal,
  hideAddEducationModal,
  showAddCredentialModal,
  showAddEducationModal
} from '../../../../redux/portfolio/Actions'
import EducationCard from './EducationCard'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import CredentialCard from './CredentialCard'
import CredentialCardModal from './CredentialCardModal'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import educationImage from '../../../../assets/images/HS-Portfolio-Icons/education.png'
import credentialImage from '../../../../assets/images/HS-Portfolio-Icons/credentials.png'

function MyAlignments(props) {
  const { educations: loadingEducations, credentials: loadingCredentials } =
    props.loadings ?? {}

  const educations = props.data?.educations?.data
  const credentials = props.data?.credentials?.data
  const dispatch = useDispatch()
  const [isEditEducationSection, setIsEditEducationSection] = useState(false)
  const [isEditCredentialSection, setIsEditCredentialSection] = useState(false)
  const mode = useSelector((state) => state.portfolio.mode)

  const showEducationModal = useSelector(
    (state) => state.portfolio.howSection.myAlignments.educations.showAddModal
  )
  const showCredentialModal = useSelector(
    (state) => state.portfolio.howSection.myAlignments.credentials.showAddModal
  )

  const handleShowEducationModal = () => {
    dispatch(showAddEducationModal())
  }
  const handleHideEducationModal = () => {
    dispatch(hideAddEducationModal())
  }

  const handleShowCredentialModal = () => {
    dispatch(showAddCredentialModal())
  }
  const handleHideCredentialModal = () => {
    dispatch(hideAddCredentialModal())
  }

  const educationActions = [
    {
      type: 'edit',
      action: () => setIsEditEducationSection(true),
      isDisplayed:
        mode === 'edit' &&
        isEditEducationSection === false &&
        educations?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowEducationModal(),
      isDisplayed: mode === 'edit' && educations?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditEducationSection(false),
      isDisplayed:
        mode === 'edit' &&
        isEditEducationSection === true &&
        educations?.length > 0
    }
  ]

  const credentialActions = [
    {
      type: 'edit',
      action: () => setIsEditCredentialSection(true),
      isDisplayed:
        mode === 'edit' &&
        isEditCredentialSection === false &&
        credentials?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowCredentialModal(),
      isDisplayed: mode === 'edit' && credentials?.length === 0
    },
    {
      type: 'save',
      action: () => setIsEditCredentialSection(false),
      isDisplayed:
        mode === 'edit' &&
        isEditCredentialSection === true &&
        credentials?.length > 0
    }
  ]

  const onSaveEducation = (data) => {
    dispatch(addMyEducation(data))
  }

  const onSaveCredential = (data) => {
    dispatch(addMyCredential(data))
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
    NoDataDisplay
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
        {items?.length > 0
          ? items?.map((item) => (
              <React.Fragment key={item.id}>
                <ItemComponent item={item} isEditSection={isEditSection} />
              </React.Fragment>
            ))
          : NoDataDisplay}
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
      <>
        {' '}
        <div className={'education-section-alignment w-100'}>
          {renderSection(
            'Education',
            educations,
            EducationCard,
            isEditEducationSection,
            educationActions,
            handleShowEducationModal,
            showEducationModal,
            handleHideEducationModal,
            'ADD EDUCATIONAL EXPERIENCE',
            onSaveEducation,
            EducationCardModal,
            loadingEducations,
            <NoDataDisplay
              src={educationImage}
              text={
                'You don’t have any education yet! Click the button to add one.'
              }
            />
          )}
        </div>
        <div className={'education-section-alignment mt-5 w-100'}>
          {renderSection(
            'Credentials',
            credentials,
            CredentialCard,
            isEditCredentialSection,
            credentialActions,
            handleShowCredentialModal,
            showCredentialModal,
            handleHideCredentialModal,
            'ADD CREDENTIAL',
            onSaveCredential,
            CredentialCardModal,
            loadingCredentials,
            <NoDataDisplay
              src={credentialImage}
              text={
                'You don’t have any credential yet! Click the button to add one.'
              }
            />
          )}
        </div>
      </>
    </>
  )
}

export default MyAlignments
