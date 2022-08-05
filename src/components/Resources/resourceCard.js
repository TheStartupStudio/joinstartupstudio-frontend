import React, { useState } from 'react'
import Unsplash1 from '../../assets/images/unsplash-1.png'
import Unsplash2 from '../../assets/images/unsplash-2.png'
import Unsplash3 from '../../assets/images/unsplash-3.png'
import './index.css'

const ResourceCard = (props) => {
  return (
    <div className='ProjectCard resourceCard px-0 position-relative'>
      <img
        src={props.data?.test ? props.data.thumbnail : Unsplash1}
        style={{ width: '100%', height: '55%', objectFit: 'cover' }}
        alt='#'
      />
      <div className='details text-center p-2'>
        <div className='d-flex flex-column my-auto w-100'>
          <p className='NewestProjectsByTheCommunity_card_title text-center'>
            {props.data.name}
          </p>
        </div>
        <a
          className='links text-center'
          href={props.data.link_url}
          target='_blank'
          rel='noreferrer'
        >
          View as Google Doc
        </a>
      </div>
    </div>
  )
}

export default ResourceCard
