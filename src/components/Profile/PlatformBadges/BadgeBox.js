import React, { useCallback, useEffect } from 'react'
import BadgeItem from './BadgeItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardTeacher,
  faCheck,
  faLightbulb,
  faPlay
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  fetchCompletedFeedbacks,
  fetchCompletedJournals,
  fetchCompletedMentorMeetings,
  fetchCompletedSprints,
  fetchPortfolioContent,
  fetchProfficientIamrSkills,
  fetchWatchedMasterclassVideos,
  fetchWatchedPodcastVideos
} from '../../../redux/platformBadges/actions'
import { useParams } from 'react-router-dom'

const BadgeBox = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const {
    masterclassVideos,
    podcastVideos,
    proficientSkills,
    ltsJournals,
    sprints,
    feedbacks,
    mentorMeetings,
    portfolio,
    loading
  } = useSelector((state) => state.platformBadges)

  const fetchCompletedPlatformBadges = useCallback(() => {
    if (id) {
      dispatch(fetchProfficientIamrSkills(id))
      dispatch(fetchCompletedJournals(id))
      dispatch(fetchPortfolioContent(id))
      dispatch(fetchCompletedMentorMeetings(id))
      dispatch(fetchCompletedFeedbacks(id))
      dispatch(fetchCompletedSprints(id))
      dispatch(fetchWatchedPodcastVideos(id))
      dispatch(fetchWatchedMasterclassVideos(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id) {
      fetchCompletedPlatformBadges(id)
    }
  }, [dispatch, id, fetchCompletedPlatformBadges])

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100px' }}
      >
        <span className=" spinner-border-primary spinner-border-sm " />
      </div>
    )
  }

  return (
    <div className="d-flex flex-col mt-2" style={{ flexDirection: 'column' }}>
      <BadgeItem
        icon={<FontAwesomeIcon icon={faLightbulb} className="me-3" />}
        title={'MASTERCLASS'}
        activeRange={masterclassVideos.length}
      />
      <BadgeItem
        icon={<FontAwesomeIcon icon={faPlay} className="me-3" />}
        title={'STORY IN MOTION'}
        activeRange={podcastVideos.length}
      />
      <BadgeItem
        title={'PROFICIENT SKILLS'}
        activeRange={proficientSkills.length}
      />
      <BadgeItem title={'LTS JOURNAL'} activeRange={ltsJournals.length} />
      <BadgeItem
        icon={<FontAwesomeIcon icon={faCheck} className="me-3" />}
        title={'SPRINTS COMPLETED'}
        activeRange={sprints.length}
      />
      <BadgeItem
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} className="me-3" />}
        title={'FEEDBACK ADDITIONS'}
        activeRange={feedbacks}
      />
      <BadgeItem title={'MENTOR MEETINGS'} activeRange={mentorMeetings} />
      <BadgeItem title={'PORTFOLIO'} activeRange={portfolio.length} />
    </div>
  )
}

export default BadgeBox
