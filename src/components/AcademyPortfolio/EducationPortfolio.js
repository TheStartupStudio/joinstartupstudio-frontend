import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyEducations } from '../../redux/portfolio/Actions'
import educationIcon from '../../assets/images/academy-icons/svg/education&ac.svg'
import PortfolioContent from './PortfolioContent'
import PortfolioWrapper from './PortfolioWrapper'
import EditEduction from './EditEduction'
import NewEducation from './NewEducation'
import educationLogo from '../../assets/images/education-logo.png'

function EducationPortfolio({ educationData = [], isUserPortfolio }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openNewEducation, setOpenNewEducation] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState(null)
  const dispatch = useDispatch()

  const stateEducationData = useSelector(
    (state) => state.portfolio?.howSection?.myAlignments?.educations?.data || []
  )

  const displayData = isUserPortfolio ? stateEducationData : educationData

  useEffect(() => {
    if (isUserPortfolio) {
      dispatch(getMyEducations())
    }
  }, [dispatch, isUserPortfolio])

  const handleEdit = (education) => {
    if (!isUserPortfolio) return
    setSelectedEducation(education)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={educationIcon}
        title={'Education & Accomplishments'}
        setOpenNew={isUserPortfolio ? setOpenNewEducation : null}
      >
        {displayData.map((education) => (
          <PortfolioContent
            key={education.id}
            setIsOpen={() => handleEdit(education)}
            imgSrc={education.imageUrl || educationLogo}
            title={education.organizationName || null}
            institution={education.location || null}
            duration={
              education.startDate
                ? `${new Date(education.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })} - ${
                    education.currentPosition
                      ? 'Present'
                      : new Date(education.endDate).toLocaleDateString(
                          'en-US',
                          { month: 'long', year: 'numeric' }
                        )
                  }`
                : null
            }
            link={education.website || null}
            fullText={education.description || null}
            isUserPortfolio={isUserPortfolio}
          />
        ))}
      </PortfolioWrapper>
      {isUserPortfolio && (
        <>
          <EditEduction
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            educationData={selectedEducation}
          />
          <NewEducation isOpen={openNewEducation} setIsOpen={setOpenNewEducation} />
        </>
      )}
    </>
  )
}

export default EducationPortfolio
