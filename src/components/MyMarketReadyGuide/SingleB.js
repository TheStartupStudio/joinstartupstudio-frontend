import React, { useState } from 'react'

export const SingleB = ({ data, index }) => {
  return (
    <div className='accordion-item'>
      <h2 className='accordion-header ' id='headingTwo'>
        <button
          className='accordion-button collapsed accordion_button accordion-button-inner '
          type='button'
          style={{ minHeight: '40px' }}
          data-bs-toggle='collapse'
          data-bs-target={`#collapse_inner${index}`}
          aria-expanded='false'
          aria-controls='collapseTwo'
        >
          {data.title}
        </button>
      </h2>
      <div
        id={`collapse_inner${index}`}
        className='accordion-collapse collapse'
        aria-labelledby='headingTwo'
        data-bs-parent='#accordionExample0'
      >
        <div className='accordion-body'>
          <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
        </div>
      </div>
    </div>
  )
}
