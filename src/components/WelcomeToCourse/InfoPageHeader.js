import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'

function InfoPageHeader({ className, linkColor, platformClass }) {
  return (
    <header
      className={`py-4 px-5 d-flex justify-content-between align-items-start ${className}`}
    >
      <img src={courseLogo} alt='course logo' />

      <nav className='mt-4'>
        <ul className='list-unstyled d-flex gap-4'>
          <li>
            <Link
              className={`fs-13 fw-medium ${platformClass}`}
              to='/explore-the-platform'
              style={{ color: linkColor }}
            >
              EXPLORE THE PLATFORM
            </Link>
          </li>
          <li>
            <Link
              className='fs-13 fw-medium'
              to='/explore-the-course'
              style={{ color: linkColor }}
            >
              EXPLORE THE COURSE
            </Link>
          </li>
          <li>
            <Link
              className='fs-13 fw-medium'
              to='/faq'
              style={{ color: linkColor }}
            >
              FAQS
            </Link>
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
    </header>
  )
}

export default InfoPageHeader
