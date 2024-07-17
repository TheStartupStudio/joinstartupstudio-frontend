import React, { useEffect, useState } from 'react'
import MyFailure from './MyFailure'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideAddFailureModal,
  showAddFailureModal
} from '../../../../redux/portfolio/Actions'
import SectionActions from '../../Components/Actions/SectionActions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import MyFailureModal from '../../Components/Modals/MyFailureModal'

function MyFailures(props) {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const [isEditSection, setIsEditSection] = useState(false)
  const showFailureModal = useSelector(
    (state) => state.portfolio.whoSection.myFailures.showAddFailureModal
  )
  const [myFailures, setMyFailures] = useState(null)

  useEffect(() => {
    if (props.myFailures) setMyFailures(props.myFailures)
  }, [props.myFailures])

  const handleShowFailureModal = () => {
    dispatch(showAddFailureModal())
  }

  const handleHideFailureModal = () => {
    dispatch(hideAddFailureModal())
  }

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed: mode === 'edit' && isEditSection === false
    },
    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed: mode === 'edit' && isEditSection === true
    }
  ]

  return (
    <div className={'d-flex flex-column gap-4'}>
      {myFailures?.data?.map((myFailure, index) => {
        return (
          <React.Fragment key={index}>
            <MyFailure data={myFailure} isEditSection={isEditSection} />
          </React.Fragment>
        )
      })}
      {isEditSection && (
        <AddEntryButton
          title={`Add new "My Failures" section`}
          onClick={handleShowFailureModal}
        />
      )}
      <SectionActions actions={actions} />

      <MyFailureModal
        onHide={handleHideFailureModal}
        show={showFailureModal}
        title={'Add Failure'}
        data={props.data}
      />
    </div>
  )
}

export default MyFailures
