import { IamrInboxProvider } from '../../components/IAMRinbox/iamrInboxContext'
import InboxMenu from '../../components/IAMRinbox/inboxMenu'
import InboxTickets from '../../components/IAMRinbox/inboxTickets'

import './index.css'

const IAMRinboxContainer = () => {
  return (
    <div className='row iamr-inbox p-0 m-0'>
      <InboxMenu />
      <InboxTickets />
    </div>
  )
}

function IAMRinbox() {
  return (
    <IamrInboxProvider>
      <IAMRinboxContainer />
    </IamrInboxProvider>
  )
}

export default IAMRinbox
