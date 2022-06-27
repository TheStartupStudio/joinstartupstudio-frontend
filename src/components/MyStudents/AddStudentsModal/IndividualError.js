import React from 'react'

const IndividualError = (props) => {
  delete props.user.id
  return (
    <div className='w-100 text-left mb-4 ps-4'>
      <p className='text-center'>{props.message}</p>
      {/* <p>{props.message.length != 0 ? props.message : 'Empty fields'}</p> */}
      <p>
        {props.code == 400 && (
          <>
            {props.user.name === undefined ? (
              <span className='d-block'>Name field was empty</span>
            ) : (
              <span className='d-block'>Name: {props.user.name}</span>
            )}
            {props.user.lastName === undefined ? (
              <span className='d-block'>LastName field was empty</span>
            ) : (
              <span className='d-block'>LastName: {props.user.lastName}</span>
            )}
            {props.user.UserEmail === undefined ? (
              <span className='d-block'>Email field was empty</span>
            ) : (
              <span className='d-block'>Email: {props.user.UserEmail}</span>
            )}
            {props.user.password === undefined ? (
              <span className='d-block'>Password field was empty</span>
            ) : (
              <span className='d-block'>Password: {props.user.password}</span>
            )}
            {props.user.year === undefined ? (
              <span className='d-block'>Year field was empty</span>
            ) : (
              <span className='d-block'>Year: {props.user.year}</span>
            )}
          </>
        )}
      </p>
      <hr />
    </div>
  )
}

export default IndividualError
