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

function MyAlignments(props) {
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
  return (
    <>
      <PortfolioDataContainer
        background={'#fff'}
        title={'Education'}
        titleAlign={'start'}
      >
        {educations?.map((education, index) => {
          return (
            <React.Fragment key={education.id}>
              <EducationCard
                education={education}
                isEditSection={isEditEducationSection}
              />
            </React.Fragment>
          )
        })}
        <SectionActions actions={educationActions} />
        {isEditEducationSection && (
          <AddEntryButton
            title={`Add new Education Experience`}
            onClick={handleShowEducationModal}
          />
        )}
        {showEducationModal && (
          <EducationCardModal
            onHide={handleHideEducationModal}
            show={showEducationModal}
            title={'ADD EDUCATIONAL EXPERIENCE'}
            onSave={onSaveEducation}
          />
        )}
      </PortfolioDataContainer>
      <div className={'mt-5'}>
        <PortfolioDataContainer
          background={'#fff'}
          title={'Credentials'}
          titleAlign={'start'}
        >
          {credentials?.map((credential, index) => {
            return (
              <React.Fragment key={credential.id}>
                <CredentialCard
                  credential={credential}
                  isEditSection={isEditCredentialSection}
                />
              </React.Fragment>
            )
          })}
          <SectionActions actions={credentialActions} />
          {isEditCredentialSection && (
            <AddEntryButton
              title={`Add new Credential`}
              onClick={handleShowCredentialModal}
            />
          )}
          {showCredentialModal && (
            <CredentialCardModal
              onHide={handleHideCredentialModal}
              show={showCredentialModal}
              title={'ADD CREDENTIAL'}
              onSave={onSaveCredential}
            />
          )}
        </PortfolioDataContainer>
      </div>
    </>
  )
}

export default MyAlignments
