import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Select, { components } from 'react-select'
import SharewithAconnecion from '../sharewithAconnecion'
import { useSelector, useDispatch } from 'react-redux'
import { EmailToInstructorModal } from '../EmailToInstructorModal'
import { IsUserLevelAuthorized } from '../../../../utils/helpers'

const Share = (props) => {
  const [sharewithAconnecion, setShareWithAconnecion] = useState(false)
  const [AddEmailToInstructor, setAddEmailToInstructor] = useState(false)
  const [connections, setConnections] = useState([])
  const user = useSelector((state) => state.user.user.user)
  const previewedUserLevel = IsUserLevelAuthorized()

  const options = previewedUserLevel
    ? [
        {
          value: 'SHARE WITH A CONNECTION IN A MESSAGE',
          label: 'SHARE WITH A CONNECTION IN A MESSAGE'
        }
      ]
    : [
        {
          value: 'SHARE WITH A CONNECTION IN A MESSAGE',
          label: 'SHARE WITH A CONNECTION IN A MESSAGE'
        },
        {
          value: 'SEND EMAIL TO MY INSTRUCTOR',
          label: 'SEND EMAIL TO MY INSTRUCTOR'
        }
      ]

  // st options = [
  //   {
  //     value: 'SHARE WITH A CONNECTION IN A MESSAGE',
  //     label: 'SHARE WITH A CONNECTION IN A MESSAGE'
  //   },
  //   {
  //     value: 'SHARE WITH THE COMMUNITY IN A NEW POST',
  //     label: 'SHARE WITH THE COMMUNITY IN A NEW POST'
  //   }
  // ]

  const handleChange = (e) => {
    if (e.value == 'SHARE WITH A CONNECTION IN A MESSAGE') {
      setShareWithAconnecion(true)
      setAddEmailToInstructor(false)
    }
    if (e.value == 'SEND EMAIL TO MY INSTRUCTOR') {
      setAddEmailToInstructor(true)
      setShareWithAconnecion(false)
    }
  }

  useEffect(() => {
    if (props.connections?.length) {
      setConnections(
        props.connections.map((connection, index) => {
          return {
            label: connection.name,
            value: connection,
            key: index
          }
        })
      )
    }
  }, [props.connections])

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4 px-md-5'>
        <h3 className='mb-0 pt-4 mt-2'>SHARE THIS PROJECT</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => {
            setShareWithAconnecion(false)
            setAddEmailToInstructor(false)
            props.onHide()
          }}
        />
        <hr />
      </Modal.Header>
      <Modal.Body style={{ minHeight: '400px' }} className='px-md-5'>
        <Select
          options={options}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            outLine: 'none',
            colors: {
              ...theme.colors,
              primary25: '#fffff',
              //   primary: '#ffff4',
              color: '#ffff',
              neutral0: '#ffffff',
              opacity: 1,
              zIndex: 99999
            },
            placeholder: (defaultStyles) => {
              return {
                ...defaultStyles,
                color: '#ffffff'
              }
            },
            spacing: {
              ...theme.spacing,
              controlHeight: 32
            },
            zIndex: 100
          })}
          placeholder={'Select What To Share'}
          styles={{
            control: (provided, state) => ({
              ...provided,
              boxShadow: 'none',
              border: 'none',
              height: 44,
              fontColor: '#ffffffff',
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#3C3C3C',
              color: 'white'
            }),
            color: 'white'
          }}
          onChange={(e) => handleChange(e)}
          className={'my-2 first_select option_select'}
        />

        {sharewithAconnecion && (
          <SharewithAconnecion
            connections={connections && connections}
            project={props.project}
            onHide={() => props.onHide()}
          />
        )}
        {/* {sharewithAcommunity && <SharewithAcommunity />}
        {sharewithAcommunity && <SharewithAcommunity />} */}
        {AddEmailToInstructor && (
          <EmailToInstructorModal
            project={props.project}
            hasInstrutor={
              user.hasOwnProperty('instructor_id') && user.instructor_id != null
            }
            onHide={() => props.onHide()}
          />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default Share
