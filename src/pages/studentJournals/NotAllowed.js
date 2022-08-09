import React from 'react'

let styles = {
  color: ' #01c5d1;'
}
const NotAllowed = () => {
  return (
    <div className='row col-12 px-auto my-auto text-center h-100'>
      <p className='h-100 mt-5 pt-5 page-title' style={{ color: '#01c5d1' }}>
        This student does not match with instructor id.
      </p>
      <spam>If you think this message is wrong, please contact support!</spam>
    </div>
  )
}

export default NotAllowed
