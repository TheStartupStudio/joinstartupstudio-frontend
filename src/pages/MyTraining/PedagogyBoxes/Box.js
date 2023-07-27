import React from 'react'

const Box = (props) => {
  return (
    <>
      <div
        style={{
          width: 95,
          height: 50,
          objectFit: 'contain',
          cursor: 'pointer',
          border: '1px solid #e3e3e3',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            props.index === props.selectedPedagogyIndex ? '#51C7DF' : '#fff',
          color:
            props.index === props.selectedPedagogyIndex ? '#fff' : '#231F20'
        }}
        onClick={() => props.selectedBox(props.box)}
      >
        {props?.box?.title}
      </div>
    </>
  )
}

export default Box
