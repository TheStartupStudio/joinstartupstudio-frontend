import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import { convertDateToMonthYear } from '../../../../utils/helpers'
import SectionActions from '../../Components/Actions/SectionActions'
import EducationCardModal from './EducationCardModal'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import {
  hideEditImmersionModal,
  hideEditWorkExperienceModal,
  showEditImmersionModal,
  showEditWorkExperienceModal,
  updateMyEducation,
  updateMyImmersion
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import ImmersionCardModal from './ImmersionCardModal'

function ImmersionCard(props) {
  const { data, isEditSection } = props

  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)
  const showModalId = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.immersions?.showEditModal
  )

  const handleShowImmersionModal = (education) => {
    dispatch(showEditImmersionModal(education?.id))
    setDataToEdit(education)
  }
  const handleHideImmersionModal = () => {
    dispatch(hideEditImmersionModal())
  }
  const alignmentActions = [
    {
      type: 'edit',
      action: () => handleShowImmersionModal(data),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  const onSave = (data) => {
    dispatch(updateMyImmersion(data))
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
          <div className={'d-flex justify-content-between flex-grow-1'}>
            <div className={'w-50'}>
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
              </div>
              <div>
                <div className={'organization-description-label mb-2'}>
                  The Problem
                </div>
                <div className={'organization-description'}>{data.problem}</div>

                <div className={'organization-description-label mb-2 mt-3'}>
                  My solution
                </div>
                <div className={'organization-description'}>
                  {data.solution}
                </div>
              </div>
            </div>
            <div className={'text-end organization-date w-50'}>
              {convertDateToMonthYear(data.startDate)} -{' '}
              {!data?.currentPosition
                ? convertDateToMonthYear(data.endDate)
                : 'Current position'}
              <div className={'mt-3'}>
                <PortfolioSubmission title={'My immersion experience'} />
              </div>
            </div>
          </div>
        </div>
        <SectionActions actions={alignmentActions} />
        {showModalId && showModalId === dataToEdit?.id && (
          <ImmersionCardModal
            onHide={handleHideImmersionModal}
            show={showModalId === dataToEdit?.id}
            title={'EDIT IMMERSION EXPERIENCE'}
            data={dataToEdit}
            onSave={onSave}
          />
        )}
      </PortfolioDataContainer>
    </div>
  )
}

export default ImmersionCard
