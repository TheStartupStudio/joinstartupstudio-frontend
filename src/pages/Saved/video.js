import React from 'react'
import IntlMessages from '../../utils/IntlMessages'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

const Podcast = ({ data }) => {
  return (
    <div
      className='row justify-content-between px-3 video-saved-image'
      style={{ height: '100%' }}
    >
      {data.map((data, index) => (
        <div className='col-12 col-sm-4 align-center py-2'>
          <div className='w-100'>
            <Link to={`/${data.type}/video/${data.id}`}>
              {data.thumbnail ? <img src={data.thumbnail} /> : 'image'}
            </Link>
          </div>
          <div className='col-12 align-center px-3 py-2'>
            <h4 className='text-center'>
              <IntlMessages id={data.title}></IntlMessages>
            </h4>
          </div>
        </div>
      ))}
    </div>
  )
}
export default Podcast
