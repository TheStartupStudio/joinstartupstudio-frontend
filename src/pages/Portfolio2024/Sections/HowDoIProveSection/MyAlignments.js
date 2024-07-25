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
      isDisplayed: mode === 'edit' && isEditEducationSection === false
    },
    {
      type: 'save',
      action: () => setIsEditEducationSection(false),
      isDisplayed: mode === 'edit' && isEditEducationSection === true
    }
  ]

  const credentialActions = [
    {
      type: 'edit',
      action: () => setIsEditCredentialSection(true),
      isDisplayed: mode === 'edit' && isEditCredentialSection === false
    },
    {
      type: 'save',
      action: () => setIsEditCredentialSection(false),
      isDisplayed: mode === 'edit' && isEditCredentialSection === true
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
            <ItemComponent item={item} isEditSection={isEditSection} />
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
      <>
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
          loadingEducations
        )}
        <div className={'mt-5'}>
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
            loadingCredentials
          )}
        </div>
      </>
    </>
  )
}

export default MyAlignments
