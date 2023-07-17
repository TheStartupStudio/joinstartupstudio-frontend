import React from 'react'

const StepContent = (props) => {
  return (
    <>
      {props.selectedStep != null && (
        <div
          style={{
            fontFamily: 'Montserrat',
            backgroundColor: '#fff'
          }}
          dangerouslySetInnerHTML={{
            __html: props.selectedStep?.stepContent
          }}
        />
      )}
      {props.selectedStep != null && (
        <div
          className={`d-flex justify-content-start
                                                         mt-2`}
        >
          <button
            style={{
              backgroundColor: '#51c7df',
              color: '#fff',
              fontSize: 9
            }}
            onClick={() => props.handleOpenPopup()}
            className="px-4 py-3 border-0 color transform text-uppercase my-1"
          >
            WHAT TO EXPECT FROM STUDENTS
          </button>
        </div>
      )}
    </>
  )
}

export default StepContent
