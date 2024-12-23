import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import GridTable from '../../../GridTable'
import { SkillBox } from '../ContentItems'
import { useParams, useHistory } from 'react-router-dom'
import Certification1Badge from '../../../../assets/images/market-ready-1-badge.png'
import Certification2Badge from '../../../../assets/images/market-ready-2-badge.png'
import StudentActionsModal from './StudentActionsModal'
import HeaderActions from '../HeaderActions'
import AddStudentBulkModal from './AddStudentBulkModal'
import {
  Actions,
  ActiveInactiveFilter,
  CustomSelectCellEditor,
  ProgramsFilter,
  TransferFilter
} from '../../../GridTable/AgGridItems'
import useModalState from '../../../../hooks/useModalState'
import useProxyLogin from '../../../../hooks/useProxyLogin'

const Learners = ({
  programs,
  levels,
  instructor_id,
  justSearchable,
  tableTitle,
  periods,
  universities,
  usedIn,
  instructors
}) => {
  const { handleProxyLogin } = useProxyLogin()
  const history = useHistory()
  const { user } = useSelector((state) => state.user.user)
  const [modals, setModalState] = useModalState()
  const [, setSelectedInstructor] = useState(null)
  // const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([])
  const { instructorId } = useParams()

  useEffect(() => {
    if (instructorId || instructor_id) {
      axiosInstance
        .get(`/users/instructors/${instructorId || instructor_id}`)
        .then(({ data }) => {
          setSelectedInstructor(data)
        })
    }
  }, [instructorId, instructor_id])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    let url = ''
    if (instructorId || instructor_id) {
      url = `/instructor/students/${user.universityId}/${
        instructorId || instructor_id
      }`
    } else {
      url = `instructor/students/${user.universityId}`
    }

    try {
      const { data } = await axiosInstance.get(url)

      const formattedData = data.map((student) => ({
        ...student,
        status: student.deactivated ? 'unactive' : 'active',
        levels: student?.levels || [],
        programs: student?.programs || [],
        transferStatus: student.transferHistory.length
          ? student.transferHistory[0].status === 'approved'
            ? 'transferred'
            : student.transferHistory[0].status === 'pending'
            ? 'requested'
            : student.transferHistory[0].status === 'denied'
            ? 'denied '
            : 'none'
          : 'none',
        universityName: student.University.name
      }))
      setRowData(formattedData)
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [instructorId, instructor_id, user.universityId])

  const refreshStudents = useCallback(() => {
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: 'user name',
        field: 'name',
        flex: 2,
        checkboxSelection: true,
        cellRenderer: (params) => {
          return (
            <>
              <div
                className='pb-0 m-0 learners-subtitles'
                style={{ height: '14px', fontWeight: '500' }}
              >
                {params.data?.name}
              </div>
              <small
                className='m-0 p-0'
                style={{ fontSize: '12px', color: 'grey' }}
              >
                {params.data?.email}
              </small>
            </>
          )
        }
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
        headerName: 'Programs',
        field: 'programs',
        cellRenderer: (params) => {
          return (
            <div className='d-flex align-items-center justify-content-center h-100'>
              <CustomSelectCellEditor
                placeHolder={
                  params.data.programs?.length
                    ? params.data?.programs?.length +
                      ` ${
                        params.data?.programs.length > 1
                          ? 'program(s)'
                          : 'program'
                      }`
                    : 'No program'
                }
                values={params.data?.programs?.map((item) => item?.name) || []}
              />
            </div>
          )
        },
        filter: ProgramsFilter
      },
      {
        headerName: 'Class',
        field: 'year'
      }
    ]

    if (justSearchable) {
      baseColumnDefs.push({
        headerName: 'Certification Progress',
        field: 'alternateField',
        cellRenderer: (params) => {
          return (
            <div className='d-flex justify-content-between text-center w-100'>
              <div className='w-50 d-flex align-items-center'>
                <div className='w-50'>
                  <img
                    className='w-100 h-100'
                    src={Certification1Badge}
                    alt=''
                  />
                </div>
                <span>
                  <span className='d-flex' style={{ height: '20px' }}>
                    <p className='text-info mb-0 pb-0 fw-bold'>
                      {params.data.completedSkills1
                        ? params.data.completedSkills1.length
                        : 0}{' '}
                    </p>
                    /
                    <p className='mb-0 pb-0'>
                      {params.data.certification1Skills
                        ? params.data.certification1Skills
                        : 0}
                    </p>
                  </span>
                  <small>Skills</small>
                </span>
              </div>
              <div className='w-50 d-flex align-items-center'>
                <div className='w-50'>
                  <img
                    className='w-100 h-100'
                    src={Certification2Badge}
                    alt=''
                  />
                </div>
                <span>
                  <span className='d-flex' style={{ height: '20px' }}>
                    <p
                      className='mb-0 pb-0 fw-bold'
                      style={{ color: '#a22f6a' }}
                    >
                      {params.data.completedSkills2
                        ? params.data.completedSkills2.length
                        : 0}
                    </p>
                    /
                    <p className='mb-0 pb-0'>
                      {params.data.certification2Skills
                        ? params.data.certification2Skills
                        : 0}
                    </p>
                  </span>
                  <small>Skills</small>
                </span>
              </div>
            </div>
          )
        },
        flex: 2
      })
    } else {
      baseColumnDefs.push({
        headerName: 'Transfer Status',
        field: 'transferHistory',
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
      })
    }

    baseColumnDefs.push({
      field: 'actions',
      flex: 4,
      cellRenderer: (params) => {
        let user = params.data

        return (
          <Actions
            user={user}
            handleViewStudent='studentEditActionModal'
            universities={universities}
            levels={levels}
            programs={programs}
            instructors={instructors}
            periods={periods}
            handleProxyLogin={handleProxyLogin}
            onSuccess={refreshStudents}
          />
        )
      }
    })

    return baseColumnDefs
  }, [
    justSearchable,
    periods,
    universities,
    levels,
    programs,
    instructors,
    refreshStudents,
    handleProxyLogin
  ])

  const handleInstructorFilterChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedSchoolFilter(null)
      return
    }
    setSelectedInstructor(null)
    const selectedSchool = instructors.find((i) => i.id === selectedOption.id)
    setSelectedSchoolFilter(selectedSchool)

    if (instructorId) {
      history.push(`/my-school/learners/${selectedOption.id}`)
    }
  }

  const filterData = useCallback((data, searchQuery, selectedSchoolFilter) => {
    return data?.filter((item) => {
      const matchesSearchQuery =
        searchQuery === '' ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesInstructorFilter =
        !selectedSchoolFilter || item.instructor_id === selectedSchoolFilter.id

      return matchesSearchQuery && matchesInstructorFilter
    })
  }, [])

  const filteredData = useMemo(
    () => filterData(rowData, searchQuery, selectedSchoolFilter),
    [rowData, searchQuery, selectedSchoolFilter, filterData]
  )

  return (
    <div style={{ background: '#fff' }}>
      <HeaderActions
        usedIn={usedIn || 'student'}
        tableTitle={tableTitle}
        firstDropdownProps={{
          title: 'Select Instructor to view',
          options: instructors?.map((instructor) => ({
            name: instructor.User.name,
            value: instructor.User.name,
            id: instructor.id
          })),
          hasResetOption: true,
          onChange: handleInstructorFilterChange
        }}
        lastDropdownProps={{
          title: 'Add Student',
          onClick: (newValue) => {
            newValue?.value === 'add-manualy'
              ? setModalState('studentAddActionModal', true)
              : setModalState('showAddStudentsBulkModal', true)
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
        onSuccess={refreshStudents}
      />
      <GridTable
        searchQuery={searchQuery}
        selectedSchoolFilter={selectedSchoolFilter}
        setSelectedRows={setSelectedRows}
        columnDefs={columnDefs}
        filteredData={filteredData}
        loading={loading}
      />

      {modals.studentAddActionModal && (
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
      )}
      <AddStudentBulkModal
        show={modals.showAddStudentsBulkModal}
        onHide={() => setModalState('showAddStudentsBulkModal', false)}
        onSuccess={refreshStudents}
      />
    </div>
  )
}

export default Learners
