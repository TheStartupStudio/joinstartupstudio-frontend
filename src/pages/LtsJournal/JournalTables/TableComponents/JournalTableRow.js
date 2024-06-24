import React from 'react'
import '../../../../pages/LtsJournal/TableWrapper/index.css'

export const JournalTableRow = (props) => {
  const { children, additionalStyle } = props
  return (
    <tr className={'journal_table-row'} style={{ ...additionalStyle }}>
      {children}
    </tr>
  )
}
export default JournalTableRow
