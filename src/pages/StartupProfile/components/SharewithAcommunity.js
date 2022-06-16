import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import axiosInstance from '../../../utils/AxiosInstance'
const SharewithAcommunity = () => {
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connections, setConnections] = useState([])

  useEffect(() => {
    getUserConnections()
  }, [])
  const handleConnectionSelect = (e) => {
    setSelectedConnection({ value: e.value, label: e.label })
    // setSelectDisabled(true)
  }

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{
                color: '#333d3d',
                height: '37px',
                width: '36px',
                position: 'absolute',
                left: '6'
                // cursor: 'pointer'
              }}
              onClick={props.closeChat}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }
  return <div></div>
}

export default SharewithAcommunity
