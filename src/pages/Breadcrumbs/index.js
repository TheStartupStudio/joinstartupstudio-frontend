import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  adminRoutes,
  authRoutes,
  publicRoutes
} from '../Router/RouteConfiguration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import './style.css'

// function formatBreadcrumb(str) {
//   return str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
// }

function Breadcrumbs() {
  const location = useLocation()

  // const pathSegments = location.pathname.split('/').filter((segment) => segment)
  const pathSegments = location.pathname.split('/')[1]

  const breadcrumbs = useMemo(() => {
    const allRoutes = [...adminRoutes, ...authRoutes, ...publicRoutes]

    const matchedRoute = allRoutes.find((route) =>
      route.path.includes(pathSegments)
    )

    return [
      {
        ...matchedRoute
        // breadcrumb: formatBreadcrumb(pathSegments)
      }
    ]
  }, [pathSegments])

  const dashboardBreadcrumb = (
    <li className='breadcrumb-item'>
      <Link to='/dashboard'>
        <FontAwesomeIcon icon={faHome} />
      </Link>
    </li>
  )

  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb'>
        {dashboardBreadcrumb}
        <li className='breadcrumb-separator'>
          <FontAwesomeIcon icon={faChevronRight} className='breadcrumb-arrow' />
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className='breadcrumb-separator'>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className='breadcrumb-arrow'
                />
              </li>
            )}
            <li className='breadcrumb-item'>
              {index < breadcrumbs.length - 1 ? (
                <Link to={breadcrumb.path}>{breadcrumb.breadcrumb}</Link>
              ) : (
                <span>{breadcrumb.breadcrumb}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
