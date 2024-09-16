import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useModalState from '../../../hooks/useModalState'
import { SkillBox } from '../MySchool/ContentItems'
import HeaderActions from './HeaderActions'
import './style.css'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  Actions,
  TableActions,
  TransferFilter
} from '../../GridTable/AgGridItems'
import GridTable from '../../GridTable'
import ViewApplicationModal from './ViewApplicationModal'
import ArchiveAppModal from './ArchiveAppModal'
import TransferModal from './TransferModal'

const MyGuestSpeakers = ({ levels, programs }) => {
  const [modals, setModalState] = useModalState()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([])
  const [instructors, setInstructors] = useState([])
  const [cohorts, setCohorts] = useState([])

  console.log('selectedRows', selectedRows)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/academy/applications')
      console.log('data', data)
      const formattedData = data.map((application) => ({
        ...application,
        user: { ...application.academy_user.user },
        payments: { ...application.academy_user.user.payments },
        name: application.academy_user?.name,
        dateOfApplication: application.academy_user?.dateOfApplication
      }))
      setRowData(formattedData)
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshApplications = useCallback(() => {
    fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    setLoading(true)
    const fetchInstructors = async () => {
      try {
        const { data } = await axiosInstance.get('/users/instructors')

        const formattedData = data.instructors.filter(
          (instructor) => instructor.User !== null
        )

        setInstructors(formattedData)

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchCohorts = async () => {
      try {
        const { data } = await axiosInstance.get('/academy/cohorts')

        setCohorts(data)

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchCohorts()
  }, [])

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'User Name',
        field: 'name',
        flex: 2,
        checkboxSelection: true
      },
      {
        headerName: 'Date Submitted',
        field: 'dateOfApplication',
        flex: 2
      },
      {
        field: 'status',
        flex: 2,
        filter: TransferFilter,
        cellRenderer: (params) => {
          console.log('params', params)
          let status = params.value
          return (
            <div>
              <SkillBox
                withStatus={true}
                color={`transfer__${
                  params.value.length
                    ? status === 'pending'
                      ? 'requested'
                      : status === 'approved'
                      ? 'transferred'
                      : status === 'denied'
                      ? 'denied'
                      : 'none'
                    : 'none'
                }`}
                text={
                  params.value.length
                    ? status === 'pending'
                      ? 'Pending'
                      : status === 'approved'
                      ? 'Approved'
                      : status === 'archived'
                      ? 'Denied'
                      : 'None'
                    : 'None'
                }
              />
            </div>
          )
        }
      },
      {
        field: 'actions',
        flex: 3,
        cellRenderer: (params) => {
          console.log('params', params)
          let user = {
            ...params.data.academy_user
          }
          let payments = {
            ...params.data.payments
          }
          let application = {
            ...params.data
          }

          if (user.parent_guardians && user.parent_guardians.length > 0) {
            const parentGuardian = user.parent_guardians[0]

            const modifiedParentGuardian = {
              pgAddress: parentGuardian.address,
              pgCity: parentGuardian.city,
              pgEmail: parentGuardian.email,
              pgName: parentGuardian.name,
              pgPhoneNumber: parentGuardian.phoneNumber,
              pgZipcode: parentGuardian.zipcode
            }

            user = {
              ...user,
              ...modifiedParentGuardian
            }
          }
          return (
            <TableActions
              user={user}
              instructors={instructors}
              cohorts={cohorts}
              levels={levels}
              programs={programs}
              payments={payments}
              application={application}
              refreshData={refreshApplications}
              ViewModal={{
                modal: ViewApplicationModal,
                name: 'viewApplicationModal',
                text: 'View App'
              }}
              TransferModal={{
                modal: TransferModal,
                name: 'transferAcademyUserModal',
                text: 'Trasnfer User'
              }}
              RemoveModal={{
                modal: ArchiveAppModal,
                name: 'archiveApplicationModal',
                text: 'Archive App'
              }}
            />
          )
        }
      }
    ],
    [instructors, cohorts, levels, programs, refreshApplications]
  )

  const filterData = useCallback((data, searchQuery, selectedSchoolFilter) => {
    return data?.filter((item) => {
      const matchesSearchQuery =
        searchQuery === '' ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSchoolFilter =
        !selectedSchoolFilter || item.universityId === selectedSchoolFilter.id

      return matchesSearchQuery && matchesSchoolFilter
    })
  }, [])

  const filteredData = useMemo(
    () => filterData(rowData, searchQuery, selectedSchoolFilter),
    [rowData, searchQuery, selectedSchoolFilter, filterData]
  )

  return (
    <div className='component__container'>
      <div style={{ background: '#fff', borderRadius: '15px' }}>
        <HeaderActions
          setSearchQuery={setSearchQuery}
          selectedRows={selectedRows}
          cohorts={cohorts}
          programs={programs}
          levels={levels}
          user={rowData.user}
          instructors={instructors}
        />
        <GridTable
          searchQuery={searchQuery}
          selectedSchoolFilter={selectedSchoolFilter}
          setSelectedRows={setSelectedRows}
          columnDefs={columnDefs}
          filteredData={filteredData}
          loading={loading}
        />
        {/* {modals.transferAcademyUserModal && (
          <TransferModal
            show={modals.transferAcademyUserModal}
            onHide={() => setModalState('transferAcademyUserModal', false)}
            user={rowData.user}
            instructors={instructors}
            cohorts={cohorts}
            programs={programs}
            levels={levels}
            refreshData={refreshApplications}
          />
        )} */}
      </div>
    </div>
  )
}

export default MyGuestSpeakers
