import { useState, useEffect } from 'react'
import axiosInstance from '../../../../utils/AxiosInstance'

function useFetchTickets(
  questionsMenuSelected,
  setLoading,
  page,
  searchKeyword
) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const endpoints = [
    {
      type: 'student_questions',
      url: `instructor/iamr/tickets?page=${page}&type=instruction`
    },
    {
      type: 'certification_feedback_requests',
      url: `instructor/iamr/tickets?page=${page}&type=certification_submit`
    },
    {
      type: 'approval_requests',
      url: `instructor/iamr/tickets?page=${page}&type=approval`
    },
    {
      type: 'industry_problem_submissions',
      url: `instructor/iamr/tickets?page=${page}&type=industry_problem`
    },
    {
      type: 'immersion_experience_applications',
      url: `instructor/iamr/tickets?page=${page}&type=immersion_experience`
    }
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      if (searchKeyword) {
        const endpoint = `instructor/iamr/tickets/search/${searchKeyword}?page=${page}`
        const response = await axiosInstance.get(endpoint)
        if (response.data) {
          setData(response.data)
        } else {
          console.error('Data not found in response:', response)
        }
      } else {
        const responses = await Promise.all(
          endpoints?.map((endpoint) => axiosInstance.get(endpoint.url))
        )

        setData(
          responses.reduce((acc, response, index) => {
            acc[endpoints[index].type] = response.data
            return acc
          }, {})
        )
      }
    } catch (err) {
      console.log('err', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [questionsMenuSelected, page, searchKeyword])

  return { data, error }
}

export default useFetchTickets
