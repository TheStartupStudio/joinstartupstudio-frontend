import React, { useState } from 'react'
import Unsplash1 from '../../assets/images/unsplash-1.png'
// import Unsplash2 from '../../assets/images/unsplash-2.png'
// import Unsplash3 from '../../assets/images/unsplash-3.png'
import './index.css'

const ResourceCard = (props) => {
  return (
    <div className='resourceCard px-0 position-relative'>
      <img
        src={props.data.thumbnail ? props.data.thumbnail : Unsplash1}
        style={{ width: '100%', height: '130px' }}
        alt='#'
      />
      <div className='details text-center p-2'>
        <p className='NewestProjectsByTheCommunity_card_title m-0 pb-2 text-center'>
          {props.data.name}
        </p>
        {props.data?.ResourcesLinks.length > 0 &&
          props.data.ResourcesLinks.map((link) => (
            <a
              className='links text-center d-block'
              href={link.url}
              target='_blank'
              rel='noreferrer'
              key={link.id}
            >
              {link.name}
            </a>
          ))}
      </div>
    </div>
  )
}

export default ResourceCard
