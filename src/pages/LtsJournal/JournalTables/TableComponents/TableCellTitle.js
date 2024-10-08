import React from 'react'

const TableCellTitle = ({ additionalStyle, backgroundColor, cell }) => {
  if (cell.isTableHeader) {
    return (
      <th
        style={{ ...additionalStyle, ...cell.cellStyle }}
        colSpan={cell.colSpan}
        className={'table_header-title_box'}
      >
        <div className={'table_header-title'} style={{ ...cell.cellStyle }}>
          {cell.content}
        </div>
      </th>
    )
  } else if (cell.isTableSubHeader) {
    return (
      <th
        style={{ ...additionalStyle, ...cell.cellStyle }}
        colSpan={cell.colSpan}
        className={'table-subheader-title_box'}
      >
        <div className={'table-subheader-title'} style={{ ...cell.cellStyle }}>
          {cell.content}
        </div>
      </th>
    )
  }
  return (
    <td
      style={{ ...additionalStyle, backgroundColor, ...cell.cellStyle }}
      colSpan={cell.colSpan}
      className={'table_cell-title_box'}
    >
      <div className={'table_cell-title'} style={{ ...cell.cellStyle }}>
        {cell.content}
      </div>
    </td>
  )
}
export default TableCellTitle
