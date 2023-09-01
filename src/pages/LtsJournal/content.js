import React, { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { faPlus, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MediaLightbox from '../../components/MediaLightbox'
import parse from 'html-react-parser'
import EntriesBox from './EntriesBox'
import TableWrapper from './TableWrapper/index'
import TableReflections from './TableReflections/index.js'
import _, { debounce, isEqual } from 'lodash'
import MeetingManager from './ArchiveManager/MeetingManager/MeetingManager'
import FeedbackManager from './ArchiveManager/FeedbackManager/FeedbackManager'
import AccordionItemWrapper from './AccordionItemWrapper'
import MentorMeetingManager from './ArchiveManager/MentorMeetingManager/MentorMeetingManager'
import ContentUploads from './ContentUploads/ContentUploads'
import CertificationSkills from './CertificationSkills/CertificationSkills'
import AccordionItems from './MyGoals/AccordionItems'
import JournalBrands from './JournalBrands/index'
import * as actions from '../../redux/reflectionsTable/Actions'
import { useDispatch } from 'react-redux'
import { Table } from 'react-bootstrap'
import {
  JournalTableCell,
  JournalTableCellInput,
  JournalTableRow
} from './TableWrapper/TableComponents'
import MonthlyBudgetComponent from './MonthlyBudget.component'

function LtsJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(true)
  let [showVideo, setShowVideo] = useState(false)

  const [openAccordion, setOpenAccordion] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const dispatch = useDispatch()
  const [filteredNullFinancialSnapshots, setFilteredNullFinancialSnapshots] =
    useState([])
  const [expenseTable, setExpenseTable] = useState([])
  const [incomeTable, setIncomeTable] = useState([])
  const [monthlyIncome, setMonthlyIncome] = useState([])
  const [monthlyFixedExpense, setMonthlyFixedExpense] = useState([])
  const [monthlyVariableExpense, setMonthlyVariableExpense] = useState([])
  const [financialProfilesTable, setFinancialProfilesTable] = useState([])
  console.log(financialProfilesTable)
  const handleAccordionClick = (accordion) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(accordion)
    }
  }

  useEffect(() => {
    setIsExpanded(false)
  }, [props.match.params.id])

  const handleShowAddReflection = (showAddReflection) => {
    setShowAddReflection(showAddReflection)
  }
  async function saveWatchData(data) {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.journalId}/videoWatchData`,
      {
        videoWatchData: JSON.stringify(data)
      }
    )
  }

  async function saveVideoWatched() {
    await axiosInstance.put(
      `/ltsJournals/${props.match.params.journalId}/watchedVideo`
    )
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )

  async function getJournal() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}`
      )
      return data
    } catch (err) {}
  }

  async function getUserJournalEntries() {
    try {
      let { data } = await axiosInstance.get(
        `/ltsJournals/${props.match.params.journalId}/userEntries`
      )
      let groupedByJournalEntry = {}
      if (data) {
        for (var userJournalEntry of data) {
          if (groupedByJournalEntry[userJournalEntry.journalEntryId]) {
            groupedByJournalEntry[userJournalEntry.journalEntryId].push(
              userJournalEntry
            )
          } else {
            groupedByJournalEntry[userJournalEntry.journalEntryId] = [
              userJournalEntry
            ]
          }
        }
      }

      return groupedByJournalEntry
    } catch (err) {}
  }

  const filterFinancialSnapshots = (
    journalData,
    type,
    setFinancialSnapshotData
  ) => {
    const financialSnapshotData = journalData?.financialSnapshots?.filter(
      (fs) => fs.transactionType === type
    )
    setFinancialSnapshotData(financialSnapshotData)
  }

  function loadData() {
    setLoading(true)
    Promise.all([getJournal(), getUserJournalEntries()])
      .then(([journalData, userJournalEntries]) => {
        filterFinancialSnapshots(journalData, 'expense', setExpenseTable)
        filterFinancialSnapshots(journalData, 'income', setIncomeTable)
        filterFinancialSnapshots(
          journalData,
          'monthly_income',
          setMonthlyIncome
        )
        filterFinancialSnapshots(
          journalData,
          'monthly_fixed_expense',
          setMonthlyFixedExpense
        )
        filterFinancialSnapshots(
          journalData,
          'monthly_variable_expense',
          setMonthlyVariableExpense
        )
        setJournal(journalData)
        setFinancialProfilesTable(journalData.financialProfilesTable)

        if (
          journalData.userEntry &&
          journalData.userEntry.length > 0 &&
          journalData.userEntry[0].videoWatchData
        ) {
          try {
            setVideoWatchData(
              JSON.parse(journalData.userEntry[0].videoWatchData)
            )
          } catch (err) {}
        }
        setUserJournalEntries(userJournalEntries)

        if (props.contentContainer && props.contentContainer.current) {
          props.contentContainer.current.scrollTop = 0
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(
    function () {
      loadData()
    },
    [props.match.params.journalId]
  )

  function deleteReflection(entry, userJournalEntry) {
    return (data) => {
      let filtered = userJournalEntries[entry.id].filter(
        (mapUserJournalEntry) => {
          return mapUserJournalEntry.id !== userJournalEntry.id
        }
      )

      if (filtered.length) {
        setUserJournalEntries({
          ...userJournalEntries,
          [entry.id]: filtered
        })
      } else {
        delete userJournalEntries[entry.id]

        setUserJournalEntries({
          ...userJournalEntries
        })
      }
    }
  }

  function addReflection(entry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: [...(userJournalEntries[entry.id] || []), data.entry]
      })
      setShowAddReflection({ ...showAddReflection, [entry.id]: false })

      props.saved && props.saved(data.journal)
    }
  }

  function updateReflection(entry, userJournalEntry) {
    return (data) => {
      setUserJournalEntries({
        ...userJournalEntries,
        [entry.id]: userJournalEntries[entry.id].map((mapUserJournalEntry) => {
          return mapUserJournalEntry.id === userJournalEntry.id
            ? data.entry
            : mapUserJournalEntry
        })
      })

      props.saved && props.saved(data.journal)
    }
  }

  if (!journal) {
    return null
  }

  let videos = (
    journal.videos && journal.videos.constructor == Array
      ? journal.videos
      : [journal.video]
  ).filter(Boolean)

  const updateUserReflectionsTable = (updatedTable, index) => {
    const updatedJournal = { ...journal }

    const foundedReflectionsTable = updatedJournal?.reflectionsTable[index]

    if (foundedReflectionsTable) {
      const updatedUserReflectionsTable = [
        ...foundedReflectionsTable.userReflectionsTable
      ]

      updatedUserReflectionsTable.push(updatedTable)

      foundedReflectionsTable.userReflectionsTable = updatedUserReflectionsTable

      updatedJournal.reflectionsTable[index] = foundedReflectionsTable

      setJournal(updatedJournal)
    }
  }

  const updateTableData = (tableData, index, newObj, setTableData) => {
    let foundedItem = tableData?.find((item, itemIndex) => itemIndex === index)

    if (foundedItem) {
      foundedItem.userFinancialSnapshot = newObj
    }

    const newTableData = tableData?.map((item) =>
      item.id === foundedItem?.id ? foundedItem : item
    )

    setTableData(newTableData)
  }

  const updateFinancialProfileInTable = (
    financialProfilesTable,
    fptId,
    fpId,
    newFinancialProfile
  ) => {
    return financialProfilesTable.map((fpt) => {
      if (fpt.id === fptId) {
        return {
          ...fpt,
          financialProfiles: fpt.financialProfiles.map((fp) => {
            if (fp.id === fpId) {
              return {
                ...fp,
                userFinancialProfiles: { ...newFinancialProfile }
              }
            }
            return fp
          })
        }
      }
      return fpt
    })
  }

  const handleChangeFinancialProfile = async (
    obj,
    value,
    isEdit,
    fpIndex,
    fptIndex,
    fpId,
    fptId
  ) => {
    const newValue = value
    // isEdit
    const editContent = {
      content: newValue,
      financialProfilesId: obj.financialProfilesId,
      journalId: obj.journalId,
      id: obj.id,
      order: obj.order
    }
    // isCreate
    const createContent = {
      content: newValue,
      financialProfilesId: obj.id,
      journalId: obj.journalId,
      order: obj.order
    }
    const newFinancialProfile = isEdit ? editContent : createContent

    const newFinancialProfilesTable = updateFinancialProfileInTable(
      financialProfilesTable,
      fptId,
      fpId,
      newFinancialProfile
    )
    setFinancialProfilesTable(newFinancialProfilesTable)

    debounce(updateFinancialProfiles, {
      financialProfile: newFinancialProfile,
      fptId,
      fpId
    })
  }

  const updateFinancialProfiles = async (obj, value) => {
    await axiosInstance
      .put(`/ltsJournals/user-financial-profiles`, {
        ...value.financialProfile
      })
      .then(({ data }) => {
        const newFinancialProfilesTable = updateFinancialProfileInTable(
          financialProfilesTable,
          value.fptId,
          value.fpId,
          data
        )

        setFinancialProfilesTable(newFinancialProfilesTable)
      })
  }
  const handleChangeAmount = async (obj, value, isEdit, index, name) => {
    const newValue = +value
    // isEdit
    const editAmount = {
      amount: newValue,
      financialSnapshotId: obj.financialSnapshotId,
      journalId: obj.journalId,
      id: obj.id
    }
    // isCreate
    const createAmount = {
      amount: newValue,
      financialSnapshotId: obj.id,
      journalId: obj.journalId
    }

    const newAmountObj = isEdit ? editAmount : createAmount
    if (name === 'expense') {
      updateTableData(expenseTable, index, newAmountObj, setExpenseTable)
    }
    if (name === 'income') {
      updateTableData(incomeTable, index, newAmountObj, setIncomeTable)
    }
    if (name === 'monthly_income') {
      updateTableData(monthlyIncome, index, newAmountObj, setMonthlyIncome)
    }
    if (name === 'monthly_fixed_expense') {
      updateTableData(
        monthlyFixedExpense,
        index,
        newAmountObj,
        setMonthlyFixedExpense
      )
    }
    if (name === 'monthly_variable_expense') {
      updateTableData(
        monthlyVariableExpense,
        index,
        newAmountObj,
        setMonthlyVariableExpense
      )
    }
    debounce(updateAmount, newAmountObj)
  }

  const updateTableWithFinancialSnapshot = (
    tableData,
    updatedItem,
    setTableData
  ) => {
    const foundedItem = tableData?.find((item) => item.id === updatedItem.id)

    if (foundedItem) {
      foundedItem.userFinancialSnapshot = updatedItem.userFinancialSnapshot
    }

    const newTableData = tableData?.map((item) =>
      item.id === foundedItem?.id ? foundedItem : item
    )

    setTableData(newTableData)
  }
  const updateAmount = async (obj, value) => {
    await axiosInstance
      .put(`/ltsJournals/user-financial-snapshots`, {
        ...value
      })
      .then(({ data }) => {
        const updatedData = {
          id: data.financialSnapshotId,
          userFinancialSnapshot: data
        }
        updateTableWithFinancialSnapshot(
          expenseTable,
          updatedData,
          setExpenseTable
        )
        updateTableWithFinancialSnapshot(
          incomeTable,
          updatedData,
          setIncomeTable
        )
        updateTableWithFinancialSnapshot(
          monthlyIncome,
          updatedData,
          setMonthlyIncome
        )
        updateTableWithFinancialSnapshot(
          monthlyFixedExpense,
          updatedData,
          setMonthlyFixedExpense
        )
        updateTableWithFinancialSnapshot(
          monthlyVariableExpense,
          updatedData,
          setMonthlyVariableExpense
        )
      })
  }

  const handleChangeBudgetAllocation = (name, value, isEdit) => {
    const userBudgetAllocationId = journal?.userBudgetAllocation?.id

    const baseBudgetAllocation = {
      needs: journal?.userBudgetAllocation?.needs ?? '',
      wants: journal?.userBudgetAllocation?.wants ?? '',
      savingsInvestments:
        journal?.userBudgetAllocation?.savingsInvestments ?? '',
      journalId: props.match.params.journalId
    }

    let createBudgetAllocation = { ...baseBudgetAllocation }
    let editBudgetAllocation = {
      ...baseBudgetAllocation,
      id: userBudgetAllocationId
    }

    let newBudgetAllocation = userBudgetAllocationId
      ? { ...editBudgetAllocation }
      : { ...createBudgetAllocation }

    newBudgetAllocation[name] = value

    const newJournal = { ...journal, userBudgetAllocation: newBudgetAllocation }
    setJournal(newJournal)
    debounce(updateBudgetAllocation, newBudgetAllocation)
  }

  const updateBudgetAllocation = async (obj, value) => {
    await axiosInstance
      .put(`/ltsJournals/budget-allocation`, {
        ...value
      })
      .then(({ data }) => {
        const newJournal = { ...journal, userBudgetAllocation: data }
        // debugger
        setJournal(newJournal)
      })
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="journal-entries__back">
            <NavLink to={props.backRoute}>Back</NavLink>
          </div>

          <h4 className="page-card__content-title">{journal.title}</h4>

          {videos &&
            videos.constructor == Array &&
            videos.map((video, index) => (
              <MediaLightbox
                video={video}
                key={index}
                show={showVideo === video.id}
                onClose={() => setShowVideo(false)}
                // watchData={videoWatchData}
                // onVideoData={saveWatchData}
                // onVideoWatched={saveVideoWatched}
              />
            ))}
          {videos && videos.constructor == Array && videos.length > 0 && (
            <div
              className={`journal-entries__videos journal-entries__videos--${
                videos.length > 1 ? 'multiple' : 'single'
              }`}
            >
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`journal-entries__video${
                    journal.content == '' ? '--welcome-video' : ''
                  }`}
                >
                  <div
                    className={`journal-entries__video-thumbnail${
                      journal.content == '' ? '--welcome-video' : ''
                    }`}
                    onClick={() => setShowVideo(video.id)}
                  >
                    <img src={video.thumbnail} />
                    <div
                      className={`journal-entries__video-thumbnail-icon${
                        journal.content == '' ? '--welcome-video' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {journal?.content?.includes('<div') ||
          journal?.content?.includes('<p') ? (
            parse(`${journal.content}`)
          ) : (
            <p className="page-card__content-description">{journal.content}</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="journal-entries">
            <EntriesBox
              entries={journal.entries}
              entryBoxTitle={journal?.title}
              journal={journal}
              isEditable={true}
              isDeletable={true}
              userJournalEntries={userJournalEntries}
              deleteReflection={(entry, userJournalEntry) =>
                deleteReflection(entry, userJournalEntry)
              }
              updateReflection={(entry, userJournalEntry) =>
                updateReflection(entry, userJournalEntry)
              }
              addReflection={(entry) => addReflection(entry)}
              handleShowAddReflection={(reflection) =>
                handleShowAddReflection(reflection)
              }
              showAddReflection={showAddReflection}
            />
          </div>
        </div>
        <div className="col-12">
          <div className={'custom-breakdowns-container'}>
            {journal.hasAccordion ? (
              <div>
                {!loading && (
                  <div style={{ order: 1 }}>
                    {
                      <AccordionItemWrapper
                        isOpened={openAccordion === 'evaluation'}
                        handleAccordionClick={() =>
                          handleAccordionClick('evaluation')
                        }
                        isExanded={isExpanded}
                        title={'EVALUATION SYSTEM'}
                      >
                        {openAccordion === 'evaluation' && <AccordionItems />}
                      </AccordionItemWrapper>
                    }
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {journal.accordions && journal.accordions.length
          ? journal.accordions.map((accordion) => (
              <div className="col-12">
                <AccordionItemWrapper
                  isOpened={openAccordion === `accordion-${accordion.id}`}
                  handleAccordionClick={() =>
                    handleAccordionClick(`accordion-${accordion.id}`)
                  }
                  isExanded={false}
                  title={accordion.title}
                >
                  {openAccordion === `accordion-${accordion.id}` && (
                    <>
                      <div className="accordion-content">
                        <div className="col-12">
                          <div className="">
                            <EntriesBox
                              entries={accordion.ltsJournalAccordionEntries}
                              entryBoxTitle={journal?.title}
                              journal={journal}
                              userJournalEntries={userJournalEntries}
                              deleteReflection={(entry, userJournalEntry) =>
                                deleteReflection(entry, userJournalEntry)
                              }
                              updateReflection={(entry, userJournalEntry) =>
                                updateReflection(entry, userJournalEntry)
                              }
                              addReflection={(entry) => addReflection(entry)}
                              handleShowAddReflection={(reflection) =>
                                handleShowAddReflection(reflection)
                              }
                              showAddReflection={showAddReflection}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </AccordionItemWrapper>
              </div>
            ))
          : null}
        {journal.brandsJournal &&
        journal.brandsJournal.length &&
        journal.brandsJournal.find((item) => item.hasAccordion) ? (
          <div className="col-12">
            <AccordionItemWrapper
              isOpened={openAccordion === `accordion-brand`}
              handleAccordionClick={() =>
                handleAccordionClick(`accordion-brand`)
              }
              isExanded={false}
              title={'BRAND VIDEO SPRINT'}
            >
              {openAccordion === `accordion-brand` && (
                <div className="accordion-content">
                  <div className="col-12">
                    <JournalBrands
                      hasAccordion={1}
                      loadData={loadData}
                      brands={journal.brandsJournal}
                      journalId={props.match.params.journalId}
                      hasActions={false}
                    />
                  </div>
                </div>
              )}
            </AccordionItemWrapper>
          </div>
        ) : null}
        {journal.reflectionsTable && journal.reflectionsTable.length ? (
          <>
            {journal.reflectionsTable.map((reflectionTable, tableIndex) => (
              <div className="col-12" key={reflectionTable.id}>
                {reflectionTable.userReflectionsTable.length === 0 ? (
                  <TableWrapper title={reflectionTable.title}>
                    <TableReflections
                      name={'reflectionsTable'}
                      isEditable={true}
                      loadData={loadData}
                      tableTitle={reflectionTable.title}
                      start={reflectionTable.startDate}
                      end={reflectionTable.endDate}
                      reflectionTable={reflectionTable}
                      userReflectionsTable={
                        reflectionTable.userReflectionsTable
                      }
                      reflectionTableEntries={
                        reflectionTable.reflectionsTableEntries
                      }
                      userReflectionTableEntries={
                        reflectionTable.userReflectionsTableEntries
                      }
                      updateUserReflectionsTable={(data) =>
                        updateUserReflectionsTable(data, tableIndex)
                      }
                    />
                  </TableWrapper>
                ) : (
                  <>
                    {reflectionTable.userReflectionsTable.map(
                      (userReflectionTable) => (
                        <TableWrapper title={userReflectionTable.title}>
                          <TableReflections
                            name={'userReflectionsTable'}
                            loadData={() => {
                              loadData()
                            }}
                            isEditable={true}
                            tableTitle={userReflectionTable.title}
                            start={userReflectionTable.startDate}
                            end={userReflectionTable.endDate}
                            reflectionTable={userReflectionTable}
                            userReflectionsTable={[
                              ...reflectionTable.userReflectionsTable
                            ]}
                            reflectionTableEntries={[
                              ...(userReflectionTable?.userReflectionsTableEntries ||
                                []),
                              ...reflectionTable.reflectionsTableEntries
                            ]}
                            userReflectionTableEntries={
                              reflectionTable.userReflectionsTableEntries
                            }
                          />
                        </TableWrapper>
                      )
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        ) : null}
        {journal?.financialProfilesTable &&
        journal?.financialProfilesTable?.length > 0 ? (
          <>
            <div>Financial Profiles</div>
            <div className="col-12">
              {financialProfilesTable
                ?.toSorted((a, b) => a.order - b.order)
                ?.map((fpt, fptIndex) => {
                  return (
                    <>
                      <div>{fpt.title}</div>
                      {fpt.financialProfiles
                        ?.toSorted((a, b) => a.order - b.order)
                        ?.map((fp, fpIndex) => {
                          return (
                            <Table bordered hover style={{ marginBottom: 0 }}>
                              <tbody>
                                <JournalTableRow key={fp.id}>
                                  <JournalTableCell
                                    isGray
                                    additionalStyling={{
                                      width: '50%',
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    {fp.title}
                                  </JournalTableCell>
                                  <JournalTableCell
                                    additionalStyling={{ width: '50%' }}
                                  >
                                    {fp.userFinancialProfiles ? (
                                      <JournalTableCellInput
                                        type={'text'}
                                        value={
                                          fp.userFinancialProfiles?.content
                                        }
                                        handleChange={(value) => {
                                          const isEdit =
                                            !!fp.userFinancialProfiles
                                          return handleChangeFinancialProfile(
                                            fp.userFinancialProfiles,
                                            value,
                                            isEdit,
                                            fpIndex,
                                            fptIndex,
                                            fp.id,
                                            fpt.id
                                          )
                                        }}
                                      />
                                    ) : (
                                      <JournalTableCellInput
                                        type={'text'}
                                        handleChange={(value) => {
                                          const isEdit =
                                            !!fp.userFinancialProfiles
                                          return handleChangeFinancialProfile(
                                            fp,
                                            value,
                                            isEdit,
                                            fpIndex,
                                            fptIndex,
                                            fp.id,
                                            fpt.id
                                          )
                                        }}
                                      />
                                    )}
                                  </JournalTableCell>
                                </JournalTableRow>
                              </tbody>
                            </Table>
                          )
                        })}
                    </>
                  )
                })}
            </div>
          </>
        ) : null}
        {journal?.financialSnapshots ? (
          <>
            {expenseTable.length > 0 && (
              <div className="col-12">
                <Table bordered hover style={{ marginBottom: 0 }}>
                  <thead>
                    <JournalTableRow>
                      <JournalTableCell isGray>
                        Expense Category
                      </JournalTableCell>
                      <JournalTableCell isGray>
                        What's included
                      </JournalTableCell>
                      <JournalTableCell isGray>Amount</JournalTableCell>
                    </JournalTableRow>
                  </thead>
                  <tbody>
                    {expenseTable.map((cell, index) => {
                      return (
                        <JournalTableRow key={cell.transactionName}>
                          <JournalTableCell isGray>
                            {cell.transactionName}
                          </JournalTableCell>
                          <JournalTableCell isGray>
                            {cell.includedItem}
                          </JournalTableCell>
                          <JournalTableCell>
                            {cell.userFinancialSnapshot ? (
                              <JournalTableCellInput
                                type={'number'}
                                value={cell.userFinancialSnapshot?.amount}
                                handleChange={(value) => {
                                  const isEdit = cell.userFinancialSnapshot
                                  return handleChangeAmount(
                                    cell.userFinancialSnapshot,
                                    value,
                                    isEdit,
                                    index,
                                    'expense'
                                  )
                                }}
                              />
                            ) : (
                              <JournalTableCellInput
                                type={'number'}
                                handleChange={(value) => {
                                  const isEdit = cell.userFinancialSnapshot
                                  return handleChangeAmount(
                                    cell,
                                    value,
                                    isEdit,
                                    index,
                                    'expense'
                                  )
                                }}
                              />
                            )}
                          </JournalTableCell>
                        </JournalTableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            )}
            <div style={{ padding: '10px 0' }}></div>
            {incomeTable.length > 0 && (
              <div className="col-12">
                <Table bordered hover style={{ marginBottom: 0 }}>
                  <thead>
                    <JournalTableRow>
                      <JournalTableCell isGray>
                        Income Category
                      </JournalTableCell>
                      <JournalTableCell isGray>Amount</JournalTableCell>
                    </JournalTableRow>
                  </thead>
                  <tbody>
                    {incomeTable.map((cell, index) => {
                      return (
                        <JournalTableRow key={cell.transactionName}>
                          <JournalTableCell isGray>
                            {cell.transactionName}
                          </JournalTableCell>
                          <JournalTableCell>
                            {cell.userFinancialSnapshot ? (
                              <JournalTableCellInput
                                type={'number'}
                                value={cell.userFinancialSnapshot?.amount}
                                handleChange={(value) => {
                                  const isEdit = cell.userFinancialSnapshot
                                  return handleChangeAmount(
                                    cell.userFinancialSnapshot,
                                    value,
                                    isEdit,
                                    index,
                                    'income'
                                  )
                                }}
                              />
                            ) : (
                              <JournalTableCellInput
                                type={'number'}
                                // value={value?.amount}
                                handleChange={(value) => {
                                  const isEdit = cell.userFinancialSnapshot
                                  return handleChangeAmount(
                                    cell,
                                    value,
                                    isEdit,
                                    index,
                                    'income'
                                  )
                                }}
                              />
                            )}
                          </JournalTableCell>
                        </JournalTableRow>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            )}
            <div style={{ padding: '10px 0' }}></div>
            {journal?.userBudgetAllocation && (
              <div className="col-12">
                <Table bordered hover style={{ marginBottom: 0 }}>
                  <thead>
                    <JournalTableRow>
                      <JournalTableCell isGray>Needs</JournalTableCell>
                      <JournalTableCell isGray>Wants</JournalTableCell>
                      <JournalTableCell isGray>
                        Savings/Investments
                      </JournalTableCell>
                    </JournalTableRow>
                  </thead>
                  <tbody>
                    <JournalTableRow>
                      <JournalTableCell>
                        {journal?.userBudgetAllocation ? (
                          <JournalTableCellInput
                            type={'text'}
                            value={journal?.userBudgetAllocation?.needs}
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation(
                                'needs',
                                value
                              )
                            }}
                          />
                        ) : (
                          <JournalTableCellInput
                            type={'text'}
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation(
                                'needs',
                                value
                              )
                            }}
                          />
                        )}
                      </JournalTableCell>
                      <JournalTableCell>
                        {journal?.userBudgetAllocation ? (
                          <JournalTableCellInput
                            type={'text'}
                            value={journal?.userBudgetAllocation?.wants}
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation(
                                'wants',
                                value
                              )
                            }}
                          />
                        ) : (
                          <JournalTableCellInput
                            type={'text'}
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation(
                                'wants',
                                value
                              )
                            }}
                          />
                        )}
                      </JournalTableCell>
                      <JournalTableCell>
                        {journal?.userBudgetAllocation ? (
                          <JournalTableCellInput
                            type={'text'}
                            value={
                              journal?.userBudgetAllocation?.savingsInvestments
                            }
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation(
                                'savingsInvestments',
                                value
                              )
                            }}
                          />
                        ) : (
                          <JournalTableCellInput
                            type={'text'}
                            handleChange={(value) => {
                              return handleChangeBudgetAllocation('', value)
                            }}
                          />
                        )}
                      </JournalTableCell>
                    </JournalTableRow>
                  </tbody>
                </Table>
              </div>
            )}
            {(monthlyFixedExpense.length > 0 ||
              monthlyVariableExpense.length > 0 ||
              monthlyIncome.length > 0) && (
              <div className="col-12">
                <TableWrapper title={'Monthly budget'}>
                  <MonthlyBudgetComponent
                    monthlyTransaction={monthlyIncome}
                    handleChangeAmount={handleChangeAmount}
                    financialType={'monthly_income'}
                  />{' '}
                  <MonthlyBudgetComponent
                    monthlyTransaction={monthlyFixedExpense}
                    handleChangeAmount={handleChangeAmount}
                    financialType={'monthly_fixed_expense'}
                  />
                  <MonthlyBudgetComponent
                    monthlyTransaction={monthlyVariableExpense}
                    handleChangeAmount={handleChangeAmount}
                    financialType={'monthly_variable_expense'}
                  />
                </TableWrapper>
              </div>
            )}
          </>
        ) : null}

        {journal?.teamMeetings ? (
          <MeetingManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.feedbacks ? (
          <FeedbackManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.mentorMeetings ? (
          <MentorMeetingManager journal={journal} isEditable={true} />
        ) : null}
        {journal?.contentUploads ? (
          <ContentUploads journal={journal} isEditable={true} />
        ) : null}
        {journal?.certificationSkills ? (
          <CertificationSkills journal={journal} isEditable={true} />
        ) : null}
        {journal.brandsJournal &&
        journal.brandsJournal.length &&
        !journal.brandsJournal.find((item) => item.hasAccordion) ? (
          <JournalBrands
            hasAccordion={0}
            loadData={loadData}
            brands={journal.brandsJournal}
            journalId={props.match.params.journalId}
            hasActions={true}
          />
        ) : null}
      </div>
    </>
  )
}

export default injectIntl(LtsJournalContent, {
  withRef: false
})
