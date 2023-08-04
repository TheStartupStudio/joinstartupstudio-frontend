import React from 'react'
import { useParams } from 'react-router-dom'

const TestPage = () => {
  const params = useParams()

  console.log(params)
  return <div>test page</div>
}

export default TestPage
