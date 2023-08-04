import React from 'react'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

const Box = (props) => {
  const windowWidth = useWindowWidth()
  const boxWidth = () => {
    if (windowWidth > 1150) {
      return '85%'
    } else if (windowWidth > 800 && windowWidth < 1150) {
      return '95%'
    } else if (windowWidth < 800) {
      return '95%'
    }
  }
  return (
    <>
      <div
        style={{
          width: boxWidth() ?? 95,
          height: 50,
          objectFit: 'contain',
          cursor: 'pointer',
          border: '1px solid #e3e3e3',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontWeight: 600,
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
