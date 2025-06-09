import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PortfolioWrapper from './PortfolioWrapper'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import MarketCard from './MarketCard'
import nemoursMarketing from '../../assets/images/academy-icons/Nemours-marketing.png'
import NewProject from './NewProject'
import EditProject from './EditProject'
import { getMarketProjects } from '../../redux/portfolio/Actions'
import { toast } from 'react-toastify'
import projectDefault from '../../assets/images/project-logo.jpeg'

function MarketProjects({ projectsData = [], isUserPortfolio }) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const stateProjectsData = useSelector(
    (state) => state.portfolio?.marketProjects?.data || []
  )


  const displayData = isUserPortfolio ? stateProjectsData : projectsData


  useEffect(() => {
    if (isUserPortfolio) {
      dispatch(getMarketProjects())
    }
  }, [dispatch, isUserPortfolio])

  const handleEdit = (project) => {
    if (!isUserPortfolio) return
    setSelectedProject(project)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={courseLogo}
        title={'Market-Ready Projects'}
        setOpenNew={isUserPortfolio ? setOpenNew : null}
      >
        <div
          className='d-grid grid-col-3 grid-col-1-mob'
          style={{ gap: '5rem' }}
        >
          {displayData?.map((project, index) => (
            <MarketCard
              key={project.id || index}
              imgSrc={project.coverUrl || projectDefault}
              title={project.title}
              description={project.description}
              url={project.contentUrl}
              uploaded={new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
              setIsOpen={() => handleEdit(project)}
              isUserPortfolio={isUserPortfolio}
            />
          ))}
        </div>
      </PortfolioWrapper>
      {isUserPortfolio && (
        <>
          <NewProject isOpen={openNew} setIsOpen={setOpenNew} />
          <EditProject
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            projectData={selectedProject}
          />
        </>
      )}
    </>
  )
}

export default MarketProjects
