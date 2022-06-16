import React, { useState } from 'react'
import moment from 'moment'
import IntlMessages from '../../../utils/IntlMessages'

export const SingleNote = (props) => {
  return (
    <div
      className='w-100 single_note_div'
      onClick={() => {
        props.dataToEdit(props.data)
        props.changeState('all_note_on_this_page')
        props.changeState('edit_single_note_modal', 'show')
      }}
    >
      <p
        className={`p-0  m-0 single_note_title${
          props.from == 'small' ? '_small' : ' pb-1'
        }`}
      >
        {props.fromPage == 'video' ? (
          <IntlMessages id={props.data.title} />
        ) : (
          props.data.title
        )}
      </p>
      <p
        className={`single_note_date${
          props.from == 'small' ? '_small pb-0 mb-2' : ''
        }`}
      >
        Created: {moment(props.data.createdAt).format('MM/D/YYYY')}
        <span className='mx-1' />
        Edited: {moment(props.data.updatedAt).format('MM/D/YYYY')}
      </p>
    </div>
  )
}
