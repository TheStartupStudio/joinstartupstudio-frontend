import React, { useReducer, useState } from 'react'

let reducer = (state, action) => {
  switch (action.type) {
    case 'studentsCount':
      return { ...state, studentsCount: action.studentsCount }
    case 'recentlyActive':
      return { ...state, recentlyActive: action.recentlyActive }
    default:
      return
  }
}

const initialState = { studentsCount: 0, recentlyActive: 0 }

const StudentCountContext = React.createContext(initialState)

function StudentCountProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StudentCountContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StudentCountContext.Provider>
  )
}

export { StudentCountContext, StudentCountProvider }
