import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideEditWorkExperienceModal,
  showEditWorkExperienceModal,
  updateMyWorkExperience
} from '../../../../redux/portfolio/Actions'
import { convertDateToMonthYear } from '../../../../utils/helpers'
import WorkExperienceCardModal from './WorkExperienceCardModal'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import WebsiteLink from '../../Components/WebsiteLink'

function WorkExperienceCard(props) {
  const { data, isEditSection } = props

  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const showModalId = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.workExperiences?.showEditModal
  )

  const handleShowWorkExperienceModal = (work) => {
    dispatch(showEditWorkExperienceModal(work?.id))
    setDataToEdit(work)
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
              src={data?.imageUrl ?? imagePlaceholder}
              alt={'work experience image'}
            />
          </div>
          <div className={'flex-grow-1'}>
            <div className={'d-flex justify-content-between gap-2'}>
              <div>
                <div className={'organization-name mb-2'}>
                  {data?.organizationName}
                </div>
                <div className={'organization-location mb-2'}>
                  {data?.location}
                </div>
                <div className={'organization-website mb-3'}>
                  <WebsiteLink website={data?.website} />
                </div>
              </div>
              <div className={'text-end organization-date'}>
                {convertDateToMonthYear(data?.startDate)} -{' '}
                {!data?.currentPosition
                  ? convertDateToMonthYear(data?.endDate)
                  : 'Present'}
              </div>
            </div>
            <div>
              <div className={'organization-description-label mb-2'}>
                {data?.jobTitle}
              </div>{' '}
              <div
                className={'organization-description'}
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
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
