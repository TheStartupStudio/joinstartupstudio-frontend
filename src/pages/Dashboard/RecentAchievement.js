import {
  faCheckCircle,
  faLightbulb,
  faPlay
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import './index.css'
import Badg1Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-1.svg'
import Badg3Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-3.svg'
import Badg5Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-5.svg'
import Badg10Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-10.svg'
import Badg15Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-15.svg'
import Badg20Colored from '../../assets/images/platform-badges/colored/Platform Badges_colored-20.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProfficientIamrSkills,
  fetchWatchedMasterclassVideos,
  fetchWatchedPodcastVideos
} from '../../redux/platformBadges/actions'
import SmallLoader from '../../ui/SmallLoader'

const badgeImages = {
  1: Badg1Colored,
  3: Badg3Colored,
  5: Badg5Colored,
  10: Badg10Colored,
  15: Badg15Colored,
  20: Badg20Colored
}

const AchievementBox = ({ icon, title, count }) => {
  const getBadgeImage = () => {
    const keys = Object.keys(badgeImages)
      .map(Number)
      .sort((a, b) => b - a)
    for (const key of keys) {
      if (count >= key) {
        return badgeImages[key]
      }
    }
    return badgeImages[keys[keys.length - 1]]
  }
  return (
    <div className='achievement-box'>
      <div className='achievement-header'>
        <span className='pe-2'>{icon}</span>
        <span>{title}</span>
      </div>
      <div className='achievement-image'>
        <img src={getBadgeImage()} alt='badge' />
      </div>
    </div>
  )
}

const RecentAchievements = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
  const { masterclassVideos, podcastVideos, proficientSkills, loading } =
    useSelector((state) => state.platformBadges)

  useEffect(() => {
    dispatch(fetchWatchedMasterclassVideos())
    dispatch(fetchWatchedPodcastVideos())
    dispatch(fetchProfficientIamrSkills(user.id))
  }, [dispatch, user?.id])

  if (loading) {
    return <SmallLoader height={'100px'} />
  }

  return (
    <a href='/account?platformBadges=true' className='achievement-container'>
      <h3>Recent Achievements</h3>
      <div className='achievement-box-container'>
        <AchievementBox
          icon={<FontAwesomeIcon icon={faLightbulb} />}
          title='MASTERCLASS'
          count={masterclassVideos?.length}
        />
        <AchievementBox
          icon={<FontAwesomeIcon icon={faPlay} />}
          title='STORY IN MOTION'
          count={podcastVideos?.length}
        />
        <AchievementBox
          icon={<FontAwesomeIcon icon={faCheckCircle} />}
          title='PROFICIENT SKILLS'
          count={proficientSkills?.length}
        />
      </div>
    </a>
  )
}

export default RecentAchievements
