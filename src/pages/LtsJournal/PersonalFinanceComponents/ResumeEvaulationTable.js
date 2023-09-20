import TableWrapper from '../TableWrapper/index'
import {
  JournalTableRow,
  TableCellTitle,
  UserJournalTableCell
} from '../TableWrapper/TableComponents'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TableRows } from '@fullcalendar/daygrid/internal'
import axiosInstance from '../../../utils/AxiosInstance'
import _ from 'lodash'

const ResumeEvaluationTable = (props) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTables(props.tables)
  }, [props.tables])

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 1000),
    []
  )
  const findHighestNumberOfCells = (tables) => {
    let maxNumberOfCells = 0

    for (const table of tables) {
      for (const row of table.rows) {
        const numberOfCellsInRow = row.cells.length
        if (numberOfCellsInRow > maxNumberOfCells) {
          maxNumberOfCells = numberOfCellsInRow
        }
      }
    }

    return maxNumberOfCells
  }

  const highestNumberOfCells = useMemo(() => {
    return findHighestNumberOfCells(props.tables)
  }, [])

  const updateResumeEvaluationTable = (tableId, rowId, cellId, content) => {
    const updatedTables = tables.map((table) => {
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
                      userCells: content
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

  const handleUpdateResumeEvaluation = async (
    obj,
    value,
    isEdit,
    tableId,
    rowId,
    cellId
  ) => {
    const content = {
      content: value ?? '',
      cellId: cellId,
      tableId: tableId
    }
    delete content.id

    if (isEdit) {
      if (obj.id) {
        content.id = obj.id
      }
      content.cellId = obj.cellId
    }

    const resumeEvaluationTable = updateResumeEvaluationTable(
      tableId,
      rowId,
      cellId,
      content
    )
    setTables(resumeEvaluationTable)

    debounce(updateResumeEvaluation, { content, cellId, rowId, tableId })
  }

  const updateResumeEvaluation = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-resume-evaluation`, {
        ...newData.content
      })
      .then(({ data }) => {
        const resumeEvaluationTable = updateResumeEvaluationTable(
          newData.tableId,
          newData.rowId,
          newData.cellId,
          data
        )
        setTables(resumeEvaluationTable)

        setLoading(false)
      })
  }
  return (
    <>
      {tables?.map((table) => {
        return (
          //   <TableWrapper title={table.title}>
          <table
            className={'journal-table'}
            style={{
              width: '100%',
              height: '100%',
              borderCollapse: 'separate',
              borderSpacing: 2,
              border: '1px solid #BBBDB'
            }}
          >
            {table?.rows
              ?.toSorted((a, b) => a.id - b.id)
              ?.map((row) => {
                return (
                  <JournalTableRow additionalStyle={{ width: '100%' }}>
                    {row?.cells?.map((cell, index) => {
                      return (
                        <>
                          {cell.title ? (
                            <TableCellTitle
                              title={cell?.title}
                              isColumn={cell.isColumn}
                              key={cell.id}
                              additionalStyle={{
                                width: `${100 / 3}%`,
                                height: 50
                              }}
                            />
                          ) : (
                            <UserJournalTableCell
                              cell={cell}
                              inputTag={'textarea'}
                              userCell={cell.userCells}
                              userCellValue={cell.userCells?.content}
                              handleChangeUserCell={(
                                cellToUpdate,
                                value,
                                isEdit
                              ) => {
                                if (!loading) {
                                  return handleUpdateResumeEvaluation(
                                    cellToUpdate,
                                    value,
                                    isEdit,
                                    table.id,
                                    row.id,
                                    cell.id
                                  )
                                }
                              }}
                              isDisabled={loading === true}
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
                )
              })}
          </table>
          //   </TableWrapper>
        )
      })}
    </>
  )
}
export default ResumeEvaluationTable
