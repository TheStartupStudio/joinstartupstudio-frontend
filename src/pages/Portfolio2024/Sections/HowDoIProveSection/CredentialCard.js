import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideEditCredentialModal,
  showEditCredentialModal,
  updateMyCredential
} from '../../../../redux/portfolio/Actions'
import CredentialCardModal from './CredentialCardModal'
import { convertDateToMonthYear } from '../../../../utils/helpers'

function CredentialCard(props) {
  const { credential, isEditSection } = props
  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const showCredentialModalId = useSelector(
    (state) => state.portfolio.howSection.myAlignments.credentials.showEditModal
  )

  const handleShowCredentialModal = (credential) => {
    setDataToEdit(credential)
    dispatch(showEditCredentialModal(credential?.id))
  }
  const handleHideCredentialModal = () => {
    dispatch(hideEditCredentialModal())
  }
  const alignmentActions = [
    {
      type: 'edit',
      action: () => handleShowCredentialModal(credential),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  const onSave = (data) => {
    dispatch(updateMyCredential(data))
  }

  return (
    <div className={'mb-3'}>
      <PortfolioDataContainer background={'#fff'}>
        <div className={'d-flex gap-3 '}>
          <div className={'flex-grow'} style={{ width: 100 }}>
            <img
              className={'organization-image'}
              src={credential.imageUrl}
              alt={'education image'}
            />
          </div>
          <div className={'flex-grow-1'}>
            <div className={'d-flex justify-content-between gap-2'}>
              <div>
                <div className={'organization-name mb-2'}>
                  {credential.credentialTitle}
                </div>
                <div className={'organization-location mb-2'}>
                  {credential.certifyingOrganization}
                </div>
                <div className={'organization-website mb-3'}>
                  {credential.website}
                </div>
              </div>
              <div className={'text-end organization-date'}>
                {convertDateToMonthYear(credential.dateAwarded)}
              </div>
            </div>
            <div>
              <div className={'organization-description-label mb-2'}>
                Description:
              </div>
              <div className={'organization-description'}>
                {credential.description}
              </div>
            </div>
          </div>
        </div>
        <SectionActions actions={alignmentActions} />
        {showCredentialModalId === dataToEdit?.id && (
          <CredentialCardModal
            onHide={handleHideCredentialModal}
            show={showCredentialModalId === dataToEdit?.id}
            title={'EDIT CREDENTIAL'}
            data={dataToEdit}
            onSave={onSave}
          />
        )}
      </PortfolioDataContainer>
    </div>
  )
}

export default CredentialCard
