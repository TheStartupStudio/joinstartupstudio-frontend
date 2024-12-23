import React, { useEffect, useState } from 'react'
import PortfolioSubmission from '../../Components/PortfolioSubmission'
import UserInfo from '../../Components/UserInfo'
import PortfolioInfoBox from '../../Components/DisplayData/PortfolioInfoBox'
import { useDispatch, useSelector } from 'react-redux'
import SectionActions from '../../Components/Actions/SectionActions'
import {
  hideAddUserBasicInfoModal,
  hideEditUserBasicInfoModal,
  saveUserBasicData,
  saveUserStory,
  showAddUserBasicInfoModal,
  showEditUserBasicInfoModal
} from '../../../../redux/portfolio/Actions'

import UserBasicInfoModal from '../../Components/Modals/UserBasicInfoModal'

const UserBasicInfo = (props) => {
  const mode = useSelector((state) => state.portfolio.mode)
  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo.isSaving
  )

  const showAddModal = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo.addModal
  )
  const showEditModal = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo.editModal
  )

  const [state, setState] = useState({
    isEditSection: false,
    imageFile: null,
    userImageUrl: null,
    thumbnailUrl: '',
    videoUrl: '',
    valueProposition: '',
    story: '',
    id: null,
    userTitle: null,
    name: '',
    organization: '',
    socialMediaLinks: {
      linkedIn: '',
      facebook: '',
      xTwitter: '',
      instagram: '',
      website: ''
    }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    if (props.data) {
      setState((prevState) => ({
        ...prevState,
        thumbnailUrl: props.data?.thumbnailUrl,
        videoUrl: props.data?.videoUrl,
        valueProposition: props.data?.valueProposition,
        story: props.data?.story,
        id: props.data?.id,
        isEditSection: false,
        userTitle: props.data?.userTitle,
        name: props.data?.name,
        organization: props.data?.organization,
        socialMediaLinks: props.data?.socialMediaLinks,
        userImageUrl: props.data?.userImageUrl
      }))
    }
  }, [props.data])

  const isEdit = () => !!state.id

  const handleShowAddMyStoryModal = () => {
    dispatch(showAddUserBasicInfoModal())
  }

  const handleHideAddMyStoryModal = () => {
    dispatch(hideAddUserBasicInfoModal())
  }

  const handleShowEditMyStoryModal = () => {
    dispatch(showEditUserBasicInfoModal())
  }

  const handleHideEditMyStoryModal = () => {
    dispatch(hideEditUserBasicInfoModal())
  }

  const actions = [
    {
      type: 'add',
      action: () => handleShowAddMyStoryModal(),
      isDisplayed: mode === 'edit' && !isEdit()
    },
    {
      type: 'edit',
      action: () => handleShowEditMyStoryModal(),
      isDisplayed: mode === 'edit' && isEdit()
    }
  ]

  const isValidContent = (content) => {
    if (content === null || content === undefined) {
      return false
    }

    const trimmedContent = content.trim()
    const htmlTagPattern = /<[^>]*>/g
    const textOnlyContent = trimmedContent.replace(htmlTagPattern, '').trim()
    return textOnlyContent !== ''
  }

  const displayContent = (content, clickEditText, noThingAddedText) => {
    if (mode === 'edit' && !state?.isEditSection && !isValidContent(content)) {
      return clickEditText ?? noThingAddedText
    } else if (mode === 'edit' && !state?.isEditSection) {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    } else if (mode === 'preview') {
      return isValidContent(content)
        ? content
        : noThingAddedText ?? 'Nothing has been added yet.'
    }
  }

  return (
    <>
      <>
        <div className={'row userinfo-row'}>
          <div className={'col-md-6'}>
            <PortfolioSubmission
              videoUrl={state.videoUrl}
              thumbnailUrl={state.thumbnailUrl}
              title={'MY PERSONAL BRAND STORY'}
            />
          </div>
          <div className={'col-md-6'}>
            <div className={'d-flex flex-column h-100'}>
              <UserInfo
                userInfo={state}
                user={props.user}
                className='portf-userinfo'
              />

              <div className={'userinfo-valueprop mt-3'}>
                <PortfolioInfoBox
                  title={'My Value Proposition'}
                  content={displayContent(
                    state.valueProposition,
                    null,
                    'No value proposition added yet! Click the edit button to add your value proposition.'
                  )}
                  contentClasses={' w-100 mt-2'}
                  height={150}
                />
              </div>
            </div>
          </div>
        </div>
      </>
      <SectionActions actions={actions} />

      {showAddModal && (
        <UserBasicInfoModal
          onHide={handleHideAddMyStoryModal}
          show={showAddModal}
          title={'ADD MY DETAILS AND VALUE PROPOSITION'}
          isSaving={isSaving}
          data={state}
          onSave={(data) => {
            dispatch(saveUserBasicData(data, state.id))
          }}
          showSectionCheckbox={false}
          isShownSection={true}
          onShowSection={() => {}}
        />
      )}

      {showEditModal && (
        <UserBasicInfoModal
          onHide={handleHideEditMyStoryModal}
          show={showEditModal}
          title={'EDIT MY DETAILS AND VALUE PROPOSITION'}
          isSaving={isSaving}
          data={state}
          onSave={(data) => {
            dispatch(saveUserBasicData(data, state.id))
          }}
          showSectionCheckbox={false}
          isShownSection={true}
          onShowSection={() => {}}
        />
      )}
    </>
  )
}

export default UserBasicInfo
