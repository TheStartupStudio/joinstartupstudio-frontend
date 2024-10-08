import React from 'react'

function WebsiteLink({ website }) {
  return (
    <a
      href={website.startsWith('https') ? website : `https://${website}`}
      target='_blank'
      className='mr-2'
    >
      {website}
    </a>
  )
}

export default WebsiteLink
