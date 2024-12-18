import { useState, useRef } from 'react'
import SkillsAccordion from './skillsAccordion'
import SkillsRouter from './skillsRouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import './index.css'
import useOnClickOutside from 'use-onclickoutside'
import Certificate1 from '../../../assets/images/market-ready-1-badge.jpg'
import Certificate2 from '../../../assets/images/market-ready-2-badge.png'
import { Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificationType } from '../../../utils/helpers'
import { useIamrContext } from './iamrContext/context'
import CompletionModal from './customComponents/completionModal'
import { setBackButton } from '../../../redux/backButtonReducer'

const CertificationCard = ({
  certificationType,
  firstElId,
  stats,
  onClick,
  certificationOneStatus
}) => {
  const [showModal, setShowModal] = useState(false)

  const handleClick = (event) => {
    if (
      certificationType === 'student-certification-2' &&
      certificationOneStatus !== 'approved'
    ) {
      event.preventDefault()
      setShowModal(true)
    } else {
      onClick()
    }
  }
  return (
    <>
      <Link
        to={`iamr-certification-system/${certificationType}/${firstElId}/content`}
        onClick={(e) => handleClick(e)}
        className='col-md-6 col-sm-12'
      >
        <div className='iamr-box d-flex'>
          <div className='w-50'>
            <img
              src={stats.image}
              alt={`certification-badge ${certificationType}`}
              className='w-100'
            />
          </div>
          <span className='w-50'>
            <p className='fw-bold mb-1' style={{ color: '#231f20' }}>
              {stats.title}
            </p>
            <p className='certified-skills'>
              <span style={{ color: stats.color }}>
                {stats.completedSkills}
              </span>
              /{stats.allSkills} SKILL CERTIFIED
            </p>
          </span>
        </div>
      </Link>
      {showModal &&
        certificationType === 'student-certification-2' &&
        certificationOneStatus !== 'approved' && (
          <CompletionModal
            show={showModal}
            className='completion-modal'
            onHide={() => setShowModal(false)}
            title={'Market - Ready Certification 2 Skills'}
            description={
              'You must complete Market-Ready 1 before you can complete Market-Ready 2.'
            }
          />
        )}
    </>
  )
}

const IAMRCertificationSystem = () => {
  const dispatch = useDispatch()
  const { setSkills, setLoading } = useIamrContext()
  const userRole = localStorage.getItem('role')
  const loggedUser = useSelector((state) => state.user.user.user)
  const [expanded, setExpanded] = useState(true)
  const accordionRef = useRef(null)
  const location = useLocation()
  const urlSegments = location.pathname.split('/')
  const [certificationOneStatus, setCertificationOneStatus] = useState(null)
  const [certificationType, setCertificationType] = useState(urlSegments[2])
  const [certificationStats, setCertificationStats] = useState([
    {
      allSkills: 0,
      completedSkills: 0,
      image: Certificate1,
      title: 'MARKET-READY 1',
      color: '#231f20',
      firstElId: 1
    },
    {
      allSkills: 0,
      completedSkills: 0,
      image: Certificate2,
      title: 'MARKET-READY 2',
      color: '#CF2E81',
      firstElId: 4
    }
  ])

  useEffect(() => {
    if (userRole !== 'student') {
      dispatch(setBackButton(true, 'my-certification-guide'))

      return () => {
        dispatch(setBackButton(false, ''))
      }
    }
  }, [dispatch, userRole])

  const marketReady = getCertificationType(certificationType)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await axiosInstance.get(
          `/iamr/skills/user/${loggedUser.id}`
        )
        const { skills, certificationOneStatus } = data
        setSkills(skills)
        setCertificationOneStatus(certificationOneStatus)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const getCertificatonStats = async (type) => {
      try {
        const response = await axiosInstance.get(
          `/iamr/certifications/stats/${loggedUser.id}/${type}`
        )

        if (response.data && response.data.result) {
          const updatedCertification = {
            allSkills: response.data.result.length,
            completedSkills: response.data.completedSkills?.length || 0
          }

          return updatedCertification
        }
      } catch (error) {
        console.error(`Error fetching ${type} certification stats:`, error)
        return null
      }
    }

    Promise.all([
      getCertificatonStats('student-certification-1'),
      getCertificatonStats('student-certification-2')
    ]).then((results) => {
      const [certification1, certification2] = results
      if (certification1 !== null) {
        setCertificationStats((prevState) =>
          prevState.map((certification, i) =>
            i === 0 ? { ...certification, ...certification1 } : certification
          )
        )
      }
      if (certification2 !== null) {
        setCertificationStats((prevState) =>
          prevState.map((certification, i) =>
            i === 1 ? { ...certification, ...certification2 } : certification
          )
        )
      }
    })
  }, [loggedUser.id])

  useOnClickOutside(accordionRef, () => {
    expanded && setExpanded(false)
  })

  const handleCertificationTypeClick = (certificationType) => {
    setCertificationType(certificationType)
    setExpanded(true)
  }

  const groupingStrings = {
    'student-certification-1': [
      'CRITICAL THINKING SKILLS',
      'COLLABORATION SKILLS',
      'CREATIVITY SKILLS'
    ],
    'student-certification-2': ['LEADERSHIP SKILLS', 'ENTERPRISE SKILLS']
  }

  return (
    <div className='iamr-container p-3'>
      {urlSegments[1] === 'iamr-certification-system' &&
      urlSegments.length <= 3 ? (
        <div className='row'>
          <div className='col-12 col-xl-12 px-0'>
            <div className='iamr-page-padding iamr-page-header '>
              <h3 className='page-title'>MY MARKET-READY CERTIFICATION</h3>
              <p className='page-description'>
                In this section of the platform, you will prove your proficiency
                in each of the employability skills.
              </p>
            </div>
          </div>
          {certificationStats.map((certification, index) => (
            <CertificationCard
              key={index}
              certificationType={`student-certification-${index + 1}`}
              stats={certification}
              onClick={() =>
                handleCertificationTypeClick(
                  `student-certification-${index + 1}`
                )
              }
              firstElId={certification.firstElId}
              certificationOneStatus={certificationOneStatus}
            />
          ))}
        </div>
      ) : (
        <Row className='w-100 ml-0 d-flex'>
          <div className='page-title__container'>
            <h3>MY MARKET-READY {marketReady} CERTIFICATION</h3>
          </div>
          <div className='d-flex pe-0'>
            <div
              className={`page-border accordion pb-4 ${
                expanded ? 'expanded' : ''
              }`}
              ref={accordionRef}
            >
              <FontAwesomeIcon
                icon={expanded ? faChevronLeft : faChevronRight}
                color='#01c5d1'
                className='mx-2 back'
                title={!expanded ? 'Show skills' : 'Hide'}
                cursor={'pointer'}
                onClick={() => setExpanded((prev) => !prev)}
              />
              <h4 className='mt-2'>SKILLS</h4>
              <SkillsAccordion
                hideExpanded={() => expanded && setExpanded(false)}
                certificationType={certificationType}
              />
            </div>
            <div className={`skill-content ${expanded ? 'expanded' : ''}`}>
              <SkillsRouter
                id={urlSegments[3]}
                certificationType={certificationType}
                groupingStrings={groupingStrings}
              />
            </div>
          </div>
        </Row>
      )}
    </div>
  )
}

export default IAMRCertificationSystem
