import React, { useState, useMemo, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Ticket from '../ticket'
import TicketChat from '../ticketChat'
import Pagination from './pagination'
import SearchBar from './searchBar'
import useOnClickOutside from 'use-onclickoutside'
import useFetchTickets from './customHooks/useFetchTickets'
import '../index.css'
import useIamrInboxContext from '../iamrInboxContext'
import LoadingAnimation from '../loadingAnimation'
import { debounce } from 'lodash'
import FilterDropdown from './filterDropdown'

function InboxTickets() {
  const {
    questionsMenuSelected,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    loading,
    setLoading,
    resetAllQuestions
  } = useIamrInboxContext()
  const dropdownRef = useRef(null)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [userSearchPage, setUserSearchPage] = useState(0)
  const [pageState, setPageState] = useState({
    questionsPage: 0,
    certificationFeedbackPage: 0,
    approvalRequestsPage: 0
  })

  const toggleFilter = () => setFilterExpanded((prev) => !prev)

  const currentPage = isSearching
    ? pageState.userSearchPage
    : questionsMenuSelected === 'student-questions'
    ? pageState.questionsPage
    : questionsMenuSelected === 'certification-feedback-questions'
    ? pageState.certificationFeedbackPage
    : pageState.approvalRequestsPage

  const { tickets, pageCount } = useFetchTickets({
    questionsMenuSelected,
    currentPage,
    searchKeyword,
    userSearchPage,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    setLoading,
    resetAllQuestions,
    setIsSearching
  })
  useOnClickOutside(dropdownRef, () => setFilterExpanded(false))

  // useDebounceEffect(
  //   () => {
  //     setLoading(true)
  //     if (searchKeyword.length < 3) {
  //       isSearching && setIsSearching(false)
  //       return
  //     }
  //     setIsSearching(true)
  //   },
  //   [searchKeyword],
  //   3500
  // )

  const handleSearch = debounce(({ target: { value } }) => {
    setSearchKeyword(value)

    if (!value) {
      isSearching && setIsSearching(false)
      return
    }
  }, 500)

  const filterBySelected = (read_by_instructor) => {
    if (!selectedFilter || selectedFilter === 'all') return true
    return selectedFilter === 'read' ? read_by_instructor : !read_by_instructor
  }

  const isTicketOpened = useMemo(() => {
    return (
      (selectedTicket?.type === 'instruction' &&
        questionsMenuSelected === 'student-questions') ||
      selectedTicket?.type !== undefined ||
      (selectedTicket?.type !== 'instruction' &&
        questionsMenuSelected !== 'student-questions')
    )
  }, [selectedTicket, questionsMenuSelected])

  const isMenuOpened = useMemo(() => {
    return (
      !selectedTicket?.type ||
      (questionsMenuSelected === 'student-questions' &&
        selectedTicket?.type !== 'instruction') ||
      (questionsMenuSelected !== 'student-questions' &&
        selectedTicket?.type === 'instruction')
    )
  }, [questionsMenuSelected, selectedTicket?.type])

  const currentPageTickets =
    isMenuOpened &&
    !loading &&
    tickets
      ?.filter((ticket) => filterBySelected(ticket.read_by_instructor))
      .map((ticket) => (
        <Ticket
          key={ticket.id}
          ticket={ticket}
          setSelectedTicket={setSelectedTicket}
        />
      ))

  const handlePageClick = debounce(({ selected }) => {
    if (isSearching) {
      setUserSearchPage(selected)
    } else if (questionsMenuSelected === 'student-questions') {
      setPageState((prev) => ({ ...prev, questionsPage: selected }))
    } else if (questionsMenuSelected === 'certification-feedback-questions') {
      setPageState((prev) => ({ ...prev, certificationFeedbackPage: selected }))
    } else {
      setPageState((prev) => ({ ...prev, approvalRequestsPage: selected }))
    }
  }, 500)

  return (
    <div className="col-12 col-lg-9 inbox-tickets-container px-4 d-flex justify-content-between flex-column">
      <div>
        <div className="top-menu mt-3 row m-0">
          <div
            className="tickets-filter col-12 col-sm-3 me-sm-2 justify-content-center d-flex align-items-center"
            onClick={toggleFilter}
            ref={dropdownRef}
          >
            <FontAwesomeIcon
              icon={faFilter}
              style={{
                color: '#707070',
                fontSize: '22px',
                marginRight: '5px'
              }}
            />
            <p className="mb-0">{selectedFilter.toUpperCase()}</p>
            {filterExpanded && (
              <FilterDropdown
                currentFilter={selectedFilter}
                setFilter={setSelectedFilter}
              />
            )}
          </div>
          <SearchBar
            searchKeyword={searchKeyword}
            handleChange={handleSearch}
          />
        </div>
        <div className="row all-tickets gy-2 m-0 my-3">
          {selectedTicket?.type && (
            <TicketChat
              ticket={selectedTicket}
              isTicketOpened={isTicketOpened}
              close={() => setSelectedTicket()}
            />
          )}

          <LoadingAnimation show={!isTicketOpened && loading} />

          {currentPageTickets}
        </div>
      </div>

      {isMenuOpened && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />
      )}
    </div>
  )
}

export default InboxTickets
