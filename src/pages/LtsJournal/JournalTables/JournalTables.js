import {
  JournalTableRow,
  TableCellTitle,
  UserJournalTableCell
} from '../TableWrapper/TableComponents'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../../utils/AxiosInstance'
import _ from 'lodash'

const JournalTables = (props) => {
  const [tables, setTables] = useState([])
  const [paragraphs, setParagraphs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTables(props.tables)
  }, [props.tables])

  useEffect(() => {
    setParagraphs(props.paragraphs)
  }, [props.paragraphs])

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
  const getTableCells = async (tableId, rowId, cellId) => {
    try {
      const response = await axiosInstance.get(
        `/ltsJournals/journal-tables-cell/${cellId}`
      )
      const newData = response.data
      setTables((prevTables) => {
        return prevTables.map((table) => {
          if (table.id === tableId) {
            return {
              ...table,
              rows: table.rows.map((row) => {
                if (row.id === rowId) {
                  return {
                    ...row,
                    cells: row.cells.map((cell) => {
                      if (cell.id === cellId) {
                        return newData
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
      })
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error)
    }
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

  const handleUpdateJournalTables = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    cellId
  ) => {
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
    await updateResumeEvaluation(null, {
      content,
      cellId,
      rowId,
      tableId,
      isEdit
    })
  }

  const updateResumeEvaluation = async (_, newData) => {
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
          if (!newData.isEdit)
            getRows(newData.tableId, newData.rowId, newData.cellId)
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  return (
    <div className={'table-container'}>
      {tables?.map((table) => {
        return (
          <>
            <>
              <table
                className={'journal-table'}
                style={{
                  order: table.order
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
                  ?.map((row) => {
                    return (
                      <>
                        <JournalTableRow
                        // additionalStyle={{ width: '100%', height: '100%' }}
                        >
                          {row?.cells
                            ?.toSorted((a, b) => a.order - b.order)
                            .map((cell, index) => {
                              return (
                                <>
                                  {!cell.isEditable ? (
                                    <TableCellTitle
                                      cell={cell}
                                      key={cell.id}
                                      additionalStyle={{
                                        width: `${100 / table.gridColumns}%`
                                      }}
                                      backgroundColor={'#fff'}
                                    />
                                  ) : (
                                    <UserJournalTableCell
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
                                        // if (!loading) {
                                        return handleUpdateJournalTables(
                                          cellToUpdate,
                                          value,
                                          isEdit,
                                          table.id,
                                          row.id,
                                          cell.id
                                        )
                                        // }
                                      }}
                                      key={cell.id}
                                      additionalInputStyle={{
                                        height: '100%',
                                        padding: '0px',
                                        margin: '0px'
                                      }}
                                    />
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
