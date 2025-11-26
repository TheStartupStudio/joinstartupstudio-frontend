export {
  userLogin,
  removeErrorMessage,
  userUpdate,
  userUpdateProfileImage,
  userLogout,
  loginLoading,
  updateTnC
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
  saveOrEditNote,
  removeNoteFromState
} from './course/Actions'

export {
  saveJournal,
  getJournal,
  getFinishedJournals,
  saveFinishedJournals,
  saveFinishedCourses,
  checkIfUserHasFinishedJournal,
  getJournalTitles
} from './journal/Actions'

export { getAllPodcast } from './podcast/Actions'

