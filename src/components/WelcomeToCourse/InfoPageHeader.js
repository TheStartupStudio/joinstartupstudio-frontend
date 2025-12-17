import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import Faq from '../FAQ/Faq'
import { useState } from 'react'

function InfoPageHeader({ className, linkColor, platformClass, courseClass }) {
  const [faqModal, setFaqModal] = useState(false)

  const history = useHistory()

  return (
    <header
      className={`py-4 px-5 d-flex justify-content-between align-items-start p-1rem-tab ${className}`}
    >
      <img
        onClick={() =>
          (window.location.href = 'https:// joinstartupstudio.com/')
        }
        className='cursor-pointer'
        src={courseLogo}
        alt='course logo'
      />

      <nav className='mt-4'>
        <ul className='list-unstyled d-flex gap-4'>
          <li className={`${platformClass}`}>
            <a
              className={`fs-13 fw-medium `}
              href='https:// joinstartupstudio.com/explore-the-platform-1.html'
              style={{ color: '#000000' }}
            >
              EXPLORE THE PLATFORM
            </a>
          </li>
          <li className={`${courseClass}`}>
            <a
              className='fs-13 fw-medium'
              href='https:// joinstartupstudio.com/explore-the-course.html'
              style={{ color: '#000000' }}
            >
              EXPLORE THE COURSE
            </a>
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
            <a
              className='fs-13 fw-medium'
              href='https:// joinstartupstudio.com/contact.html'
              style={{ color: '#000000' }}
            >
              CONTACT
            </a>
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
