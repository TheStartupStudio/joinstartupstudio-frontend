export {
  userLogin,
  removeErrorMessage,
  userUpdate,
  userUpdateProfileImage,
  userLogout,
  loginLoading
} from './user/Actions'

export {
  changeSidebarState,
  setAccordionToggled,
  setImageCropperData,
  setCroppedImage
} from './general/Actions'

export { changeLocale } from './lang/Actions'

export {
  getVideosWatched,
  getAllNotes,
  getNote,
  saveOrEditNote
} from './course/Actions'

export {
  saveJournal,
  getJournal,
  getFinishedJournals,
  saveFinishedJournals,
  saveFinishedCourses,
  checkIfUserHasFinishedJournal
} from './journal/Actions'

export { getAllPodcast } from './podcast/Actions'
