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

function ExperiencePortfolio() {
  const [isOpen, setIsOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState(null)

  const experienceData = useSelector(
    (state) =>
      state.portfolio.howSection?.myProductivity?.workExperiences?.data || []
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMyWorkExperiences())
  }, [dispatch])

  const handleEdit = (experience) => {
    setSelectedExperience(experience)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={experienceIcon}
        title={'Experience'}
        setOpenNew={setOpenNew}
      >
        {experienceData.map((experience) => (
          <PortfolioContent
            key={experience.id}
            setIsOpen={() => handleEdit(experience)}
            imgSrc={experience.imageUrl || experienceDefault}
            title={experience.organizationName || ''}
            institution={experience.location || ''}
            duration={
              experience.startDate
                ? `${new Date(experience.startDate).toLocaleDateString(
                    'en-US',
                    { month: 'long', year: 'numeric' }
                  )} - ${
                    experience.currentPosition
                      ? 'Present'
                      : new Date(experience.endDate).toLocaleDateString(
                          'en-US',
                          { month: 'long', year: 'numeric' }
                        )
                  }`
                : ''
            }
            link={experience.website || ''}
            fullText={experience.description || ''}
          />
        ))}
      </PortfolioWrapper>
      <EditExperience
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        experienceData={selectedExperience}
      />
      <NewExperience isOpen={openNew} setIsOpen={setOpenNew} />
    </>
  )
}

export default ExperiencePortfolio
