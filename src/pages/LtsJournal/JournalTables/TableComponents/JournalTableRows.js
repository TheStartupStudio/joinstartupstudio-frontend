import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles.css'
import '../../../../pages/LtsJournal/TableWrapper/index.css'
import { toast } from 'react-toastify'

import TableCellTitle from './TableCellTitle'
import UserJournalTableCell from './UserJournalTableCell'
import DisplayCellData from './DisplayCellData'
import JournalTableRow from './JournalTableRow'
import JournalTableCell from './JournalTableCell'
import JournalTableRowsCloned from './JournalTableRowsCloned'
import axiosInstance from '../../../../utils/AxiosInstance'
import { useLocation } from 'react-router-dom'
export const JournalTableRows = ({
  rows,
  displayedCellIndex,
  tableIndex,
  loading,
  setLoading,
  inputRef,
  handleUpdateJournalTables,
  table,
  additionalStyling,
  editClicked,
  selectedCell,
  setSelectedCell,
  handlePencilClick,
  setDisplayedCellIndex,
  isClonedRow,
  parentRowIndex,
  isClonedTable,
  getRows
  // onUpdateTable
}) => {
  const [tableRows, setTableRows] = useState([])

  useEffect(() => {
    if (rows) setTableRows(rows)
  }, [rows])

  const onDeleteClonedRow = (row, index) => {
    axiosInstance
      .delete(`/ltsJournalTables/rowsClone/${row.id}`)
      .then((res) => {
        const { deletedRow } = res.data
        const newTableRows = tableRows.filter((r) => r.id !== deletedRow.id)

        if (newTableRows.length === tableRows.length) {
          toast.error('Deleted row not found in the current table rows')
        } else {
          toast.success('Row deleted successfully')

          getRows()
        }
      })
      .catch((err) => {
        toast.error('Error occurred during deleting row')
      })
  }

  const onAddRow = (row) => {
    const highestOrder = Math.max(
      ...tableRows.map((row) =>
        Math.max(
          ...(row.clonedRows.length > 0
            ? row.clonedRows.map((clonedRow) => clonedRow.order)
            : [0])
        )
      )
    )

    const modifiedRow = {
      order: highestOrder + 1,
      content: '',
      parentRowId: row.id,
      parentTableId: row.tableId,
      clonedTableId: row.clonedTableId ?? null,
      cells: row.cells.map((cell) => ({
        isEditable: cell.isEditable,
        colSpan: cell.colSpan,
        isTableHeader: cell.isTableHeader,
        isTableSubHeader: cell.isTableSubHeader,
        order: cell.order,
        inputTag: cell.inputTag,
        inputType: cell.inputType,
        content: cell.content,
        cellStyle: cell.cellStyle,
        userCells: null
      }))
    }

    axiosInstance
      .post('/ltsJournalTables/rowsClone', { row: modifiedRow })
      .then((res) => {
        const createdRow = res.data.row
        const newTableRows = [...tableRows]
        const foundRowIndex = newTableRows.findIndex(
          (table) => table.id === createdRow.parentRowId
        )
        newTableRows[foundRowIndex].clonedRows = [
          ...newTableRows[foundRowIndex].clonedRows,
          createdRow
        ]
        toast.success('Row added successfully')
        setTableRows(newTableRows)
      })
      .catch((err) => {
        toast.error('Error occurred during creating row')
      })
  }

  const parentRowIndexString = (rowIndex) => {
    if (parentRowIndex) {
      return `${parentRowIndex}-${rowIndex}`
    } else {
      return `${rowIndex}`
    }
  }
  const location = useLocation()
  const isFromStudentsJournals = location.pathname.includes('students-journals')
  return (
    <>
      {tableRows
        ?.slice()
        ?.sort((a, b) => a.order - b.order)
        ?.map((row, rowIndex) => {
          return (
            <React.Fragment key={row.id}>
              <JournalTableRow additionalStyle={{ position: 'relative' }}>
                {row?.cells
                  ?.slice()
                  ?.sort((a, b) => a.order - b.order)
                  ?.map((cell, cellIndex) => {
                    return (
                      <React.Fragment key={cell.id}>
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
                        ) : displayedCellIndex &&
                          displayedCellIndex.tableIndex === tableIndex &&
                          displayedCellIndex.rowIndex ===
                            parentRowIndexString(rowIndex) &&
                          displayedCellIndex.cellIndex === cellIndex ? (
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
                                let isCloned = isClonedTable
                                const args = [
                                  cellToUpdate,
                                  value,
                                  isEdit,
                                  table.id,
                                  row.id,
                                  cell.id,
                                  table.parentTableId,
                                  isClonedRow ? row.id : null
                                ]
                                return handleUpdateJournalTables(...args)
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
                              ...additionalStyling,
                              zIndex: 0
                            }}
                          >
                            <DisplayCellData
                              editClicked={editClicked}
                              selectedCell={selectedCell}
                              loading={loading}
                              userCellValue={
                                cell.inputType === 'text'
                                  ? cell.userCells?.content
                                  : cell.userCells?.amount
                              }
                              additionalStyle={{
                                minHeight: 70,
                                width: '100%',
                                zIndex: 9999
                              }}
                              setSelectedCell={setSelectedCell}
                              setDisplayedCellIndex={setDisplayedCellIndex}
                              openEditBox={(event) => {
                                if (!loading) {
                                  return handlePencilClick(
                                    tableIndex,
                                    parentRowIndexString(rowIndex),
                                    cellIndex,
                                    event
                                  )
                                }
                              }}
                            />
                          </JournalTableCell>
                        )}
                      </React.Fragment>
                    )
                  })}
                {!isFromStudentsJournals && (
                  <>
                    {row?.isCloneable ? (
                      <div className={'add_plus-sign'}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          className='plus-ico'
                          style={{
                            width: '22px',
                            height: '22px',
                            color: '#707070',
                            cursor: 'pointer'
                          }}
                          onClick={() => onAddRow(row)}
                        />
                      </div>
                    ) : null}
                    {isClonedRow ? (
                      <div className={'add_minus-sign'}>
                        <FontAwesomeIcon
                          icon={faMinus}
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                          onClick={() => onDeleteClonedRow(row, rowIndex)}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </JournalTableRow>
              {/*//////////// CLONED ROWS //////////////*/}
              {row?.clonedRows?.length > 0 && (
                <JournalTableRowsCloned
                  getRows={getRows}
                  rows={row?.clonedRows}
                  displayedCellIndex={displayedCellIndex}
                  tableIndex={tableIndex}
                  loading={loading}
                  setLoading={setLoading}
                  inputRef={inputRef}
                  handleUpdateJournalTables={(
                    obj,
                    value,
                    isEdit,
                    tableId,
                    rowId,
                    cellId
                  ) => {
                    const parentRowId = row.id
                    const clonedRowId = rowId
                    return handleUpdateJournalTables(
                      obj,
                      value,
                      isEdit,
                      tableId,
                      parentRowId,
                      cellId,
                      clonedRowId,
                      'fromClonedRows'
                    )
                  }}
                  table={table}
                  additionalStyling={additionalStyling}
                  editClicked={editClicked}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handlePencilClick={handlePencilClick}
                  setDisplayedCellIndex={setDisplayedCellIndex}
                  parentRowIndex={rowIndex}
                  isClonedRow={true}
                  onDeleteRow={(rows) => onDeleteClonedRow(rows, row.id)}
                />
              )}
            </React.Fragment>
          )
        })}
    </>
  )
}
