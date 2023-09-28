import React, { useEffect, useState } from 'react'
import markdown from './markdown'
import LtsJournalReflection from './reflection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'

const debounce = (func, delay) => {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, delay)
  }
}

const EntriesBox = (props) => {
  const {
    entry,
    userJournalEntries,
    journal,
    deleteReflection,
    updateReflection,
    addReflection,
    handleShowAddReflection,
    showAddReflection,
    entries,
    isEditable,
    isDeletable,
    accordion
  } = props
  const [isSaving, setIsSaving] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const currentDate = new Date()
  const nextDay = new Date(currentDate)
  nextDay.setDate(currentDate.getDate() + 1)
  const [accordionDates, setAccordionDates] = useState(null)

  useEffect(() => {
    if (journal?.id && accordion?.id) {
      axiosInstance
        .get(`/ltsJournals/${journal?.id}/accordionsTable/${accordion?.id}`)
        .then(({ data }) => {
          setAccordionDates(data.ltsJournalsAccordionsTable)
          setIsNew(false)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [journal?.id, accordion?.id])

   const onSave = (values, isNew) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    let data = {
      startDate: values?.startDate,
      endDate: values?.endDate
    }

    const axiosMethodUrl = isNew
      ? axiosInstance.post(`/ltsJournals/accordionsTable/${accordion.id}`, data)
      : axiosInstance.patch(
          `/ltsJournals/accordionsTable/${accordionDates.id}`,
          data
        )

    axiosMethodUrl
      .then((res) => {
        setIsSaving(false)
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsSaving(false)
      })
  }

  const debouncedSave = debounce(onSave, 5000)

  const debouncedStartDateChange = debounce((value) => {
    handleDataChanges('startDate', value)
  }, 0)

  const debouncedEndDateChange = debounce((value) => {
    handleDataChanges('endDate', value)
  }, 5000)

  const handleDataChanges = (name, value) => {
    const newDates = { ...accordionDates, [name]: value }
    setAccordionDates(newDates)

    if (newDates.startDate !== undefined && newDates.endDate !== undefined) {
      debouncedSave(newDates, isNew)
    }
  }
 
  return entries && entries.length > 0 ? (
    <div style={{ border: '1px solid #BBBDBF' }}>
      {/* {journal.title && (
          <div
            className="journal-entry__parent-title"
            style={{
              marginTop: 0,
              marginBottom: 0,
              fontSize: 14,
              textTransform: 'uppercase'
            }}
          >
            <h5 style={{ fontSize: 14, padding: 6 }}>{journal.title}</h5>
          </div>
        )} */}
      {journal.title === 'MY PROJECT SPRINTS' && accordionDates ? (
        <div className="row" style={{ paddingBottom: '1px' }}>
          <div className="col-6" style={{ paddingRight: 0 }}>
            <div className="table-reflections__date">
              <b>Start date:</b>
              <div className={` w-100`}>
                <input
                  className={`journal_table-input my-1 py-2 px-2 text-dark `}
                  type={'date'}
                  style={{
                    width: '100%'
                  }}
                  name={'startDate'}
                  value={new Date(
                    accordionDates.startDate ?? currentDate
                  ).toLocaleDateString('en-CA')}
                  onChange={(e) => {
                    const newValue = e.target.value
                    handleDataChanges('startDate', newValue)
                    debouncedStartDateChange(newValue)
                  }}
                  disabled={!props.isEditable}
                />
              </div>
              {/*{moment(props.start).format('DD-MM-YYYY')}*/}
            </div>
          </div>
          <div className="col-6" style={{ paddingLeft: 0 }}>
            <div className="table-reflections__date">
              <b>End date:</b>{' '}
              <div className={` w-100`}>
                <input
                  className={`journal_table-input my-1 py-2 px-2 text-dark `}
                  type={'date'}
                  style={{
                    width: '100%'
                  }}
                  name={'endDate'}
                  value={new Date(
                    accordionDates.endDate ?? nextDay
                  ).toLocaleDateString('en-CA')}
                  onChange={(e) => {
                    const newValue = e.target.value
                    handleDataChanges('endDate', newValue)
                    debouncedEndDateChange(newValue)
                  }}
                  disabled={!props.isEditable}
                />
              </div>
            </div>
          </div>
        </div>
      ) : journal.title === 'MY PROJECT SPRINTS' && !accordionDates ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '50px' }}
        >
          <span className=" spinner-border-primary spinner-border-sm " />
        </div>
      ) : null}

      {entries &&
        entries?.map((entry, index) => (
          <div
            className="journal-entries__entry"
            key={entry.id}
            style={{ marginBottom: 0 }}
          >
            {entry.parentTitle && (
              <div className="journal-entry__parent-title">
                <h5>{entry.parentTitle}</h5>
              </div>
            )}{' '}
            <h4
              style={{
                padding: '12px 40px 12px 12px',
                backgroundColor: '#e5e5e5',
                marginBottom: 0,
                fontSize: 12,
                fontWeight: 700
              }}
              className={
                'journal-entries__entry-title' +
                (entry.title.indexOf('**') !== -1
                  ? ' journal-entries__entry-title--md'
                  : '')
              }
              dangerouslySetInnerHTML={{
                __html:
                  entry.title.indexOf('<h2>') === -1
                    ? markdown(entry.title)
                    : entry.title.replace(new RegExp('\r?\n', 'g'), '<br />')
              }}
            ></h4>
            <div className="journal-entries__entry-reflections">
              {/* List created reflections */}
              {userJournalEntries[entry.id] &&
                userJournalEntries[entry.id].map((userJournalEntry) => (
                  <LtsJournalReflection
                    key={userJournalEntry.id}
                    journal={journal}
                    journalEntry={entry}
                    userEntry={journal.userEntry}
                    entry={userJournalEntry}
                    isEditable={isEditable}
                    isDeletable={isDeletable}
                    deleted={deleteReflection(entry, userJournalEntry)}
                    saved={updateReflection(entry, userJournalEntry)}
                  />
                ))}
              {/* Add new reflection */}
              {(!userJournalEntries[entry.id] ||
                showAddReflection[entry.id]) && (
                <LtsJournalReflection
                  journal={journal}
                  journalEntry={entry}
                  userEntry={journal.userEntry}
                  entry={null}
                  saved={addReflection(entry)}
                  showCancel={!!userJournalEntries[entry.id]}
                  isEditable={isEditable}
                  isDeletable={isDeletable}
                  cancel={(e) => {
                    handleShowAddReflection({
                      ...showAddReflection,
                      [entry.id]: false
                    })
                  }}
                />
              )}
              {/*Show add new reflection*/}
              <div
                className={`journal-entries__entry-reflections-actions ${
                  userJournalEntries[entry.id] && !showAddReflection[entry.id]
                    ? 'active'
                    : ''
                }`}
              >
                <a
                  href="#"
                  className="journal-entries__entry-reflections-action"
                  onClick={(e) => {
                    e.preventDefault()
                    handleShowAddReflection({
                      ...showAddReflection,
                      [entry.id]: true
                    })
                  }}
                >
                  Add reflection <FontAwesomeIcon icon={faPlus} />
                </a>
              </div>
            </div>
            {entry.contentAfter && (
              <div
                className="page-card__content-description journal-entry__content-after"
                dangerouslySetInnerHTML={{
                  __html: entry.contentAfter
                }}
              ></div>
            )}
          </div>
        ))}
    </div>
  ) : (
    <></>
  )
}

export default EntriesBox
