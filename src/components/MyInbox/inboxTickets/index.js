import React, { useState, useEffect, useRef, useMemo } from 'react'
import useFetchTickets from './customHooks/useFetchTickets'
import Ticket from '../ticket'
import { debounce } from 'lodash'
import useInboxContext from '../inboxContext'
import useOnClickOutside from 'use-onclickoutside'
import Pagination from './pagination'
import SearchBar from './searchBar'
import FilterDropdown from './filterDropdown'
import TicketChat from '../ticketChat'
import LoadingAnimation from '../../../ui/loadingAnimation'
import '../index.css'

function InboxTickets() {
  const {
    questionsMenuSelected,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    setIndustryProblems,
    setImmersionExperiences,
    loading,
    setLoading
  } = useInboxContext()

  const [currentPage, setCurrentPage] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedFilter, setSelectedFilter] = useState()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const dropdownRef = useRef(null)

  const { data, error } = useFetchTickets(
    questionsMenuSelected,
    setLoading,
    currentPage,
    searchKeyword
  )

  useEffect(() => {
    if (data) {
      setStudentQuestions(data['student_questions'])
      setCertificationFeedbackQuestions(data['certification_feedback_requests'])
      setApprovalRequests(data['approval_requests'])
      setIndustryProblems(data['industry_problem_submissions'])
      setImmersionExperiences(data['immersion_experience_applications'])
    }
  }, [
    data,
    questionsMenuSelected,
    setStudentQuestions,
    setCertificationFeedbackQuestions,
    setApprovalRequests,
    setImmersionExperiences,
    setIndustryProblems
  ])

  useEffect(() => {
    if (selectedTicket) {
      setSelectedTicket(null)
    }
  }, [questionsMenuSelected])

  const isTicketOpened = useMemo(() => {
    return (
      (selectedTicket?.type === 'instruction' &&
        questionsMenuSelected === 'student-questions') ||
      selectedTicket?.type !== undefined ||
      (selectedTicket?.type !== 'instruction' &&
        questionsMenuSelected !== 'student-questions')
    )
  }, [questionsMenuSelected, selectedTicket?.type])

  const isMenuOpened = useMemo(() => {
    return (
      !selectedTicket?.type ||
      (questionsMenuSelected === 'student_questions' &&
        selectedTicket?.type !== 'instruction') ||
      (questionsMenuSelected !== 'student_questions' &&
        selectedTicket?.type === 'instruction')
    )
  }, [questionsMenuSelected, selectedTicket?.type])

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected)
  }

  const handleSearch = debounce((value) => {
    setSearchKeyword(value.trim())
  }, 500)

  // const renderTickets =
  //   isMenuOpened &&
  //   data &&
  //   !loading &&
  //   data[questionsMenuSelected]?.rows
  //     .filter((ticket) => filterBySelected(ticket.read_by_instructor))
  //     .map((ticket) => (
  //       <Ticket
  //         key={ticket.id}
  //         ticket={ticket}
  //         setSelectedTicket={setSelectedTicket}
  //       />
  //     ))

  const renderTickets = useMemo(() => {
    const filterBySelected = (read_by_instructor) => {
      if (!selectedFilter || selectedFilter === 'all') return true
      return selectedFilter === 'read'
        ? read_by_instructor
        : !read_by_instructor
    }

    if (!isMenuOpened || loading || !data || !data[questionsMenuSelected]) {
      return null
    }

    const filteredTickets = data[questionsMenuSelected].rows.filter((ticket) =>
      filterBySelected(ticket.read_by_instructor)
    )

    if (filteredTickets.length === 0) {
      return (
        <div className="col-12 text-center mt-3">
          <p>No tickets available.</p>
        </div>
      )
    }

    return filteredTickets.map((ticket) => (
      <Ticket
        key={ticket.id}
        ticket={ticket}
        setSelectedTicket={setSelectedTicket}
      />
    ))
  }, [
    isMenuOpened,
    loading,
    data,
    questionsMenuSelected,
    setSelectedTicket,
    selectedFilter
  ])

  const showPagination = useMemo(() => {
    return (
      isMenuOpened &&
      data &&
      data[questionsMenuSelected] &&
      data[questionsMenuSelected].count > 5
    )
  }, [isMenuOpened, data, questionsMenuSelected])

  useOnClickOutside(dropdownRef, () => {
    setFilterExpanded(false)
  })

  return (
    <div className="col-12 col-lg-9 inbox-tickets-container px-4 d-flex justify-content-between flex-column">
      <div>
        <div className="top-menu mt-3 row m-0">
          {error && <p>Error fetching data: {error.message}</p>}
          <FilterDropdown
            currentFilter={selectedFilter}
            filterExpanded={filterExpanded}
            setFilterExpanded={() => setFilterExpanded((prev) => !prev)}
            setFilter={setSelectedFilter}
            dropdownRef={dropdownRef}
          />

          <SearchBar handleChange={(e) => handleSearch(e.target.value)} />
        </div>
        <div className="row all-tickets gy-2 m-0 my-3">
          {selectedTicket?.type && (
            <TicketChat
              ticket={selectedTicket}
              isTicketOpened={isTicketOpened}
              close={() => setSelectedTicket(null)}
            />
          )}

          <LoadingAnimation show={loading} />

          {renderTickets}
        </div>
      </div>
      {isMenuOpened && showPagination && (
        <Pagination
          onPageChange={handlePageChange}
          forcePage={currentPage}
          pageCount={Math.ceil(data[questionsMenuSelected]?.count / 5) || 0}
        />
      )}
    </div>
  )
}

export default InboxTickets
