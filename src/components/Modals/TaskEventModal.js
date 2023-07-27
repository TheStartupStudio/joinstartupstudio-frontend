import React, { useEffect, useState } from 'react'
import { DropdownButton, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import IntlMessages from '../../utils/IntlMessages'
import { FormattedMessage } from 'react-intl'
import ReactQuill from 'react-quill'
import FoulWords from '../../utils/FoulWords'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import DatePicker from 'react-datepicker'
import 'react-quill/dist/quill.snow.css'
import PeriodSelector from '../PeriodSelector/PeriodSelector'
import { useDispatch, useSelector } from 'react-redux'
import {
  editEventStart,
  getPeriodsStart,
  postEventStart
} from '../../redux/dashboard/Actions'
import TimePicker from '../TimePicker/TimePicker'
import './TaskEventModal.css'
import MultiSelect from '../MultiSelect/MultiSelect'
import { toast } from 'react-toastify'

const TaskEventModal = (props) => {
  const [tab, setTab] = useState('task')
  const [periods, setPeriods] = useState(props.periods)
  const loggedUser = useSelector((state) => state.user.user.user)

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

  const userLevel = defaultData.filter(
    (data) => data.value === loggedUser.level
  )
  useEffect(() => {
    props.show === false && setState(initialState)
  }, [])

  useEffect(() => {
    if (isEdit()) {
      const newState = {
        name: props.event?.name,
        startDate: props.event?.startDate,
        endDate: props.event?.endDate ? props.event?.endDate : null,
        startTime: props.event?.startTime,
        endTime: props.event?.endTime,
        description: props.event?.description,
        type: props.event?.type,
        requirements: props.event?.requirements,
        periods: props.event?.periods
        // chooseClasses: props.event?.period,
      }

      setState(newState)
      setTab(props.event?.type)
    }
  }, [props.event])

  useEffect(() => {
    if (isAddingOnClick()) {
      setState({ ...state, startDate: props.startDate })
    }
  }, [props.startDate])

  const dispatch = useDispatch()

  useEffect(() => {
    setPeriods(props.periods)
  }, [props.periods])

  const initialState = {
    name: '',
    startDate: '',
    endDate: null,
    startTime: '',
    endTime: '',
    description: '',
    type: '',
    requirements: '',
    // chooseClasses: {},
    periods: []
  }

  const [state, setState] = useState(initialState)
  useEffect(() => {
    const newState = { ...state }
    newState.type = tab == 'task' ? 'task' : 'event'
    setState(newState)
  }, [tab])

  useEffect(() => {
    setState({ ...state, startDate: props.startDate })
  }, [props.startDate])

  const isEndTimeBeforeStartTime = () => {
    const startTimeArray = state.startTime.split(':')
    const endTimeArray = state.endTime.split(':')
    if (!!endTimeArray[0]) {
      return (
        +endTimeArray[0] < +startTimeArray[0] ||
        (+endTimeArray[0] === +startTimeArray[0] &&
          +endTimeArray[1] <= +startTimeArray[1])
      )
    }
  }

  useEffect(() => {
    if (!isEdit()) {
      setTab('task')
    }
  }, [])

  const handleInputChange = (name, value) => {
    if (value !== 'NaN:NaN') {
      setState((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const activeTabStyle = {
    backgroundColor: '#51c7df',
    color: '#fff',
    border: '1px solid #51c7df',
    borderRadius: '0.25rem',
    marginBottom: 6
  }

  const inActiveTabStyle = {
    backgroundColor: '#fff',
    color: '#666',
    border: '1px solid #666',
    borderRadius: '0.25rem',
    marginBottom: 6
  }
  const toggleTab = (tab) => {
    setTab(tab)
  }

  const onPostEvent = () => {
    let newEventObj = {
      name: state.name,
      startDate: state.startDate,
      startTime: state.startTime,
      endDate: state.endDate ? state.endDate : null,
      endTime: state.endTime,
      description: state.description,
      type: state.type,
      requirements: state.requirements,
      periods: state.periods
    }
    if (isAddingOnClick()) {
      setState(initialState)
    }
    if (state.periods.length > 0) {
      dispatch(postEventStart(newEventObj))
      setState(initialState)
    } else {
      toast.error('You must select at least one period')
    }
  }

  const onEditEvent = () => {
    let newEvent = {
      name: state.name,
      startDate: state.startDate,
      startTime: state.startTime,
      endDate: state.endDate ? state.endDate : null,
      endTime: state.endTime,
      description: state.description,
      type: state.type,
      requirements: state.requirements,
      periods: state.periods
    }
    if (state.periods.length) {
      dispatch(editEventStart(newEvent, { eventId: props.event.id }))
    } else {
      toast.error('You must select at least one period')
    }
  }
  const isEdit = () => {
    return props.event != null
  }

  const isAddingOnClick = () => {
    return props.startDate != null
  }

  useEffect(() => {
    if (isEndTimeBeforeStartTime()) {
      const newState = { ...state }
      const tomorrow = new Date(newState.startDate)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const date = new Date(tomorrow)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const parts = formattedDate.split('/')
      const formattedDateInNewFormat = `${parts[2]}-${parts[0]}-${parts[1]}`
      newState.endDate = formattedDateInNewFormat
      setState(newState)
    }
  }, [state.endTime])

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
    // Add more options as needed
  ]

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      className="edit-modal general-modal-header task-event-modal"
    >
      <Modal.Header className="add-new-note-title general-modal-header my-auto p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">
          {isEdit() ? (
            <IntlMessages id={`calendar_task-events.edit_${tab}`} />
          ) : (
            <IntlMessages id="calendar_task-events.add_a_new_task/event" />
          )}
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className="mt-4 mb-3 mx-4 add-new-note event-input-container">
        <div className="row w-100 m-0 mb-4">
          <div className="col-md-6">
            <button
              style={tab == 'task' ? activeTabStyle : inActiveTabStyle}
              className="btn w-100"
              onClick={() => toggleTab('task')}
            >
              Task
            </button>
          </div>
          <div className="col-md-6">
            <button
              className="btn w-100"
              style={tab == 'event' ? activeTabStyle : inActiveTabStyle}
              onClick={() => toggleTab('event')}
            >
              Event
            </button>
          </div>
        </div>
        <div className="row px-2 add-new-note event-input-container">
          <div className="col-md-12">
            <label
              htmlFor={tab === 'task' ? 'taskName' : 'eventName'}
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              <FormattedMessage id={`calendar_task-events.name_of_${tab}`} />
            </label>
            <FormattedMessage id={`calendar_task-events.name_of_${tab}`}>
              {(placeholder) => (
                <input
                  className="my-1 mb-4 py-2 px-2 w-100 event-input text-dark "
                  type="text"
                  name={tab === 'task' ? 'taskName' : 'eventName'}
                  style={{
                    height: 48,
                    borderRadius: '0.25rem',
                    backgroundColor: 'white',
                    color: '#000'
                  }}
                  placeholder={placeholder}
                  id={tab === 'task' ? 'taskName' : 'eventName'}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  value={state.name}
                />
              )}
            </FormattedMessage>
          </div>
          <div
            className={`event-input-container col-md-6
            `}
          >
            <label
              htmlFor="date"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              Start{' '}
              <FormattedMessage id={`calendar_task-events.date_of_${tab}`} />
            </label>
            <FormattedMessage id={`calendar_task-events.date_of_${tab}`}>
              {(placeholder) => (
                <input
                  className="my-1 mb-4 py-2 px-2 w-100 event-input "
                  type="date"
                  name={tab === 'task' ? 'taskDate' : 'eventDate'}
                  style={{
                    height: 48,
                    borderRadius: '0.25rem',
                    backgroundColor: 'white',
                    '::placeholder': {
                      color: '#000',
                      fontWeight: 'bold'
                    }
                  }}
                  placeholder={placeholder}
                  id={tab === 'task' ? 'taskDate' : 'eventDate'}
                  pattern="\d{4}-\d{2}-\d{2}"
                  onChange={(e) =>
                    handleInputChange('startDate', e.target.value)
                  }
                  value={state.startDate}
                />
              )}
            </FormattedMessage>
          </div>
          {
            <div className="col-md-6 event-input-container">
              <label
                htmlFor="date"
                style={{ fontSize: '14px', fontWeight: 'bold' }}
              >
                End{' '}
                <FormattedMessage id={`calendar_task-events.date_of_${tab}`} />
              </label>
              <FormattedMessage id={`calendar_task-events.date_of_${tab}`}>
                {(placeholder) => (
                  <input
                    className="my-1 mb-4 py-2 px-2 w-100 event-input"
                    type="date"
                    name={tab === 'task' ? 'taskDate' : 'eventDate'}
                    style={{
                      height: 48,
                      borderRadius: '0.25rem',
                      backgroundColor: 'white'
                    }}
                    placeholder={placeholder}
                    id={tab === 'task' ? 'taskDate' : 'eventDate'}
                    pattern="\d{4}-\d{2}-\d{2}"
                    onChange={(e) =>
                      handleInputChange('endDate', e.target.value)
                    }
                    value={state.endDate}
                  />
                )}
              </FormattedMessage>
            </div>
          }
          <div className="col-md-6 event-input-container">
            <label
              htmlFor="date"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              <FormattedMessage
                id={`calendar_task-events.start_time_of_${tab}`}
              />
            </label>
            <FormattedMessage id={`calendar_task-events.date_of_${tab}`}>
              {(placeholder) => (
                <TimePicker
                  onChange={(e) => handleInputChange('startTime', e)}
                  value={state.startTime}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="col-md-6 ">
            <label
              htmlFor="date"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              <FormattedMessage
                id={`calendar_task-events.end_time_of_${tab}`}
              />
            </label>
            <FormattedMessage id={`calendar_task-events.date_of_${tab}`}>
              {(placeholder) => (
                <TimePicker
                  onChange={(e) => handleInputChange('endTime', e)}
                  value={state.endTime}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="col-md-12 event-input-container">
            <label
              htmlFor="description"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              <FormattedMessage
                id={`calendar_task-events.description_of_${tab}`}
              />
            </label>
            <FormattedMessage id={`calendar_task-events.description_of_${tab}`}>
              {(placeholder) => (
                <ReactQuill
                  theme="snow"
                  name={'description'}
                  id={'description'}
                  // name={tab === 'task' ? 'taskDescription' : 'eventDescription'}
                  // id={tab === 'task' ? 'taskDescription' : 'eventDescription'}
                  className="my-1 mb-4 py-2 px-0 w-100 rounded-0 scroll-add-new-note-modal "
                  style={{
                    height: '150px',
                    '::placeholder': {
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: 16
                    }
                  }}
                  placeholder={placeholder}
                  onChange={(e) => handleInputChange('description', e)}
                  value={state.description}
                />
              )}
            </FormattedMessage>
          </div>
          <div className="col-md-12 event-input-container">
            <label
              htmlFor="requirements"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              <FormattedMessage id="calendar_task-events.requirements" />
            </label>
            <FormattedMessage id="calendar_task-events.requirements">
              {(placeholder) => (
                <ReactQuill
                  theme="snow"
                  className="my-1 mb-4 py-2 w-100 rounded-0 scroll-add-new-note-modal "
                  name="requirements"
                  style={{
                    height: '150px',
                    '::placeholder': {
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: 16
                    }
                  }}
                  placeholder={placeholder}
                  id="requirements"
                  onChange={(e) => handleInputChange('requirements', e)}
                  value={state.requirements}
                />
              )}
            </FormattedMessage>
          </div>

          <div className="col-md-12">
            <label
              htmlFor="chooseClasses"
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            >
              {isEdit() ? (
                <FormattedMessage id="calendar_task-events.chosen_classes" />
              ) : (
                <FormattedMessage id="calendar_task-events.choose_classes" />
              )}
            </label>
            <MultiSelect
              periods={periods}
              options={props.event?.periods}
              handleChange={(e) => handleInputChange('periods', e)}
            />
          </div>
        </div>
      </Modal.Body>
      <div
        style={{ border: '0px' }}
        className="mt-0 pt-0 border-0 border-none mx-4 pe-1 mb-4"
      >
        <button
          className="float-end m-0 px-md-5 save-button add-new-note-button-text ms-1"
          onClick={isEdit() ? onEditEvent : onPostEvent}
        >
          <IntlMessages id="general.save" />
        </button>
      </div>
    </Modal>
  )
}
export default TaskEventModal
