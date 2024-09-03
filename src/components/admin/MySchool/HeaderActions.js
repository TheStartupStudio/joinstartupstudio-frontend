import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, CustomSearchBar } from './ContentItems'
import IntlMessages from '../../../utils/IntlMessages'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import useModalState from './useModalState'
import { ConfirmationModal } from '../../Modals/confirmationModal'
import { DeactivateDialogModal } from '../../StudentsTable/deactivateDialogModal'
import { NextYearModal } from '../../StudentsTable/nextYearModal'
import EditBulkModal from './EditBulkModal'

const HeaderActions = ({
  usedIn = 'instructor',
  firstDropdownProps,
  lastDropdownProps,
  setSearchQuery,
  setLoading,
  levels,
  selectedRows,
  periods,
  tableTitle,
  onSuccess
}) => {
  const [modals, setModalState] = useModalState()
  const [bulkEditingStudents, setBulkEditingStudents] = useState([])
  const [bulkNextYearStudents, setBulkNextYearStudents] = useState([])
  const [bulkDeactivatingStudents, setBulkDeactivatingStudents] = useState([])

  const getId = (item) => (usedIn === 'instructor' ? item.User.id : item.id)

  const defaultData = [
    {
      name: 'level',
      value: 'LS',
      label: 'LS',
      year: ['K', '1st', '2nd', '3rd', '4th', '5th']
    },
    {
      name: 'level',
      value: 'MS',
      label: 'MS',
      year: ['ES1', 'ES2', 'ES3'],
      period: periods
        ?.filter(
          (item) =>
            item.name === 'Period 1' ||
            item.name === 'Period 2' ||
            item.name === 'Period 3' ||
            item.name === 'Period 4' ||
            item.name === 'Period 5' ||
            item.name === 'Period 6' ||
            item.name === 'Period 7'
        )
        .map((item) => item.name)
    },
    {
      name: 'level',
      value: 'HS',
      label: 'HS',
      year: ['LTS1', 'LTS2', 'LTS3', 'LTS4'],
      period: periods?.map((item) => item.name)
    },
    { name: 'level', value: 'HE', label: 'HE' }
  ]

  const handleBulkEditAction = () => {
    if (!selectedRows.length) return

    setBulkEditingStudents(selectedRows.map(getId))
    setModalState('showBulkEditModal', true)
  }
  const bulkEditStudents = async (options) => {
    setLoading(true)

    try {
      await axiosInstance.post(`/instructor/bulk-update/`, {
        studentsIds: bulkEditingStudents,
        options: options
      })

      onSuccess()
      setModalState('showConfirmationModal', true)
      setModalState('showBulkEditModal', false)
    } catch (err) {
      toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDeactiveAction = () => {
    if (!selectedRows.length) return

    setBulkDeactivatingStudents(selectedRows.map(getId))
    setModalState('showBulkDeactivationModal', true)
  }
  const bulkDeactivateStudents = async () => {
    setLoading(true)
    try {
      await axiosInstance.post('/instructor/bulk-update/', {
        studentsIds: bulkDeactivatingStudents,
        bulkDeactivate: true
      })
      onSuccess()
      setModalState('showConfirmationModal', true)
      setModalState('showBulkDeactivationModal', false)
    } catch (err) {
      toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    }
    setLoading(false)
  }

  const handleBulkNextYearAction = () => {
    if (!selectedRows.length) return

    setBulkNextYearStudents(selectedRows.map(getId))
    setModalState('showBulkNextYearModal', true)
  }
  const bulkNextYear = async () => {
    setLoading(true)
    try {
      const updatedOptions = await Promise.all(
        bulkNextYearStudents?.map(async (id) => {
          const { data } = await axiosInstance.get(`/users/${id}`)

          const selectedUserData = defaultData.find(
            (item) => item.value === data?.level
          )

          const currentYearIndex = selectedUserData?.year.indexOf(data?.year)
          const periodIndexId = periods?.find(
            (period) => period.id === data?.period_id
          )?.name

          const currentPeriodIndex =
            selectedUserData?.period.indexOf(periodIndexId)

          let nextYearIndex
          let nextPeriodIndex

          if (selectedUserData?.year.length - 1 === currentYearIndex) {
            nextYearIndex = currentYearIndex
            nextPeriodIndex = currentPeriodIndex
          } else {
            nextYearIndex = currentYearIndex + 1
            nextPeriodIndex = 0
          }

          const nextYear = selectedUserData?.year[nextYearIndex]
          const nextPeriodName = selectedUserData?.period[nextPeriodIndex]

          const nextPeriod = periods.find(
            (item) => item.name === nextPeriodName
          )?.id

          return {
            studentID: data?.id,
            year: nextYear,
            period_id: nextPeriod
          }
        })
      )

      await axiosInstance.post('/instructor/bulk-update/', {
        studentsIds: bulkNextYearStudents,
        nextYearOptions: updatedOptions
      })

      onSuccess()
      setModalState('showConfirmationModal', true)
      setModalState('showBulkNextYearModal', false)
    } catch (err) {
      toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    }
    setLoading(false)
  }
  return (
    <>
      <Row className='py-3 m-0'>
        {usedIn === 'reports' && (
          <Col md='8' className='ps-0'>
            <h4 className='m-0 p-0'>{tableTitle}</h4>
          </Col>
        )}
        {usedIn !== 'reports' && (
          <Col md='4'>
            <CustomDropdown
              title={firstDropdownProps.title}
              btnClassName={'instructor'}
              options={firstDropdownProps.options}
              onClick={firstDropdownProps.onChange}
              width={'300px'}
            />
          </Col>
        )}
        <Col
          md='4'
          className={`${
            usedIn === 'reports' ? 'd-flex justify-content-end pe-0' : ''
          }`}
        >
          <CustomSearchBar
            onChange={(e) => setSearchQuery(e.target.value)}
            className={usedIn === 'reports' ? 'w-100' : ''}
          />
        </Col>
        {usedIn !== 'reports' && (
          <>
            <Col className='d-flex justify-content-end'>
              <CustomDropdown
                title='Bulk Actions'
                options={[
                  {
                    name: 'Edit',
                    value: 'edit'
                  },
                  { name: 'Next year', value: 'next year' },
                  { name: 'Deactivate', value: 'deactivate' }
                ]}
                onClick={(newValue) => {
                  newValue?.value === 'edit'
                    ? handleBulkEditAction()
                    : newValue?.value === 'deactivate'
                    ? handleBulkDeactiveAction()
                    : handleBulkNextYearAction()
                }}
                btnClassName={'instructor'}
              />
            </Col>
            <Col>
              <CustomDropdown
                options={[
                  {
                    name: 'Add Manualy',
                    value: 'add-manualy',
                    icon: ''
                  },
                  {
                    name: 'Bulk Upload',
                    value: 'bulk-upload',
                    icon: ''
                  }
                ]}
                onClick={lastDropdownProps?.onClick}
                title={lastDropdownProps?.title}
              />
            </Col>
          </>
        )}
      </Row>

      <DeactivateDialogModal
        show={modals.showBulkDeactivationModal}
        onHide={() => setModalState('showBulkDeactivationModal', false)}
        bulkDeactivateStudents={bulkDeactivateStudents}
        deactivateLoading={modals.loading}
        handleAction={() => {
          bulkDeactivateStudents()
        }}
      />
      <NextYearModal
        show={modals.showBulkNextYearModal}
        onHide={() => setModalState('showBulkNextYearModal', false)}
        bulkNextYear={bulkNextYear}
        nextYearLoading={modals.loading}
        handleAction={() => {
          bulkNextYear()
        }}
      />

      <EditBulkModal
        show={modals.showBulkEditModal}
        onHide={() => setModalState('showBulkEditModal', false)}
        bulkEditStudents={bulkEditStudents}
        onSave={(options) => bulkEditStudents(options)}
        levels={levels}
        onSuccess={onSuccess}
      />
      {bulkEditingStudents?.length > 0 && (
        <>
          <ConfirmationModal
            show={modals.showConfirmationModal}
            onHide={() => {
              setModalState('showConfirmationModal', false)
              setBulkEditingStudents([])
            }}
            message={'Student(s) updated.'}
          />
        </>
      )}
      {bulkNextYearStudents?.length > 0 && (
        <>
          <ConfirmationModal
            show={modals.showConfirmationModal}
            onHide={() => {
              setModalState('showConfirmationModal', false)
              setBulkNextYearStudents([])
            }}
            message={'Student(s) year and period updated.'}
          />
        </>
      )}
      {bulkDeactivatingStudents.length > 0 && (
        <>
          <ConfirmationModal
            show={modals.showConfirmationModal}
            onHide={() => {
              setModalState('showConfirmationModal', false)
              setBulkDeactivatingStudents([])
            }}
            message={'Student(s) deactivated.'}
          />
        </>
      )}
    </>
  )
}

export default HeaderActions
