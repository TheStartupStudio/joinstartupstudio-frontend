import React, { useState, useEffect } from 'react'
import './studentsTable.css'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import createClass from 'create-react-class'
import { DeactivateDialogModal } from './deactivateDialogModal'
import { ConfirmationModal } from '../Modals/confirmationModal'
import searchIcon from '../../assets/images/search-icon.png'

export default function StudentsTable(props) {
  const [currentEditingStudent, setCurrentEditingStudent] = useState()
  const [tooglingActivationStudent, setTooglingActivationStudent] = useState()
  const [bulkDeactivatingStudents, setBulkDeactivatingStudents] = useState([])
  const [students, setStudents] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(['level', 'year'])
  const [selectedRows, setSelectedRows] = useState([])
  const [showToggleActivationModal, setShowToggleActivationModal] =
    useState(false)
  const [showBulkDeactivationModal, setShowBulkDeactivationModal] =
    useState(false)
  const [deactivateLoading, setDeactivateLoading] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showStudentsOption, setShowStudentsOption] = useState('all')
  const [searchingKeyword, setSearchingKeyword] = useState('')

  const filteringCondition = (student) => {
    return student?.name?.includes(searchingKeyword)
  }

  useEffect(() => {
    getStudents()
  }, [])

  useEffect(() => {
    setSelectedRows([])
  }, [showStudentsOption])

  const tableData = () => {
    if (!isSearching) {
      if (showStudentsOption === 'all') return students
      if (showStudentsOption === 'active')
        return students.filter((student) => !student.deactivated)
      else return students.filter((student) => student.deactivated)
    } else {
      if (showStudentsOption === 'all')
        return students.filter((student) => filteringCondition(student))
      if (showStudentsOption === 'active')
        return students.filter(
          (student) => !student.deactivated && filteringCondition(student)
        )
      else
        return students.filter(
          (student) => student.deactivated && filteringCondition(student)
        )
    }
  }

  const getStudents = async () => {
    await axiosInstance
      .get('/instructor/my-students')
      .then((res) => {
        if (res.data.students.length) {
          setStudents(res.data.students)
        }
      })
      .catch((e) => e)
  }

  const updateSelectedOptions = (data) => {
    if (selectedOptions.includes(data.value)) {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== data.value)
      )
    } else {
      setSelectedOptions([...selectedOptions, data.value])
    }
  }

  const dropDownStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: 'none',
      border: '1px solid #BBBDBF',
      borderRadius: '0',
      height: 15,
      fontSize: '16px',
      cursor: 'pointer',
      color: '#707070',
      fontWeight: '500',
      ':hover': {
        border: '1px solid #BBBDBF'
      }
    }),
    menu: (base) => ({
      ...base,
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      margin: 0,
      paddingTop: 0,
      boxShadow: '0px 3px 6px #00000029'
    }),
    valueContainer: (base) => ({
      ...base
    }),
    option: (styles, state) => ({
      ...styles,
      cursor: 'pointer',
      fontWeight: 600,
      color: '231F20',
      fontSize: '14px',
      paddingTop: '2px',
      paddingBottom: '2px',
      ':hover': {
        backgroundColor: 'white',
        background: 'white'
      },
      backgroundColor: 'white',
      textTransform: 'uppercase'
    })
  }

  const Option = createClass({
    render() {
      return (
        <div>
          <components.Option {...this.props}>
            <div
              className='d-flex align-items-center'
              onClick={() => updateSelectedOptions(this.props.data)}
            >
              <input
                style={{ cursor: 'pointer', borderRadius: '0' }}
                type='checkbox'
                checked={selectedOptions.includes(this.props.data.value)}
                onChange={(e) => e}
              />{' '}
              <label
                style={{ cursor: 'pointer', paddingTop: '2px' }}
                className='my-auto ms-2'
              >
                {this.props.value}{' '}
              </label>
            </div>
          </components.Option>
        </div>
      )
    }
  })

  const MultiValue = (props) => {
    return (
      <components.MultiValue {...props}>
        <span>{props.data.label}</span>
      </components.MultiValue>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setCurrentEditingStudent((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(
        `/instructor/update-student/${currentEditingStudent.id}`,
        currentEditingStudent
      )
      .then(({ data }) => {
        setStudents(
          students.map((student) => (student.id === data.id ? data : student))
        )
        toast.success('Student updated!')
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
    setLoading(false)
    setCurrentEditingStudent()
  }

  const defaultLevels = [
    { label: 'L1 (ES)', value: 'ES' },
    { label: 'L2 (MS)', value: 'MS' },
    { label: 'L3 (HS)', value: 'HS' },
    { label: 'L4', value: 'L4' }
  ]

  const defaultYears = [
    { label: 'LTS YEAR 1', value: 'L1' },
    { label: 'LTS YEAR 2', value: 'L2' },
    { label: 'LTS YEAR 3', value: 'L3' },
    { label: 'LTS YEAR 4', value: 'L4' }
  ]

  const customStyles = {
    rows: {
      style: {
        minHeight: '100px' // override the row height
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px'
      }
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
        color: '#231F20'
      }
    }
  }

  const handleSingleActivationToggle = async () => {
    setDeactivateLoading(true)
    await axiosInstance
      .put(`/instructor/update-student/${tooglingActivationStudent.data.id}`, {
        deactivated: !tooglingActivationStudent.data.deactivated
      })
      .then(({ data }) => {
        if (data) {
          setShowConfirmationModal(true)
          setStudents(
            students.map((student) => (student.id === data.id ? data : student))
          )
        } else {
          toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        }
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
    setDeactivateLoading(false)
    setShowToggleActivationModal(false)
  }

  const handleBulkDeactiveAction = () => {
    if (!selectedRows) return

    setCurrentEditingStudent()
    setTooglingActivationStudent()

    setBulkDeactivatingStudents(selectedRows)
    setShowBulkDeactivationModal(true)
  }

  const bulkDeactivateStudents = async () => {
    setDeactivateLoading(true)
    const studentsData = bulkDeactivatingStudents.map((student) => {
      return student.id
    })
    await axiosInstance
      .post(`/instructor/bulk-update/`, {
        studentsData,
        bulkDeactivate: true
      })
      .then((data) => {
        setShowConfirmationModal(true)
        setStudents(
          students.map((student) => {
            console.log(
              'studentsData.includes(student.id) :>> ',
              studentsData.includes(student.id)
            )
            if (studentsData.includes(student.id)) {
              student.deactivated = true
            }
            return student
          })
        )
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
    setDeactivateLoading(false)
    setShowBulkDeactivationModal(false)
  }

  const noDataComponent = () => {
    return (
      <div className='no-data-component text-center'>
        You don't have any students yet. <br /> Use the blue link above to
        upload your rosters.
      </div>
    )
  }

  const handleBulkEditAction = () => {}

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
            <div className='d-flex flex-column my-auto justify-content-center w-100'>
              {currentEditingStudent?.id !== record.id ? (
                <>
                  <p
                    className='mb-1'
                    style={{ color: '#231F20!important', fontWeight: '500' }}
                  >
                    {record.name}
                  </p>
                  <div className='d-flex'>
                    <span
                      role='button'
                      onClick={() => {
                        setCurrentEditingStudent(record)
                      }}
                    >
                      Quick Edit User
                    </span>
                    <span className='mx-2'>|</span>
                    {!record.deactivated ? (
                      <span
                        role='button'
                        onClick={() => {
                          setTooglingActivationStudent({
                            data: record,
                            action_type: 'deactivate'
                          })
                          setShowToggleActivationModal(true)
                        }}
                      >
                        Deactivate User
                      </span>
                    ) : (
                      <span
                        role='button'
                        onClick={() => {
                          setTooglingActivationStudent({
                            data: record,
                            action_type: 'activate'
                          })
                          setShowToggleActivationModal(true)
                        }}
                      >
                        Activate User
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className='d-flex flex-column justify-content-start'>
                  <input
                    type='text'
                    className='w-75 px-2 py-1'
                    style={{ border: '1px solid #BBBDBF', height: '35px' }}
                    name='name'
                    value={currentEditingStudent.name}
                    onChange={handleChange}
                  />
                  <button
                    className='edit-btn m-0 mt-1 p-0'
                    onClick={() => setCurrentEditingStudent()}
                  >
                    Cancel
                  </button>
                </div>
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
              <div className='w-50'>
                {currentEditingStudent?.id === record.id ? (
                  <Select
                    options={defaultLevels}
                    value={{
                      label: currentEditingStudent.level,
                      value: currentEditingStudent.level
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'level', value: newValue.value }
                      })
                    }
                    className='my-auto py-auto'
                    // styles={customStyles}
                  />
                ) : (
                  <p className='my-auto'>{record.level} </p>
                )}
              </div>
            </>
          )
        }
      },
      {
        name: 'Year',
        key: 'year',
        selector: (row) => (row.year ? row.year : 'NONE'),
        sortable: true,
        omit: !selectedOptions.includes('year'),

        cell: (record) => {
          return (
            <>
              <div className='w-50'>
                {currentEditingStudent?.id === record.id ? (
                  <Select
                    options={defaultYears}
                    value={{
                      label: currentEditingStudent.year,
                      value: currentEditingStudent.year
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'year', value: newValue.value }
                      })
                    }
                    className='my-auto py-auto'
                    // styles={customStyles}
                  />
                ) : (
                  <p className='my-auto'>
                    {record.year ? record.year : 'None'}{' '}
                  </p>
                )}
              </div>
            </>
          )
        }
      },
      {
        name: 'School',
        key: 'school',
        selector: (row) => 'FFFFF',
        sortable: true,
        omit: !selectedOptions.includes('school')
      },
      {
        key: 'action',
        className: 'action',
        sortable: false,
        cell: (record) => {
          return (
            <>
              <div className='d-flex justify-content-end w-100 text-end me-3'>
                <div
                  className='d-flex text-center flex-column'
                  style={{ width: '95px' }}
                >
                  <span
                    role='button'
                    className='my-1 fw-bold'
                    onClick={() => {
                      // onEdit(record);
                    }}
                    style={{ color: '#51C7DF' }}
                  >
                    View
                  </span>
                  {currentEditingStudent?.id === record.id && (
                    <>
                      <button
                        className='edit-btn my-1 fw-bold ms-auto'
                        onClick={() => {
                          handleSubmit()
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
    [currentEditingStudent, loading, selectedOptions, students]
  )

  const handleSearch = (keyword) => {
    if (keyword.length > 2) {
      setIsSearching(true)
      setSearchingKeyword(keyword)
    } else {
      setSearchingKeyword('')
      setIsSearching(false)
    }
  }

  return (
    <>
      <>
        <div className='row'>
          <div className='col-12'>
            <div className='row'>
              <div className='col-6'>
                <div className='d-flex flex-row switch_students_options align-items-end h-100'>
                  <div
                    className={`${
                      showStudentsOption !== 'all' ? 'not_active' : ''
                    }`}
                    onClick={() => setShowStudentsOption('all')}
                  >
                    <p>
                      ALL
                      <span style={{ color: '#333d3d83' }}>
                        (
                        {!isSearching
                          ? students.length
                          : students.filter((student) =>
                              filteringCondition(student)
                            ).length}
                        )
                      </span>
                    </p>
                  </div>
                  <div className='div mx-1'>|</div>
                  <div
                    className={`${
                      showStudentsOption !== 'active' ? 'not_active' : ''
                    }`}
                    onClick={() => setShowStudentsOption('active')}
                  >
                    <p>
                      ACTIVE
                      <span style={{ color: '#333d3d83' }}>
                        (
                        {!isSearching
                          ? students.filter((student) => !student.deactivated)
                              .length
                          : students.filter(
                              (student) =>
                                !student.deactivated &&
                                filteringCondition(student)
                            ).length}
                        )
                      </span>
                    </p>
                  </div>
                  <div className='div mx-1'>|</div>
                  <div
                    className={`${
                      showStudentsOption !== 'inactive' ? 'not_active' : ''
                    }`}
                    onClick={() => setShowStudentsOption('inactive')}
                  >
                    <p>
                      INACTIVE
                      <span style={{ color: '#333d3d83' }}>
                        (
                        {!isSearching
                          ? students.filter((student) => student.deactivated)
                              .length
                          : students.filter(
                              (student) =>
                                student.deactivated &&
                                filteringCondition(student)
                            ).length}
                        )
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12'>
            <div className='row justify-content-between'>
              <div className='col-12 col-md-5 mt-2'>
                <div className='connections-search' style={{ height: '48px' }}>
                  <div className='input-group h-100'>
                    <div className='input-group-prepend my-auto'>
                      <button
                        className='btn btn-outline-secondary my-2 ms-2'
                        type='button'
                        id='button-addon1'
                      >
                        <img src={searchIcon} alt='#' width='90%' />
                      </button>
                    </div>

                    <input
                      type='text'
                      className='form-control'
                      name='searchedNote'
                      placeholder={'SEARCH USERS'}
                      aria-describedby='button-addon1'
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className='col-12 col-md-7'>
                <div className='row h-100 me-0 align-items-end justify-content-end'>
                  <div className='col-12 col-sm-6 col-xxl-5 mt-2 pe-0'>
                    <Select
                      options={[
                        { label: 'edit', value: 'edit' },
                        { label: 'deactivate', value: 'deactivate' }
                      ]}
                      value={'Bulk Actions'}
                      placeholder={'Bulk Actions'}
                      onChange={(newValue) =>
                        newValue.value === 'edit'
                          ? handleBulkEditAction()
                          : handleBulkDeactiveAction()
                      }
                      className='mb-0 me-0 custom-dropdown'
                      styles={dropDownStyles}
                      autoFocus={false}
                      isSearchable={false}
                    />
                  </div>
                  <div className='col-12 col-sm-6 col-xxl-5 mt-2 me-0 pe-0'>
                    <Select
                      options={[
                        { label: 'level', value: 'level' },
                        { label: 'year', value: 'year' },
                        { label: 'school', value: 'school' }
                      ]}
                      placeholder={'Show Columns'}
                      // value={'Show Columns'}
                      // onChange={
                      //   // (newValue) =>
                      //   // handleChange({
                      //   //   target: { name: 'level', value: newValue.value }
                      //   // })
                      // }
                      defaultValue={[
                        { label: 'level', value: 'level' },
                        { label: 'year', value: 'year' }
                      ]}
                      value={null}
                      className='mb-0 custom-dropdown'
                      style={{ width: '200px', maxWidth: '200px' }}
                      styles={dropDownStyles}
                      autoFocus={false}
                      isSearchable={false}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      components={{ Option, MultiValue }}
                      hideSelectedOptions={false}
                      isClearable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          title='Employees'
          columns={tableColumns}
          data={tableData()}
          pagination
          selectableRows
          onSelectedRowsChange={(rows) => setSelectedRows(rows.selectedRows)}
          striped
          selectableRowsNoSelectAll
          customStyles={customStyles}
          noHeader
          noDataComponent={noDataComponent()}
        />
      </>

      {showBulkDeactivationModal && (
        <DeactivateDialogModal
          show={showBulkDeactivationModal}
          onHide={() => {
            setShowBulkDeactivationModal(false)
            setBulkDeactivatingStudents([])
          }}
          deactivateLoading={deactivateLoading}
          handleAction={() => {
            bulkDeactivateStudents()
          }}
        />
      )}

      {bulkDeactivatingStudents && (
        <>
          <ConfirmationModal
            show={showConfirmationModal}
            onHide={() => {
              setShowConfirmationModal(false)
              setBulkDeactivatingStudents([])
            }}
            message={'Student(s) deactivated.'}
          />
        </>
      )}

      {showToggleActivationModal && (
        <DeactivateDialogModal
          show={showToggleActivationModal}
          onHide={() => {
            setShowToggleActivationModal(false)
            setTooglingActivationStudent()
          }}
          deactivateLoading={deactivateLoading}
          handleAction={() => {
            handleSingleActivationToggle()
          }}
          action_type={
            tooglingActivationStudent && tooglingActivationStudent.action_type
          }
        />
      )}

      {tooglingActivationStudent &&
        tooglingActivationStudent.action_type === 'deactivate' && (
          <>
            <ConfirmationModal
              show={showConfirmationModal}
              onHide={() => {
                setShowConfirmationModal(false)
                setTooglingActivationStudent()
              }}
              message={'Student(s) deactivated.'}
            />
          </>
        )}

      {tooglingActivationStudent &&
        tooglingActivationStudent.action_type === 'activate' && (
          <>
            <ConfirmationModal
              show={showConfirmationModal}
              onHide={() => {
                setShowConfirmationModal(false)
                setTooglingActivationStudent()
              }}
              message={'Student(s) activated.'}
            />
          </>
        )}
    </>
  )
}
