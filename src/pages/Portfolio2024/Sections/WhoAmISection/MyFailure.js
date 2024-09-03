import React, { useEffect, useState } from 'react'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import PortfolioInfo from '../../Components/DisplayData/PortfolioInfo'
import SectionActions from '../../Components/Actions/SectionActions'
import { useDispatch, useSelector } from 'react-redux'
import MyFailureModal from '../../Components/Modals/MyFailureModal'
import {
  hideEditFailureModal,
  showEditFailureModal
} from '../../../../redux/portfolio/Actions'

function MyFailure(props) {
  const dispatch = useDispatch()
  const [myFailure, setMyFailure] = useState({})
  const mode = useSelector((state) => state.portfolio.mode)

  const showFailureModalId = useSelector(
    (state) => state.portfolio.whoSection.myFailures.showEditFailureModal
  )

  const handleShowFailureModal = (id) => {
    dispatch(showEditFailureModal(id))
  }
  const handleHideFailureModal = () => {
    dispatch(hideEditFailureModal())
  }

  useEffect(() => {
    if (props.data) setMyFailure(props.data)
  }, [props.data])
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.myFailures.isSaving
  )
  const actions = [
    {
      type: 'edit',
      action: () => handleShowFailureModal(myFailure?.id),
      isDisplayed:
        mode === 'edit' &&
        props.isEditSection === true &&
        (showFailureModalId === null || showFailureModalId === false)
    }
  ]

  const submissionActions = [
    {
      type: 'edit',
      action: () => handleShowFailureModal(myFailure?.id),
      isDisplayed: mode === 'edit' && props.isEditSection === false
    },
    {
      type: 'save',
      action: () => null,
      isDisplayed: mode === 'edit' && props.isEditSection === true
    }
  ]

  return (
    <>
      <div className={'my-failures-container position-relative'}>
        <div className={'row'}>
          <div className={'col-md-5'}>
            <PortfolioSubmission
              videoUrl={myFailure?.videoUrl}
              thumbnailUrl={myFailure?.thumbnailUrl}
              actions={submissionActions}
              title={'MY FAILURE STORY'}
            />
          </div>
          <div className={'col-md-7'}>
            <PortfolioInfo
              title={'MY FAILURE'}
              content={myFailure?.assessment}
            />
            <div className={'mt-2'}>
              <PortfolioInfo title={'My Pivot'} content={myFailure?.outcome} />
            </div>
            <div className={'mt-2'}>
              <PortfolioInfo
                title={'My Outcome'}
                content={myFailure?.outcome}
              />
            </div>
          </div>
        </div>
        <SectionActions actions={actions} />
      </div>
      <MyFailureModal
        onHide={handleHideFailureModal}
        show={showFailureModalId === myFailure?.id}
        title={'Edit Failure'}
        data={myFailure}
        isSaving={isSaving}
      />
    </>
  )
}

export default MyFailure
