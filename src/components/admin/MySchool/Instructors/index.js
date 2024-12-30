import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './style.css'
import {
  Actions,
  ActiveInactiveFilter,
  CustomSelectCellEditor,
  LevelsFilter,
  ProgramsFilter
} from '../../../GridTable/AgGridItems'
import axiosInstance from '../../../../utils/AxiosInstance'
import { SkillBox } from '../ContentItems'
import AddInstructorBulkModal from './AddInstructorBulkModal'
import AddInstructorModal from './AddInstructorModal'
import GridTable from '../../../GridTable'
import HeaderActions from '../HeaderActions'
import { toast } from 'react-toastify'
import useModalState from '../../../../hooks/useModalState'
import reportFileIcon from '../../../../assets/images/studentlist.png'
import userReportIcon from '../../../../assets/images/userreport.png'
import useProxyLogin from '../../../../hooks/useProxyLogin'

const Instructors = ({
  programs,
  levels,
  periods,
  universities,
  levelDescriptions
}) => {
  const { handleProxyLogin } = useProxyLogin()

  const [modals, setModalState] = useModalState()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rowData, setRowData] = useState([])

  const fetchInstructors = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/users/instructors')
      const formattedData = data.instructors
        .filter((instructor) => instructor.User !== null)
        .map((instructor) => ({
          ...instructor,
          username: instructor.User?.name,
          email: instructor.User?.email,
          levels: instructor.User?.levels.length
            ? instructor.User?.levels.map((item) => item.name)
            : instructor.User?.levels,
          programs: instructor.User?.programs.map((item) => item.name) || [],
          students: instructor.students?.length,
          reports: instructor.User?.reports || 'N/A',
          status: instructor.User?.deactivated ? 'unactive' : 'active',
          actions: 'actions',
          universityId: instructor.universityId,
          universityName: instructor.University.universityName
        }))
      setRowData(formattedData)
    } catch (error) {
      toast.error('Something went wrong!')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [])
  const refreshInstructors = useCallback(() => {
    fetchInstructors()
  }, [fetchInstructors])

  useEffect(() => {
    fetchInstructors()
  }, [fetchInstructors])

  const columnDefs = useMemo(
    () => [
      {
        field: 'username',
        flex: 2,
        checkboxSelection: true,
        filter: ActiveInactiveFilter,
        cellRenderer: (params) => (
          <>
            <div className='pb-0 m-0 fw-medium' style={{ height: '14px' }}>
              {params.data?.username}
            </div>
            <small
              className='m-0 p-0'
              style={{ fontSize: '12px', color: 'grey' }}
            >
              {params.data?.email}
            </small>
          </>
        )
      },
      {
        field: 'levels',
        filter: LevelsFilter,
        cellRenderer: (params) => (
          <>
            {params.value?.length > 1 ? (
              <div className='d-flex align-items-center'>
                <SkillBox
                  color={
                    params.value[0] === 'LS'
                      ? 'green'
                      : params.value[0] === 'HS'
                      ? 'red'
                      : 'blue'
                  }
                  text={params?.value[0]}
                />
                <SkillBox
                  color={'blue'}
                  text={`+ ${params.value.length - 1}`}
                />
              </div>
            ) : (
              <div className=''>
                <SkillBox
                  color={
                    params.value[0] === 'LS'
                      ? 'green'
                      : params.value[0] === 'HS'
                      ? 'red'
                      : 'blue'
                  }
                  text={params?.value[0]}
                />
              </div>
            )}
          </>
        )
      },
      {
        headerName: 'Programs',
        field: 'programs',
        cellRenderer: (params) => (
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
              values={params.data?.programs.map((item) => item.name) || []}
            />
          </div>
        ),
        filter: ProgramsFilter
      },
      {
        field: 'students',
        cellRenderer: (params) => (
          <a
            href={`/my-school/learners/${params.data.id}`}
            className='d-flex align-items-center students__cell'
          >
            <p className='m-0 pe-2'> {params.data.students}</p>
            <img
              src={reportFileIcon}
              width={20}
              height={24}
              alt='report file'
            />
            {/* <FontAwesomeIcon icon={faFile} /> */}
          </a>
        )
      },
      {
        field: 'reports',
        cellRenderer: (params) => (
          <a
            href={`/my-school/reports/${params.data.id} `}
            className='reports_cell'
          >
            <img
              src={userReportIcon}
              width={22}
              height={22}
              alt='user report'
            />
            {/* <FontAwesomeIcon icon={faChalkboardTeacher} /> */}
          </a>
        )
      },
      {
        field: 'actions',
        flex: 4,
        cellRenderer: (params) => {
          let user = {
            ...params.data.University,
            ...params.data.User
          }
          return (
            <Actions
              user={user}
              universities={universities}
              levels={levels}
              programs={programs}
              instructors={rowData}
              handleViewStudent='editInstructorModal'
              onSuccess={refreshInstructors}
              handleProxyLogin={handleProxyLogin}
              levelDescriptions={levelDescriptions}
            />
          )
        }
      }
    ],
    [
      universities,
      levels,
      programs,
      rowData,
      refreshInstructors,
      handleProxyLogin,
      levelDescriptions
    ]
  )

  const handleSchoolFilterChange = (selectedOption) => {
    const selectedSchool = universities.find(
      (univ) => univ.id === selectedOption?.id
    )
    setSelectedSchoolFilter(selectedSchool)
  }

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
    <div className='' style={{ background: '#fff', borderRadius: '12px' }}>
      <HeaderActions
        universities={universities}
        levels={levels}
        firstDropdownProps={{
          title: 'Select school to view',
          options: universities?.map((university) => ({
            name: university.name,
            value: university.name,
            id: university.id
          })),
          hasResetOption: true,
          onChange: handleSchoolFilterChange
        }}
        lastDropdownProps={{
          title: 'Add Instructor',
          onClick: (newValue) => {
            newValue?.value === 'add-manualy'
              ? setModalState('showAddInstructorModal', true)
              : setModalState('showAddInstructorBulkModal', true)
          }
        }}
        handleSchoolFilterChange={handleSchoolFilterChange}
        setSearchQuery={setSearchQuery}
        rowData={rowData}
        setRowData={setRowData}
        setLoading={setLoading}
        selectedRows={selectedRows}
        periods={periods}
        programs={programs}
        onSuccess={refreshInstructors}
      />
      <GridTable
        searchQuery={searchQuery}
        selectedSchoolFilter={selectedSchoolFilter}
        setSelectedRows={setSelectedRows}
        columnDefs={columnDefs}
        filteredData={filteredData}
        loading={loading}
      />
      {modals.showAddInstructorModal && (
        <AddInstructorModal
          show={modals.showAddInstructorModal}
          onHide={() => setModalState('showAddInstructorModal', false)}
          universities={universities}
          programs={programs}
          levels={levels}
          mode='add'
          onSuccess={refreshInstructors}
        />
      )}
      <AddInstructorBulkModal
        show={modals.showAddInstructorBulkModal}
        onHide={() => setModalState('showAddInstructorBulkModal', false)}
        onSuccess={refreshInstructors}
      />
    </div>
  )
}

export default Instructors
