import { useState, useEffect, useRef } from 'react'
import searchIcon from '../../assets/images/search-icon.png'
import {
  faFilter,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { debounce } from 'lodash'
import axiosInstance from '../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import Student from './student'
import EvaluateStudentModal from './evaluateStudentModal'

const FilterDropdown = ({
  currentFilter,
  filterExpanded,
  setFilterExpanded,
  setFilter,
  setYearFilter,
  setPeriodFilter,
  clearFilters,
  dropdownRef
}) => {
  const yearfilters = ['LTS 1', 'LTS 2', 'LTS 3', 'LTS 4']
  const classPeriodFilters = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '4A',
    '4B',
    '4C',
    '5',
    '5A',
    '5B',
    '5C',
    '6',
    '7',
    '8',
    '9'
  ]

  const handleYearFilterClick = (filter) => {
    setYearFilter(filter)
    setPeriodFilter('') // Clear period filter
    setFilter(filter)
    setFilterExpanded(false) // Close the filter dropdown
  }

  const handlePeriodFilterClick = (filter) => {
    setPeriodFilter(filter)
    setYearFilter('') // Clear year filter
    setFilter(filter)
    setFilterExpanded(false) // Close the filter dropdown
  }

  const handleClearFilters = () => {
    setYearFilter('')
    setPeriodFilter('')
    setFilter('')
    setFilterExpanded(false) // Close the filter dropdown
    clearFilters()
  }

  return (
    <div
      className='tickets-filter col-12 col-sm-3 me-sm-2 justify-content-center d-flex align-items-center'
      onClick={() => setFilterExpanded((prev) => !prev)} // Toggle filter expanded
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
      <p className='m-0'>{'FILTER'}</p>
      {filterExpanded && (
        <div>
          <div
            className='evaluation-filter-expanded'
            style={{
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <div className='years-period-container'>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                Year
              </div>

              {yearfilters.map((filter) => (
                <div
                  className={`years-items ${
                    filter === currentFilter ? 'active' : ''
                  }`}
                  key={filter}
                  onClick={() => {
                    handleYearFilterClick(filter)
                    setFilterExpanded(false) // Close the filter dropdown after selection
                  }}
                >
                  {filter.toUpperCase()}
                </div>
              ))}
            </div>

            <div className='class-period-container'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '7px'
                }}
              >
                CLASS PERIOD
              </div>
              <div className='grid-container'>
                {classPeriodFilters.map((filter) => (
                  <div
                    className={`years-items ${
                      filter === currentFilter ? 'active' : ''
                    }`}
                    key={filter}
                    onClick={() => {
                      handlePeriodFilterClick(filter)
                      setFilterExpanded(false) // Close the filter dropdown after selection
                    }}
                  >
                    {filter.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Students = (props) => {
  const dropdownRef = useRef(null)
  const { user, isAdmin } = useSelector((state) => state.user.user)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState()

  const [yearFilter, setYearFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [myStudents, setMyStudents] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const getStudents = async () => {
    const url = `/instructor/my-students/${user.instructorInfo.id}`
    try {
      const res = await axiosInstance.get(url)
      const sortedStudents = res.data.students.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      setMyStudents(sortedStudents)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (props.journalSelected) {
      getStudents()
    }
  }, [props.journalSelected])

  const handleSearch = debounce(({ target: { value } }) => {
    setSearchKeyword(value)
    if (!value) {
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
  }, 500)

  const handleClearFilters = () => {
    setYearFilter('')
    setPeriodFilter('')
    setSelectedFilter('')
  }

  const filterStudents = (student) => {
    const normalizedYearFilter = yearFilter.replace(/\s+/g, '').toLowerCase()
    const normalizedStudentYear = student.year.replace(/\s+/g, '').toLowerCase()

    const normalizedPeriodFilter = periodFilter.toLowerCase()
    const normalizedStudentPeriod = student?.period?.name.match(/\d+/)?.[0]

    const isYearMatch =
      !yearFilter || normalizedStudentYear === normalizedYearFilter
    const isPeriodMatch =
      !periodFilter || normalizedStudentPeriod === normalizedPeriodFilter
    const isSearchMatch =
      !searchKeyword ||
      student.name.toLowerCase().includes(searchKeyword.toLowerCase())

    return isYearMatch && isPeriodMatch && isSearchMatch
  }

  const paginatedStudents = myStudents
    .filter(filterStudents)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(
    myStudents.filter(filterStudents).length / itemsPerPage
  )

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 6
    let startPage = currentPage - Math.floor(maxVisiblePages / 2)
    startPage = Math.max(startPage, 1)
    let endPage = startPage + maxVisiblePages - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = endPage - maxVisiblePages + 1
      startPage = Math.max(startPage, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Fill with dummy numbers to ensure 6 elements
    while (pages.length < maxVisiblePages) {
      pages.push(endPage + (pages.length - (endPage - startPage + 1)) + 1)
    }

    return pages.slice(0, maxVisiblePages) // Ensure exactly 6 elements
  }

  if (!props.journalSelected) {
    return null
  }

  return (
    <div className='col-12 col-lg-9 inbox-tickets-container px-4 d-flex justify-content-between flex-column'>
      <div>
        <div className='journal-select-title'>{props.journalSelected}</div>
        <div className='top-menu mt-3 row m-0'>
          <FilterDropdown
            currentFilter={selectedFilter}
            filterExpanded={filterExpanded}
            setFilterExpanded={() => setFilterExpanded((prev) => !prev)}
            setYearFilter={setYearFilter}
            setPeriodFilter={setPeriodFilter}
            setFilter={setSelectedFilter}
            clearFilters={handleClearFilters}
            dropdownRef={dropdownRef}
          />
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

        <div className='all-students-container'>
          {paginatedStudents && paginatedStudents.length > 0
            ? paginatedStudents.map((myStudent) => (
                <Student
                  key={myStudent.id}
                  student={myStudent}
                  subject={props.journalSelected}
                  setSelectedUser={setSelectedUser}
                />
              ))
            : 'No students available'}

          {selectedUser && props.journalSelected ? (
            <EvaluateStudentModal
              userId={selectedUser.id}
              userName={selectedUser.name}
              selectedJournalId={props.journalSelectedId}
              myStudents={myStudents}
              setSelectedUser={setSelectedUser}
            />
          ) : null}
        </div>

        <div className='pagination-controls'>
          <div className={`chevron ${currentPage === 1 ? 'disabled' : ''}`}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </div>
          {getPageNumbers().map((page, index) => (
            <div
              key={index}
              className={`page-number ${page === currentPage ? 'active' : ''} 
              ${page > totalPages ? 'disabled' : ''}`}
              onClick={() => page <= totalPages && handlePageChange(page)}
            >
              {page}
            </div>
          ))}
          <div
            className={`chevron ${
              currentPage === totalPages ? 'disabled' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Students
