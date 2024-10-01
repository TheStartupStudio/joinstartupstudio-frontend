import React, { useEffect, useRef, useState } from 'react'
import { JournalTableRows } from './JournalTableRows'
import '../../TableWrapper/index.css'
import { useLocation } from 'react-router-dom'
// import { JournalTableRows } from '../../TableWrapper/TableComponents'

const JournalTable = ({
  table,
  tableIndex,
  handleUpdateJournalTables,
  additionalStyling,
  loading,
  setLoading,
  isClonedTable,
  getRows
}) => {
  const [displayedCellIndex, setDisplayedCellIndex] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus()
      const textLength = inputRef?.current?.value?.length
      if (inputRef?.current?.type !== 'number') {
        inputRef?.current?.setSelectionRange(textLength, textLength)
      }
    }
  }, [selectedCell])

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
  const tableRows = isClonedTable ? table?.clonedRows : table?.rows
  return (
    <>
      <>
        <table
          className={'journal-table'}
          style={{
            order: table.order,
            // position: 'relative',
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
          <JournalTableRows
            rows={tableRows}
            displayedCellIndex={displayedCellIndex}
            tableIndex={tableIndex}
            loading={loading}
            setLoading={setLoading}
            inputRef={inputRef}
            handleUpdateJournalTables={handleUpdateJournalTables}
            table={table}
            additionalStyling={additionalStyling}
            editClicked={editClicked}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            handlePencilClick={handlePencilClick}
            setDisplayedCellIndex={setDisplayedCellIndex}
            isClonedTable={isClonedTable}
            getRows={getRows}
          />
        </table>
      </>
    </>
  )
}
export default JournalTable
