import React from 'react'
import { useParams } from 'react-router-dom'

const ImrSubContent = () => {
  const { id, type } = useParams()
  return <div>ImrSubContent {`${type}-${id}`}</div>
}

export default ImrSubContent
