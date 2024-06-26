import React, { useEffect, useState } from 'react'

import './styles.css'
import JournalTable from './TableComponents/JournalTable'
import ClonedTables from './TableComponents/ClonedTables'
import { toast } from 'react-toastify'
import '../../../pages/LtsJournal/TableWrapper/index.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'

const JournalTables = (props) => {
  const [tables, setTables] = useState([])
  const [paragraphs, setParagraphs] = useState([])
  const [loading, setLoading] = useState(false)

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

  const updateJournalTableRowsClones = (
    tableId,
    rowId,
    cellId,
    content,
    clonedRowId,
    from
  ) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        const updatedRows = table.rows.map((row) => {
          if (row.id === rowId) {
            const updatedClonedRows = row.clonedRows.map((clonedRow) => {
              if (clonedRow.id === clonedRowId) {
                const updatedCells = clonedRow.cells.map((cell) => {
                  if (cell.id === cellId) {
                    const updatedUserCells = {
                      ...cell.userCells,
                      ...content
                    }

                    const updatedCell = {
                      ...cell,
                      userCells: updatedUserCells
                    }
                    return updatedCell
                  }
                  return cell
                })
                return {
                  ...clonedRow,
                  cells: updatedCells
                }
              }
              return clonedRow
            })
            return {
              ...row,
              clonedRows: updatedClonedRows
            }
          }
          return row
        })
        return {
          ...table,
          rows: updatedRows
        }
      }
      return table
    })

    return updatedTables
  }

  const updateJournalTableClones = (
    tableId,
    rowId,
    cellId,
    content,
    parentTableId
  ) => {
    const updatedTables = tables?.map((table) => {
      if (table.id !== parentTableId) {
        return table
      }

      const updatedClonedTables = table.clonedTables?.map((clonedTable) => {
        if (clonedTable.id !== tableId) {
          return clonedTable
        }

        const updatedClonedRows = clonedTable.clonedRows.map((clonedRow) => {
          if (clonedRow.id !== rowId) {
            return clonedRow
          }

          const updatedCells = clonedRow.cells.map((clonedCell) => {
            if (clonedCell.id === cellId) {
              return {
                ...clonedCell,
                userCells: {
                  ...clonedCell.userCells,
                  ...content
                }
              }
            }
            return clonedCell
          })

          return {
            ...clonedRow,
            cells: updatedCells
          }
        })

        return {
          ...clonedTable,
          clonedRows: updatedClonedRows
        }
      })

      return {
        ...table,
        clonedTables: updatedClonedTables
      }
    })

    return updatedTables
  }

  const updateTable = async (newData, parentTableId, from, clonedRowId) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-journal-tables`, {
        ...newData.content
      })
      .then(({ data }) => {
        if (data) {
          if (data.cloneCellId) {
            if (from !== 'fromClonedRows') {
              const updatedJournalTable = updateJournalTableClones(
                newData.tableId,
                newData.rowId,
                newData.cloneCellId,
                data,
                parentTableId
              )
              setTables(updatedJournalTable)
            } else {
              const updatedJournalTable = updateJournalTableRowsClones(
                newData.tableId,
                newData.rowId,
                newData.cloneCellId,
                data,
                clonedRowId,
                from
              )
              setTables(updatedJournalTable)
            }

            setLoading(false)
          } else {
            const updatedJournalTable = updateJournalTable(
              newData.tableId,
              newData.rowId,
              newData.cellId,
              data
            )
            setTables(updatedJournalTable)
            setLoading(false)
          }
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
  useEffect(() => {
    setTables(props.tables)
  }, [props.tables])

  useEffect(() => {
    setParagraphs(props.paragraphs)
  }, [props.paragraphs])

  const handleUpdateJournalTables = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    cellId,
    from
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

  const handleUpdateJournalRowsClones = async (
    obj,
    value,
    isEdit,
    tableId,
    parentRowId,
    cellId,
    clonedRowId,
    from
  ) => {
    // setLoading(true)
    const content = {
      content: null,
      amount: null,
      cloneCellId: cellId,
      tableId: tableId,
      inputType: obj.inputType,
      inputTag: obj.inputTag
      // parentTableId
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

    const updatedJournalTable = updateJournalTableRowsClones(
      tableId,
      parentRowId,
      cellId,
      content,
      clonedRowId,
      from
    )
    setTables(updatedJournalTable)

    await updateTable(
      {
        content,
        cellId,
        rowId: parentRowId,
        tableId,
        isEdit,
        cloneCellId: cellId
      },
      null,
      from,
      clonedRowId
    )
  }
  const handleUpdateJournalTablesClones = async (...args) => {
    const [obj, value, isEdit, tableId, rowId, cellId, parentTableId] = args

    // setLoading(true)
    const content = {
      content: null,
      amount: null,
      cloneCellId: cellId,
      tableId: tableId,
      inputType: obj.inputType,
      inputTag: obj.inputTag,
      parentTableId
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

    const updatedJournalTable = updateJournalTableClones(
      tableId,
      rowId,
      cellId,
      content,
      parentTableId
    )

    setTables(updatedJournalTable)
    await updateTable(
      {
        content,
        rowId,
        cellId: null,
        tableId,
        isEdit,
        cloneCellId: cellId
      },
      parentTableId
    )
  }

  const onAddTable = (table) => {
    const highestOrder = Math.max(
      ...tables.map((table) => {
        return Math.max(
          ...(table.clonedTables.length > 0
            ? table.clonedTables.map((clonedTable) => clonedTable.order)
            : [0])
        )
      })
    )

    const modifiedTable = {
      title: table.title,
      journalId: table.journalId,
      ltsJournalAccordionId: table.ltsJournalAccordionId,
      order: highestOrder + 1,
      gridColumns: table.gridColumns,
      parentTableId: table.id,
      rows: table.rows.map((row, index) => {
        let newRow = {
          order: index + 1,
          content: ''
        }
        return {
          ...newRow,
          cells: row.cells.map((cell) => {
            let newCell = {
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
            }
            return newCell
          })
        }
      })
    }
    axiosInstance
      .post('/ltsJournalTables/tableClone', modifiedTable)
      .then((res) => {
        const createdTable = res.data.table
        let foundedTableIndex = tables.findIndex(
          (table) => table.id === createdTable.parentTableId
        )
        let newTables = [...tables]
        let clonedTables = newTables[foundedTableIndex].clonedTables
        clonedTables.unshift(createdTable)

        newTables[foundedTableIndex].clonedTables = clonedTables
        toast.success('JournalTable added successfully')
        setTables(newTables)
      })
      .catch((err) => {
        if (err.response.data.message) {
          toast.error(err.response.data.message)
        } else {
          toast.error('Error occurred during creating table')
        }
      })
  }

  const onDeleteClonedTable = (table, index) => {
    axiosInstance
      .delete(`/ltsJournalTables/tableClone/${table.id}`)
      .then((res) => {
        let newTables = [...tables]
        let clonedTables = newTables.find(
          (t) => t.id === table.parentTableId
        )?.clonedTables

        if (clonedTables) {
          clonedTables.splice(index, 1)
          toast.success('JournalTable deleted successfully')
          setTables(newTables)
        }
      })
      .catch((err) => {
        toast.error('Error occurred during deleting table')
      })
  }

  console.log('tables', tables)
  return (
    <div className={'table-container'}>
      {tables?.map((table, tableIndex) => {
        const sortedTables = table?.clonedTables?.sort(
          (a, b) => a.order - b.order
        )

        return (
          <React.Fragment key={table.id}>
            <div style={{ order: table.order }}>
              <div style={{ order: 1 }}>
                <JournalTable
                  table={table}
                  tableIndex={tableIndex}
                  additionalStyling={props.additionalStyling}
                  handleUpdateJournalTables={(
                    obj,
                    value,
                    isEdit,
                    tableId,
                    rowId,
                    cellId,
                    clonedRowId,
                    from
                  ) => {
                    if (from !== 'fromClonedRows') {
                      return handleUpdateJournalTables(
                        obj,
                        value,
                        isEdit,
                        tableId,
                        rowId,
                        cellId,
                        from
                      )
                    } else {
                      const parentRowId = rowId
                      return handleUpdateJournalRowsClones(
                        obj,
                        value,
                        isEdit,
                        tableId,
                        parentRowId,
                        cellId,
                        clonedRowId,
                        from
                      )
                    }
                  }}
                  getRows={() => getRows(table.id)}
                  loading={loading}
                  setLoading={setLoading}
                  isClonedTable={false}
                />
              </div>
              <div style={{ order: 2 }}>
                {table?.clonedTables?.length > 0 && (
                  <ClonedTables
                    tables={sortedTables}
                    additionalStyling={props.additionalStyle}
                    handleUpdateJournalTablesClones={
                      handleUpdateJournalTablesClones
                    }
                    loading={loading}
                    setLoading={setLoading}
                    onDeleteClonedTable={onDeleteClonedTable}
                  />
                )}
              </div>
              <div style={{ order: 3, position: 'relative' }}>
                {table?.isCloneable ? (
                  <div className={' d-flex justify-content-end p-2'}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="plus-ico "
                      style={{
                        width: '28px',
                        height: '28px',
                        color: '#707070',
                        cursor: 'pointer'
                      }}
                      onClick={() => onAddTable(table)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </React.Fragment>
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
