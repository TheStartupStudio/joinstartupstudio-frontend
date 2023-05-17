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
        <Form>
          <div className="mb-4 py-2 px-md-2 row">
            <Col sm={12} md={12} className="row mb-4">
              <div className="col-12 col-md-6">
                <label htmlFor="title" className="brand-text">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="p-md-2 w-100"
                  placeholder={'Title'}
                  value={notification.title}
                  onChange={(e) =>
                    onChangeNotification('title', e.target.value)
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="title" className="brand-text">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className="p-md-2 w-100"
                  placeholder={'Description'}
                  value={notification.description}
                  onChange={(e) =>
                    onChangeNotification('description', e.target.value)
                  }
                />
              </div>
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
