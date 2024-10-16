import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CustomDropdown, CustomSearchBar } from './ContentItems'
import IntlMessages from '../../../utils/IntlMessages'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import useModalState from './useModalState'
import { ConfirmationModal } from '../../Modals/confirmationModal'
import {
  DeactivateDialogModal,
  RemoveDialogModal
} from './DeactiveImmersionModal'
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
  // const [bulkEditingStudents, setBulkEditingStudents] = useState([])
  const [bulkRemovingImmersions, setBulkremovingImmersions] = useState([])
  const [bulkNextYearStudents, setBulkNextYearStudents] = useState([])
  const [bulkDeactivatingImmersions, setBulkDeactivatingImmersions] = useState(
    []
  )

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

    setBulkremovingImmersions(selectedRows.map(getId))
    setModalState('showBulkEditModal', true)
  }
  const bulkRemoveImmersions = async (options) => {
    setLoading(true)

    try {
      await axiosInstance.delete(`/immersion/immersionsAll/remove`, {
        data: {
          immersionIds: bulkRemovingImmersions // Send data under 'data' key for DELETE request
        }
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

    setBulkDeactivatingImmersions(selectedRows.map(getId))
    setModalState('showBulkDeactivationModal', true)
  }
  const bulkDeactivateImmersions = async () => {
    setLoading(true)
    try {
      await axiosInstance.patch('/immersion/immersionsAll/batch/status', {
        immersionIds: bulkDeactivatingImmersions,
        status: '0'
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

        <Col md='3'></Col>

        <Col
          md='3'
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
            <Col md='3' className='d-flex justify-content-end'>
              <CustomDropdown
                title='Bulk Actions'
                options={[
                  { name: 'Deactivate', value: 'deactivate' },
                  { name: 'Remove', value: 'remove' }
                ]}
                onClick={(newValue) => {
                  newValue?.value === 'remove'
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
                    name: 'Step 1: Industry Problem',
                    value: '1',
                    icon: ''
                  },
                  {
                    name: 'Step 2:Immersion Experience',
                    value: '2',
                    icon: ''
                  },
                  {
                    name: 'Step 3: Internship',
                    value: '3',
                    icon: ''
                  },
                  {
                    name: 'Step 4: Entry-Level Employment',
                    value: '4',
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
        bulkDeactivateImmersions={bulkDeactivateImmersions}
        deactivateLoading={modals.loading}
        handleAction={() => {
          bulkDeactivateImmersions()
        }}
      />

      {/* <RemoveDialogModal    show={modals.showBulkDeactivationModal}
        onHide={() => setModalState('showBulkDeactivationModal', false)}
        bulkDeactivateImmersions={bulkDeactivateImmersions}
        deactivateLoading={modals.loading}
        handleAction={() => {
          bulkDeactivateImmersions()
        }}
      /> */}

      <RemoveDialogModal
        show={modals.showBulkEditModal}
        onHide={() => setModalState('showBulkEditModal', false)}
        bulkEditStudents={bulkRemovingImmersions}
        handleAction={() => {
          bulkRemoveImmersions()
        }}
        levels={levels}
        onSuccess={onSuccess}
      />
      {bulkRemovingImmersions?.length > 0 && (
        <>
          <ConfirmationModal
            show={modals.showConfirmationModal}
            onHide={() => {
              setModalState('showConfirmationModal', false)
              setBulkremovingImmersions([])
            }}
            message={'Immersions removed'}
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
      {bulkDeactivatingImmersions.length > 0 && (
        <>
          <ConfirmationModal
            show={modals.showConfirmationModal}
            onHide={() => {
              setModalState('showConfirmationModal', false)
              setBulkDeactivatingImmersions([])
            }}
            message={'Immersion(s) deactivated.'}
          />
        </>
      )}
    </>
  )
}

export default HeaderActions
