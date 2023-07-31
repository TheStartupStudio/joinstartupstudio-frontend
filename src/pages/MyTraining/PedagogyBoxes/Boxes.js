import React from 'react'
import Box from './Box'
import { useLocation } from 'react-router-dom'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

const Boxes = (props) => {
  const location = useLocation()
  const isTraining = location.pathname.includes('my-training')
  const windowWidth = useWindowWidth()

  const gridTemplateColumns = () => {
    if (windowWidth > 1150 && windowWidth < 1250) {
      return 'repeat(4, 1fr)'
    } else if (windowWidth > 750 && windowWidth < 1150) {
      return 'repeat(2, 1fr)'
    } else if (windowWidth < 750) {
      return 'repeat(2, 1fr)'
    }
    // else if (windowWidth < 750) {
    //   return 'repeat(2, 1fr)'
    // }
  }
  return (
    <div
      style={{
        font: 'normal normal 500 10.2px/17px Montserrat',
        letterSpacing: 0.18,
        color: '#333D3D',
        gridTemplateColumns: gridTemplateColumns(),
        rowGap: 10,
        gap: 10,
        display: windowWidth < 1250 ? 'grid' : 'flex',
        justifyContent: 'space-between',
        padding: '20px 0',
        marginBottom: '20px',
        borderBottom:
          isTraining && props.selectedPedagogyIndex !== null
            ? '1px solid #e3e3e3'
            : '0px solid #e3e3e3'
      }}
    >
      <>
        {props.boxes?.map((box, index) => (
          <Box
            key={index}
            index={index}
            selectedPedagogyIndex={props.selectedPedagogyIndex}
            box={box}
            selectedBox={(box) => props.selectPedagogy(box, index)}
          />
        ))}
      </>
    </div>
  )
}

export default Boxes
