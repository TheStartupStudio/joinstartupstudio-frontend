import React, { useState } from 'react'
import { AllNotesFromThisPage } from './allNotesFromThisPage'
import '../style/index.css'
import { SingleNote } from './singleNote'

export const SmallPageForNote = (props) => {
  return (
    <div
      className='firstDiv px-2 py-4 text-center'
      style={{
        transform: 'translate(0px, 0px)',
        display: props.display ? 'block' : 'none',
        overflowY:'scroll'
      }}
    >
      <p
        className='modalsNotes_title text-center mb-0 pb-0 me-4 pe-1'
        onClick={() => {
          props.changeState('create_new_note', 'show')
          props.setNotesDiv(false)
        }}
      >
        CREATE NEW NOTE
      </p>
      <p className='modalsNotes_title text-center mt-1 mb-1 pb-0 ps-2'>
        NOTES FROM THIS PAGE
      </p>
      <center>
        <hr className='mt-0 mb-2' style={{ width: '170px' }} />
      </center>
      <div className='ps-5'>
        {props.data &&
          props.data.map((data, index) => {
            if (index < 2) {
              return (
                <SingleNote
                  dataToEdit={(data) => props.sendDataToEdit(data)}
                  changeState={(data, type) => props.changeState(data, type)}
                  data={data}
                  fromPage={props.fromPage}
                  key={data.id}
                  from={'small'}
                />
              )
            }
          })}
      </div>
      {props.data.length > 2 ? (
        <p
          className='noteFromThisPage_ViewMore ps-5 cursor-pointer'
          onClick={() => props.changeState('all_note_on_this_page', 'show')}
        >
          View More…
        </p>
      ) : (
        ''
      )}
    </div>
  )
}

// const Resizable = require('react-resizable').Resizable; // or,
// const ResizableBox = require('react-resizable').ResizableBox;

// // ES6
// import { Resizable, ResizableBox } from 'react-resizable';

// // ...
// render() {
//   return (
//     <ResizableBox width={200} height={200} draggableOpts=
//         minConstraints={[100, 100]} maxConstraints={[300, 300]}>
//       <span>Contents</span>
//     </ResizableBox>
//   );
// }
