import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import Faq from '../FAQ/Faq'
import { useState } from 'react'

function InfoPageHeader({ className, linkColor, platformClass, courseClass }) {
  const [faqModal, setFaqModal] = useState(false)

  const history = useHistory()

  return (
    <header
      className={`py-4 px-5 d-flex justify-content-between align-items-start ${className}`}
    >
      <img
        onClick={() => history.push('/')}
        className='cursor-pointer'
        src={courseLogo}
        alt='course logo'
      />

      <nav className='mt-4'>
        <ul className='list-unstyled d-flex gap-4'>
          <li className={`${platformClass}`}>
            <Link
              className='fs-13 fw-medium'
              to='/explore-the-platform'
              style={{ color: linkColor }}
            >
              EXPLORE THE PLATFORM
            </Link>
          </li>
          <li className={`${courseClass}`}>
            <Link
              className='fs-13 fw-medium'
              to='/explore-the-course'
              style={{ color: linkColor }}
            >
              EXPLORE THE COURSE
            </Link>
          </li>
          <li>
            <span
              className='fs-13 fw-medium cursor-pointer'
              onClick={() => setFaqModal(true)}
              style={{ color: linkColor }}
            >
              FAQS
            </span>
          </li>
          <li>
            <Link
              className='fs-13 fw-medium'
              to='/contact'
              style={{ color: linkColor }}
            >
              CONTACT
            </Link>
          </li>
          <li>
            <Link
              className='fs-13 fw-medium'
              to='/'
              style={{ color: linkColor }}
            >
              LOGIN
            </Link>
          </li>
        </ul>
      </nav>
      <Faq isOpen={faqModal} setIsOpen={setFaqModal} />
    </header>
  )
}

export default InfoPageHeader
