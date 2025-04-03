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

function MarketProjects() {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [openNew, setOpenNew] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)


  const { data: projects, loading, error } = useSelector(
    (state) => state.portfolio?.marketProjects || {}
  )

  useEffect(() => {
    dispatch(getMarketProjects())
  }, [dispatch])


  if (error) {
    return <div>Error loading projects: {error}</div>
  }

  const handleEdit = (project) => {
    setSelectedProject(project)
    setIsOpen(true)
  }

  return (
    <>
      <PortfolioWrapper
        img={courseLogo}
        title={'Market-Ready Projects'}
        setOpenNew={setOpenNew}
      >
        <div className='d-grid' style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '5rem' }}>
          {projects?.map((project, index) => (
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
            />
          ))}
        </div>
      </PortfolioWrapper>
      <NewProject isOpen={openNew} setIsOpen={setOpenNew} />
      <EditProject 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        projectData={selectedProject}
      />
    </>
  )
}

export default MarketProjects
