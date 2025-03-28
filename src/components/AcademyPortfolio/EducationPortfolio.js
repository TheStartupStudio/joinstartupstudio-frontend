import { useState, useEffect } from 'react'
import educationIcon from '../../assets/images/academy-icons/svg/education&ac.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import PortfolioContent from './PortfolioContent'
import PortfolioWrapper from './PortfolioWrapper'
import EditEduction from './EditEduction'
import NewEducation from './NewEducation'
import { useDispatch, useSelector } from 'react-redux'
import { getMyEducations } from '../../redux/portfolio/Actions'

function EducationPortfolio() {
  const [isOpen, setIsOpen] = useState(false)
  const [openNewEducation, setOpenNewEducation] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState(null)
  
  const educationData = useSelector(
    (state) => state.portfolio.howSection.myAlignments.educations.data
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMyEducations())
  }, [dispatch])

  const handleEdit = (education) => {
    setSelectedEducation(education)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={educationIcon}
        title={'Education & Accomplishments'}
        setOpenNew={setOpenNewEducation}
      >
        {educationData.map((education) => (
          <PortfolioContent
            key={education.id}
            setIsOpen={() => handleEdit(education)}
            imgSrc={education.imageUrl || universityFlorida}
            title={education.organizationName || null}
            institution={education.location || null} 
            duration={education.startDate ? 
              `${new Date(education.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${
                education.currentPosition ? 'Present' : 
                new Date(education.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }` : null
            }
            link={education.website || null}
            fullText={education.description?.replace(/<[^>]*>/g, '') || null}
          />
        ))}
      </PortfolioWrapper>
      <EditEduction 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        educationData={selectedEducation}
      />  
      <NewEducation isOpen={openNewEducation} setIsOpen={setOpenNewEducation} />
    </>
  )
}

export default EducationPortfolio
