import { useState, useMemo, useEffect } from 'react'
import searchIcon from '../../assets/images/search-icon.png'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useIamrInboxContext from './iamrInboxContext'
import Ticket from './ticket'
import TicketChat from './ticketChat'
import './index.css'
import ReactPaginate from 'react-paginate'
import { debounce } from 'lodash'
import axiosInstance from '../../utils/AxiosInstance'

function InboxTickets({ getTicketsByPage }) {
  const {
    studentQuestions,
    certificationFeedbackQuestions,
    questionsMenuSelected,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    loading,
    setLoading
  } = useIamrInboxContext()
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState()
  const [questionsPage, setQuestionsPage] = useState(0)
  const [instructionsPage, setInstructionsPage] = useState(0)

  const currentPage = questionsMenuSelected ? questionsPage : instructionsPage

  const tickets = questionsMenuSelected
    ? studentQuestions
    : certificationFeedbackQuestions

  const PER_PAGE = 1
  const pageCount = tickets?.count

  const filterBySelected = (read_by_instructor) => {
    if (!selectedFilter || selectedFilter === 'all') return true
    return selectedFilter === 'read' ? read_by_instructor : !read_by_instructor
  }
  const currentPageData = tickets?.rows
    ?.filter((ticket) =>
      questionsMenuSelected
        ? ticket.type === 'instruction' &&
          filterBySelected(ticket.read_by_instructor)
        : ticket.type !== 'instruction' &&
          filterBySelected(ticket.read_by_instructor)
    )
    .map((ticket) => (
      <Ticket
        key={ticket.id}
        ticket={ticket}
        setSelectedTicket={setSelectedTicket}
      />
    ))

  const isTicketOpened = useMemo(() => {
    return (
      (selectedTicket?.type === 'instruction' && questionsMenuSelected) ||
      (selectedTicket?.type !== undefined &&
        selectedTicket?.type !== 'instruction' &&
        !questionsMenuSelected)
    )
  }, [questionsMenuSelected, selectedTicket?.type])

  const isMenuOpened = useMemo(() => {
    return (
      !selectedTicket?.type ||
      (questionsMenuSelected && selectedTicket?.type !== 'instruction') ||
      (!questionsMenuSelected && selectedTicket?.type === 'instruction')
    )
  }, [questionsMenuSelected, selectedTicket?.type])

  const showPagination = useMemo(() => {
    return isMenuOpened && tickets?.count > PER_PAGE
  }, [isMenuOpened, tickets])

  const handlePageClick = debounce(({ selected }) => {
    questionsMenuSelected
      ? setQuestionsPage(selected)
      : setInstructionsPage(selected)
  }, 500)

  useEffect(() => {
    let canceled = false

    setLoading(true)

    const type = questionsMenuSelected && 'instruction'

    axiosInstance
      .get(`instructor/iamr/tickets?page=${questionsPage}&type=${type}`)
      .then(({ data }) => {
        if (canceled) return

        type === 'instruction'
          ? setStudentQuestions(data)
          : setCertificationFeedbackQuestions(data)
      })

    setLoading(false)
  }, [
    questionsMenuSelected,
    questionsPage,
    setCertificationFeedbackQuestions,
    setLoading,
    setStudentQuestions
  ])

  const handleSearch = () => {}

  return (
    <div className='col-9 inbox-tickets-container px-4'>
      <div className='d-flex top-menu'>
        <div
          className='tickets-filter me-2 justify-content-center d-flex align-items-center'
          onClick={() => setFilterExpanded((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={faFilter}
            style={{
              color: '#707070',
              fontSize: '22px',
              marginRight: '5px'
            }}
          />
          <p className='m-0'>{selectedFilter ? selectedFilter : 'FILTER'}</p>
          {filterExpanded && (
            <div className='tickets-filter-expanded'>
              <p className='my-2 ms-2' onClick={() => setSelectedFilter('all')}>
                All
              </p>
              <p
                className='my-2 ms-2'
                onClick={() => setSelectedFilter('read')}
              >
                Read
              </p>
              <p
                className='my-2 ms-2'
                onClick={() => setSelectedFilter('unread')}
              >
                Unread
              </p>
            </div>
          )}
        </div>
        <div
          className='connections-search'
          style={{ height: '48px', width: '350px' }}
        >
          <div className='input-group h-100'>
            <div className='input-group-prepend my-auto'>
              <button
                className='btn btn-outline-secondary my-2 ms-2'
                type='button'
                id='button-addon1'
              >
                <img src={searchIcon} alt='#' width='90%' />
              </button>
            </div>

            <input
              type='text'
              className='form-control'
              name='searchedNote'
              placeholder={'SEARCH USERS'}
              aria-describedby='button-addon1'
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='row all-tickets mt-3 gy-2'>
        {selectedTicket?.type && (
          <TicketChat
            ticket={selectedTicket}
            isTicketOpened={isTicketOpened}
            close={() => setSelectedTicket()}
          />
        )}
        {isMenuOpened && currentPageData}
      </div>
      {isMenuOpened && showPagination && (
        <ReactPaginate
          nextLabel='>'
          previousLabel='<'
          onPageChange={handlePageClick}
          forcePage={currentPage}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          pageClassName='page-item'
          pageLinkClassName='page-link px-3'
          previousClassName='page-item me-2'
          previousLinkClassName='page-link'
          nextClassName='page-item ms-2'
          nextLinkClassName='page-link'
          breakLabel='...'
          breakClassName='page-item'
          breakLinkClassName='page-link px-3'
          containerClassName='pagination custom-pagination my-2 justify-content-end'
          activeClassName='active'
          renderOnZeroPageCount={null}
        />
      )}
    </div>
  )
}

export default InboxTickets
