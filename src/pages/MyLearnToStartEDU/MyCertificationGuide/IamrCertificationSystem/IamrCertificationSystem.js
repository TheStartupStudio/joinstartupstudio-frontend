import { IamrProvider } from '../../../../components/MyLearnToStartEDU/IAMRCertificationSystem/iamrContext/context'
import IAMRCertificationSystem from '../../../../components/MyLearnToStartEDU/IAMRCertificationSystem/index.js'
import './index.css'

export default function IamrSkills() {
  return (
    <IamrProvider>
      <IamrCertificationSystem />
    </IamrProvider>
  )
}

function IamrCertificationSystem() {
  return (
    <div className='container-fluid iamr-page'>
      <div className='row'>
        <div className='col-12 col-xl-12 px-0'>
          <div className='page-border'>
            <IAMRCertificationSystem />
          </div>
        </div>
      </div>
    </div>
  )
}
