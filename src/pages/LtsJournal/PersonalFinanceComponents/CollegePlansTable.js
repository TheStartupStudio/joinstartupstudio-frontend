import React from 'react'
import TableWrapper from '../TableWrapper/index'
import {
  JournalTableCell,
  TableCellTitle,
  UserJournalTableCell
} from '../TableWrapper/TableComponents'

const CollegePlansTable = ({ tables, loading, handleChange }) => {
  return (
    <div>
      {tables
        ?.toSorted((a, b) => a.id - b.id)
        ?.map((table) => {
          return (
            <TableWrapper title={table.title}>
              {table.collegePlansRows
                ?.toSorted((a, b) => a.id - b.id)
                ?.map((row) => {
                  return (
                    <div>
                      <div
                        className={'d-flex justify-content-between'}
                        style={{ gap: 2 }}
                      >
                        {row.collegePlansColumns
                          ?.toSorted((a, b) => a.id - b.id)
                          ?.map((column) => {
                            return (
                              <div style={{ width: '100%' }}>
                                <div
                                  style={{
                                    height: 54,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#E5E5E5',
                                    color: '#231F20',
                                    width: '100%'
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 12,
                                      textAlign: 'start',
                                      padding: '4px 10px',
                                      fontWeight: 500,
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    {column?.title}
                                  </div>
                                </div>
                                <div
                                  className={
                                    'd-flex justify-content-between flex-column'
                                  }
                                  style={{ gap: 2 }}
                                >
                                  {column.collegePlansCells
                                    ?.toSorted((a, b) => a.id - b.id)
                                    ?.map((cell, index) => {
                                      return (
                                        <div
                                          style={{
                                            display: 'flex',
                                            width: '100%'
                                          }}
                                        >
                                          {!cell?.title &&
                                            !cell?.title?.length && (
                                              <UserJournalTableCell
                                                cell={cell}
                                                userCell={
                                                  cell.userCollegePlansCells
                                                }
                                                userCellValue={
                                                  cell?.userCollegePlansCells
                                                    ?.content
                                                }
                                                inputType={'text'}
                                                handleChangeUserCell={(
                                                  cellToUpdate,
                                                  value,
                                                  isEdit
                                                ) => {
                                                  if (!loading) {
                                                    return handleChange(
                                                      cellToUpdate,
                                                      value,
                                                      isEdit,
                                                      table.id,
                                                      row.id,
                                                      column.id,
                                                      cell.id
                                                    )
                                                  }
                                                }}
                                              />
                                            )}
                                          {cell?.title &&
                                            cell?.title?.length && (
                                              <TableCellTitle
                                                title={cell?.title}
                                              />
                                            )}
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )
                })}
            </TableWrapper>
          )
        })}
    </div>
  )
}

export default CollegePlansTable
