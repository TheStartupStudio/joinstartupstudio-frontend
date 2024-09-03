import React from 'react'
import '../../TableWrapper/index.css'

export const JournalTableCell = (props) => {
  const { isGray, colSpan, additionalStyling } = props

  return (
    <td
      colSpan={colSpan}
      style={{
        backgroundColor: isGray ? '#dfdfdf' : '#fff',
        ...additionalStyling,
        height: '100%',
        display: 'table-cell'
      }}
      className={'journal_table-data '}
      // className={'table_cell-title_box'}
    >
      {props.children}
    </td>
  )
}
export default JournalTableCell
