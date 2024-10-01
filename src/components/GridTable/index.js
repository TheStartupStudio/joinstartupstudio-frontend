import React, { useCallback, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles//ag-grid.css'
import 'ag-grid-community/styles//ag-theme-quartz.css'
import './style.css'

const loadingTemplate = `
  <div class="d-flex justify-content-center align-items-center flex-column my-5 py-5">
    <div class="lds-facebook">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
`

const noRowsTemplate = `
  <div class="d-flex justify-content-center align-items-center flex-column my-5 py-5">
    <p>No data available to display</p>
  </div>
`

const GridTable = ({
  setSelectedRows,
  columnDefs = [],
  filteredData = [],
  loading
}) => {
  const gridApiRef = useRef(null)
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      editable: true
    }
  }, [])

  const onSelectionChanged = useCallback(
    (event) => {
      const selectedNodes = event.api.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)

      setSelectedRows(selectedData)
    },
    [setSelectedRows]
  )

  const onGridReady = (params) => {
    gridApiRef.current = params.api
    if (loading) {
      params.api.showLoadingOverlay()
    } else if (filteredData.length === 0) {
      params.api.showNoRowsOverlay()
    }
  }

  React.useEffect(() => {
    if (gridApiRef.current) {
      if (loading) {
        gridApiRef.current.showLoadingOverlay()
      } else {
        gridApiRef.current.hideOverlay()
      }
    }
  }, [loading])
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className='ag-theme-quartz' style={{ height: 500 }}>
        <AgGridReact
          popupParent={document.body}
          reactiveCustomComponents
          rowData={filteredData}
          rowHeight={55}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection='multiple'
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          overlayLoadingTemplate={loadingTemplate}
          overlayNoRowsTemplate={noRowsTemplate}
          onGridReady={onGridReady}
          reactive
        />
      </div>
    </div>
  )
}

export default GridTable
