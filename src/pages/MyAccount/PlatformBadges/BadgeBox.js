import React, { useEffect, useRef } from 'react'
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

const BadgeBox = ({ userRole }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
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
  const masterclassRef = useRef(null)
  const storyInMotionRef = useRef(null)
  const proficientSkillsRef = useRef(null)

  const handleScroll = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section')

    // Scroll to the correct section if it exists
    if (section === 'masterclass' && masterclassRef.current) {
      masterclassRef.current.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'story-in-motion' && storyInMotionRef.current) {
      storyInMotionRef.current.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'proficient-skills' && proficientSkillsRef.current) {
      proficientSkillsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const fetchId = userRole === 'student' ? user?.id : id
    if (fetchId) {
      dispatch(fetchProfficientIamrSkills(fetchId))
      dispatch(fetchCompletedJournals(fetchId))
      dispatch(fetchPortfolioContent(fetchId))
      dispatch(fetchCompletedMentorMeetings(fetchId))
      dispatch(fetchCompletedFeedbacks(fetchId))
      dispatch(fetchCompletedSprints(fetchId))
      dispatch(fetchWatchedPodcastVideos(fetchId))
      dispatch(fetchWatchedMasterclassVideos(fetchId))
    }
  }, [dispatch, id, user.id, userRole])

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100px' }}
      >
        <span className=' spinner-border-primary spinner-border-sm ' />
      </div>
    )
  }

  return (
    <div className='d-flex flex-col mt-2' style={{ flexDirection: 'column' }}>
      <div ref={masterclassRef} onClick={() => handleScroll(masterclassRef)}>
        <BadgeItem
          icon={<FontAwesomeIcon icon={faLightbulb} className="me-3" />}
          title="MASTERCLASS"
          activeRange={masterclassVideos.length}
        />
      </div>
      <div ref={storyInMotionRef} onClick={() => handleScroll(storyInMotionRef)}>
        <BadgeItem
          icon={<FontAwesomeIcon icon={faPlay} className="me-3" />}
          title="STORY IN MOTION"
          activeRange={podcastVideos.length}
        />
      </div>
      <div ref={proficientSkillsRef} onClick={() => handleScroll(proficientSkillsRef)}>
        <BadgeItem
          title="PROFICIENT SKILLS"
          activeRange={proficientSkills.length}
        />
      </div>
      <BadgeItem title={'LTS JOURNAL'} activeRange={ltsJournals.length} />
      <BadgeItem
        icon={<FontAwesomeIcon icon={faCheck} className='me-3' />}
        title={'SPRINTS COMPLETED'}
        activeRange={sprints.length}
      />
      <BadgeItem
        icon={<FontAwesomeIcon icon={faChalkboardTeacher} className='me-3' />}
        title={'FEEDBACK ADDITIONS'}
        activeRange={feedbacks}
      />
      <BadgeItem title={'MENTOR MEETING'} activeRange={mentorMeetings} />
      <BadgeItem title={'PORTFOLIO'} activeRange={portfolio.length} />
    </div>
  )
}

export default BadgeBox
