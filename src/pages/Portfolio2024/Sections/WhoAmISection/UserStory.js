import React, { useEffect, useState } from 'react'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import {
  hideAddMyStoryModal,
  hideEditMyStoryModal,
  saveUserStory,
  showAddMyStoryModal,
  showEditMyStoryModal,
  toggleUserStory
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import myStoryImage from '../../../../assets/images/HS-Portfolio-Icons/my story icon.png'
import StoryModal from '../../Components/Modals/StoryModal'

function UserStory(props) {
  const [isEditSection, setIsEditSection] = useState(false)
  const [story, setStory] = useState('')
  const [showStory, setShowStory] = useState(false)
  const [id, setId] = useState(null)
  const dispatch = useDispatch()

  const mode = useSelector((state) => state.portfolio.mode)
  const showAddModal = useSelector(
    (state) => state.portfolio.whoSection.userStory.addModal
  )
  const showEditModal = useSelector(
    (state) => state.portfolio.whoSection.userStory.editModal
  )
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.userStory.isSaving
  )
  const isTogglingSection = useSelector(
    (state) => state.portfolio.whoSection.userStory.isTogglingSection
  )
  useEffect(() => {
    if (props.data) {
      setShowStory(props.data?.showUserStory)
      setStory(props?.data?.story)
      setId(props.data?.id)
    }
    setIsEditSection(false)
  }, [props.data])

  const handleShowAddMyStoryModal = () => {
    dispatch(showAddMyStoryModal())
  }

  const handleHideAddMyStoryModal = () => {
    dispatch(hideAddMyStoryModal())
  }

  const handleShowEditMyStoryModal = () => {
    dispatch(showEditMyStoryModal())
  }

  const handleHideEditMyStoryModal = () => {
    dispatch(hideEditMyStoryModal())
  }

  const isEdit = () => !!id

  const actions = [
    {
      type: 'add',
      action: () => handleShowAddMyStoryModal(),
      isDisplayed: mode === 'edit' && (!story || story?.trim()?.length < 1)
    },
    {
      type: 'edit',
      action: () => handleShowEditMyStoryModal(),
      isDisplayed: mode === 'edit' && (story || story?.trim()?.length > 0)
    }
  ]

  return (
    <>
      {!story || story.trim().length < 1 ? (
        <>
          <NoDataDisplay
            src={myStoryImage}
            classNames={'mt-2 mb-2'}
            text={
              mode === 'edit'
                ? 'Nothing has been added yet. Click the button to add your story.'
                : 'Nothing has been added yet.'
            }
            width={200}
          />
        </>
      ) : (
        <div className={'row'}>
          <div className={'col-sm-12 mb-3'}>
            <PortfolioInfoBox
              inputHeight={120}
              content={story}
              contentClasses={'text-start'}
            />
          </div>
        </div>
      )}

      {mode === 'edit' && <SectionActions actions={actions} />}

      {showAddModal && (
        <StoryModal
          onHide={handleHideAddMyStoryModal}
          show={showAddModal}
          title={'Add My Story'}
          isSaving={isSaving}
          data={{
            story
          }}
          onSave={(data) => {
            dispatch(saveUserStory(data, id))
          }}
          showSectionCheckbox={true}
          isShownSection={showStory}
          onToggleSection={(showUserStory) => {
            dispatch(toggleUserStory({ showUserStory: showUserStory }, id))
          }}
          isTogglingSection={isTogglingSection}
          switchId={'add-story-switch'}
          switchName={'add-story-switch'}
        />
      )}

      {showEditModal && (
        <StoryModal
          onHide={handleHideEditMyStoryModal}
          show={showEditModal}
          title={'Edit My Story'}
          isSaving={isSaving}
          data={{
            story
          }}
          onSave={(data) => {
            dispatch(saveUserStory(data, id))
          }}
          showSectionCheckbox={true}
          isShownSection={showStory}
          onToggleSection={(showUserStory) => {
            dispatch(toggleUserStory({ showUserStory: showUserStory }, id))
          }}
          isTogglingSection={isTogglingSection}
          switchId={'edit-story-switch'}
          switchName={'edit-story-switch'}
        />
      )}
    </>
  )
}

export default UserStory
