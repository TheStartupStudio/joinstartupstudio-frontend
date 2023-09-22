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
  JournalTableRow,
  UserJournalTableCell
} from './TableWrapper/TableComponents'
import MonthlyBudgetComponent from './MonthlyBudget.component'
import JobApplicationTable from './PersonalFinanceComponents/JobApplicationTable'
import CollegePlansTable from './PersonalFinanceComponents/CollegePlansTable'
import ResumeEvaluationTable from './PersonalFinanceComponents/ResumeEvaulationTable'
import LifestyleHousingTable from './PersonalFinanceComponents/LifestyleHousingTable'
import JournalTables from './JournalTables/JournalTables'

function LtsJournalContent(props) {
  let [showAddReflection, setShowAddReflection] = useState({})
  let [journal, setJournal] = useState({})
  let [videoWatchData, setVideoWatchData] = useState([])
  let [userJournalEntries, setUserJournalEntries] = useState({})
  let [loading, setLoading] = useState(false)
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
  const [financialAccounts, setFinancialAccounts] = useState([])
  const [researchQuestionTable, setResearchQuestionTable] = useState({})
  const [creditCardInfoTable, setCreditCardInfoTable] = useState({})
  const [collegeInfoTables, setCollegeInfoTables] = useState([])
  const [economicMajorsTables, setEconomicMajorsTables] = useState([])
  const [jobApplicationTables, setJobApplicationTables] = useState([])
  const [journalId, setJournalId] = useState(null)
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
  useEffect(() => {
    setJournalId(props.match.params.journalId)
  }, [props.match.params.journalId])

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
        `/ltsJournals/${props.match.params.journalId}/student/${0}`
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
        setEconomicMajorsTables(journalData.economicMajorsTables)
        setFinancialAccounts(journalData.financialAccounts)
        setResearchQuestionTable(journalData.researchQuestionTable)
        setCreditCardInfoTable(journalData.creditCardInfoTables)
        setCollegeInfoTables(journalData.collegePlansTables)
        setJobApplicationTables(journalData.jobApplicationTables)

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

  const handleChangeFinancialAccountsFields = async (
    type,
    obj,
    value,
    isEdit,
    fafId,
    faId
  ) => {
    const updatedObj = { ...obj }

    if (type === 'fieldOne') {
      updatedObj.fieldOne = value
    } else if (type === 'fieldTwo') {
      updatedObj.fieldTwo = value
    }

    const content = {
      fieldOne: updatedObj.fieldOne ?? '',
      fieldTwo: updatedObj.fieldTwo ?? '',
      financialAccountsFieldsId: fafId,
      journalId: props.match.params.journalId,
      order: updatedObj.order
    }

    if (isEdit) {
      content.id = updatedObj.id
      content.financialAccountsFieldsId = updatedObj.financialAccountsFieldsId
    }

    const financialAccountsFields = updateFinancialAccountsFields(
      financialAccounts,
      fafId,
      faId,
      content
    )
    setFinancialAccounts(financialAccountsFields)
    debounce(updateFinancialAccount, { content, fafId, faId })
  }
  const updateFinancialAccountsFields = (
    financialAccounts,
    fafId,
    faId,
    newFinancialProfile
  ) => {
    return financialAccounts.map((fa) => {
      if (fa.id === faId) {
        return {
          ...fa,
          financialAccountsFields: fa.financialAccountsFields.map((faf) => {
            if (faf.id === fafId) {
              return {
                ...faf,
                userFinancialAccountsField: { ...newFinancialProfile }
              }
            }
            return faf
          })
        }
      }
      return fa
    })
  }

  const updateFinancialAccount = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-financial-accounts-fields`, {
        ...newData.content
      })
      .then(({ data }) => {
        const financialAccountsFields = financialAccounts.map((fa) => {
          if (fa.id === newData.faId) {
            return {
              ...fa,
              financialAccountsFields: fa.financialAccountsFields.map((faf) => {
                if (faf.id === newData.fafId) {
                  const newFaf = {
                    ...faf,
                    userFinancialAccountsField: data
                  }
                  return newFaf
                }
                return faf
              })
            }
          }
          return fa
        })
        setLoading(false)
        setFinancialAccounts(financialAccountsFields)
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

  const updateUserResearchQuestion = (researchQuestions, rqId, content) => {
    const newResearchQuestions = researchQuestions.map((rq) => {
      if (rq.id === rqId) {
        const newRq = {
          ...rq,
          userResearchQuestion: content
        }
        return newRq
      }
      return rq
    })
    return newResearchQuestions
  }

  const handleChangeUserCreditScoreGoal = (...props) => {
    const [obj, value, isEdit] = props
    const updatedObj = { ...obj }
    const newResearchQuestionTable = { ...researchQuestionTable }

    const content = {
      title: value ?? '',
      researchQuestionTableId: newResearchQuestionTable.id,
      journalId: journalId
    }

    if (isEdit) {
      content.id = updatedObj.id
      content.researchQuestionTableId = updatedObj.researchQuestionTableId
      delete content.journalId
    }

    newResearchQuestionTable.userCreditScoreGoal = content
    setResearchQuestionTable(newResearchQuestionTable)
    debounce(updateChangeUserCreditScoreGoal, { content })
  }

  const updateChangeUserCreditScoreGoal = async (obj, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-credit-score-goal`, {
        ...newData.content
      })
      .then(({ data }) => {
        const newResearchQuestionTable = { ...researchQuestionTable }
        newResearchQuestionTable.userCreditScoreGoal = data
        setResearchQuestionTable(newResearchQuestionTable)

        setLoading(false)
      })
  }

  const handleChangeResearchQuestion = (...props) => {
    const [obj, value, isEdit, rqId, type] = props
    const newResearchQuestionTable = { ...researchQuestionTable }
    const researchQuestions = newResearchQuestionTable.researchQuestions

    const updatedObj = { ...obj }

    if (type === 'question') {
      updatedObj.question = value
    } else if (type === 'research') {
      updatedObj.research = value
    }

    const content = {
      question: updatedObj.question ?? '',
      research: updatedObj.research ?? '',
      researchQuestionId: rqId,
      journalId: journalId
    }

    if (isEdit) {
      content.id = updatedObj.id
      content.researchQuestionId = updatedObj.researchQuestionId
      delete content.journalId
    }
    const newResearchQuestions = updateUserResearchQuestion(
      researchQuestions,
      rqId,
      content
    )

    newResearchQuestionTable.researchQuestions = newResearchQuestions
    setResearchQuestionTable(newResearchQuestionTable)
    debounce(updateResearchQuestionTable, { content, rqId })
  }
  const updateResearchQuestionTable = async (obj, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-research-question`, {
        ...newData.content
      })
      .then(({ data }) => {
        const researchQuestions = [...researchQuestionTable.researchQuestions]
        const newResearchQuestions = updateUserResearchQuestion(
          researchQuestions,
          newData.rqId,
          data
        )

        researchQuestionTable.researchQuestions = newResearchQuestions
        setResearchQuestionTable(researchQuestionTable)
        setLoading(false)
      })
  }

  const updateCreditCardInfoTable = (columnId, cellId, content) => {
    let newCreditCardInfoTable = { ...creditCardInfoTable }
    const creditCardInfoColumns = newCreditCardInfoTable.creditCardInfoColumns
    const newCreditCardInfoColumns = creditCardInfoColumns?.map((column) => {
      if (column.id === columnId) {
        const newCreditCardInfoCells = column?.creditCardInfoCells?.map(
          (cell) => {
            if (cell.id === cellId) {
              return { ...cell, userCreditCardInfoCell: content }
            }
            return cell
          }
        )
        return { ...column, creditCardInfoCells: newCreditCardInfoCells }
      }
      return column
    })
    newCreditCardInfoTable.creditCardInfoColumns = newCreditCardInfoColumns
    return newCreditCardInfoTable
  }

  const handleChangeCreditCardInfo = async (
    obj,
    value,
    isEdit,
    columnId,
    cellId
  ) => {
    const content = {
      content: value ?? '',
      creditCardInfoCellId: cellId
      // journalId: journalId
    }
    delete content.id

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.creditCardInfoCellId = obj.creditCardInfoCellId
      // delete content.journalId
    }

    const newCreditCardInfoTable = updateCreditCardInfoTable(
      columnId,
      cellId,
      content
    )

    console.log(columnId, cellId)
    setCreditCardInfoTable(newCreditCardInfoTable)
    debounce(updateCreditCardInfoCell, { content, cellId, columnId })
  }

  const updateCreditCardInfoCell = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-credit-card-info-cell`, {
        ...newData.content
      })
      .then(({ data }) => {
        const newCreditCardInfoTable = updateCreditCardInfoTable(
          newData.columnId,
          newData.cellId,
          data
        )
        // debugger
        setCreditCardInfoTable(newCreditCardInfoTable)

        setLoading(false)
      })
  }

  const updateCollegeInfoTable = (
    tableId,
    rowId,
    columnId,
    cellId,
    content
  ) => {
    const updatedTables = collegeInfoTables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          collegePlansRows: table.collegePlansRows.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                collegePlansColumns: row.collegePlansColumns.map((column) => {
                  if (column.id === columnId) {
                    return {
                      ...column,
                      collegePlansCells: column.collegePlansCells.map(
                        (cell) => {
                          if (cell.id === cellId) {
                            return {
                              ...cell,
                              userCollegePlansCells: content
                            }
                          }
                          return cell
                        }
                      )
                    }
                  }
                  return column
                })
              }
            }
            return row
          })
        }
      }
      return table
    })
    return updatedTables
  }

  const handleCollegeInfo = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    columnId,
    cellId
  ) => {
    console.log(obj, value, isEdit, tableId, rowId, columnId, cellId)
    const content = {
      content: value ?? '',
      cellId: cellId,
      tableId: tableId
      // journalId: journalId
    }
    delete content.id

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.cellId = obj.cellId
      // delete content.journalId
    }

    const newCreditCardInfoTable = updateCollegeInfoTable(
      tableId,
      rowId,
      columnId,
      cellId,
      content
    )
    setCollegeInfoTables(newCreditCardInfoTable)

    debounce(updateCollegeInfo, { content, cellId, columnId, tableId, rowId })
  }

  const updateCollegeInfo = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-college-info`, {
        ...newData.content
      })
      .then(({ data }) => {
        debugger
        const newCreditCardInfoTable = updateCollegeInfoTable(
          newData.tableId,
          newData.rowId,
          newData.columnId,
          newData.cellId,
          data
        )
        setCreditCardInfoTable(newCreditCardInfoTable)

        setLoading(false)
      })
  }

  //

  const updateMajorsTable = (tableId, rowId, columnId, cellId, content) => {
    const updatedTables = economicMajorsTables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          economicMajorsRows: table.economicMajorsRows.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                economicMajorsColumns: row.economicMajorsColumns.map(
                  (column) => {
                    if (column.id === columnId) {
                      return {
                        ...column,
                        economicMajorsCells: column.economicMajorsCells.map(
                          (cell) => {
                            if (cell.id === cellId) {
                              return {
                                ...cell,
                                userEconomicMajorsCells: content
                              }
                            }
                            return cell
                          }
                        )
                      }
                    }
                    return column
                  }
                )
              }
            }
            return row
          })
        }
      }
      return table
    })
    return updatedTables
  }

  const handleMajorsInfo = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    columnId,
    cellId
  ) => {
    const content = {
      content: value ?? '',
      cellId: cellId,
      tableId: tableId
      // journalId: journalId
    }
    delete content.id

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.cellId = obj.cellId
      // delete content.journalId
    }

    const newMajorsTable = updateMajorsTable(
      tableId,
      rowId,
      columnId,
      cellId,
      content
    )
    setEconomicMajorsTables(newMajorsTable)

    debounce(updateMajors, { content, cellId, columnId, tableId, rowId })
  }

  const updateMajors = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-economic-majors`, {
        ...newData.content
      })
      .then(({ data }) => {
        const newMajorsTable = updateMajorsTable(
          newData.tableId,
          newData.rowId,
          newData.columnId,
          newData.cellId,
          data
        )
        setEconomicMajorsTables(newMajorsTable)

        setLoading(false)
      })
  }

  //

  const updateJobApplicationTable = (tableId, columnId, cellId, content) => {
    const updatedTables = jobApplicationTables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          jobApplicationColumns: table.jobApplicationColumns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                jobApplicationCells: column.jobApplicationCells.map((cell) => {
                  if (cell.id === cellId) {
                    return {
                      ...cell,
                      userJobApplicationCells: content
                    }
                  }
                  return cell
                })
              }
            }
            return column
          })
        }
      }
      return table
    })
    return updatedTables
  }

  const handleUpdateJobApplication = async (
    obj,
    value,
    isEdit,
    tableId,
    columnId,
    cellId
  ) => {
    const content = {
      content: value ?? '',
      cellId: cellId,
      tableId: tableId
      // journalId: journalId
    }
    delete content.id

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.cellId = obj.cellId
      // delete content.journalId
    }

    const jobApplicationTable = updateJobApplicationTable(
      tableId,
      columnId,
      cellId,
      content
    )
    setJobApplicationTables(jobApplicationTable)

    debounce(updateJobApplication, { content, cellId, columnId, tableId })
  }

  const updateJobApplication = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-job-application`, {
        ...newData.content
      })
      .then(({ data }) => {
        const jobApplicationTable = updateJobApplicationTable(
          newData.tableId,
          newData.columnId,
          newData.cellId,
          data
        )
        setJobApplicationTables(jobApplicationTable)

        setLoading(false)
      })
  }

  const tableColumnStyle = {
    backgroundColor: '#51c7df',
    color: '#fff',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    height: 56
  }

  console.log(journal.entries)

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
      {journal?.journalTables ? (
        <div className="col-12">
          <>
            <JournalTables
              tables={journal?.journalTables}
              paragraphs={journal?.journalParagraphs}
              loading={loading}
              handleChange={handleUpdateJobApplication}
              backgroundColor={'#fff'}
            />
          </>
        </div>
      ) : null}
      {journal?.entriesLists?.map((list) => (
        <div className="col-12" key={list.id}>
          <div className="journal-entries">
            <EntriesBox
              entries={list.entries}
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
      ))}

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
        {/*{journal?.jobApplicationTables ? (*/}
        {/*  <div className="col-12">*/}
        {/*    <>*/}
        {/*      <JobApplicationTable*/}
        {/*        tables={jobApplicationTables}*/}
        {/*        loading={loading}*/}
        {/*        handleUpdateJobApplication={handleUpdateJobApplication}*/}
        {/*      />*/}
        {/*    </>*/}
        {/*  </div>*/}
        {/*) : null}*/}

        {/*{journal?.resumeEvaluationTables ? (*/}
        {/*  <div className="col-12">*/}
        {/*    <>*/}
        {/*      <ResumeEvaluationTable*/}
        {/*        tables={journal?.resumeEvaluationTables}*/}
        {/*        loading={loading}*/}
        {/*        handleChange={handleUpdateJobApplication}*/}
        {/*      />*/}
        {/*    </>*/}
        {/*  </div>*/}
        {/*) : null}*/}

        {/*{journal?.lifestyleHousingTables ? (*/}
        {/*  <div className="col-12">*/}
        {/*    <>*/}
        {/*      <LifestyleHousingTable*/}
        {/*        tables={journal?.lifestyleHousingTables}*/}
        {/*        loading={loading}*/}
        {/*        handleChange={handleUpdateJobApplication}*/}
        {/*        backgroundColor={'#fff'}*/}
        {/*      />*/}
        {/*    </>*/}
        {/*  </div>*/}
        {/*) : null}*/}

        {/*{journal?.researchQuestionTable ? (*/}
        {/*  <div className="col-12">*/}
        {/*    <>*/}
        {/*      <div*/}
        {/*        style={{*/}
        {/*          backgroundColor: '#E5E5E5',*/}
        {/*          color: '#231F20',*/}
        {/*          fontFamily: 'Montserrat',*/}
        {/*          fontWeight: 700,*/}
        {/*          lineSpacing: 15,*/}
        {/*          padding: 10*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        {researchQuestionTable?.description}*/}
        {/*      </div>*/}
        {/*      {researchQuestionTable?.researchQuestions*/}
        {/*        ?.toSorted((a, b) => a.id - b.id)*/}
        {/*        .map((rq) => {*/}
        {/*          return (*/}
        {/*            <div className={'d-flex'}>*/}
        {/*              <UserJournalTableCell*/}
        {/*                cell={rq}*/}
        {/*                userCell={rq.userResearchQuestion}*/}
        {/*                userCellValue={rq.userResearchQuestion?.question}*/}
        {/*                handleChangeUserCell={(cellToUpdate, value, isEdit) => {*/}
        {/*                  if (!loading) {*/}
        {/*                    return handleChangeResearchQuestion(*/}
        {/*                      cellToUpdate,*/}
        {/*                      value,*/}
        {/*                      isEdit,*/}
        {/*                      rq.id,*/}
        {/*                      'question'*/}
        {/*                    )*/}
        {/*                  }*/}
        {/*                }}*/}
        {/*              />*/}
        {/*              <UserJournalTableCell*/}
        {/*                cell={rq}*/}
        {/*                userCell={rq.userResearchQuestion}*/}
        {/*                userCellValue={rq.userResearchQuestion?.research}*/}
        {/*                handleChangeUserCell={(cellToUpdate, value, isEdit) => {*/}
        {/*                  if (!loading) {*/}
        {/*                    return handleChangeResearchQuestion(*/}
        {/*                      cellToUpdate,*/}
        {/*                      value,*/}
        {/*                      isEdit,*/}
        {/*                      rq.id,*/}
        {/*                      'research'*/}
        {/*                    )*/}
        {/*                  }*/}
        {/*                }}*/}
        {/*              />*/}
        {/*            </div>*/}
        {/*          )*/}
        {/*        })}*/}
        {/*      <div*/}
        {/*        style={{ padding: 10, background: '#fff' }}*/}
        {/*        className={'d-flex align-items-center'}*/}
        {/*      >*/}
        {/*        <div*/}
        {/*          style={{*/}
        {/*            width: '60%',*/}
        {/*            color: '#231F20',*/}
        {/*            fontFamily: 'Montserrat',*/}
        {/*            fontWeight: 700,*/}
        {/*            lineSpacing: 15*/}
        {/*          }}*/}
        {/*        >*/}
        {/*          {researchQuestionTable?.creditScoreGoal}*/}
        {/*        </div>*/}
        {/*        <UserJournalTableCell*/}
        {/*          cell={researchQuestionTable}*/}
        {/*          userCell={researchQuestionTable?.userCreditScoreGoal}*/}
        {/*          userCellValue={*/}
        {/*            researchQuestionTable?.userCreditScoreGoal?.title*/}
        {/*          }*/}
        {/*          handleChangeUserCell={(cellToUpdate, value, isEdit) => {*/}
        {/*            if (!loading) {*/}
        {/*              return handleChangeUserCreditScoreGoal(*/}
        {/*                cellToUpdate,*/}
        {/*                value,*/}
        {/*                isEdit*/}
        {/*              )*/}
        {/*            }*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </>*/}
        {/*  </div>*/}
        {/*) : null}*/}

        {/*{journal?.collegePlansTables ? (*/}
        {/*  <div className="col-12">*/}
        {/*    <CollegePlansTable*/}
        {/*      tables={collegeInfoTables}*/}
        {/*      loading={loading}*/}
        {/*      handleChange={handleCollegeInfo}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*) : null}*/}
        {/*{journal?.economicMajorsTables ? (*/}
        {/*  <div className="col-12">*/}
        {/*    {economicMajorsTables*/}
        {/*      ?.toSorted((a, b) => a.id - b.id)*/}
        {/*      ?.map((table) => {*/}
        {/*        return (*/}
        {/*          <TableWrapper title={table.title}>*/}
        {/*            {table.economicMajorsRows*/}
        {/*              ?.toSorted((a, b) => a.id - b.id)*/}
        {/*              ?.map((row) => {*/}
        {/*                return (*/}
        {/*                  <div*/}
        {/*                    className={*/}
        {/*                      'd-flex justify-content-between flex-column'*/}
        {/*                    }*/}
        {/*                    style={{ gap: 2, margin: '2px 0px' }}*/}
        {/*                  >*/}
        {/*                    {row?.title && (*/}
        {/*                      <div*/}
        {/*                        style={{*/}
        {/*                          height: 54,*/}
        {/*                          display: 'flex',*/}
        {/*                          alignItems: 'center',*/}
        {/*                          backgroundColor: '#E5E5E5',*/}
        {/*                          color: '#231F20',*/}
        {/*                          width: '100%'*/}
        {/*                        }}*/}
        {/*                      >*/}
        {/*                        <div*/}
        {/*                          style={{*/}
        {/*                            fontSize: 12,*/}
        {/*                            textAlign: 'start',*/}
        {/*                            padding: '4px 10px',*/}
        {/*                            fontWeight: 500,*/}
        {/*                            width: '100%',*/}
        {/*                            height: '100%',*/}
        {/*                            display: 'flex',*/}
        {/*                            alignItems: 'center'*/}
        {/*                          }}*/}
        {/*                        >*/}
        {/*                          {row?.title}*/}
        {/*                        </div>*/}
        {/*                      </div>*/}
        {/*                    )}*/}
        {/*                    <div*/}
        {/*                      className={'d-flex justify-content-between'}*/}
        {/*                      style={{ gap: 2 }}*/}
        {/*                    >*/}
        {/*                      {row.economicMajorsColumns*/}
        {/*                        ?.toSorted((a, b) => a.id - b.id)*/}
        {/*                        ?.map((column) => {*/}
        {/*                          return (*/}
        {/*                            <div style={{ width: '100%' }}>*/}
        {/*                              <div*/}
        {/*                                style={{*/}
        {/*                                  height: 54,*/}
        {/*                                  display: 'flex',*/}
        {/*                                  alignItems: 'center',*/}
        {/*                                  backgroundColor: '#E5E5E5',*/}
        {/*                                  color: '#231F20',*/}
        {/*                                  width: '100%'*/}
        {/*                                }}*/}
        {/*                              >*/}
        {/*                                <div*/}
        {/*                                  style={{*/}
        {/*                                    fontSize: 12,*/}
        {/*                                    textAlign: 'start',*/}
        {/*                                    padding: '4px 10px',*/}
        {/*                                    fontWeight: 500,*/}
        {/*                                    width: '100%',*/}
        {/*                                    height: '100%',*/}
        {/*                                    display: 'flex',*/}
        {/*                                    alignItems: 'center'*/}
        {/*                                  }}*/}
        {/*                                >*/}
        {/*                                  {column?.title}*/}
        {/*                                </div>*/}
        {/*                              </div>*/}
        {/*                              <div*/}
        {/*                                className={*/}
        {/*                                  'd-flex justify-content-between flex-column'*/}
        {/*                                }*/}
        {/*                                style={{ gap: 2 }}*/}
        {/*                              >*/}
        {/*                                {column.economicMajorsCells*/}
        {/*                                  ?.toSorted((a, b) => a.id - b.id)*/}
        {/*                                  ?.map((cell, index) => {*/}
        {/*                                    return (*/}
        {/*                                      <div*/}
        {/*                                        style={{*/}
        {/*                                          display: 'flex',*/}
        {/*                                          width: '100%'*/}
        {/*                                        }}*/}
        {/*                                      >*/}
        {/*                                        {!cell?.title &&*/}
        {/*                                          !cell?.title?.length && (*/}
        {/*                                            <UserJournalTableCell*/}
        {/*                                              cell={cell}*/}
        {/*                                              userCell={*/}
        {/*                                                cell.userEconomicMajorsCells*/}
        {/*                                              }*/}
        {/*                                              userCellValue={*/}
        {/*                                                cell*/}
        {/*                                                  ?.userEconomicMajorsCells*/}
        {/*                                                  ?.content*/}
        {/*                                              }*/}
        {/*                                              inputType={'number'}*/}
        {/*                                              handleChangeUserCell={(*/}
        {/*                                                cellToUpdate,*/}
        {/*                                                value,*/}
        {/*                                                isEdit*/}
        {/*                                              ) => {*/}
        {/*                                                if (!loading) {*/}
        {/*                                                  return handleMajorsInfo(*/}
        {/*                                                    cell.userEconomicMajorsCells,*/}
        {/*                                                    value,*/}
        {/*                                                    isEdit,*/}
        {/*                                                    table.id,*/}
        {/*                                                    row.id,*/}
        {/*                                                    column.id,*/}
        {/*                                                    cell.id*/}
        {/*                                                  )*/}
        {/*                                                }*/}
        {/*                                              }}*/}
        {/*                                            />*/}
        {/*                                          )}*/}
        {/*                                        {cell?.title &&*/}
        {/*                                          cell?.title?.length && (*/}
        {/*                                            <JournalTableCell*/}
        {/*                                              additionalStyling={{*/}
        {/*                                                width: '100%',*/}
        {/*                                                backgroundColor: '#fff',*/}
        {/*                                                height: 54*/}
        {/*                                              }}*/}
        {/*                                            >*/}
        {/*                                              <div*/}
        {/*                                                style={{*/}
        {/*                                                  height: 54,*/}
        {/*                                                  display: 'flex',*/}
        {/*                                                  alignItems: 'center',*/}

        {/*                                                  width: '100%'*/}
        {/*                                                }}*/}
        {/*                                              >*/}
        {/*                                                <div*/}
        {/*                                                  style={{*/}
        {/*                                                    fontSize: 12,*/}
        {/*                                                    textAlign: 'start',*/}
        {/*                                                    fontWeight: 500,*/}
        {/*                                                    width: '100%',*/}
        {/*                                                    height: '100%',*/}
        {/*                                                    display: 'flex',*/}
        {/*                                                    alignItems: 'center'*/}
        {/*                                                  }}*/}
        {/*                                                >*/}
        {/*                                                  {cell?.title}*/}
        {/*                                                </div>*/}
        {/*                                              </div>*/}
        {/*                                            </JournalTableCell>*/}
        {/*                                          )}*/}
        {/*                                      </div>*/}
        {/*                                    )*/}
        {/*                                  })}*/}
        {/*                              </div>*/}
        {/*                            </div>*/}
        {/*                          )*/}
        {/*                        })}*/}
        {/*                    </div>*/}
        {/*                  </div>*/}
        {/*                )*/}
        {/*              })}*/}
        {/*          </TableWrapper>*/}
        {/*        )*/}
        {/*      })}*/}
        {/*  </div>*/}
        {/*) : null}*/}
        {/*<div className="col-12">*/}
        {/*  {journal?.creditCardInfoTables ? (*/}
        {/*    <div*/}
        {/*      className={'d-flex justify-content-between'}*/}
        {/*      style={{ gap: 4, height: '100%' }}*/}
        {/*    >*/}
        {/*      {creditCardInfoTable?.creditCardInfoColumns*/}
        {/*        ?.toSorted((a, b) => a.id - b.id)*/}
        {/*        ?.map((column) => {*/}
        {/*          return (*/}
        {/*            <div*/}
        {/*              className={'d-flex justify-content-between flex-column'}*/}
        {/*              style={{ width: '100%' }}*/}
        {/*            >*/}
        {/*              <div*/}
        {/*                style={{*/}
        {/*                  backgroundColor: '#51c7df',*/}
        {/*                  color: '#fff',*/}
        {/*                  padding: 4,*/}
        {/*                  display: 'flex',*/}
        {/*                  alignItems: 'center',*/}
        {/*                  height: 56*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                {column.title}*/}
        {/*              </div>*/}
        {/*              <div>*/}
        {/*                {column.creditCardInfoCells*/}
        {/*                  ?.toSorted((a, b) => a.id - b.id)*/}
        {/*                  ?.map((cell) => (*/}
        {/*                    <div>*/}
        {/*                      <div>*/}
        {/*                        <UserJournalTableCell*/}
        {/*                          cell={cell}*/}
        {/*                          userCell={cell.userCreditCardInfoCell}*/}
        {/*                          userCellValue={*/}
        {/*                            cell?.userCreditCardInfoCell?.content*/}
        {/*                          }*/}
        {/*                          inputType={'text'}*/}
        {/*                          handleChangeUserCell={(*/}
        {/*                            cellToUpdate,*/}
        {/*                            value,*/}
        {/*                            isEdit*/}
        {/*                          ) => {*/}
        {/*                            if (!loading) {*/}
        {/*                              return handleChangeCreditCardInfo(*/}
        {/*                                cellToUpdate,*/}
        {/*                                value,*/}
        {/*                                isEdit,*/}
        {/*                                column.id,*/}
        {/*                                cell.id*/}
        {/*                              )*/}
        {/*                            }*/}
        {/*                          }}*/}
        {/*                        />*/}
        {/*                      </div>*/}
        {/*                    </div>*/}
        {/*                  ))}*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          )*/}
        {/*        })}*/}
        {/*    </div>*/}
        {/*  ) : null}*/}
        {/*</div>*/}

        {/*{journal?.financialProfilesTable &&*/}
        {/*journal?.financialProfilesTable?.length > 0 ? (*/}
        {/*  <>*/}
        {/*    <div className="col-12">*/}
        {/*      {financialProfilesTable*/}
        {/*        ?.toSorted((a, b) => a.order - b.order)*/}
        {/*        ?.map((fpt, fptIndex) => {*/}
        {/*          return (*/}
        {/*            <div style={{ border: '1px solid #BBBDBF' }}>*/}
        {/*              {fpt.financialProfiles*/}
        {/*                ?.toSorted((a, b) => a.order - b.order)*/}
        {/*                ?.map((fp, fpIndex) => {*/}
        {/*                  return (*/}
        {/*                    <Table*/}
        {/*                      bordered*/}
        {/*                      style={{*/}
        {/*                        marginBottom: 0*/}
        {/*                      }}*/}
        {/*                    >*/}
        {/*                      <tbody>*/}
        {/*                        <JournalTableRow key={fp.id}>*/}
        {/*                          <div*/}
        {/*                            className={'d-flex p-0'}*/}
        {/*                            style={{ gap: 6 }}*/}
        {/*                          >*/}
        {/*                            <JournalTableCell*/}
        {/*                              additionalStyling={{*/}
        {/*                                width: '50%',*/}
        {/*                                verticalAlign: 'middle'*/}
        {/*                              }}*/}
        {/*                            >*/}
        {/*                              {fp.title}*/}
        {/*                            </JournalTableCell>*/}
        {/*                            <UserJournalTableCell*/}
        {/*                              cell={fp}*/}
        {/*                              userCell={fp?.userFinancialProfiles}*/}
        {/*                              userCellValue={*/}
        {/*                                fp?.userFinancialProfiles?.content*/}
        {/*                              }*/}
        {/*                              inputType={'text'}*/}
        {/*                              handleChangeUserCell={(*/}
        {/*                                cellToUpdate,*/}
        {/*                                value,*/}
        {/*                                isEdit*/}
        {/*                              ) => {*/}
        {/*                                if (!loading) {*/}
        {/*                                  return handleChangeFinancialProfile(*/}
        {/*                                    cellToUpdate,*/}
        {/*                                    value,*/}
        {/*                                    isEdit,*/}
        {/*                                    fp.id,*/}
        {/*                                    fpt.id*/}
        {/*                                  )*/}
        {/*                                }*/}
        {/*                              }}*/}
        {/*                              additionalStyling={{*/}
        {/*                                width: '50%',*/}
        {/*                                verticalAlign: 'middle'*/}
        {/*                              }}*/}
        {/*                            />*/}
        {/*                          </div>*/}
        {/*                        </JournalTableRow>*/}
        {/*                      </tbody>*/}
        {/*                    </Table>*/}
        {/*                  )*/}
        {/*                })}*/}
        {/*            </div>*/}
        {/*          )*/}
        {/*        })}*/}
        {/*    </div>*/}
        {/*  </>*/}
        {/*) : null}*/}

        {/*{journal?.financialAccounts &&*/}
        {/*  journal?.financialAccounts?.length > 0 && (*/}
        {/*    <div style={{ minHeight: 300, margin: '20px 0' }}>*/}
        {/*      {financialAccounts*/}
        {/*        ?.toSorted((a, b) => a.order - b.order)*/}
        {/*        ?.map((fa) => {*/}
        {/*          return (*/}
        {/*            <TableWrapper*/}
        {/*              title={fa?.title}*/}
        {/*              key={fa?.id}*/}
        {/*              additionalStyle={{ margin: 0 }}*/}
        {/*            >*/}
        {/*              <div*/}
        {/*                style={{*/}
        {/*                  display: 'grid',*/}
        {/*                  gap: 4,*/}
        {/*                  alignItems: 'center',*/}
        {/*                  gridTemplateColumns: 'repeat(3,1fr)'*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                {fa?.financialAccountsFields*/}
        {/*                  ?.toSorted((a, b) => a.order - b.order)*/}
        {/*                  ?.map((faf) => {*/}
        {/*                    return (*/}
        {/*                      <div*/}
        {/*                        key={faf?.id}*/}
        {/*                        style={{*/}
        {/*                          background: '#E5E5E5',*/}
        {/*                          display: 'flex',*/}
        {/*                          flexDirection: 'column'*/}
        {/*                        }}*/}
        {/*                      >*/}
        {/*                        <div*/}
        {/*                          style={{*/}
        {/*                            height: 54,*/}
        {/*                            display: 'flex',*/}
        {/*                            alignItems: 'center'*/}
        {/*                          }}*/}
        {/*                        >*/}
        {/*                          <div*/}
        {/*                            style={{*/}
        {/*                              fontSize: 12,*/}
        {/*                              textAlign: 'start',*/}
        {/*                              padding: '4px 10px',*/}
        {/*                              fontWeight: 500*/}
        {/*                            }}*/}
        {/*                          >*/}
        {/*                            {faf?.title}*/}
        {/*                          </div>*/}
        {/*                        </div>*/}
        {/*                        <UserJournalTableCell*/}
        {/*                          cell={faf}*/}
        {/*                          userCell={faf?.userFinancialAccountsField}*/}
        {/*                          userCellValue={*/}
        {/*                            faf?.userFinancialAccountsField?.fieldOne*/}
        {/*                          }*/}
        {/*                          inputType={'text'}*/}
        {/*                          handleChangeUserCell={(*/}
        {/*                            cellToUpdate,*/}
        {/*                            value,*/}
        {/*                            isEdit*/}
        {/*                          ) => {*/}
        {/*                            if (!loading) {*/}
        {/*                              return handleChangeFinancialAccountsFields(*/}
        {/*                                'fieldOne',*/}
        {/*                                cellToUpdate,*/}
        {/*                                value,*/}
        {/*                                isEdit,*/}
        {/*                                faf?.id,*/}
        {/*                                fa?.id*/}
        {/*                              )*/}
        {/*                            }*/}
        {/*                          }}*/}
        {/*                          additionalStyling={{*/}
        {/*                            verticalAlign: 'middle'*/}
        {/*                          }}*/}
        {/*                        />*/}
        {/*                        <UserJournalTableCell*/}
        {/*                          cell={faf}*/}
        {/*                          userCell={faf?.userFinancialAccountsField}*/}
        {/*                          userCellValue={*/}
        {/*                            faf?.userFinancialAccountsField?.fieldTwo*/}
        {/*                          }*/}
        {/*                          inputType={'text'}*/}
        {/*                          handleChangeUserCell={(*/}
        {/*                            cellToUpdate,*/}
        {/*                            value,*/}
        {/*                            isEdit*/}
        {/*                          ) => {*/}
        {/*                            if (!loading) {*/}
        {/*                              return handleChangeFinancialAccountsFields(*/}
        {/*                                'fieldTwo',*/}
        {/*                                cellToUpdate,*/}
        {/*                                value,*/}
        {/*                                isEdit,*/}
        {/*                                faf?.id,*/}
        {/*                                fa?.id*/}
        {/*                              )*/}
        {/*                            }*/}
        {/*                          }}*/}
        {/*                          additionalStyling={{*/}
        {/*                            verticalAlign: 'middle'*/}
        {/*                          }}*/}
        {/*                        />*/}
        {/*                      </div>*/}
        {/*                    )*/}
        {/*                  })}*/}
        {/*              </div>*/}
        {/*            </TableWrapper>*/}
        {/*          )*/}
        {/*        })}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*{journal?.financialSnapshots ? (*/}
        {/*  <>*/}
        {/*    {expenseTable.length > 0 && (*/}
        {/*      <div className="col-12">*/}
        {/*        <Table bordered style={{ marginBottom: 0 }}>*/}
        {/*          <thead>*/}
        {/*            <JournalTableRow>*/}
        {/*              <div className={'d-flex p-0'} style={{ gap: 4 }}>*/}
        {/*                <JournalTableCell*/}
        {/*                  additionalStyling={{*/}
        {/*                    width: '100%',*/}
        {/*                    ...tableColumnStyle*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  Expense Category*/}
        {/*                </JournalTableCell>*/}
        {/*                <JournalTableCell*/}
        {/*                  additionalStyling={{*/}
        {/*                    width: '100%',*/}
        {/*                    ...tableColumnStyle*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  What's included*/}
        {/*                </JournalTableCell>*/}
        {/*                <JournalTableCell*/}
        {/*                  additionalStyling={{*/}
        {/*                    width: '100%',*/}
        {/*                    ...tableColumnStyle*/}
        {/*                  }}*/}
        {/*                >*/}
        {/*                  Amount*/}
        {/*                </JournalTableCell>*/}
        {/*              </div>*/}
        {/*            </JournalTableRow>*/}
        {/*          </thead>*/}
        {/*          <tbody>*/}
        {/*            {expenseTable.map((cell, index) => {*/}
        {/*              return (*/}
        {/*                <JournalTableRow key={cell.transactionName}>*/}
        {/*                  <div className={'d-flex p-0'}>*/}
        {/*                    <JournalTableCell*/}
        {/*                      additionalStyling={{ width: '100%' }}*/}
        {/*                    >*/}
        {/*                      {cell.transactionName}*/}
        {/*                    </JournalTableCell>*/}
        {/*                    <JournalTableCell*/}
        {/*                      additionalStyling={{ width: '100%' }}*/}
        {/*                    >*/}
        {/*                      {cell.includedItem}*/}
        {/*                    </JournalTableCell>*/}
        {/*                    <UserJournalTableCell*/}
        {/*                      cell={cell}*/}
        {/*                      userCell={cell?.userFinancialSnapshot}*/}
        {/*                      userCellValue={*/}
        {/*                        cell?.userFinancialSnapshot?.amount*/}
        {/*                      }*/}
        {/*                      inputType={'text'}*/}
        {/*                      handleChangeUserCell={(*/}
        {/*                        cellToUpdate,*/}
        {/*                        value,*/}
        {/*                        isEdit*/}
        {/*                      ) => {*/}
        {/*                        if (!loading) {*/}
        {/*                          return handleChangeAmount(*/}
        {/*                            cellToUpdate,*/}
        {/*                            value,*/}
        {/*                            isEdit,*/}
        {/*                            index,*/}
        {/*                            'expense'*/}
        {/*                          )*/}
        {/*                        }*/}
        {/*                      }}*/}
        {/*                      additionalStyling={{*/}
        {/*                        width: '100%',*/}
        {/*                        verticalAlign: 'middle'*/}
        {/*                      }}*/}
        {/*                    />*/}
        {/*                  </div>*/}
        {/*                </JournalTableRow>*/}
        {/*              )*/}
        {/*            })}*/}
        {/*          </tbody>*/}
        {/*        </Table>*/}
        {/*      </div>*/}
        {/*    )}*/}

        {/*    {incomeTable.length > 0 && (*/}
        {/*      <div className="col-12">*/}
        {/*        <Table bordered hover style={{ marginBottom: 0 }}>*/}
        {/*          <JournalTableRow>*/}
        {/*            <div className={'d-flex p-0'} style={{ gap: 4 }}>*/}
        {/*              <JournalTableCell*/}
        {/*                additionalStyling={{*/}
        {/*                  width: '100%',*/}
        {/*                  ...tableColumnStyle*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                Income Category*/}
        {/*              </JournalTableCell>*/}
        {/*              <JournalTableCell*/}
        {/*                additionalStyling={{*/}
        {/*                  width: '100%',*/}
        {/*                  ...tableColumnStyle*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                Amount*/}
        {/*              </JournalTableCell>*/}
        {/*            </div>*/}
        {/*          </JournalTableRow>*/}
        {/*          <tbody>*/}
        {/*            {incomeTable.map((cell, index) => {*/}
        {/*              return (*/}
        {/*                <JournalTableRow key={cell.transactionName}>*/}
        {/*                  <div className={'d-flex p-0'}>*/}
        {/*                    <JournalTableCell*/}
        {/*                      additionalStyling={{ width: '100%' }}*/}
        {/*                    >*/}
        {/*                      {cell.transactionName}*/}
        {/*                    </JournalTableCell>*/}
        {/*                    <UserJournalTableCell*/}
        {/*                      cell={cell}*/}
        {/*                      userCell={cell?.userFinancialSnapshot}*/}
        {/*                      userCellValue={*/}
        {/*                        cell?.userFinancialSnapshot?.amount*/}
        {/*                      }*/}
        {/*                      inputType={'number'}*/}
        {/*                      handleChangeUserCell={(*/}
        {/*                        cellToUpdate,*/}
        {/*                        value,*/}
        {/*                        isEdit*/}
        {/*                      ) => {*/}
        {/*                        if (!loading) {*/}
        {/*                          return handleChangeAmount(*/}
        {/*                            cellToUpdate,*/}
        {/*                            value,*/}
        {/*                            isEdit,*/}
        {/*                            index,*/}
        {/*                            'income'*/}
        {/*                          )*/}
        {/*                        }*/}
        {/*                      }}*/}
        {/*                      additionalStyling={{*/}
        {/*                        width: '100%',*/}
        {/*                        verticalAlign: 'middle'*/}
        {/*                      }}*/}
        {/*                    />*/}
        {/*                  </div>*/}
        {/*                </JournalTableRow>*/}
        {/*              )*/}
        {/*            })}*/}
        {/*          </tbody>*/}
        {/*        </Table>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*  */}
        {/*    {journal?.userBudgetAllocation && (*/}
        {/*      <div className="col-12">*/}
        {/*        <Table bordered hover style={{ marginBottom: 0 }}>*/}
        {/*          <thead>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell isGray>Needs</JournalTableCell>*/}
        {/*              <JournalTableCell isGray>Wants</JournalTableCell>*/}
        {/*              <JournalTableCell isGray>*/}
        {/*                Savings/Investments*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*          </thead>*/}
        {/*          <tbody>*/}
        {/*            <JournalTableRow>*/}
        {/*              <JournalTableCell>*/}
        {/*                {journal?.userBudgetAllocation ? (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    value={journal?.userBudgetAllocation?.needs}*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation(*/}
        {/*                        'needs',*/}
        {/*                        value*/}
        {/*                      )*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                ) : (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation(*/}
        {/*                        'needs',*/}
        {/*                        value*/}
        {/*                      )*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                )}*/}
        {/*              </JournalTableCell>*/}
        {/*              <JournalTableCell>*/}
        {/*                {journal?.userBudgetAllocation ? (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    value={journal?.userBudgetAllocation?.wants}*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation(*/}
        {/*                        'wants',*/}
        {/*                        value*/}
        {/*                      )*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                ) : (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation(*/}
        {/*                        'wants',*/}
        {/*                        value*/}
        {/*                      )*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                )}*/}
        {/*              </JournalTableCell>*/}
        {/*              <JournalTableCell>*/}
        {/*                {journal?.userBudgetAllocation ? (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    value={*/}
        {/*                      journal?.userBudgetAllocation?.savingsInvestments*/}
        {/*                    }*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation(*/}
        {/*                        'savingsInvestments',*/}
        {/*                        value*/}
        {/*                      )*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                ) : (*/}
        {/*                  <JournalTableCellInput*/}
        {/*                    type={'text'}*/}
        {/*                    handleChange={(value) => {*/}
        {/*                      return handleChangeBudgetAllocation('', value)*/}
        {/*                    }}*/}
        {/*                  />*/}
        {/*                )}*/}
        {/*              </JournalTableCell>*/}
        {/*            </JournalTableRow>*/}
        {/*          </tbody>*/}
        {/*        </Table>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*    {(monthlyFixedExpense.length > 0 ||*/}
        {/*      monthlyVariableExpense.length > 0 ||*/}
        {/*      monthlyIncome.length > 0) && (*/}
        {/*      <div className="col-12">*/}
        {/*        <TableWrapper title={'Monthly budget'}>*/}
        {/*          <MonthlyBudgetComponent*/}
        {/*            monthlyTransaction={monthlyIncome}*/}
        {/*            handleChangeAmount={handleChangeAmount}*/}
        {/*            financialType={'monthly_income'}*/}
        {/*          />*/}
        {/*          <MonthlyBudgetComponent*/}
        {/*            monthlyTransaction={monthlyFixedExpense}*/}
        {/*            handleChangeAmount={handleChangeAmount}*/}
        {/*            financialType={'monthly_fixed_expense'}*/}
        {/*          />*/}
        {/*          <MonthlyBudgetComponent*/}
        {/*            monthlyTransaction={monthlyVariableExpense}*/}
        {/*            handleChangeAmount={handleChangeAmount}*/}
        {/*            financialType={'monthly_variable_expense'}*/}
        {/*          />*/}
        {/*        </TableWrapper>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*  </>*/}
        {/*) : null}*/}

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
