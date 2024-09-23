import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import GridTable from '../MySchool/GridTable'
import {
  Actions,
  ActiveInactiveFilter,
  CustomSelectCellEditor,
  ProgramsFilter,
  TransferFilter
} from './AgGridItems'
import useModalState from '../MySchool/useModalState'
import { SkillBox } from '../MySchool/ContentItems'
import { useParams, useHistory } from 'react-router-dom'
import Certification1Badge from '../../../assets/images/market-ready-1-badge.png'
import Certification2Badge from '../../../assets/images/market-ready-2-badge.png'
import StudentActionsModal from '../MySchool/Learners/StudentActionsModal'
import HeaderActions from './HeaderActions'
import AddImmersionModal from './AddImmersionModal'
// import AddStudentBulkModal from '../MySchool/Learners/AddStudentBulkModal'

const MyImmersion = ({
  programs,
  levels,
  instructor_id,
  justSearchable,
  tableTitle,
  periods,
  universities,
  usedIn
}) => {
  const { user } = useSelector((state) => state.user.user)
  // const [modals, setModalState] = useModalState()

  const [immersionStep, setImmersionStep] = useState()
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([])
  const { instructorId } = useParams()
  const [viewExprience, setViewExprience] = useState()
  const history = useHistory()

  console.log(viewExprience, 'viewExprience')

  useEffect(() => {
    if (instructorId || instructor_id) {
      axiosInstance
        .get(`/users/instructors/${instructorId || instructor_id}`)
        .then(({ data }) => {
          setSelectedInstructor(data)
        })
    }
  }, [instructorId, instructor_id])

  const fetchImmersions = useCallback(() => {
    setLoading(true)
    let url = '/immersion/immersionsAll'

    try {
      axiosInstance.get(url).then(({ data }) => {
        console.log('dataImmersions', data)
        const formattedData = data.data.map((immersion) => ({
          ...immersion,
          status: immersion.status ? 'active' : 'unactive'
        }))
        setRowData(formattedData)
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
    }
  }, [])

  // const refreshStudents = useCallback(() => {
  //   fetchImmersions()
  // }, [fetchImmersions])

  useEffect(() => {
    fetchImmersions()
  }, [fetchImmersions])

  // useEffect(() => {
  //   setLoading(true)
  //   const fetchInstructors = async () => {
  //     try {
  //       const { data } = await axiosInstance.get('/users/instructors')

  //       const formattedData = data.instructors.filter(
  //         (instructor) => instructor.User !== null
  //       )

  //       setInstructors(formattedData)

  //       setLoading(false)
  //     } catch (error) {
  //       console.error('Error fetching instructors:', error)
  //       setLoading(false)
  //     }
  //   }

  //   fetchInstructors()
  // }, [])

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: 'Company Name',
        field: 'company_name', // Use the field name as per your data
        flex: 2,
        checkboxSelection: true
        // Remove cellRenderer for now
      },
      {
        field: 'status',
        filter: ActiveInactiveFilter,
        cellRenderer: (params) => {
          return (
            <div className=''>
              <SkillBox
                withStatus={true}
                color={`status__${params?.value}`}
                text={params?.value}
              />
            </div>
          )
        }
      },
      {
        headerName: 'Step',
        field: 'step',
        flex: 1
      },
      {
        headerName: 'INDUSTRY',
        field: 'industry', // Field name from your data
        flex: 2,
        cellRenderer: (params) => {
          return (
            <div
              className='pb-0 m-0'
              style={{ height: '14px', fontWeight: '500' }}
            >
              {params.data.industry}
            </div>
          )
        }
      },
      {
        headerName: 'DESCRIPTION',
        field: 'company_description', // Field name from your data
        flex: 3,
        cellRenderer: (params) => {
          return (
            <div
              className='pb-0 m-0'
              style={{ height: '14px', fontWeight: '500' }}
            >
              {params.data.company_description}
            </div>
          )
        }
      }
    ]

    baseColumnDefs.push({
      field: 'actions',
      flex: 3,
      cellRenderer: (params) => {
        let immersion = params.data
        return (
          <Actions
            user={user}
            handleViewStudent='immersionEditActionModal'
            setViewExprience={() => setViewExprience(immersion)}
            immersion={immersion}
            // levels={levels}
            // programs={programs}
            // instructors={instructors}
            // periods={periods}
            onSuccess={null}
          />
        )
      }
    })

    return baseColumnDefs
  }, [justSearchable, periods, universities, levels, programs, instructors])

  const filterData = useCallback((data, searchQuery, selectedSchoolFilter) => {
    return data?.filter((item) => {
      console.log(item, 'datafilterItem')
      console.log(searchQuery, 'searchQuery')
      const matchesSearchQuery =
        searchQuery === '' ||
        item.company_name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesInstructorFilter =
        !selectedSchoolFilter || item.instructor_id === selectedSchoolFilter.id

      return matchesSearchQuery && matchesInstructorFilter
    })
  }, [])

  const filteredData = useMemo(
    () => filterData(rowData, searchQuery, selectedSchoolFilter),
    [rowData, searchQuery, selectedSchoolFilter, filterData]
  )

  const handleInstructorFilterChange = (selectedOption) => {
    setSelectedInstructor(null)
    const selectedSchool = instructors.find((i) => i.id === selectedOption.id)
    setSelectedSchoolFilter(selectedSchool)

    if (instructorId) {
      history.push(`/my-school/learners/${selectedOption.id}`)
    }
  }

  return (
    <div style={{ background: '#fff' }}>
      <HeaderActions
        usedIn={usedIn || 'student'}
        tableTitle={tableTitle}
        lastDropdownProps={{
          title: 'Add Immersion Oppurtunity',
          onClick: (newValue) => {
            console.log(newValue, 'newValue')

            setImmersionStep(newValue)
          }
        }}
        levels={levels}
        handleInstructorFilterChange={handleInstructorFilterChange}
        setSearchQuery={setSearchQuery}
        rowData={rowData}
        setRowData={setRowData}
        setLoading={setLoading}
        selectedRows={selectedRows}
        periods={periods}
        programs={programs}
        onSuccess={null}
      />
      <GridTable
        searchQuery={searchQuery}
        selectedSchoolFilter={selectedSchoolFilter}
        setSelectedRows={setSelectedRows}
        columnDefs={columnDefs}
        filteredData={filteredData}
        loading={loading}
      />

      {immersionStep && <AddImmersionModal />}
      {viewExprience && <AddImmersionModal viewExprience={viewExprience} />}
      {/* {modals.studentAddActionModal && (
        <StudentActionsModal
          show={modals.studentAddActionModal}
          onHide={() => setModalState('studentAddActionModal', false)}
          user={user}
          universities={universities}
          programs={programs}
          levels={levels}
          instructors={instructors}
          periods={periods}
          mode='add'
          onSuccess={refreshStudents}
        />
      )} */}
      {/* <AddStudentBulkModal
        show={modals.showAddStudentsBulkModal}
        onHide={() => setModalState('showAddStudentsBulkModal', false)}
        onSuccess={refreshStudents}
      /> */}
    </div>
  )
}

export default MyImmersion
