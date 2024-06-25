import { InboxProvider } from '../../components/MyInbox/inboxContext'
import InboxMenu from '../../components/MyInbox/inboxMenu/index'
// import InboxTickets from '../../components/IAMRinbox/inboxTickets'
import InboxTickets from '../../components/MyInbox/inboxTickets/index'

import './index.css'

const InboxContainer = () => {
  return (
    <div className="row iamr-inbox p-0 m-0">
      <InboxMenu />
      <InboxTickets />
    </div>
  )
}

function MyInbox() {
  return (
    <InboxProvider>
      <InboxContainer />
    </InboxProvider>
  )
}

export default MyInbox
