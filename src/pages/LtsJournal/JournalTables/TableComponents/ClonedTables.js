import React from 'react'
import JournalTable from './JournalTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

function ClonedTables({
  tables,
  additionalStyling,
  handleUpdateJournalTablesClones,
  loading,
  setLoading,
  onDeleteClonedTable
}) {
  return tables?.map((clonedTable, tableIndex) => {
    return (
      <React.Fragment key={clonedTable.id}>
        <div
          className={'d-flex'}
          style={{ order: clonedTable.order, marginTop: 10 }}
        >
          <div style={{ order: 1, width: '100%', flexGrow: 0.9 }}>
            <JournalTable
              table={clonedTable}
              tableIndex={tableIndex}
              additionalStyling={additionalStyling}
              handleUpdateJournalTables={(...args) => {
                return handleUpdateJournalTablesClones(...args)
              }}
              loading={loading}
              setLoading={setLoading}
              isClonedTable={true}
            />
          </div>
          <div
            style={{
              order: 2,
              flexGrow: 0.1,
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="plus-icon float-end ms-1"
              style={{
                width: '22px',
                height: '22px',
                color: 'rgb(254, 67, 161)',
                cursor: 'pointer'
              }}
              onClick={() => onDeleteClonedTable(clonedTable, tableIndex)}
            />
          </div>
        </div>
      </React.Fragment>
    )
  })
}

export default ClonedTables
