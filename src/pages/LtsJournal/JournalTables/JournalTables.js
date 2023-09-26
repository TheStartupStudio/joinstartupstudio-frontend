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

    console.log('content', content)
    setTables(updatedJournalTable)
    updateResumeEvaluation(null, { content, cellId, rowId, tableId })
  }

  const updateResumeEvaluation = async (_, newData) => {
    setLoading(true)
    await axiosInstance
      .put(`/ltsJournals/user-journal-tables`, {
        ...newData.content
      })
      .then(({ data }) => {
        const updatedJournalTable = updateJournalTable(
          newData.tableId,
          newData.rowId,
          newData.cellId,
          data
        )

        setTables(updatedJournalTable)

        setLoading(false)
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
                                        if (!loading) {
                                          return handleUpdateJournalTables(
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
