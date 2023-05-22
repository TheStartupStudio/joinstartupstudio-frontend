import React, { useEffect, useState } from 'react'
import { Col, DropdownButton, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import IntlMessages from '../../utils/IntlMessages'
import 'react-quill/dist/quill.snow.css'
import './NotificationModal.css'

const NotificationModal = (props) => {
  const initialState = {
    title: '',
    description: '',
    url: '',
  }
  const [notification, setNotification] = useState(initialState)

  useEffect(() => {
    props.show === false && setNotification(initialState)
  }, [props.show])

  useEffect(() => {
    if (isEdit()) {
      const newNotification = {
        title: props.notification?.title,
        description: props.notification?.description,
        url: props.notification?.url,
      }
      setNotification(newNotification)
    }
  }, [props.notification])

  const onChangeNotification = (name, value) => {
    setNotification({ ...notification, [name]: value })
  }

  const onEditNotification = () => {
    let newNotification = {
      id: props.notification.id,
      title: notification.title,
      description: notification.description,
      url: notification.url,
    }
    props.handleUpdateNotification(newNotification)
  }
  const isEdit = () => {
    return props.notification != null
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      className={'notification-modal'}
    >
      <Modal.Header className=" general-modal-header my-auto p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">Edit Notification</h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className="mt-4 mb-3 mx-4 ">
        <Form>
          <div className="mb-4 py-2 px-md-2 row">
            <Col sm={12} md={12}>
              <label htmlFor="title" className="brand-text">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="mt-2 mb-2 col-12  p-md-2 w-100 rounded-0"
                placeholder={'Title'}
                value={notification.title}
                onChange={(e) => onChangeNotification('title', e.target.value)}
              />
            </Col>
            <Col sm={12} md={12}>
              <label htmlFor="title" className="brand-text">
                Description
              </label>
              <textarea
                name="description"
                className="mt-2 mb-2 col-12  p-md-2 w-100  rounded-0"
                placeholder={'Description'}
                style={{ resize: 'none' }}
                value={notification.description}
                onChange={(e) =>
                  onChangeNotification('description', e.target.value)
                }
                rows={4}
              />
            </Col>
            <Col sm={12} md={12}>
              <label htmlFor="link" className="brand-text">
                Link to redirect
              </label>
              <input
                className="mt-2 mb-2 col-12 p-md-2 rounded-0"
                type="text"
                name="link"
                placeholder={'Link'}
                value={notification.url}
                onChange={(e) => onChangeNotification('url', e.target.value)}
              />
            </Col>
          </div>
        </Form>
      </Modal.Body>
      <div
        style={{ border: '0px' }}
        className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
      >
        <button
          className="float-end m-0 px-md-5 save-button  ms-1"
          onClick={onEditNotification}
        >
          <IntlMessages id="general.save" />
        </button>
      </div>
    </Modal>
  )
}
export default NotificationModal
