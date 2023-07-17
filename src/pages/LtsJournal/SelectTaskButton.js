import React from 'react'
import './TestJournalContent.css'

const SelectTaskButton = (props) => {
  return (
    <div>
      <div
        className={'days-of-task-box'}
        style={{
          width: 150,
          height: 80,
          border: '1px solid #d8d9d9',
          padding: 15,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 6,
          backgroundColor:
            props.index === props.selectedTaskIndex ? '#51C7DF' : '#fff',
          color: props.index === props.selectedTaskIndex ? '#fff' : '#231F20'
        }}
        onClick={() => props.handleSelectTask()}
      >
        <div>{props.task?.days}</div>
        <div>Task</div>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '16px',
          marginTop: 10,
          fontWeight: 600
        }}
      >
        <div>{props.task?.title?.split(' ')[1]?.toUpperCase()}</div>{' '}
        <div>{props.task?.title?.split(' ')[2]?.toUpperCase()}</div>
      </div>
    </div>
  )
}

export default SelectTaskButton
