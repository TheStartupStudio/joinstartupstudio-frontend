import React, { useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import { convertDateToMonthYear } from '../../../../utils/helpers'
import SectionActions from '../../Components/Actions/SectionActions'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import {
  hideEditImmersionModal,
  showEditImmersionModal,
  updateMyImmersion
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import ImmersionCardModal from './ImmersionCardModal'
import imagePlaceholder from '../../../../assets/images/image-placeholder.jpeg'
import WebsiteLink from '../../Components/WebsiteLink'
function ImmersionCard(props) {
  const { data, isEditSection } = props

  console.log('props', props)
  const [dataToEdit, setDataToEdit] = useState({})

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)
  const showModalId = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.immersions?.showEditModal
  )

  const handleShowImmersionModal = (immersion) => {
    dispatch(showEditImmersionModal(immersion?.id))
    setDataToEdit(immersion)
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
    <div className={'mb-3 w-100'}>
      <PortfolioDataContainer background={'#fff'}>
        <div className={'d-flex gap-3 '}>
          <div className={'flex-grow'} style={{ width: 100 }}>
            <img
              className={'organization-image'}
              src={data?.organizationLogo ?? imagePlaceholder}
              alt={'education image'}
            />
          </div>
          <div className={'d-flex justify-content-between flex-grow-1 gap-4'}>
            <div className={'w-50'}>
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
              </div>
              <div>
                <div className={'organization-description-label mb-2'}>
                  The Problem
                </div>
                <div
                  className={'organization-description'}
                  dangerouslySetInnerHTML={{ __html: data?.problem }}
                />

                <div className={'organization-description-label mb-2 mt-3'}>
                  My solution
                </div>
                <div
                  className={'organization-description'}
                  dangerouslySetInnerHTML={{ __html: data?.solution }}
                />
              </div>
            </div>
            <div className={'text-end organization-date w-50'}>
              {convertDateToMonthYear(data?.startDate)} -{' '}
              {!data?.currentlyAttending
                ? convertDateToMonthYear(data?.endDate)
                : 'Currently attending'}
              <div className={'mt-3'}>
                <PortfolioSubmission
                  title={'My immersion experience'}
                  thumbnailUrl={data?.immersionThumbnailUrl}
                  videoUrl={data?.immersionVideoUrl}
                />
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
