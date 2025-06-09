import { useState, useEffect } from 'react'
import experienceIcon from '../../assets/images/academy-icons/svg/experience.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import EditExperience from './EditExperience'
import PortfolioContent from './PortfolioContent'
import PortfolioWrapper from './PortfolioWrapper'
import NewExperience from './NewExperience'
import { useDispatch, useSelector } from 'react-redux'
import { getMyWorkExperiences } from '../../redux/portfolio/Actions'
import experienceDefault from '../../assets/images/experience-logo.jpg'

function ExperiencePortfolio({ experienceData = [], isUserPortfolio }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState(null)
  const dispatch = useDispatch()

  // Fix the selector to get work experiences from the correct path in state
  const stateExperienceData = useSelector(
    (state) => state.portfolio?.howSection?.myProductivity?.workExperiences?.data || []
  )

  // Use the correct data source based on isUserPortfolio
  const displayData = isUserPortfolio ? stateExperienceData : experienceData

  useEffect(() => {
    if (isUserPortfolio) {
      dispatch(getMyWorkExperiences())
    }
  }, [dispatch, isUserPortfolio])

  const handleEdit = (experience) => {
    if (!isUserPortfolio) return
    setSelectedExperience(experience)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={experienceIcon}
        title={'Experience'}
        setOpenNew={isUserPortfolio ? setOpenNew : null}
      >
        {displayData.map((experience) => (
          <PortfolioContent
            key={experience.id}
            setIsOpen={() => handleEdit(experience)}
            imgSrc={experience.imageUrl || experienceDefault}
            title={experience.organizationName || ''}
            institution={experience.location || ''}
            duration={
              experience.startDate
                ? `${new Date(experience.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })} - ${
                    experience.currentPosition
                      ? 'Present'
                      : new Date(experience.endDate).toLocaleDateString('en-US', 
                          { month: 'long', year: 'numeric' }
                        )
                  }`
                : ''
            }
            link={experience.website || ''}
            fullText={experience.description || ''}
            isUserPortfolio={isUserPortfolio}
          />
        ))}
      </PortfolioWrapper>
      {isUserPortfolio && (
        <>
          <EditExperience
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            experienceData={selectedExperience}
          />
          <NewExperience isOpen={openNew} setIsOpen={setOpenNew} />
        </>
      )}
    </>
  )
}

export default ExperiencePortfolio
