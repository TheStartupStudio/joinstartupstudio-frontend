import { useEffect, useState } from 'react'
import axiosInstance from '../../../../utils/AxiosInstance'

const useFetchTickets = ({
  questionsMenuSelected,
  currentPage,
  searchKeyword,
  userSearchPage,
  setLoading,
  resetAllQuestions,
  setIsSearching
}) => {
  const [tickets, setTickets] = useState([])
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    let isComponentUnmounted = false

    const determineTicketType = (menu) => {
      const ticketTypeMap = {
        'student-questions': 'instruction',
        'certification-feedback-questions': 'certification_submit',
        'approval-requests': 'approval'
      }
      return ticketTypeMap[menu] || 'instruction'
    }

    const constructUrl = () => {
      if (searchKeyword && searchKeyword.length >= 3) {
        resetAllQuestions()
        setIsSearching(true)
        return `instructor/iamr/tickets/search/${searchKeyword}?page=${userSearchPage}`
      } else {
        setIsSearching(false)
        const ticketType = determineTicketType(questionsMenuSelected)
        return `instructor/iamr/tickets?page=${currentPage}&type=${ticketType}`
      }
    }

    const fetchTickets = async () => {
      setLoading(true)

      try {
        const url = constructUrl()
        const response = await axiosInstance.get(url)
        if (isComponentUnmounted) return

        const dataKey =
          searchKeyword?.length >= 3
            ? questionsMenuSelected.replace(/-/g, '_')
            : 'rows'
        console.log('questionMenuSelected', questionsMenuSelected)

        console.log('response.data', response.data)

        const ticketRows = response.data[dataKey]?.rows || response.data.rows
        const ticketCount = response.data[dataKey]?.count || response.data.count

        setTickets(ticketRows || [])
        setPageCount(Math.ceil(ticketCount / 5))
      } catch (error) {
        console.error('Error fetching tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()

    return () => {
      isComponentUnmounted = true
    }
  }, [
    questionsMenuSelected,
    currentPage,
    searchKeyword,
    userSearchPage,
    setLoading,
    resetAllQuestions,
    setIsSearching
  ])

  return { tickets, pageCount }
}

export default useFetchTickets
