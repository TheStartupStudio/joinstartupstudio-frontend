import React, { useEffect, useState } from 'react'
import MyFailure from './MyFailure'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideAddFailureModal,
  hideAddMentorModal,
  showAddFailureModal,
  showAddMentorModal
} from '../../../../redux/portfolio/Actions'
import SectionActions from '../../Components/Actions/SectionActions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import MyFailureModal from '../../Components/Modals/MyFailureModal'
import failureImage from '../../../../assets/images/HS-Portfolio-Icons/failure.png'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
function MyFailures(props) {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const [isEditSection, setIsEditSection] = useState(false)
  const showFailureModal = useSelector(
    (state) => state.portfolio.whoSection.myFailures.showAddFailureModal
  )

  const [myFailures, setMyFailures] = useState(null)

  useEffect(() => {
    if (props.data) setMyFailures(props.data)
  }, [props.data])

  const handleShowFailureModal = () => {
    dispatch(showAddFailureModal())
  }

  const handleHideFailureModal = () => {
    dispatch(hideAddFailureModal())
  }

  const handleShowModal = () => {
    dispatch(showAddFailureModal())
  }

  const handleHideModal = () => {
    dispatch(hideAddFailureModal())
  }

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed:
        mode === 'edit' && isEditSection === false && myFailures?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowModal(),
      isDisplayed: mode === 'edit' && myFailures?.length === 0
    },

    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed:
        mode === 'edit' && isEditSection === true && myFailures?.length > 0
    }
  ]

  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.myFailures.isSaving
  )

  return (
    <div className={'d-flex flex-column gap-4 h-100'}>
      {myFailures?.length > 0 ? (
        myFailures?.map((myFailure, index) => (
          <React.Fragment key={myFailure?.id}>
            <MyFailure data={myFailure} isEditSection={isEditSection} />
          </React.Fragment>
        ))
      ) : (
        <NoDataDisplay
          src={failureImage}
          text={'You don’t have any failures yet! Click the button to add one.'}
        />
      )}
      {myFailures?.length > 0 && isEditSection && (
        <AddEntryButton
          title={`Add new "My Failures" section`}
          onClick={handleShowFailureModal}
        />
      )}
      <SectionActions actions={actions} />

      {showFailureModal && (
        <MyFailureModal
          onHide={handleHideFailureModal}
          show={showFailureModal}
          title={'Add New Failure'}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

export default MyFailures
