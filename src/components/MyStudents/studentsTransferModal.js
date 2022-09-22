import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'
import { toast } from 'react-toastify'
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import axiosInstance from '../../utils/AxiosInstance'
import Select from 'react-select'
import { TransferDialog } from './transferDialog'

const StudentsTransferModal = (props) => {
  const [isReceivedSelected, setIsReceivedSelected] = useState(true)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isBulkUpdating, setIsBulkUpdating] = useState({
    status: false,
    action: null
  })
  const [currentUpdatingRows, setCurrentUpdatingRows] = useState([])
  const [transferDialogData, setTransferDialogData] = useState(null)

  const isUpdatingCondition = () => {
    return (
      !isBulkDeleting &&
      !isBulkUpdating.status &&
      currentUpdatingRows.length === 0
    )
  }

  const deleteSingleSentTransfer = async (id) => {
    if (currentUpdatingRows.length > 2) {
      return toast.error("You can't delete more than 3 rows at once!")
    }

    setCurrentUpdatingRows([...currentUpdatingRows, id])

    await axiosInstance
      .delete(`/instructor/transfers/${id}`)
      .then((res) => {
        props.deleteSingleSentTransfer(id)
      })
      .catch((e) =>
        toast.error(
          'Something went wrong while canceling transfer, please reload and try again!'
        )
      )

    setCurrentUpdatingRows((currentUpdatingRows) =>
      currentUpdatingRows.filter((row) => row !== id)
    )
  }

  const respondSingleReceivedTransfer = async (id, status) => {
    if (currentUpdatingRows.length > 2) {
      return toast.error("You can't update more than 3 rows at once!")
    }

    setCurrentUpdatingRows([...currentUpdatingRows, id])

    await axiosInstance
      .put(`/instructor/transfers/${id}`, {
        status: status
      })
      .then((res) => {
        props.respondSingleReceivedTransfer(id, status, res.data.student)
      })
      .catch((e) =>
        toast.error(
          'Something went wrong while responding to transfer, please reload and try again!'
        )
      )

    setCurrentUpdatingRows((currentUpdatingRows) =>
      currentUpdatingRows.filter((row) => row !== id)
    )
  }

  const handleBulkSentDelete = async (type) => {
    if (!props.sentTransferRequests.length > 0) return

    if (type === 'delete_approved') {
      let hasApproved = false

      let i = 0
      while (i < props.sentTransferRequests.length) {
        if (props.sentTransferRequests[i].status === 'approved') {
          hasApproved = true
          break
        }
        i++
      }
      if (!hasApproved) return

      setTransferDialogData({
        type: 'sent',
        action: type,
        cb: deleteBulkSentRequests
      })
      return
    }

    if (type === 'delete_pending') {
      let hasPending = false

      let i = 0
      while (i < props.sentTransferRequests.length) {
        if (props.sentTransferRequests[i].status === 'pending') {
          hasPending = true
          break
        }
        i++
      }
      if (!hasPending) return

      setTransferDialogData({
        type: 'sent',
        action: type,
        cb: deleteBulkSentRequests
      })
    }
  }

  const handleBulkReceivedAction = (status) => {
    let hasPending = false

    let i = 0
    while (i < props.receivedTransferRequests.length) {
      if (props.receivedTransferRequests[i].status === 'pending') {
        hasPending = true
        break
      }
      i++
    }
    if (!hasPending) return
    setTransferDialogData({
      type: 'received',
      action: status,
      cb: updateBulkReceivedRequests
    })
  }

  const updateBulkReceivedRequests = async (status) => {
    setIsBulkUpdating({ status: true, action: status })
    setTransferDialogData(null)

    await axiosInstance
      .post(`/instructor/transfers/received-bulk-update?status=${status}`)
      .then((res) => {
        props.handleBulkReceivedUpdate(status)
      })
      .catch((e) =>
        toast.error(
          'Something went wrong while updating transfers, please reload and try again!'
        )
      )
    setIsBulkUpdating({ status: false, action: null })
  }

  const deleteBulkSentRequests = async (type) => {
    setTransferDialogData(null)
    if (type === 'delete_approved') {
      setIsBulkDeleting(true)
      await axiosInstance
        .delete(`/instructor/transfers/delete?status=approved`)
        .then((res) => {
          props.handleBulkSentDelete('approved')
        })
        .catch((e) =>
          toast.error(
            'Something went wrong while deleting transfers, please reload and try again!'
          )
        )
      setIsBulkDeleting(false)
    }

    if (type === 'delete_pending') {
      setIsBulkDeleting(true)
      await axiosInstance
        .delete(`/instructor/transfers/delete?status=pending`)
        .then((res) => {
          props.handleBulkSentDelete('pending')
        })
        .catch((e) =>
          toast.error(
            'Something went wrong while deleting transfers, please reload and try again!'
          )
        )
      setIsBulkDeleting(false)
    }
  }

  const dropDownStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: 'none',
      border: '1px solid #BBBDBF',
      borderRadius: '0',
      height: 15,
      fontSize: '16px',
      cursor: 'pointer',
      color: '#707070',
      fontWeight: '500',
      ':hover': {
        border: '1px solid #BBBDBF'
      },
      zIndex: 100
    }),
    menu: (base) => ({
      ...base,
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      margin: 0,
      paddingTop: 0,
      boxShadow: '0px 3px 6px #00000029',
      zIndex: 9999
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    valueContainer: (base) => ({
      ...base
    }),
    option: (styles, state) => ({
      ...styles,
      cursor: 'pointer',
      fontWeight: 600,
      color: '231F20',
      fontSize: '14px',
      paddingTop: '2px',
      paddingBottom: '2px',
      ':hover': {
        backgroundColor: 'white',
        background: 'white'
      },
      backgroundColor: 'white',
      textTransform: 'uppercase'
    })
  }

  const formatDate = (date) => {
    if (!date) return
    const dateNow = new Date()

    const dateWithTimezone = new Date(date)
    // const userTimezoneOffset = dateWithTimezone.getTimezoneOffset() * 60000

    const msgDate = new Date(dateWithTimezone.getTime())

    const dateDifference =
      (dateNow.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24.0)

    if (dateDifference > 6) {
      return format(msgDate, 'MMM dd, yyyy')
    } else {
      return format(msgDate, "E h:mmaaaaa'm'")
    }
  }

  const getStatusColor = (status) => {
    return status === 'pending'
      ? 'text-warning'
      : status === 'approved'
      ? 'text-success'
      : 'text-danger'
  }

  return (
    <Modal
      show={props.show}
      backdrop='static'
      onHide={() => {
        isUpdatingCondition() && props.onHide()
      }}
      style={{ marginTop: '3.9%' }}
      className='edit-modal'
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4 general-modal-header'>
        <h3 className='mb-0 pt-4 mt-2'>Students Transfer</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => {
            isUpdatingCondition() && props.onHide()
          }}
        />
      </Modal.Header>
      <Modal.Body className='students-transfer-modal mx-2'>
        <div
          className='row justify-content-between'
          style={{ marginTop: '-10px', minHeight: '38px' }}
        >
          <div className='col-12 col-md-6 d-flex float-start my-md-auto'>
            <p
              className={`my-auto`}
              onClick={() =>
                isUpdatingCondition() && setIsReceivedSelected(true)
              }
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 400,
                color: !isReceivedSelected && '#51c7df'
              }}
            >
              RECEIVED
            </p>
            <span className='mx-2'>|</span>
            <p
              className={`my-auto`}
              onClick={() =>
                isUpdatingCondition() && setIsReceivedSelected(false)
              }
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 400,
                color: isReceivedSelected && '#51c7df'
              }}
            >
              SENT
            </p>
          </div>
          <div className='col-12 col-md-5 col-lg-3'>
            {!isReceivedSelected
              ? props.sentTransferRequests.length > 0 && (
                  <Select
                    options={[
                      { label: 'DELETE PENDING', value: 'delete_pending' },
                      { label: 'DELETE APPROVED', value: 'delete_approved' }
                    ]}
                    isDisabled={!isUpdatingCondition()}
                    value={'Bulk Actions'}
                    placeholder={'Bulk Actions'}
                    onChange={(newValue) =>
                      handleBulkSentDelete(newValue.value)
                    }
                    className='mb-0 me-0 custom-dropdown'
                    styles={dropDownStyles}
                    autoFocus={false}
                    isSearchable={false}
                  />
                )
              : props.receivedTransferRequests.length > 0 && (
                  <Select
                    options={[
                      { label: 'ACCEPT ALL', value: 'approved' },
                      { label: 'REJECT ALL', value: 'denied' }
                    ]}
                    isDisabled={!isUpdatingCondition()}
                    value={'Bulk Actions'}
                    placeholder={'Bulk Actions'}
                    onChange={(newValue) =>
                      handleBulkReceivedAction(newValue.value)
                    }
                    className='mb-0 me-0 custom-dropdown'
                    styles={dropDownStyles}
                    autoFocus={false}
                    isSearchable={false}
                  />
                )}
          </div>
        </div>
        <div className='table-container'>
          <div className='table-responsive transfers-table position-relative mt-2'>
            <table className='table table-striped'>
              <thead
                className='thead-light'
                style={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  fontSize: '14px'
                }}
              >
                <tr>
                  <th scope='col'>Student</th>
                  <th scope='col'>Instructor</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Request</th>
                  <th scope='col'>Updated</th>
                  <th scope='col' style={{ width: '100px' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                {!isReceivedSelected ? (
                  props.sentTransferRequests.length > 0 ? (
                    props.sentTransferRequests.map((transfer) => (
                      <tr>
                        <td>{transfer.student.name}</td>
                        <td>{transfer.transferTo.User.name}</td>
                        <td className={getStatusColor(transfer.status)}>
                          {transfer.status.toUpperCase()}
                        </td>
                        <td>{formatDate(transfer.createdAt)}</td>
                        <td>
                          {transfer.updatedAt !== transfer.createdAt &&
                            formatDate(transfer.updatedAt)}
                        </td>
                        <td>
                          {transfer.status === 'pending' &&
                            (!currentUpdatingRows.includes(transfer.id) ? (
                              <FontAwesomeIcon
                                icon={faBan}
                                className=''
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  color: '#df4759',
                                  cursor: 'pointer'
                                }}
                                onClick={() =>
                                  deleteSingleSentTransfer(transfer.id)
                                }
                              />
                            ) : (
                              <span className='text-success'>SAVING...</span>
                            ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        // className='pt-4'
                        style={{ fontSize: '14px' }}
                      >
                        You dont have new transfer requests!
                      </td>
                    </tr>
                  )
                ) : props.receivedTransferRequests.length > 0 ? (
                  props.receivedTransferRequests.map((transfer) => (
                    <tr>
                      <td>{transfer.student.name}</td>
                      <td>{transfer.transferFrom.User.name}</td>
                      <td className={getStatusColor(transfer.status)}>
                        {transfer.status.toUpperCase()}
                      </td>
                      <td>{formatDate(transfer.createdAt)}</td>
                      <td>
                        {transfer.updatedAt !== transfer.createdAt &&
                          formatDate(transfer.updatedAt)}
                      </td>
                      <td>
                        {transfer.status === 'pending' &&
                          (!currentUpdatingRows.includes(transfer.id) ? (
                            <>
                              <FontAwesomeIcon
                                icon={faBan}
                                className='my-auto'
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  color: '#df4759',
                                  cursor: 'pointer'
                                }}
                                onClick={() =>
                                  respondSingleReceivedTransfer(
                                    transfer.id,
                                    'denied'
                                  )
                                }
                              />
                              <FontAwesomeIcon
                                icon={faCheck}
                                className='ms-2 my-auto'
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  color: '#51c7df',
                                  cursor: 'pointer'
                                }}
                                onClick={() =>
                                  respondSingleReceivedTransfer(
                                    transfer.id,
                                    'approved'
                                  )
                                }
                              />
                            </>
                          ) : (
                            <span className='text-success'>SAVING...</span>
                          ))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      // className='pt-4'
                      style={{ fontSize: '14px' }}
                    >
                      You dont have new transfer requests!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {isBulkDeleting && (
            <div className='bulk-deleting'>
              <div className='d-flex h-100 justify-content-center align-items-center flex-column'>
                <div className='lds-facebook'>
                  <div style={{ background: '#dc3545' }}></div>
                  <div style={{ background: '#dc3545' }}></div>
                  <div style={{ background: '#dc3545' }}></div>
                </div>
                <p style={{ color: '#dc3545', fontSize: '16px' }}>
                  Deleting transfers, please wait!
                </p>
              </div>
            </div>
          )}

          {isBulkUpdating.status && (
            <div className='bulk-deleting'>
              <div className='d-flex h-100 justify-content-center align-items-center flex-column'>
                <div className='lds-facebook'>
                  <div
                    style={{
                      background:
                        isBulkUpdating.action === 'approved'
                          ? '#198754'
                          : '#dc3545'
                    }}
                  ></div>
                  <div
                    style={{
                      background:
                        isBulkUpdating.action === 'approved'
                          ? '#198754'
                          : '#dc3545'
                    }}
                  ></div>
                  <div
                    style={{
                      background:
                        isBulkUpdating.action === 'approved'
                          ? '#198754'
                          : '#dc3545'
                    }}
                  ></div>
                </div>
                <p
                  style={{
                    color:
                      isBulkUpdating.action === 'approved'
                        ? '#198754'
                        : '#dc3545',
                    fontSize: '16px'
                  }}
                >
                  {isBulkUpdating.action === 'approved'
                    ? 'Accepting transfer requests, please wait!'
                    : 'Deleting transfers, please wait!'}
                </p>
              </div>
            </div>
          )}
          <TransferDialog
            transferDialogData={transferDialogData}
            action={() => transferDialogData.cb(transferDialogData.action)}
            onHide={() => setTransferDialogData(null)}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default StudentsTransferModal
