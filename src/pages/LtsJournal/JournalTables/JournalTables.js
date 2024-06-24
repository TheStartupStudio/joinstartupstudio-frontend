import {
  JournalTableCell,
  JournalTableRow,
  TableCellTitle,
  UserJournalTableCell
} from '../TableWrapper/TableComponents'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import _ from 'lodash'
import * as actions from '../../../redux/reflectionsTable/Actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import './styles.css'
const JournalTables = (props) => {
  const [tables, setTables] = useState([])
  const [paragraphs, setParagraphs] = useState([])
  const [loading, setLoading] = useState(false)

  const [displayedCellIndex, setDisplayedCellIndex] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)

  useEffect(() => {
    setTables(props.tables)
  }, [props.tables])

  useEffect(() => {
    setParagraphs(props.paragraphs)
  }, [props.paragraphs])
  const inputRef = useRef(null)

  const getRows = async (tableId) => {
    await axiosInstance
      .get(`/ltsJournals/journal-tables/${tableId}`)
      .then(({ data }) => {
        let newTables = [...tables]
        const foundedIndex = newTables.findIndex(
          (table) => table.id === tableId
        )

        newTables[foundedIndex].rows = data
        setTables(newTables)
      })
  }
  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus()
      const textLength = inputRef?.current?.value?.length
      if (inputRef?.current?.type !== 'number') {
        inputRef?.current?.setSelectionRange(textLength, textLength)
      }
    }
  }, [selectedCell])

  const updateJournalTable = (tableId, rowId, cellId, content) => {
    const updatedTables = tables?.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: table.rows.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                cells: row.cells.map((cell) => {
                  if (cell.id === cellId) {
                    return {
                      ...cell,
                      userCells: { ...cell.userCells, ...content }
                    }
                  }
                  return cell
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

  const handleUpdateJournalTables = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    cellId
  ) => {
    // setLoading(true)
    const content = {
      content: null,
      amount: null,
      cellId: cellId,
      tableId: tableId,
      inputType: obj.inputType,
      inputTag: obj.inputTag
    }
    delete content.id
    if (obj.inputType === 'text') {
      content.content = value
    } else if (obj.inputType === 'number') {
      content.amount = +value
    }

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.cellId = obj.cellId
    }

    const updatedJournalTable = updateJournalTable(
      tableId,
      rowId,
      cellId,
      content
    )

    setTables(updatedJournalTable)
    await updateTable({
      content,
      cellId,
      rowId,
      tableId,
      isEdit
    })
  }
  const EditButton = (props) => {
    const newRef = useRef(null)

    useEffect(() => {
      if (props.selectedCell) {
        function handleOutsideClick(e) {
          if (
            !e.target.classList.contains('edit-pencil') &&
            !e.target.classList.contains('edit-pencil-container') &&
            !e.target.classList.contains('journal_table-input') &&
            !props.loading
          ) {
            props.setDisplayedCellIndex(null)
            props.setSelectedCell(null)
          }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
          document.removeEventListener('mousedown', handleOutsideClick)
        }
      }
    }, [props.selectedCell])
    return (
      <>
        <div
          ref={newRef}
          onClick={(event) => {
            props.openEditBox(event)
          }}
          className={'edit-pencil-container d-flex justify-content-end'}
          style={{
            padding: '16px 0 16px 16px',
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <FontAwesomeIcon
            className={'z-3 ml-1 edit-pencil'}
            icon={faPencilAlt}
          />
        </div>
      </>
    )
  }
  const updateTable = async (newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-journal-tables`, {
        ...newData.content
      })
      .then(({ data }) => {
        if (data) {
          const updatedJournalTable = updateJournalTable(
            newData.tableId,
            newData.rowId,
            newData.cellId,
            data
          )
          setTables(updatedJournalTable)
          setLoading(false)
          // if (!newData.isEdit)
          //   getRows(newData.tableId, newData.rowId, newData.cellId)
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
  const [editClicked, setEditClicked] = useState(null)
  const handlePencilClick = (tableIndex, rowIndex, cellIndex, event) => {
    const currentIndex = { tableIndex, rowIndex, cellIndex }
    if (
      selectedCell &&
      selectedCell.tableIndex === tableIndex &&
      selectedCell.rowIndex === rowIndex &&
      selectedCell.cellIndex === cellIndex
    ) {
      setSelectedCell(null)
      setDisplayedCellIndex(null)
    } else {
      setSelectedCell(currentIndex)
      setDisplayedCellIndex(currentIndex)
    }
  }

  return (
    <div className={'table-container'}>
      {tables?.map((table, tableIndex) => {
        return (
          <>
            <>
              <table
                className={'journal-table'}
                style={{
                  order: table.order,
                  tableLayout: 'fixed'
                }}
              >
                {table.title && (
                  <td
                    className={'table_header-title_box'}
                    colSpan={table.gridColumns}
                  >
                    <div className={'table_header-title'}>{table.title}</div>
                  </td>
                )}

                {table?.rows
                  ?.toSorted((a, b) => a.order - b.order)
                  ?.map((row, rowIndex) => {
                    return (
                      <>
                        <JournalTableRow>
                          {row?.cells
                            ?.toSorted((a, b) => a.order - b.order)
                            .map((cell, cellIndex) => {
                              return (
                                <>
                                  {!cell.isEditable ? (
                                    <TableCellTitle
                                      cell={cell}
                                      key={cell.id}
                                      additionalStyle={{
                                        width: `${100 / table.gridColumns}%`,
                                        minHeight: 70
                                      }}
                                      backgroundColor={'#fff'}
                                    />
                                  ) : // ) : cell.isEditBox && cell.id === activeId ? (
                                  displayedCellIndex &&
                                    displayedCellIndex.tableIndex ===
                                      tableIndex &&
                                    displayedCellIndex.rowIndex === rowIndex &&
                                    displayedCellIndex.cellIndex ===
                                      cellIndex ? (
                                    <React.Fragment>
                                      <UserJournalTableCell
                                        loading={loading}
                                        setLoading={setLoading}
                                        inputRef={inputRef}
                                        cell={cell}
                                        userCell={cell.userCells}
                                        userCellValue={
                                          cell.inputType === 'text'
                                            ? cell.userCells?.content
                                            : cell.userCells?.amount
                                        }
                                        handleChangeUserCell={(
                                          cellToUpdate,
                                          value,
                                          isEdit
                                        ) => {
                                          return handleUpdateJournalTables(
                                            cellToUpdate,
                                            value,
                                            isEdit,
                                            table.id,
                                            row.id,
                                            cell.id
                                          )
                                        }}
                                        key={cell.id}
                                        additionalInputStyle={{
                                          padding: '0px',
                                          margin: '0px',
                                          minHeight: 70
                                        }}
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <JournalTableCell
                                      colSpan={cell.colSpan}
                                      additionalStyling={{
                                        display: 'flex',
                                        gap: 6,
                                        ...props.additionalStyling,
                                        zIndex: 0,
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        position: 'relative'
                                      }}
                                    >
                                      <div
                                        style={{
                                          paddingRight: 15,
                                          wordWrap: 'break-word',
                                          overflowWrap: 'break-word'
                                        }}
                                      >
                                        {cell.inputType === 'text'
                                          ? cell.userCells?.content
                                          : cell.userCells?.amount}
                                      </div>
                                      <EditButton
                                        editClicked={editClicked}
                                        selectedCell={selectedCell}
                                        loading={loading}
                                        additionalStyle={{
                                          minHeight: 70,
                                          width: '100%',
                                          zIndex: 9999
                                        }}
                                        setSelectedCell={setSelectedCell}
                                        setDisplayedCellIndex={
                                          setDisplayedCellIndex
                                        }
                                        openEditBox={(event) => {
                                          if (!loading) {
                                            return handlePencilClick(
                                              tableIndex,
                                              rowIndex,
                                              cellIndex,
                                              event
                                            )
                                          }
                                        }}
                                      />
                                    </JournalTableCell>
                                  )}
                                </>
                              )
                            })}
                        </JournalTableRow>
                      </>
                    )
                  })}
              </table>
            </>
          </>
        )
      })}
      {paragraphs?.map((paragraph) => (
        <div
          dangerouslySetInnerHTML={{ __html: paragraph.paragraph }}
          style={{ order: paragraph.order }}
        />
      ))}
    </div>
  )
}
export default JournalTables
