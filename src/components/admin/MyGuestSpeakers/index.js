import React, { useCallback, useMemo, useState } from 'react'
import GridTable from '../MySchool/GridTable'
import useModalState from '../MySchool/useModalState'
import { Actions, TransferFilter } from '../MySchool/AgGridItems'
import { SkillBox } from '../MySchool/ContentItems'
import HeaderActions from './HeaderActions'
import './style.css'

const MyGuestSpeakers = () => {
  const [modals, setModalState] = useModalState()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([
    {
      email: 'bledonibishi1@gmail.com',
      username: 'Bledon ibishi',
      submittedDate: '2024-08-29',
      status: 'pending'
    },
    {
      email: 'bledonibishi1@gmail.com',
      username: 'Bledon ibishi',
      submittedDate: '2024-08-29',
      status: 'pending'
    },
    {
      email: 'bledonibishi1@gmail.com',
      username: 'Bledon ibishi',
      submittedDate: '2024-08-29',
      status: 'pending'
    },
    {
      email: 'bledonibishi1@gmail.com',
      username: 'Bledon ibishi',
      submittedDate: '2024-08-29',
      status: 'pending'
    }
  ])

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'User Name',
        field: 'username',
        flex: 2,
        checkboxSelection: true
      },
      {
        headerName: 'Date Submitted',
        field: 'submittedDate',
        flex: 2
      },
      {
        field: 'status',
        flex: 2,
        filter: TransferFilter,
        cellRenderer: (params) => {
          let status = params.value[0]?.status
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
                      ? 'Requested'
                      : status === 'approved'
                      ? 'Transferred'
                      : status === 'denied'
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
          let user = {
            ...params.data.University,
            ...params.data.User
          }
          return (
            <Actions
              user={user}
              instructors={rowData}
              handleViewStudent='editInstructorModal'
              // onSuccess={refreshInstructors}
            />
          )
        }
      }
    ],
    [rowData]
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
        <HeaderActions setSearchQuery={setSearchQuery} />
        <GridTable
          searchQuery={searchQuery}
          selectedSchoolFilter={selectedSchoolFilter}
          setSelectedRows={setSelectedRows}
          columnDefs={columnDefs}
          filteredData={filteredData}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default MyGuestSpeakers
