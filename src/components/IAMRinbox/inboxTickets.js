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
import LoadingAnimation from './loadingAnimation'

function InboxTickets() {
  const {
    studentQuestions,
    certificationFeedbackQuestions,
    questionsMenuSelected,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    loading,
    setLoading,
    resetAllQuestions
  } = useIamrInboxContext()
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState()
  const [selectedTicket, setSelectedTicket] = useState()
  const [questionsPage, setQuestionsPage] = useState(0)
  const [certificationFeedbackPage, setCertificationFeedbackPage] = useState(0)
  const [userSearchPage, setUserSearchPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const currentPage = isSearching
    ? userSearchPage
    : questionsMenuSelected
    ? questionsPage
    : certificationFeedbackPage

  const tickets = questionsMenuSelected
    ? studentQuestions
    : certificationFeedbackQuestions

  const PER_PAGE = 1
  const pageCount = tickets.count

  const filterBySelected = (read_by_instructor) => {
    if (!selectedFilter || selectedFilter === 'all') return true
    return selectedFilter === 'read' ? read_by_instructor : !read_by_instructor
  }

  const currentPageData = tickets.rows
    .filter((ticket) =>
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
    isSearching
      ? setUserSearchPage(selected)
      : questionsMenuSelected
      ? setQuestionsPage(selected)
      : setCertificationFeedbackPage(selected)
  }, 500)

  const handleSearch = debounce(({ target: { value } }) => {
    setSearchKeyword(value)

    if (!value) {
      isSearching && setIsSearching(false)
      return
    }
  }, 500)

  useEffect(() => {
    let canceled = false

    const fetch = async () => {
      if (isSearching) return

      setLoading(true)

      await getTicketsByPage(questionsPage, 'instruction')
        .then(({ data }) => {
          if (canceled) return
          setStudentQuestions(data)
        })
        .catch((e) => e)
      setLoading(false)
    }

    fetch()

    return () => {
      canceled = true
    }
  }, [isSearching, questionsPage, setLoading, setStudentQuestions])

  useEffect(() => {
    let canceled = false

    const fetch = async () => {
      if (isSearching) return

      setLoading(true)

      await getTicketsByPage(certificationFeedbackPage)
        .then(({ data }) => {
          if (canceled) return
          setCertificationFeedbackQuestions(data)
        })
        .catch((e) => e)
      setLoading(false)
    }

    fetch()

    return () => {
      canceled = true
    }
  }, [
    isSearching,
    certificationFeedbackPage,
    setCertificationFeedbackQuestions,
    setLoading
  ])

  useEffect(() => {
    let canceled = false

    const search = async () => {
      if (searchKeyword.length < 3) {
        return
      }

      resetAllQuestions()
      setIsSearching(true)
      setLoading(true)

      await axiosInstance
        .get(
          `instructor/iamr/tickets/search/${searchKeyword}?page=${userSearchPage}`
        )
        .then(({ data }) => {
          if (canceled) return

          setStudentQuestions(data.student_questions)
          setCertificationFeedbackQuestions(
            data.certification_feedback_questions
          )
        })
        .catch((e) => e)
      setLoading(false)
    }

    search()

    return () => {
      canceled = true
      setIsSearching(false)
      setLoading(false)
    }
  }, [
    userSearchPage,
    searchKeyword,
    setCertificationFeedbackQuestions,
    setStudentQuestions,
    setLoading,
    resetAllQuestions
  ])

  const getTicketsByPage = (page, type) => {
    let url = `instructor/iamr/tickets?page=${page}${
      type !== undefined ? `&type=${type}` : ''
    }`

    return axiosInstance.get(url)
  }

  return (
    <div className='col-12 col-lg-9 inbox-tickets-container px-4 d-flex justify-content-between flex-column'>
      <div>
        <div className='top-menu mt-3 row m-0'>
          <div
            className='tickets-filter col-12 col-sm-3 me-sm-2 justify-content-center d-flex align-items-center'
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
            <p className='m-0'>{selectedFilter ?? 'FILTER'}</p>
            {filterExpanded && (
              <div className='tickets-filter-expanded'>
                <p
                  className='my-2 ms-2'
                  onClick={() => setSelectedFilter('all')}
                >
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
            className='connections-search col-12 col-sm-8 col-lg-6 mt-2 mt-sm-0'
            style={{ height: '48px' }}
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
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className='row all-tickets mt-3 gy-2 m-0'>
          {selectedTicket?.type && (
            <TicketChat
              ticket={selectedTicket}
              isTicketOpened={isTicketOpened}
              close={() => setSelectedTicket()}
            />
          )}

          {!isTicketOpened && <LoadingAnimation />}

          {isMenuOpened && !loading && currentPageData}
        </div>
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
          containerClassName='pagination custom-pagination my-4 justify-content-end'
          activeClassName='active'
          renderOnZeroPageCount={null}
        />
      )}
    </div>
  )
}

export default InboxTickets
