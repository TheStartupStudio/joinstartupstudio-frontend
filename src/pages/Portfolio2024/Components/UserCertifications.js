import React from 'react'
import collaborationCertificationBadge from '../../../assets/images/certification-badges/Collaboration Certx1200.png'
import creativityCertificationBadge from '../../../assets/images/certification-badges/Creativity Certx1200.png'
import criticalThinkingCertificationBadge from '../../../assets/images/certification-badges/Critical Thinking Certx1200.png'
import enterpriseCertificationBadge from '../../../assets/images/certification-badges/Enterprise Certx1200.png'
import leadershipCertificationBadge from '../../../assets/images/certification-badges/Leadership Certx1200.png'
import CertificationBadge from './CertificationBadge'

const UserCertifications = () => {
  return (
    <div className={'certification-badges'}>
      <CertificationBadge
        badge={collaborationCertificationBadge}
        alt={'collaboration-badge'}
      />
      <CertificationBadge
        badge={creativityCertificationBadge}
        alt={'creativity-badge'}
      />
      <CertificationBadge
        badge={criticalThinkingCertificationBadge}
        alt={'critical-thinking-badge'}
      />
      <CertificationBadge
        badge={enterpriseCertificationBadge}
        alt={'enterprise-badge'}
      />
      <CertificationBadge
        badge={leadershipCertificationBadge}
        alt={'leadership-badge'}
      />
    </div>
  )
}

export default UserCertifications
