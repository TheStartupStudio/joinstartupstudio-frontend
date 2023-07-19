const SelectTaskButton = (props) => {
  return (
    <div style={{ width: 150 }}>
      <div
        className={'days-of-task-box'}
        style={{
          // width: 'fit-content', // Adjusted width to fit the content

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
          fontWeight: 600,
          whiteSpace: 'normal',
          lineHeight: 1.4
        }}
      >
        <span>
          {`${props.task?.title?.split(' ')[1]?.toUpperCase()} ${
            props.task?.title?.split(' ')[2]?.toUpperCase() ?? ''
          } ${props.task?.title?.split(' ')[3]?.toUpperCase() ?? ''} ${
            props.task?.title?.split(' ')[4]?.toUpperCase() ?? ''
          }`}
        </span>
      </div>
    </div>
  )
}

export default SelectTaskButton
