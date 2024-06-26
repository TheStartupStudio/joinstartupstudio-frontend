import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import JournalTableRow from './JournalTableRow'
import TableCellTitle from './TableCellTitle'
import UserJournalTableCell from './UserJournalTableCell'
import JournalTableCell from './JournalTableCell'
import DisplayCellData from './DisplayCellData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import '../../TableWrapper/index.css'
import axiosInstance from '../../../../utils/AxiosInstance'

export const JournalTableRowsCloned = ({
  getRows,
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
  onDeleteRow
}) => {
  const [tableRows, setTableRows] = useState([])
  const [tableRowsChanged, setTableRowsChanged] = useState(false)

  useEffect(() => {
    if (rows) setTableRows(rows)
  }, [rows])

  useEffect(() => {
    if (tableRows && tableRowsChanged) onDeleteRow(tableRows)
  }, [tableRows.length])

  const onDeleteClonedRow = (row, index) => {
    if (row.parentRowId)
      axiosInstance
        .delete(`/ltsJournalTables/rowsClone/${row.id}`)
        .then((res) => {
          const { deletedRow } = res.data
          // debugger
          const newTableRows = tableRows.filter((r) => r.id !== deletedRow.id)

          if (newTableRows.length === tableRows.length) {
            toast.error('Deleted row not found in the current table rows')
          } else {
            toast.success('Row deleted successfully')
            // setTableRowsChanged(true)
            // setTableRows(newTableRows)
            getRows()
          }
        })
        .catch((err) => {
          toast.error('Error occurred during deleting row')
        })
  }

  console.log('tableRows', tableRows)

  const parentRowIndexString = (rowIndex) => {
    if (parentRowIndex) {
      return `${parentRowIndex}-${rowIndex}`
    } else {
      return `${rowIndex}`
    }
  }

  return (
    <>
      {tableRows
        ?.toSorted((a, b) => a.order - b.order)
        ?.map((row, rowIndex) => {
          return (
            <React.Fragment key={row.id}>
              <JournalTableRow additionalStyle={{ position: 'relative' }}>
                {row?.cells
                  ?.toSorted((a, b) => a.order - b.order)
                  .map((cell, cellIndex) => {
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
                      onClick={() => {
                        onDeleteClonedRow(row, rowIndex)
                      }}
                    />
                  </div>
                ) : null}
              </JournalTableRow>
            </React.Fragment>
          )
        })}
    </>
  )
}

export default JournalTableRowsCloned
