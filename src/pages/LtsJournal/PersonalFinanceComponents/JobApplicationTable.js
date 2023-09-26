import TableWrapper from '../TableWrapper/index'
import {
  TableCellTitle,
  UserJournalTableCell
} from '../TableWrapper/TableComponents'
import React from 'react'

const JobApplicationTable = ({
  tables,
  handleUpdateJobApplication,
  loading
}) => {
  return (
    <div>
      {tables?.map((table) => {
        return (
          <div>
            <TableWrapper title={table.title}>
              <div className={'d-flex'} style={{ gap: 2 }}>
                {table?.jobApplicationColumns
                  ?.toSorted((a, b) => a.id - b.id)
                  ?.map((column) => {
                    return (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}
                      >
                        {column?.jobApplicationCells?.map((cell, index) => {
                          return (
                            <div style={{ height: 54 }}>
                              {cell.title ? (
                                <TableCellTitle title={cell?.title} />
                              ) : (
                                <UserJournalTableCell
                                  cell={cell}
                                  userCell={cell.userJobApplicationCells}
                                  userCellValue={
                                    cell.userJobApplicationCells?.content
                                  }
                                  handleChangeUserCell={(
                                    cellToUpdate,
                                    value,
                                    isEdit
                                  ) => {
                                    if (!loading) {
                                      return handleUpdateJobApplication(
                                        cellToUpdate,
                                        value,
                                        isEdit,
                                        table.id,
                                        column.id,
                                        cell.id
                                      )
                                    }
                                  }}
                                  isDisabled={loading === true}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
              </div>
            </TableWrapper>
          </div>
        )
      })}
    </div>
  )
}
export default JobApplicationTable
