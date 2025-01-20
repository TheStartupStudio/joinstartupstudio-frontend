import platformBadgesService from './service'
import * as types from './types'

export const fetchWatchedMasterclassVideos = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchWatchedMasterclassVideosPending())
      const data = await platformBadgesService.fetchWatchedMasterClassVidoes()
      dispatch(fetchWatchedMasterClassVideosFulfilled(data))
    } catch (error) {
      dispatch(fetchWatchedMasterClassVideosRejected(error))
    }
  }
}
export const fetchWatchedPodcastVideos = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchWatchedPodcastVideosPending())
      const data = await platformBadgesService.fetchWatchedPodcastVidoes()
      dispatch(fetchWatchedPodcastVideosFulfilled(data))
    } catch (error) {
      dispatch(fetchWatchedPodcastVideosRejected(error))
    }
  }
}
export const fetchProfficientIamrSkills = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchProfficientImarSkillsPending())
      const data = await platformBadgesService.fetchProfficientIamrSkills(
        studentID
      )
      dispatch(fetchProfficientImarSkillsFulfilled(data))
    } catch (error) {
      dispatch(fetchProfficientImarSkillsRejected(error))
    }
  }
}
export const fetchCompletedJournals = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompletedJournalsPending())
      const data = await platformBadgesService.fetchCompletedJournals(studentID)
      dispatch(fetchCompletedJournalsFulfilled(data))
    } catch (error) {
      dispatch(fetchCompletedJournalsRejected(error))
    }
  }
}

export const fetchCompletedSprints = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompletedSprintsPending())
      const data = await platformBadgesService.fetchCompletedSprints(studentID)
      dispatch(fetchCompletedSprintsFulfilled(data))
    } catch (error) {
      dispatch(fetchCompletedSprintsRejected(error))
    }
  }
}

export const fetchCompletedFeedbacks = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompletedFeedbacksPending())
      const data = await platformBadgesService.fetchCompletedFeedbacks(
        studentID
      )
      dispatch(fetchCompletedFeedbacksFulfilled(data))
    } catch (error) {
      dispatch(fetchCompletedFeedbacksRejected(error))
    }
  }
}
export const fetchCompletedMentorMeetings = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompletedMentorMeetingsPending())
      const data = await platformBadgesService.fetchCompletedMentorMeetings(
        studentID
      )
      dispatch(fetchCompletedMentorMeetingsFulfilled(data))
    } catch (error) {
      dispatch(fetchCompletedMentorMeetingsRejected(error))
    }
  }
}
export const fetchPortfolioContent = (studentID) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompletedPortfolioContentPending())
      const data = await platformBadgesService.fetchCompletedPortfolioContent(
        studentID
      )
      dispatch(fetchCompletedPortfolioContentFulfilled(data))
    } catch (error) {
      dispatch(fetchCompletedPortfolioContentRejected(error))
    }
  }
}
export const createWatchedMasterclass = (contentID) => {
  return async (dispatch) => {
    try {
      dispatch(createWatchedMasterclassPending())
      const data = await platformBadgesService.createMasterClassWatchedVideo(
        contentID
      )
      dispatch(createWatchedMasterclassFulfilled(data))
    } catch (error) {
      dispatch(createWatchedMasterclassRejected(error))
    }
  }
}
export const createWatchedPodcast = (podcastID) => {
  return async (dispatch) => {
    try {
      dispatch(createWatchedPodcastPending())
      const data = await platformBadgesService.createPodcastWatchedVideo(
        podcastID
      )
      dispatch(createWatchedPodcastFulfilled(data))
    } catch (error) {
      dispatch(createWatchedPodcastRejected(error))
    }
  }
}

export const fetchWatchedMasterclassVideosPending = () => ({
  type: types.FETCH_WATCHED_MASTERCLASS_VIDEOS_PENDING
})
export function fetchWatchedMasterClassVideosFulfilled(payload) {
  return { type: types.FETCH_WATCHED_MASTERCLASS_VIDEOS_FULFILLED, payload }
}
export function fetchWatchedMasterClassVideosRejected(error) {
  return { type: types.FETCH_WATCHED_MASTERCLASS_VIDEOS_REJECTED, error }
}
export const fetchWatchedPodcastVideosPending = () => ({
  type: types.FETCH_WATCHED_PODCAST_VIDEOS_PENDING
})
export function fetchWatchedPodcastVideosFulfilled(payload) {
  return { type: types.FETCH_WATCHED_PODCAST_VIDEOS_FULFILLED, payload }
}
export function fetchWatchedPodcastVideosRejected(error) {
  return { type: types.FETCH_WATCHED_PODCAST_VIDEOS_REJECTED, error }
}
export const fetchProfficientImarSkillsPending = () => ({
  type: types.FETCH_PROFFICIENT_IAMR_SKILL_PENDING
})
export function fetchProfficientImarSkillsFulfilled(payload) {
  return { type: types.FETCH_PROFFICIENT_IAMR_SKILL_FULFILLED, payload }
}
export function fetchProfficientImarSkillsRejected(error) {
  return { type: types.FETCH_PROFFICIENT_IAMR_SKILL_REJECTED, error }
}
export const fetchCompletedJournalsPending = () => ({
  type: types.FETCH_COMPLETED_JOURNALS_PENDING
})
export function fetchCompletedJournalsFulfilled(payload) {
  return { type: types.FETCH_COMPLETED_JOURNALS_FULFILLED, payload }
}
export function fetchCompletedJournalsRejected(error) {
  return { type: types.FETCH_COMPLETED_JOURNALS_REJECTED, error }
}
export const fetchCompletedSprintsPending = () => ({
  type: types.FETCH_COMPLETED_SPRINTS_PENDING
})
export function fetchCompletedSprintsFulfilled(payload) {
  return { type: types.FETCH_COMPLETED_SPRINTS_FULFILLED, payload }
}
export function fetchCompletedSprintsRejected(error) {
  return { type: types.FETCH_COMPLETED_SPRINTS_REJECTED, error }
}
export const fetchCompletedFeedbacksPending = () => ({
  type: types.FETCH_COMPLETED_FEEDBACKS_PENDING
})
export function fetchCompletedFeedbacksFulfilled(payload) {
  return { type: types.FETCH_COMPLETED_FEEDBACKS_FULFILLED, payload }
}
export function fetchCompletedFeedbacksRejected(error) {
  return { type: types.FETCH_COMPLETED_FEEDBACKS_REJECTED, error }
}
export const fetchCompletedMentorMeetingsPending = () => ({
  type: types.FETCH_COMPLETED_MENTOR_MEETING_PENDING
})
export function fetchCompletedMentorMeetingsFulfilled(payload) {
  return { type: types.FETCH_COMPLETED_MENTOR_MEETING_FULFILLED, payload }
}
export function fetchCompletedMentorMeetingsRejected(error) {
  return { type: types.FETCH_COMPLETED_MENTOR_MEETING_REJECTED, error }
}
export const fetchCompletedPortfolioContentPending = () => ({
  type: types.FETCH_COMPLETED_PORTFOLIO_CONTENT_PENDING
})
export function fetchCompletedPortfolioContentFulfilled(payload) {
  return { type: types.FETCH_COMPLETED_PORTFOLIO_CONTENT_FULFILLED, payload }
}
export function fetchCompletedPortfolioContentRejected(error) {
  return { type: types.FETCH_COMPLETED_PORTFOLIO_CONTENT_REJECTED, error }
}
export const createWatchedMasterclassPending = () => ({
  type: types.CREATE_WATCHED_MASTERCLASS_PENDING
})
export function createWatchedMasterclassFulfilled(payload) {
  return { type: types.CREATE_WATCHED_MASTERCLASS_FULFILLED, payload }
}
export function createWatchedMasterclassRejected(error) {
  return { type: types.CREATE_WATCHED_MASTERCLASS_REJECTED, error }
}
export const createWatchedPodcastPending = () => ({
  type: types.CREATE_WATCHED_PODCAST_PENDING
})
export function createWatchedPodcastFulfilled(payload) {
  return { type: types.CREATE_WATCHED_PODCAST_FULFILLED, payload }
}
export function createWatchedPodcastRejected(error) {
  return { type: types.CREATE_WATCHED_PODCAST_REJECTED, error }
}
