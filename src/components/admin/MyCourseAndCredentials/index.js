import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import {
  Actions,
  ActiveInactiveFilter,
  AwardTypeFilter,
  CustomSelectCellEditor,
  ProgramsFilter,
  TransferFilter
} from './AgGridItems'
import { SkillBox } from '../MySchool/ContentItems'
import { useParams, useHistory } from 'react-router-dom'

import HeaderActions from './HeaderActions'
import AddCourseandCredentialModal from './AddCourseandCredentialModal'
import DeleteModal from './DeleteImmersionModal'
import GridTable from '../../GridTable'

const MyCourseAndCredentials = ({
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

  const [immersionStep, setImmersionStep] = useState()
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState(null)
  const [selectedRows, setSelectedRows] = useState([]) // State to track selected rows
  const [rowData, setRowData] = useState([])
  const { instructorId } = useParams()
  const [viewExprience, setViewExprience] = useState()
  const [viewDeleteModal, setViewDeleteModal] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteImmersion, setDeleteImmersion] = useState(null)
  const history = useHistory()

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
    let url = '/coursesandcredentials/get-courses-credentials'

    try {
      axiosInstance.get(url).then(({ data }) => {
        const formattedData = data.map((courseandcredential) => ({
          ...courseandcredential,
          status: courseandcredential.status ? 'active' : 'unactive'
        }))
        setRowData(formattedData)
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
    }
  }, [])

  // Fetch immersions when the component mounts
  useEffect(() => {
    fetchImmersions()
  }, [fetchImmersions])

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(
        `coursesandcredentials/remove-courses-credentials/${deleteImmersion.id}`
      )
      setShowDeleteModal(false) // Close the modal after deletion
      fetchImmersions() // Re-fetch immersions
    } catch (error) {
      console.error('Error deleting Immersion:', error)
    }
  }

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: 'COURSE NAME',
        field: 'name_course_credential',
        flex: 2,
        checkboxSelection: true // Enable checkbox selection in this column
      },
      {
        headerName: 'AWARD TYPE',
        field: 'type_award',
        filter: AwardTypeFilter, // Attach the custom filter component
        cellRenderer: (params) => {
          return <div>{params.data.type_award}</div>
        }
      },
      {
        field: 'PROVIDER',

        cellRenderer: (params) => {
          return (
            <div className=''>
              {params.data.name_course_credential_provider}
            </div>
          )
        }
      },

      {
        headerName: 'DESCRIPTION',
        field: 'course_credential_description',
        flex: 3,
        cellRenderer: (params) => {
          return (
            <div
              className='pb-0 m-0'
              style={{ height: '14px', fontWeight: '500' }}
            >
              {params.data.course_credential_description}
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
            setViewDeleteModal={() => setViewDeleteModal(immersion)}
            setShowDeleteModal={setShowDeleteModal}
            setDeleteImmersion={() => setDeleteImmersion(immersion)}
            immersion={immersion}
            onSuccess={fetchImmersions} // Pass fetchImmersions function to refresh data after an action
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
    fetchImmersions
  ])

  const filterData = useCallback((data, searchQuery, selectedSchoolFilter) => {
    return data?.filter((item) => {
      const matchesSearchQuery =
        searchQuery === '' ||
        item.name_course_credential
          .toLowerCase()
          .includes(searchQuery.toLowerCase())

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

  const handleCloseModal = () => {
    setImmersionStep(null) // Close the add immersion modal
    setViewExprience(null) // Close the view/edit immersion modal
  }

  return (
    <div style={{ background: '#fff' }}>
      {viewDeleteModal ||
        (showDeleteModal && (
          <DeleteModal
            onClose={() => setShowDeleteModal(false)} // Close the modal
            onDelete={() => handleConfirmDelete(viewExprience)} // Confirm deletion
            title='Delete Immersion Experience'
            message='Are you sure you want to delete this item?'
          />
        ))}
      <HeaderActions
        usedIn={usedIn || 'student'}
        tableTitle={tableTitle}
        lastDropdownProps={{
          title: 'Add Course or Credential +',
          onClick: (newValue) => {
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
        onSuccess={fetchImmersions} // Add this line to refresh data after actions
      />
      <GridTable
        searchQuery={searchQuery}
        selectedSchoolFilter={selectedSchoolFilter}
        setSelectedRows={setSelectedRows}
        columnDefs={columnDefs}
        filteredData={filteredData}
        loading={loading}
      />

      {immersionStep && (
        <AddCourseandCredentialModal
          onClose={handleCloseModal}
          immersionStep={immersionStep}
          onSuccess={fetchImmersions} // Pass fetchImmersions to refresh data
        />
      )}

      {console.log(viewExprience, 'viewExprience')}
      {viewExprience && (
        <AddCourseandCredentialModal
          viewExprience={viewExprience}
          onClose={handleCloseModal}
          immersionStep={immersionStep}
          onSuccess={fetchImmersions} // Pass fetchImmersions to refresh data
        />
      )}
    </div>
  )
}

export default MyCourseAndCredentials
