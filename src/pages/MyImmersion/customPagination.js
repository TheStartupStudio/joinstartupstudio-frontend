import React from 'react'
import './style.css'

const CustomPagination = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="d-flex justify-content-end">
      <ul className="pagination">
        {/* <li className={`page-item-custom `}>
          <a
            href="#!"
            className="page-link-custom"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </a>
        </li> */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item-custom ${
              currentPage === number ? 'active' : ''
            }`}
          >
            <a
              onClick={(e) => paginate(number, e)}
              href="#!"
              className="page-link-custom"
            >
              {number}
            </a>
          </li>
        ))}
        {/* <li className={`page-item-custom `}>
          <a
            href="#!"
            className="page-link-custom"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </a>
        </li> */}
      </ul>
    </nav>
  )
}

export default CustomPagination
