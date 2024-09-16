import React, { useCallback, useMemo, useState } from 'react'
import '../MySchool/style.css'
import HeaderActions from './HeaderActions'
import useModalState from '../../../hooks/useModalState'
import './style.css'
import ViewItemModal from './ViewItemModal'
import RemoveItemModal from './RemoveItemModal'
import { ActiveInactiveFilter, TableActions } from '../../GridTable/AgGridItems'
import GridTable from '../../GridTable'
import CourseVCredentialsActions from './CourseVCredentialsActions'

const CoursesVCredentials = () => {
  const [modals, setModalState] = useModalState()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([
    {
      name: 'English for Career Development',
      awardType: 'Certificate',
      provider: 'University of Pennsylvania',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In aliquid et minus qui, ea consequatur eveniet quis beatae quo, ipsum aut recusandae quas error tempore, voluptas earum inventore quam magni.'
    },
    {
      name: 'Foundation of Digital Marketing',
      awardType: 'Certificate',
      provider: 'Google',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In aliquid et minus qui, ea consequatur eveniet quis beatae quo, ipsum aut recusandae quas error tempore, voluptas earum inventore quam magni.'
    },
    {
      name: 'Google Projet Management',
      awardType: 'Certificate',
      provider: 'Google',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In aliquid et minus qui, ea consequatur eveniet quis beatae quo, ipsum aut recusandae quas error tempore, voluptas earum inventore quam magni.'
    },
    {
      name: 'Social Entrepreneurship Specializierin',
      awardType: 'Certificate',
      provider: 'Copenhagen Bussines University',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. In aliquid et minus qui, ea consequatur eveniet quis beatae quo, ipsum aut recusandae quas error tempore, voluptas earum inventore quam magni.'
    }
  ])

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Course Name',
        field: 'name',
        flex: 2,
        checkboxSelection: true,
        filter: ActiveInactiveFilter
      },
      {
        headerName: 'Award Type',
        field: 'awardType',
        flex: 2
      },
      {
        headerName: 'Provider',
        field: 'provider',
        flex: 2
      },
      {
        field: 'description',
        flex: 2
      },
      {
        field: 'actions',
        flex: 2,
        cellRenderer: (params) => {
          return (
            <TableActions
              ViewModal={{
                modal: ViewItemModal,
                name: 'viewCoursesVCredentialModal',
                text: 'View Item'
              }}
              RemoveModal={{
                modal: RemoveItemModal,
                name: 'removeCoursesVCredentialModal',
                text: 'Delete Item'
              }}
            />
          )
        }
      }
    ],
    []
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
    <>
      <div className='my-school__container'>
        <div className='' style={{ background: '#fff' }}>
          <HeaderActions
            setSearchQuery={setSearchQuery}
            addNewCourseVCredential={() =>
              setModalState('addCoursesVCredentialModal', true)
            }
          />

          <GridTable
            searchQuery={searchQuery}
            setSelectedRows={setSelectedRows}
            columnDefs={columnDefs}
            filteredData={filteredData}
            loading={loading}
          />
        </div>
      </div>

      {/* {modals.addCoursesVCredentialModal && (
        <CourseVCredentialsActions
          show={modals.addCoursesVCredentialModal}
          onHide={() => setModalState('addCoursesVCredentialModal', false)}
          mode='add'
        />
      )} */}
    </>
  )
}

export default CoursesVCredentials
