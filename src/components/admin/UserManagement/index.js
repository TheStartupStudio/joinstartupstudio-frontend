import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import TableHead from './TableHead'
import './style.css'
import axiosInstance from '../../../utils/AxiosInstance'
import Select from 'react-select'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import AddSchool from './addSchool'
import { EditSchoolForm, customStyles, noDataComponent } from './TableItems'

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
    year: ['ES1', 'ES2', 'ES3']
  },
  {
    name: 'level',
    value: 'HS',
    label: 'HS',
    year: ['LTS1', 'LTS2', 'LTS3', 'LTS4']
  },
  { name: 'level', value: 'HE', label: 'HE' }
]

const UserManagementComponent = () => {
  const [addSchoolModal, setAddSchoolModal] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schools, setSchools] = useState([])
  const [currentEditingSchool, setCurrentEditingSchool] = useState()
  const [showSchoolsOption, setShowSchoolsOption] = useState('all')
  const [searchingKeyword, setSearchingKeyword] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([
    'level',
    'teachers',
    'code'
  ])

  const filteringCondition = (school) => {
    return school?.name
      ?.toLocaleLowerCase()
      .includes(searchingKeyword?.toLocaleLowerCase())
  }

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        await axiosInstance
          .get('/university')
          .then(({ data }) => setSchools(data))
      } catch (error) {
        console.log('error', error)
      }
    }

    fetchUniversities()
  }, [])

  const tableData = () => {
    if (!isSearching) {
      if (showSchoolsOption === 'all') return schools
      if (showSchoolsOption === 'active')
        return schools?.filter((school) => !school.deactivated)
      else return schools?.filter((school) => school.deactivated)
    } else {
      if (showSchoolsOption === 'all')
        return schools?.filter((school) => filteringCondition(school))
      if (showSchoolsOption === 'active')
        return schools?.filter(
          (school) => !school.deactivated && filteringCondition(school)
        )
      else
        return schools?.filter(
          (school) => school.deactivated && filteringCondition(school)
        )
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'level') {
      setCurrentEditingSchool((prevValues) => ({
        ...prevValues,
        [name]: value,
        period_id: null,
        year: ''
      }))
    } else {
      setCurrentEditingSchool((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    }
  }

  const tableColumns = React.useMemo(
    () => [
      {
        name: 'Name',
        key: 'name',
        show: true,
        selector: (row) => row.name,
        sortable: true,
        width: '300px',
        cell: (record) => (
          <>
            <div className="d-flex flex-column my-auto justify-content-center w-100">
              {currentEditingSchool?.id !== record.id ? (
                <>
                  <p
                    className="mb-1"
                    style={{ color: '#231F20!important', fontWeight: '500' }}
                  >
                    {record.name}
                  </p>
                  <div className="d-flex">
                    <span
                      role="button"
                      onClick={() => {
                        setCurrentEditingSchool(record)
                        // updateOptions(record.level)
                      }}
                    >
                      Quick Edit School
                    </span>
                  </div>
                </>
              ) : (
                <EditSchoolForm
                  currentEditingSchool={currentEditingSchool}
                  setCurrentEditingSchool={setCurrentEditingSchool}
                  handleChange={handleChange}
                  editSingleSchool={editSingleSchool}
                  loading={loading}
                />
              )}
            </div>
          </>
        )
      },
      {
        name: 'Level',
        key: 'level',
        show: false,
        hidden: true,
        selector: (row) => row.level,
        sortable: true,
        omit: !selectedOptions.includes('level'),
        cell: (record) => {
          return (
            <>
              <div className="table-edit-dropdown">
                {currentEditingSchool?.id === record.id ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    options={defaultData}
                    value={{
                      label: currentEditingSchool?.level,
                      value: currentEditingSchool?.level
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'level', value: newValue.value }
                      })
                    }
                    className="my-auto py-auto"
                  />
                ) : (
                  <p className="my-auto">{record.level} </p>
                )}
              </div>
            </>
          )
        }
      },
      {
        name: 'Teachers',
        key: 'teachers',
        selector: (row) => row.teachers,
        omit: !selectedOptions.includes('teachers'),
        sortable: false,
        cell: (row) => (
          <div>
            {row.teachers.map((teacher) => (
              <div key={teacher?.id}>
                <a
                  href={`/instructor-data/${teacher?.User?.id}`}
                  // style={{ color: '#231F20' }}
                  className="teachers_name"
                >
                  {teacher.User?.name}
                </a>
              </div>
            ))}
          </div>
        )
      },
      {
        name: 'Code',
        key: 'code',
        selector: (row) => row.code,
        omit: !selectedOptions.includes('code'),
        sortable: true
      },
      {
        name: 'Domain',
        key: 'domain',
        selector: (row) => row.domain,
        omit: !selectedOptions.includes('domain'),
        sortable: true
      },
      {
        key: 'action',
        className: 'action',
        sortable: false,
        cell: (record) => {
          return (
            <>
              <div className="d-flex justify-content-end w-100 text-end me-3">
                <div
                  className="d-flex text-center flex-column"
                  style={{ width: '95px' }}
                >
                  {currentEditingSchool?.id === record.id && (
                    <>
                      <button
                        className="edit-btn my-1 fw-bold ms-auto"
                        onClick={() => {
                          editSingleSchool()
                        }}
                        disabled={loading}
                        style={{ background: '#01c5d1' }}
                      >
                        {loading ? 'SAVING...' : 'SAVE'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )
        }
      }
    ],
    [selectedOptions, currentEditingSchool, handleChange, loading]
  )

  const editSingleSchool = async () => {
    setLoading(true)
    await axiosInstance
      .patch(`/university/${currentEditingSchool.id}`, currentEditingSchool)
      .then(({ data }) => {
        setSchools(
          schools?.map((school) => (school.id === data.id ? data : school))
        )
        toast.success('School updated!')
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
    setLoading(false)
    setCurrentEditingSchool()
  }

  return (
    <div>
      <TableHead
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        searchingKeyword={searchingKeyword}
        setSearchingKeyword={setSearchingKeyword}
        schools={schools}
        filteringCondition={filteringCondition}
        setAddSchoolModal={setAddSchoolModal}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        showSchoolsOption={showSchoolsOption}
        setShowSchoolsOption={setShowSchoolsOption}
      />
      <DataTable
        title="Employees"
        columns={tableColumns}
        data={tableData()}
        pagination
        selectableRows
        striped
        selectableRowsNoSelectAll
        customStyles={customStyles}
        noHeader
        noDataComponent={noDataComponent(isSearching)}
      />
      {addSchoolModal && (
        <AddSchool
          show={addSchoolModal}
          onHide={() => setAddSchoolModal(false)}
          mode="add"
        />
      )}
    </div>
  )
}

export default UserManagementComponent
