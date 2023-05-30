import { Col, Form } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const NotificationComponent = (props) => {
  const [notification, setNotification] = useState(props.notification)

  // useEffect(() => {
  //   if (props.notification) setNotification(props.notification)
  // }, [props.notification])

  useEffect(() => {
    props.handleChange(notification)
  }, [notification])

  const onChangeNotification = (name, value) => {
    setNotification({ ...notification, [name]: value })
  }
  return (
    <>
      <>
        {props.notifications.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="remove-notification btn-close"
              aria-label="Close"
              onClick={props.handleRemove}
            ></button>
          </div>
        )}
        <Form>
          <div className="mb-4 py-2 px-md-2 row">
            <Col sm={12} md={12}>
              <label htmlFor="title" className="brand-text">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="mt-2 mb-2 col-12  p-md-2 w-100"
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
                className="mt-2 mb-2 col-12  p-md-2 w-100"
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
                className="mt-2 mb-2 col-12 p-md-2"
                type="text"
                name="link"
                placeholder={'Link'}
                value={notification.url}
                onChange={(e) => onChangeNotification('url', e.target.value)}
              />
            </Col>
          </div>
        </Form>
      </>
    </>
  )
}
export default NotificationComponent
