import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
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
import EditBulk from '../../components/MyStudents/AddStudentsModal/editBulk'
import AddStudentsModal from '../../components/MyStudents/AddStudentsModal/addStudentsModal'
import { StudentCountContext } from '../../components/MyStudents/studentCountContext'
import EditStudentModal from '../MyStudents/AddStudentsModal/EditStudentModal'
import StudentsTransferModal from '../../components/MyStudents/studentsTransferModal'
import Certification1Badge from '../../assets/images/market-ready-1-badge.png'
import Certification2Badge from '../../assets/images/market-ready-2-badge.png'
import { useDispatch, useSelector } from 'react-redux'
import { getPeriodsStart } from '../../redux/dashboard/Actions'
import { NextYearModal } from './nextYearModal'
import { C } from '@fullcalendar/core/internal-common'

export default function StudentsTable(props) {
  const dispatchRedux = useDispatch()
  const [currentEditingStudent, setCurrentEditingStudent] = useState()
  const [tooglingActivationStudent, setTooglingActivationStudent] = useState()
  const [bulkDeactivatingStudents, setBulkDeactivatingStudents] = useState([])
  const periods = useSelector((state) => state.dashboard.periods)
  const [bulkEditingStudents, setBulkEditingStudents] = useState([])
  const [bulkNextYearStudents, setBulkNextYearStudents] = useState([])
  const [students, setStudents] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(['level', 'year'])
  const [selectedRows, setSelectedRows] = useState([])
  const [showToggleActivationModal, setShowToggleActivationModal] =
    useState(false)
  const [showBulkDeactivationModal, setShowBulkDeactivationModal] =
    useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [showBulkNextYearModal, setShowBulkNextYearModal] = useState(false)
  const [deactivateLoading, setDeactivateLoading] = useState(false)
  const [nextYearLoading, setNextYearLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showStudentsOption, setShowStudentsOption] = useState('all')
  const [searchingKeyword, setSearchingKeyword] = useState('')
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false)
  const [setSchool, school] = useState(false)
  const [universities, setUniversities] = useState([])
  const { state, dispatch } = useContext(StudentCountContext)
  const [instructors, setInstructors] = useState()
  const [openEditUserModal, setOpenEditUserModal] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState({})
  const [showStudentsTransferModal, setShowStudentsTransferModal] =
    useState(false)
  const [sentTransferRequests, setSentTransferRequests] = useState([])
  const [receivedTransferRequests, setReceivedTransferRequests] = useState([])
  const [receivedTransfersCount, setReceivedTransfersCount] = useState(0)
  const [yearOptions, setYearOptions] = useState([])
  const [periodOptions, setPeriodOptions] = useState([])
  const [nextYearOptions, setNextYearOptions] = useState([])

  const filteringCondition = (student) => {
    return student?.name
      ?.toLocaleLowerCase()
      .includes(searchingKeyword?.toLocaleLowerCase())
  }

  useEffect(() => {
    getStudents()
    getTransferedStudents()
    dispatchRedux(getPeriodsStart())
  }, [])

  useEffect(() => {
    if (students?.length) {
      dispatch({ type: 'studentsCount', studentsCount: students?.length })
      var today = moment().startOf('day')

      const count = students?.filter((student) => {
        var createdDate = moment(student.createdAt, 'YYYY-MM-DD').startOf('day')
        var diff = today.diff(createdDate, 'days')

        if (diff <= 7) {
          return true
        }

        return false
      }).length

      dispatch({ type: 'recentlyActive', recentlyActive: count })
    }
  }, [students?.length])

  useEffect(() => {
    setReceivedTransfersCount(
      receivedTransferRequests.filter(
        (transfer) => transfer.status === 'pending'
      ).length
    )
  }, [receivedTransferRequests])

  useEffect(() => {
    setSelectedRows([])
  }, [showStudentsOption])

  const tableData = () => {
    if (!isSearching) {
      if (showStudentsOption === 'all') return students
      if (showStudentsOption === 'active')
        return students?.filter((student) => !student.deactivated)
      else return students?.filter((student) => student.deactivated)
    } else {
      if (showStudentsOption === 'all')
        return students?.filter((student) => filteringCondition(student))
      if (showStudentsOption === 'active')
        return students?.filter(
          (student) => !student.deactivated && filteringCondition(student)
        )
      else
        return students?.filter(
          (student) => student.deactivated && filteringCondition(student)
        )
    }
  }

  const getStudents = async () => {
    await axiosInstance
      .get('/instructor/my-students')
      .then((res) => {
        debugger
        if (res.data.students?.length) {
          let newArrray = []
          res.data.instructorsnew.map((instructor) => {
            newArrray.push({
              value: instructor.instructorInfo.id,
              label: instructor.name
            })
          })

          setUniversities(res.data?.schools)
          setInstructors(newArrray)
          setStudents(res.data.students)
          setSchool(res.data.universityName)
        }
      })
      .catch((e) => e)
  }

  const deleteSingleSentTransfer = (id) => {
    setSentTransferRequests((sentTransferRequests) =>
      sentTransferRequests.map((transfer) => {
        if (transfer.id === id) {
          transfer.status = 'canceled'
          transfer.updatedAt = Date.now()
        }
        return transfer
      })
    )

    setStudents((students) =>
      students.map((student) => {
        if (
          student?.transferHistory &&
          student?.transferHistory[0]?.id === id
        ) {
          delete student.transferHistory[0]
        }
        return student
      })
    )
  }

  const handleBulkSentDelete = (status) => {
    if (status === 'pending') {
      setSentTransferRequests((sentTransferRequests) =>
        sentTransferRequests.filter(
          (transfer) =>
            transfer.status !== 'pending' && transfer.status !== 'canceled'
        )
      )

      setStudents((students) =>
        students.map((student) => {
          if (
            student?.transferHistory &&
            student?.transferHistory[0]?.status === 'pending'
          ) {
            delete student.transferHistory[0]
          }
          return student
        })
      )
    }

    if (status === 'approved') {
      setSentTransferRequests((sentTransferRequests) =>
        sentTransferRequests.filter(
          (transfer) => transfer.status !== 'approved'
        )
      )
    }
  }

  const handleBulkReceivedUpdate = (status) => {
    setReceivedTransferRequests((receivedTransferRequest) =>
      receivedTransferRequest.map((transfer) => {
        if (transfer.status === 'pending') transfer.status = status
        transfer.updatedAt = Date.now()
        return transfer
      })
    )

    if (status === 'denied') {
      toast.success('Students transfer denied!')
    }

    if (status === 'approved') {
      getStudents()
      toast.success('Students transfer accepted!')
    }
  }

  const respondSingleReceivedTransfer = (id, status, student) => {
    setReceivedTransferRequests((sentTransferRequests) =>
      sentTransferRequests.map((transfer) => {
        if (transfer.id === id) {
          transfer.status = status
        }
        transfer.updatedAt = Date.now()
        return transfer
      })
    )

    if (status === 'approved') {
      setStudents((students) => {
        return [student, ...students]
      })
    }
  }

  const addNewTransferRequest = (transfer) => {
    setStudents((students) =>
      students.map((student) => {
        if (student.id === transfer.userId) {
          student.transferHistory[0] = transfer
        }
        return student
      })
    )
    setSentTransferRequests((sentTransferRequests) => [
      transfer,
      ...sentTransferRequests
    ])
  }

  const getTransferedStudents = async () => {
    axiosInstance
      .get('/instructor/transfers/sent-requests')
      .then((res) => {
        setSentTransferRequests(res.data)
      })
      .catch((e) => e)
    axiosInstance
      .get('/instructor/transfers/received-requests')
      .then((res) => {
        setReceivedTransferRequests(res.data)
      })
      .catch((e) => e)
  }

  const updateState = (id, data) => {
    const studentsFiltered = students
      .filter((student) => {
        if (student.id != data.id) {
          return student
        } else {
          if (data.instructor_id == data.Instructor.id) {
            return student
          }
        }
      })
      .map((student, index) => {
        if (student.id == id) {
          return data
        }
        return student
      })

    setStudents(studentsFiltered)
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
      fontSize: '14px',
      cursor: 'pointer',
      color: '#707070',
      fontWeight: '500',

      ':hover': {
        border: '1px solid #BBBDBF'
      },
      zIndex: 100
    }),
    menu: (base) => ({
      ...base,
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      // width: '150%',
      margin: 0,
      paddingTop: 0,
      boxShadow: '0px 3px 6px #00000029',
      zIndex: 9999
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
              className="d-flex align-items-center"
              onClick={() => updateSelectedOptions(this.props.data)}
            >
              <input
                style={{ cursor: 'pointer', borderRadius: '0' }}
                type="checkbox"
                checked={selectedOptions.includes(this.props.data.value)}
                onChange={(e) => e}
              />{' '}
              <label
                style={{ cursor: 'pointer', paddingTop: '2px' }}
                className="my-auto ms-2"
              >
                {this.props.value}{' '}
              </label>
            </div>
          </components.Option>
        </div>
      )
    }
  })

  const noDataComponent = () => {
    return (
      <div className="no-data-component text-center">
        {isSearching ? (
          'You do not have any students with this information.'
        ) : (
          <>
            You don't have any students yet. <br /> Use the blue link above to
            upload your rosters.
          </>
        )}
      </div>
    )
  }

  const MultiValue = (props) => {
    return (
      <components.MultiValue {...props}>
        <span>{props.data.label}</span>
      </components.MultiValue>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'level') {
      setCurrentEditingStudent((prevValues) => ({
        ...prevValues,
        [name]: value,
        period_id: null,
        year: ''
      }))
      updateOptions(value)
    } else {
      setCurrentEditingStudent((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    }
  }

  const editSingleStudent = async () => {
    setLoading(true)
    await axiosInstance
      .put(
        `/instructor/update-student/${currentEditingStudent.id}`,
        currentEditingStudent
      )
      .then(({ data }) => {
        setStudents(
          students?.map((student) => (student.id === data.id ? data : student))
        )
        toast.success('Student updated!')
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
    setLoading(false)
    setCurrentEditingStudent()
  }

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
      year: ['ES1', 'ES2', 'ES3'],
      period: periods
        ?.filter(
          (item) =>
            item.name === 'Period 1' ||
            item.name === 'Period 2' ||
            item.name === 'Period 3' ||
            item.name === 'Period 4' ||
            item.name === 'Period 5' ||
            item.name === 'Period 6' ||
            item.name === 'Period 7'
        )
        .map((item) => item.name)
    },
    {
      name: 'level',
      value: 'HS',
      label: 'HS',
      year: ['LTS1', 'LTS2', 'LTS3', 'LTS4'],
      period: periods?.map((item) => item.name)
    },
    { name: 'level', value: 'HE', label: 'HE' }
  ]

  // useEffect(() => {
  //   const getOptions = (value, prop) => {
  //     const item = defaultData.find((item) => item.value === value)
  //     const elements = item ? item[prop] : []

  //     if (prop === 'period') {
  //       const periodIds = elements?.map(
  //         (el) => periods.find((period) => period.name === el)?.id
  //       )

  //       return elements?.map((el, index) => ({
  //         name: prop,
  //         value: periodIds[index], // Assign the period ID as the value
  //         label: el,
  //       }))
  //     }
  //     return elements?.map((el) => ({
  //       name: prop,
  //       value: el,
  //       label: el,
  //     }))
  //   }
  //   const yearOptions = getOptions(currentEditingStudent?.level, 'year')
  //   const periodOptions = getOptions(currentEditingStudent?.level, 'period')
  //   setYearOptions(yearOptions)
  //   setPeriodOptions(periodOptions)
  // }, [currentEditingStudent?.level])

  const updateOptions = (level) => {
    const getOptions = (value, prop) => {
      const item = defaultData.find((item) => item.value === value)
      const elements = item ? item[prop] : []

      if (prop === 'period') {
        const periodIds = elements?.map(
          (el) => periods.find((period) => period.name === el)?.id
        )

        return elements?.map((el, index) => ({
          name: prop,
          value: periodIds[index], // Assign the period ID as the value
          label: el
        }))
      }
      return elements?.map((el) => ({
        name: prop,
        value: el,
        label: el
      }))
    }

    const yearOptions = getOptions(level, 'year')
    const periodOptions = getOptions(level, 'period')

    setYearOptions(yearOptions)
    setPeriodOptions(periodOptions)
  }

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
            students?.map((student) =>
              student.id === data.id ? data : student
            )
          )
        } else {
          toast.error(<IntlMessages id="alerts.something_went_wrong" />)
        }
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
    setDeactivateLoading(false)
    setShowToggleActivationModal(false)
  }

  const handleBulkDeactiveAction = () => {
    if (!selectedRows.length) return

    setCurrentEditingStudent()
    setTooglingActivationStudent()

    setBulkDeactivatingStudents(selectedRows)
    setShowBulkDeactivationModal(true)
  }

  const handleBulkEditAction = () => {
    if (!selectedRows.length) return

    setCurrentEditingStudent()
    setTooglingActivationStudent()

    setBulkEditingStudents(selectedRows)
    setShowBulkEditModal(true)
  }

  const handleBulkNextYearAction = () => {
    if (!selectedRows.length) return

    setCurrentEditingStudent()
    setTooglingActivationStudent()

    setBulkNextYearStudents(selectedRows)
    setShowBulkNextYearModal(true)
  }

  const bulkDeactivateStudents = async () => {
    setDeactivateLoading(true)

    await axiosInstance
      .post(`/instructor/bulk-update/`, {
        studentsIds: bulkDeactivatingStudents,
        bulkDeactivate: true
      })
      .then((data) => {
        setStudents(
          students?.map((student) => {
            if (bulkDeactivatingStudents.includes(student.id)) {
              student.deactivated = true
            }
            return student
          })
        )
        setShowConfirmationModal(true)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
    setDeactivateLoading(false)
    setShowBulkDeactivationModal(false)
  }

  const bulkEditStudents = async (options) => {
    setEditLoading(true)

    await axiosInstance
      .post(`/instructor/bulk-update/`, {
        studentsIds: bulkEditingStudents,
        options: options
      })
      .then((data) => {
        const updatedStudents = students?.map((student) => {
          if (bulkEditingStudents.includes(student.id)) {
            for (const property in options) {
              if (property === 'activated') {
                student['deactivated'] = !options[property]
              } else {
                student[property] = options[property]
              }
            }
          }
          return student
        })
        setStudents(updatedStudents)
        setShowConfirmationModal(true)
        setShowBulkEditModal(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })

    setEditLoading(false)
    setDeactivateLoading(false)
    setShowBulkDeactivationModal(false)
  }

  const bulkNextYear = async () => {
    setNextYearLoading(true)

    const updatedOptions = await Promise.all(
      bulkNextYearStudents?.map(async (id) => {
        const { data } = await axiosInstance.get(`/users/${id}`)

        const selectedUserData = defaultData.find(
          (item) => item.value === data?.level
        )

        const currentYearIndex = selectedUserData?.year.indexOf(data?.year)
        const periodIndexId = periods?.find(
          (period) => period.id === data?.period_id
        )?.name

        const currentPeriodIndex =
          selectedUserData?.period.indexOf(periodIndexId)
        let nextYearIndex
        let nextPeriodIndex

        if (selectedUserData?.year.length - 1 === currentYearIndex) {
          nextYearIndex = currentYearIndex
          nextPeriodIndex = currentPeriodIndex
        } else {
          nextYearIndex = currentYearIndex + 1
          nextPeriodIndex = 0
        }

        const nextYear = selectedUserData?.year[nextYearIndex]
        const nextPeriodName = selectedUserData?.period[nextPeriodIndex]

        const nextPeriod = periods.find(
          (item) => item.name === nextPeriodName
        )?.id

        return {
          studentID: data?.id,
          year: nextYear,
          period_id: nextPeriod
        }
      })
    )

    await axiosInstance
      .post(`/instructor/bulk-update/`, {
        studentsIds: bulkNextYearStudents,
        nextYearOptions: updatedOptions
      })
      .then((data) => {
        const updatedStudents = students?.map((student) => {
          if (bulkNextYearStudents.includes(student.id)) {
            for (let i = 0; i < updatedOptions.length; i++) {
              const option = updatedOptions[i]
              if (option.studentID === student.id) {
                for (const property in option) {
                  if (property === 'activated') {
                    student['deactivated'] = !option[property]
                  } else {
                    student[property] = option[property]
                  }
                }
              }
            }
          }
          return student
        })
        setStudents(updatedStudents)
        setShowConfirmationModal(true)
        setShowBulkNextYearModal(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })

    setNextYearLoading(false)
    setDeactivateLoading(false)
    setShowBulkDeactivationModal(false)
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
              {currentEditingStudent?.id !== record.id ? (
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
                        setCurrentEditingStudent(record)
                        updateOptions(record.level)
                      }}
                    >
                      Quick Edit User
                    </span>
                    <span className="mx-2">|</span>
                    {!record.deactivated ? (
                      <span
                        role="button"
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
                        role="button"
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
                <div className="d-flex flex-column justify-content-start">
                  <input
                    type="text"
                    className="w-75 px-2 py-1"
                    style={{ border: '1px solid #BBBDBF', height: '35px' }}
                    name="name"
                    value={currentEditingStudent?.name}
                    onChange={handleChange}
                  />
                  <button
                    className="edit-btn m-0 mt-1 p-0"
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
              <div className="table-edit-dropdown">
                {currentEditingStudent?.id === record.id ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    options={defaultData}
                    value={{
                      label: currentEditingStudent?.level,
                      value: currentEditingStudent?.level
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'level', value: newValue.value }
                      })
                    }
                    className="my-auto py-auto"
                    // styles={customStyles}
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
        name: 'Year',
        key: 'year',
        selector: (row) => (row.year ? row.year : 'NONE'),
        sortable: true,
        omit: !selectedOptions.includes('year'),
        cell: (record) => {
          return (
            <>
              <div className="table-edit-dropdown">
                {currentEditingStudent?.id === record.id ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    options={yearOptions}
                    isDisabled={currentEditingStudent?.level === 'HE'}
                    value={{
                      label: currentEditingStudent?.year,
                      value: currentEditingStudent?.year
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'year', value: newValue.value }
                      })
                    }
                    className="my-auto py-auto"
                    // styles={customStyles}
                  />
                ) : (
                  <p className="my-auto">
                    {record.year ? record.year : 'None'}{' '}
                  </p>
                )}
              </div>
            </>
          )
        }
      },
      {
        name: 'Class',
        key: 'class',
        selector: (row) => (row.period_id ? row.period_id : 'NONE'),
        sortable: true,
        omit: !selectedOptions.includes('class'),
        cell: (record) => {
          return (
            <>
              <div className="table-edit-dropdown">
                {currentEditingStudent?.id === record.id ? (
                  <Select
                    menuPortalTarget={document.body}
                    menuPosition={'fixed'}
                    options={periodOptions}
                    isDisabled={
                      currentEditingStudent.level === 'LS' ||
                      currentEditingStudent.level === 'HE'
                    }
                    value={{
                      label: periods?.find(
                        (period) =>
                          period.id === currentEditingStudent?.period_id
                      )?.name,
                      value: periods?.find(
                        (period) =>
                          period.id === currentEditingStudent?.period_id
                      )?.name
                    }}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: 'period_id', value: newValue.value }
                      })
                    }
                    className="my-auto py-auto"
                  />
                ) : (
                  <p className="my-auto">
                    {periods?.find((period) => period.id === record.period_id)
                      ?.name || 'None'}
                  </p>
                )}
              </div>
            </>
          )
        }
      },
      {
        name: 'IAMR Status',
        key: 'IAMRStatus',
        selector: (row) =>
          row.completedSkills1 ? row.completedSkills1 : 'NONE',
        sortable: true,
        omit: !selectedOptions.includes('certification'),
        cell: (record) => {
          return (
            <>
              <div className="d-flex justify-content-between text-center w-100">
                <div className="w-50 d-flex align-items-center">
                  <div className="w-50">
                    <img
                      className="w-100 h-100"
                      src={Certification1Badge}
                      alt=""
                    />
                  </div>
                  <span>
                    <span className="d-flex">
                      <p className="text-info mb-0 pb-0 fw-bold">
                        {record.completedSkills1
                          ? record.completedSkills1.length
                          : 0}{' '}
                      </p>
                      /
                      <p className="mb-0 pb-0">
                        {record.certification1Skills
                          ? record.certification1Skills
                          : 0}
                      </p>
                    </span>
                    Skills
                  </span>
                </div>
                <div className="w-50 d-flex align-items-center">
                  <div className="w-50">
                    <img
                      className="w-100 h-100"
                      src={Certification2Badge}
                      alt=""
                    />
                  </div>
                  <span>
                    <span className="d-flex">
                      <p
                        className="mb-0 pb-0 fw-bold"
                        style={{ color: '#a22f6a' }}
                      >
                        {record.completedSkills2
                          ? record.completedSkills2.length
                          : 0}
                      </p>
                      /
                      <p className="mb-0 pb-0">
                        {record.certification2Skills
                          ? record.certification2Skills
                          : 0}
                      </p>
                    </span>
                    Skills
                  </span>
                </div>
              </div>
            </>
          )
        }
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
                  <span
                    role="button"
                    className="my-1 fw-bold"
                    onClick={() => {
                      setStudentToEdit(record)
                      setOpenEditUserModal(true)
                    }}
                    style={{ color: '#51C7DF' }}
                  >
                    View
                  </span>
                  {currentEditingStudent?.id === record.id && (
                    <>
                      <button
                        className="edit-btn my-1 fw-bold ms-auto"
                        onClick={() => {
                          editSingleStudent()
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
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="d-flex flex-row switch_students_options align-items-end h-100">
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
                          ? students?.length
                          : students?.filter((student) =>
                              filteringCondition(student)
                            ).length}
                        )
                      </span>
                    </p>
                  </div>
                  <div className="div mx-1">|</div>
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
                          ? students?.filter((student) => !student.deactivated)
                              .length
                          : students?.filter(
                              (student) =>
                                !student.deactivated &&
                                filteringCondition(student)
                            ).length}
                        )
                      </span>
                    </p>
                  </div>
                  <div className="div mx-1">|</div>
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
                          ? students?.filter((student) => student.deactivated)
                              .length
                          : students?.filter(
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
              <div className="col-12 col-md-6 mt-2 mt-md-0 text-end setAddStudents d-flex justify-content-md-end justify-content-start align-items-end">
                <p
                  className="p-0 m-0"
                  role={'button'}
                  onClick={() => setShowStudentsTransferModal(true)}
                >
                  Student transfers<span>({receivedTransfersCount})</span>
                </p>
                <span className="mx-2" style={{ color: '#333d3d83' }}>
                  |
                </span>
                <p
                  className="p-0 m-0"
                  role={'button'}
                  onClick={() => setShowAddStudentsModal(true)}
                >
                  Add Users
                </p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row justify-content-between">
              <div className="col-12 col-md-5 mt-2">
                <div className="connections-search" style={{ height: '48px' }}>
                  <div className="input-group h-100">
                    <div className="input-group-prepend my-auto">
                      <button
                        className="btn btn-outline-secondary my-2 ms-2"
                        type="button"
                        id="button-addon1"
                      >
                        <img src={searchIcon} alt="#" width="90%" />
                      </button>
                    </div>

                    <input
                      type="text"
                      className="form-control"
                      name="searchedNote"
                      placeholder={'SEARCH USERS'}
                      aria-describedby="button-addon1"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="row h-100 me-0 align-items-end justify-content-end">
                  <div className="col-12 col-sm-4 col-xxl-4 mt-2 pe-0">
                    <Select
                      options={[
                        { label: 'edit', value: 'edit' },
                        { label: 'nextYear', value: 'nextYear' },
                        { label: 'deactivate', value: 'deactivate' }
                      ]}
                      value={'Bulk Actions'}
                      placeholder={'Bulk Actions'}
                      onChange={(newValue) => {
                        newValue.value === 'edit'
                          ? handleBulkEditAction()
                          : newValue.value === 'deactivate'
                          ? handleBulkDeactiveAction()
                          : handleBulkNextYearAction()
                      }}
                      className="mb-0 me-0 custom-dropdown"
                      styles={dropDownStyles}
                      autoFocus={false}
                      isSearchable={false}
                    />
                  </div>
                  <div className="col-12 col-sm-5 col-xxl-5 mt-2 me-0 pe-0">
                    <Select
                      options={[
                        { label: 'level', value: 'level' },
                        { label: 'year', value: 'year' },
                        { label: 'class', value: 'class' },
                        { label: 'certification', value: 'certification' },
                        { label: 'transfers', value: 'transfers' }
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
                      className="mb-0 custom-dropdown"
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
          title="Employees"
          columns={tableColumns}
          data={tableData()}
          pagination
          selectableRows
          onSelectedRowsChange={(rows) =>
            setSelectedRows(
              rows?.selectedRows?.map((row) => {
                return row.id
              })
            )
          }
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

      {showBulkNextYearModal && (
        <NextYearModal
          show={showBulkNextYearModal}
          onHide={() => {
            setShowBulkNextYearModal(false)
            setBulkNextYearStudents([])
          }}
          nextYearLoading={nextYearLoading}
          handleAction={() => {
            bulkNextYear()
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
      {bulkEditingStudents?.length > 0 && (
        <>
          <ConfirmationModal
            show={showConfirmationModal}
            onHide={() => {
              setShowConfirmationModal(false)
              setBulkEditingStudents([])
            }}
            message={'Student(s) updated.'}
          />
        </>
      )}
      {bulkNextYearStudents?.length > 0 && (
        <>
          <ConfirmationModal
            show={showConfirmationModal}
            onHide={() => {
              setShowConfirmationModal(false)
              setBulkNextYearStudents([])
            }}
            message={'Student(s) year and period updated.'}
          />
        </>
      )}

      <EditStudentModal
        show={openEditUserModal}
        onHide={() => setOpenEditUserModal(false)}
        instructors={instructors}
        addNewTransferRequest={addNewTransferRequest}
        setStudentToEdit={setStudentToEdit}
        data={studentToEdit}
        school={universities}
        updateState={(id, data) => updateState(id, data)}
      />

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

      {bulkEditingStudents?.length > 0 && (
        <EditBulk
          show={showBulkEditModal}
          students={bulkEditingStudents}
          loading={editLoading}
          onSave={(options) => bulkEditStudents(options)}
          onHide={() => setShowBulkEditModal(false)}
        />
      )}

      <AddStudentsModal
        show={showAddStudentsModal}
        onHide={() => setShowAddStudentsModal(false)}
        addStudents={(addedStudents) => {
          setStudents([...addedStudents, ...students])
        }}
      />

      <StudentsTransferModal
        show={showStudentsTransferModal}
        onHide={() => setShowStudentsTransferModal(false)}
        receivedTransferRequests={receivedTransferRequests}
        sentTransferRequests={sentTransferRequests}
        deleteSingleSentTransfer={deleteSingleSentTransfer}
        handleBulkSentDelete={handleBulkSentDelete}
        handleBulkReceivedUpdate={handleBulkReceivedUpdate}
        respondSingleReceivedTransfer={respondSingleReceivedTransfer}
      />
    </>
  )
}
