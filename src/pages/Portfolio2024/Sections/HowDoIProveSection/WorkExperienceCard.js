import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideEditEducationModal,
  hideEditWorkExperienceModal,
  showEditEducationModal,
  showEditWorkExperienceModal,
  updateMyEducation,
  updateMyWorkExperience
} from '../../../../redux/portfolio/Actions'
import EducationCardModal from './EducationCardModal'
import { convertDateToMonthYear } from '../../../../utils/helpers'
import WorkExperienceCardModal from './WorkExperienceCardModal'

function WorkExperienceCard(props) {
  const { data, isEditSection } = props

  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const showModalId = useSelector(
    (state) =>
      state.portfolio.howSection?.myAlignments?.workExperiences?.showEditModal
  )

  const handleShowWorkExperienceModal = (education) => {
    dispatch(showEditWorkExperienceModal(education?.id))
    setDataToEdit(education)
  }
  const handleHideWorkExperienceModal = () => {
    dispatch(hideEditWorkExperienceModal())
  }
  const alignmentActions = [
    {
      type: 'edit',
      action: () => handleShowWorkExperienceModal(data),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  const onSave = (data) => {
    dispatch(updateMyWorkExperience(data))
  }

  return (
    <div className={'mb-3'}>
      <PortfolioDataContainer background={'#fff'}>
        <div className={'d-flex gap-3 '}>
          <div className={'flex-grow'} style={{ width: 100 }}>
            <img
              className={'organization-image'}
              src={data.imageUrl}
              alt={'education image'}
            />
          </div>
          <div className={'flex-grow-1'}>
            <div className={'d-flex justify-content-between gap-2'}>
              <div>
                <div className={'organization-name mb-2'}>
                  {data.organizationName}
                </div>
                <div className={'organization-location mb-2'}>
                  {data.location}
                </div>
                <div className={'organization-website mb-3'}>
                  {data.website}
                </div>
              </div>
              <div className={'text-end organization-date'}>
                {convertDateToMonthYear(data.startDate)} -{' '}
                {!data?.currentPosition
                  ? convertDateToMonthYear(data.endDate)
                  : 'Current position'}
              </div>
            </div>
            <div>
              <div className={'organization-description-label mb-2'}>
                Description:
              </div>{' '}
              <div className={'organization-description'}>
                {data.description}
              </div>
            </div>
          </div>
        </div>
        <SectionActions actions={alignmentActions} />
        {showModalId && showModalId === dataToEdit?.id && (
          <WorkExperienceCardModal
            onHide={handleHideWorkExperienceModal}
            show={showModalId === dataToEdit?.id}
            title={'EDIT WORK EXPERIENCE'}
            data={dataToEdit}
            onSave={onSave}
          />
        )}
      </PortfolioDataContainer>
    </div>
  )
}

export default WorkExperienceCard
