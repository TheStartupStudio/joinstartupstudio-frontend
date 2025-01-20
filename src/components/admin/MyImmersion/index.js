import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import {
  Actions,
  ActiveInactiveFilter,
  CustomSelectCellEditor,
  ProgramsFilter,
  TransferFilter,
  StepFilter
} from './AgGridItems'
import { SkillBox } from '../MySchool/ContentItems'
import { useParams, useHistory } from 'react-router-dom'

import HeaderActions from './HeaderActions'
import AddImmersionModal from './AddImmersionModal'
import DeleteModal from './DeleteImmersionModal'
import GridTable from '../../GridTable'

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
    let url = '/immersion/immersionsAll'

    try {
      axiosInstance.get(url).then(({ data }) => {
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

  // Fetch immersions when the component mounts
  useEffect(() => {
    fetchImmersions()
  }, [fetchImmersions])

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(
        `/immersion/immersionsAll/${deleteImmersion.id}`
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
        headerName: 'Company Name',
        field: 'company_name',
        flex: 2,
        checkboxSelection: true // Enable checkbox selection in this column
      },
      {
        field: 'status',
        filter: ActiveInactiveFilter,
        sortable: false,
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
        flex: 1,
        sortable: false,
        filter: StepFilter,
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
        headerName: 'INDUSTRY',
        field: 'industry',
        sortable: false,
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
        field: 'company_description',
        sortable: false,
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
      sortable: false,
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
            message='Are you sure you want to delete this experience?'
          />
        ))}
      <HeaderActions
        usedIn={usedIn || 'student'}
        tableTitle={tableTitle}
        lastDropdownProps={{
          title: 'Add Immersion Opportunity',
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
        <AddImmersionModal
          onClose={handleCloseModal}
          immersionStep={immersionStep}
          onSuccess={fetchImmersions} // Pass fetchImmersions to refresh data
        />
      )}
      {viewExprience && (
        <AddImmersionModal
          viewExprience={viewExprience}
          onClose={handleCloseModal}
          immersionStep={immersionStep}
          onSuccess={fetchImmersions} // Pass fetchImmersions to refresh data
        />
      )}
    </div>
  )
}

export default MyImmersion
