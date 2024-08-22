import moment from 'moment'
import './index.css'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useState } from 'react'
import { TableReflectionModal } from '../../../components/Modals/TableReflectionModal'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../../redux/reflectionsTable/Actions'
import axiosInstance from '../../../utils/AxiosInstance'
import _, { isEqual } from 'lodash'
import { setIsEdit } from '../../../redux/reflectionsTable/Actions'

const TableReflections = (props) => {
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()
  const reflectionsTable = useSelector((state) => state.reflectionsTable)

  const [reflectionTableEntries, setReflectionTableEntries] = useState([])
  const [userReflectionTableEntries, setUserReflectionTableEntries] = useState(
    []
  )
  const [submitted, setSubmitted] = useState(false)
  const [isEdit, setIsEdit] = useState()
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingTableRefection, setIsSavingTableReflection] = useState(false)
  const currentDate = new Date()
  const nextDay = new Date(currentDate)
  nextDay.setDate(currentDate.getDate() + 1)
  const [tableReflection, setTableReflections] = useState({
    startDate: currentDate,
    endDate: nextDay,
    reflectionTableId: 1
  })

  useEffect(() => {
    if (props.name === 'userReflectionsTable') {
      setIsEdit(true)
    }
  }, [props.name])

  const [tableReflectionEntry, setTableReflectionEntry] = useState({
    title: '',
    order: 1
  })

  useEffect(() => {
    let newUserReflectionTabEntries = []
    props.userReflectionTableEntries?.forEach((entry, index) => {
      if (entry.reflectionsTableEntriesId === null) {
        newUserReflectionTabEntries.push(entry)
      }
    })

    setUserReflectionTableEntries(newUserReflectionTabEntries)
  }, [props.userReflectionTableEntries])

  useEffect(() => {
    let newReflectionTableEntries = []

    props.reflectionTableEntries?.map((entry) => {
      const foundedEntry = newReflectionTableEntries?.find(
        (e) => e.id === entry.id
      )

      if (!foundedEntry && !entry.hasOwnProperty('reflectionsTableEntriesId')) {
        newReflectionTableEntries.push(entry)
      }
    })

    setReflectionTableEntries(newReflectionTableEntries)
  }, [])

  const onSave = (name, value) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)
    let url
    const data = {
      reflectionsTableId: props.reflectionTable.id
    }

    if (reflectionsTable.isEdit) {
      url = `/LtsJournals/user-reflections-table-entry/${
        reflectionsTable.activeItem ? reflectionsTable.activeItem.id : 0
      }`

      data['reflectionsTableEntriesId'] =
        reflectionsTable.reflectionsTableEntry.reflectionsTableEntriesId ===
        null
          ? null
          : reflectionsTable.reflectionsTableEntry.id
      data['content'] = reflectionsTable.content
    } else {
      data['title'] = reflectionsTable.content
      url = '/LtsJournals/reflections-table-entry'
    }

    const method = reflectionsTable.isEdit ? 'patch' : 'post'

    let isEditValue = {
      startDate: tableReflection.startDate,
      endDate: tableReflection.endDate,
      title: tableReflection.title,
      journalId: tableReflection.journalId,
      reflectionsTableId: props.reflectionTable.reflectionsTableId,
      id: props.reflectionTable.id
    }
    let isCreateValue = {
      startDate: tableReflection.startDate,
      endDate: tableReflection.endDate,
      title: tableReflection.title,
      journalId: tableReflection.journalId,
      reflectionsTableId: props.reflectionTable.reflectionsTableId
    }

    if (reflectionsTable.isEdit === false) {
      isCreateValue.reflectionsTableId = props.reflectionTable.id
    } else {
      isCreateValue.id = props.reflectionTable.id
    }

    const newValue =
      props.name === 'userReflectionsTable' ? isEditValue : isCreateValue
    axiosInstance
      .patch(
        `/LtsJournals/user-reflections-table/${
          props.name === 'userReflectionsTable' ? tableReflection.id : 0
        }`,
        newValue
      )
      .then((res) => {
        setSubmitted(true)
        const newObj = {
          title: data.title,
          content: data.content,
          reflectionsTableEntriesId: data.reflectionsTableEntriesId,

          userReflectionTableId: res.data.id,
          reflectionsTableId: res.data.reflectionsTableId
        }

        if (props.updateUserReflectionsTable) {
          props.updateUserReflectionsTable(newObj)
        }
        if (!isSaving) {
          axiosInstance[method](url, newObj).then((data) => {
            props.loadData()
            setShowModal(false)
            setIsSaving(false)
          })
        } else {
          setIsSaving(false)
        }
      })
  }

  useEffect(() => {
    const currentDate = new Date()
    const nextDay = new Date(currentDate)
    nextDay.setDate(currentDate.getDate() + 1)
    const newTableReflection = {
      startDate: props.reflectionTable.startDate ?? new Date(),
      endDate: props.reflectionTable.endDate ?? nextDay,
      title: props.reflectionTable.title,
      journalId: props.reflectionTable.journalId,
      id: props.reflectionTable.id,
      ...(props.reflectionTable.id && {
        reflectionsTableId: props.reflectionTable.id
      })
    }

    setTableReflections(newTableReflection)
  }, [])

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  const handleChangeTableReflectionsEntry = async (name, value) => {
    const newTableReflectionEntry = { ...tableReflectionEntry }
    let newTableReflection = { ...tableReflection }
    newTableReflectionEntry[name] = value
    setTableReflectionEntry(newTableReflectionEntry)
    newTableReflection[name] = value
    newTableReflection.reflectionsTableId = tableReflection.reflectionsTableId
    newTableReflection.title = tableReflection.title
    setTableReflections(newTableReflection)
    debounce(onSubmit, newTableReflection)
  }

  const onSubmit = async (debounceName, value) => {
    setIsSaving(true)
    const isEditValue = {
      ...value,
      id: props.reflectionTable.id,
      reflectionsTableId: props.reflectionTable.reflectionsTableId
    }

    const isCreateValue = {
      startDate: value.startDate,
      endDate: value.endDate,
      title: value.title,
      journalId: value.journalId,
      reflectionsTableId: value.reflectionsTableId
    }
    const newValue =
      props.name === 'userReflectionsTable' ? isEditValue : isCreateValue
    axiosInstance
      .patch(
        `/LtsJournals/user-reflections-table/${tableReflection.id}`,
        newValue
      )
      .then(({ data }) => {
        if (props.updateUserReflectionsTable) {
          props.updateUserReflectionsTable(data)
        }
        setTableReflections(data)
        setIsSaving(false)
      })
  }

  return (
    <div className='table-reflections'>
      <div className='table-reflections__dates'>
        <div className='row'>
          <div className='col-6' style={{ paddingRight: 0 }}>
            <div className='table-reflections__date'>
              <b>Start date:</b>
              <div className={` w-100`}>
                <input
                  className={`journal_table-input my-1 py-2 px-2 text-dark `}
                  type={'date'}
                  style={{
                    width: '100%'
                  }}
                  name={'startDate'}
                  value={new Date(tableReflection.startDate).toLocaleDateString(
                    'en-CA'
                  )}
                  onChange={(e) => {
                    if (!isSaving) {
                      return handleChangeTableReflectionsEntry(
                        'startDate',
                        e.target.value
                      )
                    }
                  }}
                  disabled={!props.isEditable}
                />
              </div>
              {/*{moment(props.start).format('DD-MM-YYYY')}*/}
            </div>
          </div>
          <div className='col-6' style={{ paddingLeft: 0 }}>
            <div className='table-reflections__date'>
              <b>End date:</b>{' '}
              <div className={` w-100`}>
                <input
                  className={`journal_table-input my-1 py-2 px-2 text-dark `}
                  type={'date'}
                  style={{
                    width: '100%'
                  }}
                  name={'startDate'}
                  value={new Date(tableReflection.endDate).toLocaleDateString(
                    'en-CA'
                  )}
                  onChange={(e) => {
                    if (!isSaving) {
                      return handleChangeTableReflectionsEntry(
                        'endDate',
                        e.target.value
                      )
                    }
                  }}
                  disabled={!props.isEditable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='table-reflections__entries'>
        {reflectionTableEntries && reflectionTableEntries?.length
          ? [...reflectionTableEntries]?.map((entry) => (
              <div className='table-reflections__entry' key={entry.id}>
                <p style={{ marginRight: '6px' }}>
                  <b>{entry.title}</b>
                  <p className={'pt-1'}>
                    {
                      props.userReflectionTableEntries?.find(
                        (item) =>
                          item.reflectionsTableEntriesId === entry.id &&
                          item.reflectionsTableId ===
                            props.reflectionTable.reflectionsTableId
                      )?.content
                    }
                  </p>
                </p>
                {props.isEditable && (
                  <span
                    className='table-reflections__entry-icon'
                    onClick={() => {
                      if (!isSaving) {
                        const userReflection =
                          props.userReflectionTableEntries?.find(
                            (item) =>
                              item.reflectionsTableEntriesId === entry.id &&
                              item.reflectionsTableId ===
                                props.reflectionTable.reflectionsTableId
                          )
                        dispatch(actions.setActiveItem(userReflection))
                        dispatch(actions.setIsEdit(true))
                        dispatch(
                          actions.setContent(
                            userReflection ? userReflection.content : ''
                          )
                        )
                        dispatch(actions.setSubtitle(entry.title))
                        dispatch(actions.setReflectionsTableEntry(entry))

                        setShowModal(true)
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                )}
              </div>
            ))
          : null}
        {userReflectionTableEntries && userReflectionTableEntries?.length
          ? [...userReflectionTableEntries]?.map((entry) => (
              <div className='table-reflections__entry' key={entry.id}>
                <p>
                  <b>{entry.title}</b>
                  <p className={'pt-1'}>
                    {
                      entry.content
                      // userReflectionTableEntries.find(
                      //   (item) =>
                      //     item.reflectionsTableEntriesId == entry.id &&
                      //     item.reflectionsTableId == props.reflectionTable.id
                      // )?.content
                    }
                  </p>
                </p>
                {props.isEditable && (
                  <span
                    className='table-reflections__entry-icon'
                    onClick={() => {
                      // const userReflection = userReflectionTableEntries.find(
                      //   (item) =>
                      //     item.reflectionsTableEntriesId == entry.id &&
                      //     item.reflectionsTableId == props.reflectionTable.id
                      // )
                      if (!isSaving) {
                        const activeItem = {
                          ...entry,
                          reflectionsTableEntriesId: null
                        }
                        const newReflectionsTableEntries = {
                          createdAt: entry.createdAt,
                          id: entry.id,
                          order: entry.order,
                          reflectionsTableId: null,
                          title: entry.title,
                          updatedAt: entry.updatedAt
                        }
                        dispatch(actions.setActiveItem(activeItem))
                        dispatch(actions.setIsEdit(true))
                        dispatch(actions.setContent(entry ? entry.content : ''))
                        dispatch(actions.setSubtitle(entry.title))

                        dispatch(
                          actions.setReflectionsTableEntry({
                            ...entry,
                            reflectionsTableEntriesId: null
                          })
                        )

                        setShowModal(true)
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                )}
              </div>
            ))
          : null}
        <div className='table-reflections__entry'>
          {props.isEditable && (
            <>
              <p>
                <b>Add another team member to this table</b>
              </p>
              <span
                className='table-reflections__entry-icon'
                onClick={() => {
                  if (!isSaving) {
                    dispatch(actions.setActiveItem(null))
                    dispatch(actions.setReflectionsTableEntry(null))
                    dispatch(actions.setIsEdit(false))
                    dispatch(actions.setContent(''))
                    dispatch(actions.setSubtitle('New Team Member'))
                    setShowModal(true)
                  }
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </>
          )}
        </div>
      </div>
      <TableReflectionModal
        show={showModal}
        title={props.reflectionTable.FontAwesomeIcontitle}
        tableTitle={props.tableTitle}
        onSave={() => onSave()}
        onHide={() => setShowModal(false)}
      />
    </div>
  )
}

export default TableReflections
