import React from 'react'
import { useTable } from 'react-table'
import LtsButton from '../LTSButtons/LTSButton'

const ReactTable = ({
  data,
  onAdd,
  onSelectRow,
  getColumns,
  onEdit,
  onDelete,
  onView
}) => {
  const columns = React.useMemo(
    () => getColumns({ onSelectRow, onEdit, onDelete, onView }),
    [onSelectRow, onEdit, onDelete, onView]
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: data ?? []
    })

  return (
    <div className={'my-2'}>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ReactTable
