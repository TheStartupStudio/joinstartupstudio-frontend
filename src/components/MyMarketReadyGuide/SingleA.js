import React from 'react'
import { SingleB } from './SingleB'
import Accordion from 'react-bootstrap/Accordion'

export const SingleA = ({ data, title, index }) => {
  return (
    <div className='mt-2'>
      <div className='accordion-item'>
        <h2 className='accordion-header' id={`heading-${1}`}>
          <button
            className='accordion-button collapsed accordion-outter button-accordion'
            type='button'
            eventKey={`${index}`}
            data-bs-toggle='collapse'
            data-bs-target={`#collapse_outer${index}`}
            aria-expanded='false'
            aria-controls={`collapse_outer${index}`}
          >
            {title}
          </button>
        </h2>
        <div
          id={`collapse_outer${index}`}
          eventKey={`${index}`}
          class={`accordion-collapse collapse `}
          aria-labelledby={`heading-${index}`}
          data-bs-parent={`#accordionExample`}
        >
          <div className='accordion-body py-4' eventKey={`${index}`}>
            {/* <div
              className='accordion-outter-body px-2'
              dangerouslySetInnerHTML={{ __html: data?.content }}
            > */}
            {console.log(data)}
            {data.map((item) => (
              <div className='w-100 row'>
                <p>
                  <span className='item-title text-start pe-2 text-capitalize'>
                    {item.title}:
                  </span>
                  <span className='item-content text-capitalize'>
                    {item.content}
                  </span>
                </p>
              </div>
            ))}
            {/* </div> */}
            {/* <div className='row d-row' id='accordionExample0'> */}
            {/* {data?.small &&
                data?.small.map((data, index) => {
                  return (
                    <div className='Properties col-12 col-md-4 mt-2'>
                      <SingleB data={data} index={index} key={index} />
                    </div>
                  )
                })} */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
