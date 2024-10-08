import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideEditEducationModal,
  showEditEducationModal,
  updateMyEducation
} from '../../../../redux/portfolio/Actions'
import EducationCardModal from './EducationCardModal'
import { convertDateToMonthYear } from '../../../../utils/helpers'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import WebsiteLink from '../../Components/WebsiteLink'

function EducationCard(props) {
  const { item: education, isEditSection } = props

  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const showEducationModalId = useSelector(
    (state) => state.portfolio.howSection.myAlignments.educations.showEditModal
  )

  const handleShowEducationModal = (education) => {
    dispatch(showEditEducationModal(education?.id))
    setDataToEdit(education)
  }
  const handleHideEducationModal = () => {
    dispatch(hideEditEducationModal())
  }
  const alignmentActions = [
    {
      type: 'edit',
      action: () => handleShowEducationModal(education),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  const onSave = (data) => {
    dispatch(updateMyEducation(data))
  }

  return (
    <div className={' mb-3 w-100'}>
      <PortfolioDataContainer background={'#fff'}>
        <div className={'proveit-card-resp d-flex gap-3 '} s>
          <div className={'flex-grow'} style={{ width: 100 }}>
            <img
              className={'organization-image'}
              src={education?.imageUrl ?? imagePlaceholder}
              alt={'education image'}
            />
          </div>
          <div className={'flex-grow-1'}>
            <div className={'d-flex justify-content-between gap-2'}>
              <div>
                <div className={' proveit-title-org organization-name mb-2'}>
                  {education?.organizationName}
                </div>
                <div
                  className={'organization-location mb-2'}
                  style={{ fontWeight: 400 }}
                >
                  {education?.location}
                </div>
                <div
                  className={'organization-website mb-3'}
                  style={{ fontWeight: 400 }}
                >
                  <WebsiteLink website={education?.website} />
                </div>
              </div>
              <div
                className={'text-end organization-date'}
                style={{ fontWeight: 400 }}
              >
                {convertDateToMonthYear(education?.startDate)} -{' '}
                {!education?.currentPosition
                  ? convertDateToMonthYear(education?.endDate)
                  : 'Present'}
              </div>
            </div>
            <div>
              <div
                className={
                  ' proveit-title-org organization-description-label mb-2'
                }
              >
                Description:
              </div>{' '}
              <div
                className={'organization-description'}
                dangerouslySetInnerHTML={{ __html: education?.description }}
                style={{ fontWeight: 300 }}
              />
            </div>
          </div>
        </div>
        <SectionActions actions={alignmentActions} />
        {showEducationModalId === dataToEdit?.id && (
          <EducationCardModal
            onHide={handleHideEducationModal}
            show={showEducationModalId === dataToEdit?.id}
            title={'EDIT EDUCATIONAL EXPERIENCE'}
            data={dataToEdit}
            onSave={onSave}
          />
        )}
      </PortfolioDataContainer>
    </div>
  )
}

export default EducationCard
