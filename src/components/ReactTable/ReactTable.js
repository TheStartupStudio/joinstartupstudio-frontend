import React from 'react'
import { useTable } from 'react-table'

const ReactTable = ({ accordions }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title'
      },
      {
        Header: 'Actions',
        accessor: 'id', // Assuming each accordion item has a unique id
        Cell: ({ value }) => (
          <div>
            <button onClick={() => handleEdit(value)}>Edit</button>
            <button onClick={() => handleDelete(value)}>Delete</button>
          </div>
        )
      }
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: accordions
    })

  const handleEdit = (id) => {
    // Handle edit action based on the id
    console.log('Edit id:', id)
  }

  const handleDelete = (id) => {
    // Handle delete action based on the id
    console.log('Delete id:', id)
  }

  const handleAddNew = () => {
    // Handle adding new record
    console.log('Add new record')
  }

  return (
    <div>
      <button onClick={handleAddNew}>Add New</button>
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
