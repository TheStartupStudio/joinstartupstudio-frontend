import React from 'react'
import { Image } from 'react-bootstrap'
import defaultImage from '../../assets/images/profile-image.png'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'

const SharedPeerBox = (props) => {
  const navigate = useHistory()
  const name = props.data?.name?.split(' ') ?? ''

  return (
    <div
      className={`col-auto my-connection-box ${
        props.from == 'EditPage' || props.from == 'PreviewPage'
          ? 'editPage'
          : ''
      } ${
        props.from == 'approved-connections' || props.from === 'my-classroom'
          ? 'mt-3'
          : 'mx-2'
      } p-3`}
    >
      {props.data.status === 'accept' && (
        <FontAwesomeIcon
          icon={faBan}
          onClick={() =>
            props.removeConnection({
              id: props.data.id,
              name: props.data.name
            })
          }
          style={{
            color: '#F2359D',
            position: 'absolute',
            right: '10px',
            cursor: 'pointer',
            height: '15px',
            width: '15px'
          }}
        />
      )}
      <div className="text-center mb-2">
        <Image
          src={
            props.data.profile_image ? props.data.profile_image : defaultImage
          }
        />
      </div>
      <h4>{name[0]}</h4>
      {name[1] ? <h4>{name[1]}</h4> : <h4>‎</h4>}
      {props.from == 'PublishedProject' ||
      props.from == 'PreviewPage' ||
      props.from == 'EditPage' ? (
        <p>{props.data.Business_Founders.role}</p>
      ) : (
        <p className="mt-0 mb-3">{props.data.profession}</p>
      )}
      {props.from !== 'EditPage' && (
        <>
          <button
            className="d-block mx-auto"
            onClick={() =>
              navigate.push(`/user-portfolio/${props.data.username}`, {
                isPeerView: true
              })
            }
          >
            PORTFOLIO
          </button>
        </>
      )}
    </div>
  )
}
export default SharedPeerBox
