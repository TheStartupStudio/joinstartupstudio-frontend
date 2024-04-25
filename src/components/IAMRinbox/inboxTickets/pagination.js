import React from 'react'
import ReactPaginate from 'react-paginate'

const Pagination = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      nextLabel=">"
      previousLabel="<"
      onPageChange={onPageChange}
      forcePage={currentPage}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      containerClassName="pagination custom-pagination mb-3 justify-content-end"
      pageClassName="page-item"
      pageLinkClassName="page-link px-3"
      previousClassName="page-item me-2"
      previousLinkClassName="page-link"
      nextClassName="page-item ms-2"
      nextLinkClassName="page-link"
      activeClassName="active"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link px-3"
      renderOnZeroPageCount={null}
    />
  )
}

export default Pagination
