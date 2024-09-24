import React from 'react'

const CertificationBadge = ({ badge, alt }) => {
  return <img src={badge} alt={alt} className={'certification-badge'} />
}

export default CertificationBadge
