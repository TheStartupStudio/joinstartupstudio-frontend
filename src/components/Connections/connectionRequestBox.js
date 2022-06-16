import React, { useEffect, useState } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import { getConnections, getConnectionRequests } from '../../utils/helpers'

export default function ConnectionRequestsBox(props) {
  const [myConnections, setMyConnections] = useState(0)
  const [myRequests, setMyRequests] = useState(0)

  useEffect(() => {
    getConnectionsAll()
    getConnectionRequestsAll()
  }, [])

  useEffect(() => {
    setMyConnections(props.count)
  }, [props.count])

  useEffect(() => {
    setMyRequests(props.requests_count)
  }, [props.requests_count])

  const getConnectionsAll = async () => {
    if (!isNaN(props.count)) return setMyConnections(props.count)

    await getConnections()
      .then((connections) => setMyConnections(connections.data.count))
      .catch((e) => e)
  }

  const getConnectionRequestsAll = async () => {
    if (!isNaN(props.requests_count))
      return setMyConnections(props.requests_count)

    await getConnectionRequests()
      .then((requests) => setMyRequests(requests.data.count))
      .catch((e) => e)
  }

  return (
    <div
      style={{
        backgroundColor: '#F8F7F7',
        borderRadius: 0,
        marginTop: `${props?.type == 'no-margin' && '40px'}`
      }}
      className={`dashboard-notification py-3 mb-2 ${
        props?.type !== 'no-margin' && 'mt-4'
      }`}
    >
      <h3 className='py-2 px-3 mb-0 text-lg-center'>
        <IntlMessages id='connection.page_title' />
      </h3>
      {props.from != 'MyProject' && (
        <div className='row px-3'>
          <div className='col-10'>
            <p className='mt-2 mb-0'>Connection Requests</p>
          </div>
          <div className='col-1 text-left'>
            <p className='mt-2 mb-0'>{myRequests}</p>
          </div>
        </div>
      )}
      <div className='row px-3'>
        <div className='col-10'>
          <p className='mt-2 mb-0'>
            <IntlMessages id='connection.page_title' />
          </p>
        </div>
        <div className='col-1 text-left'>
          <p className='mt-2 mb-0'>{myConnections}</p>
        </div>
      </div>
    </div>
  )
}
