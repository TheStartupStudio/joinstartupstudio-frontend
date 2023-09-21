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

const LifestyleHousingTable = (props) => {
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
      .put(`/ltsJournals/user-lifestyle-housing`, {
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
    <div className={'table-container'}>
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
              ?.toSorted((a, b) => a.order - b.order)
              ?.map((row) => {
                return (
                  <JournalTableRow
                    additionalStyle={{ width: '100%', height: '100%' }}
                  >
                    {row?.cells
                      ?.toSorted((a, b) => a.order - b.order)
                      .map((cell, index) => {
                        return (
                          <>
                            {cell.title ? (
                              <TableCellTitle
                                title={cell?.title}
                                isColumn={cell.isTableHeader}
                                isTableSubHeader={cell.isTableSubHeader}
                                key={cell.id}
                                additionalStyle={{
                                  width: `${
                                    cell.isTableHeader || cell.isTableSubHeader
                                      ? 100 / table.gridColumns
                                      : 'auto'
                                  }%`
                                }}
                                backgroundColor={'#fff'}
                              />
                            ) : (
                              <UserJournalTableCell
                                cell={cell}
                                inputType={cell.inputType}
                                inputTag={cell.inputTag}
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
    </div>
  )
}
export default LifestyleHousingTable
