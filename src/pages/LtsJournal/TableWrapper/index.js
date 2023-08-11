import './index.css'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const TableWrapper = ({ title, children, isDelete, onDelete }) => {
  return (
    <div className="table-wrapper">
      <div className="table-wrapper__title">
        <h5>{title}</h5>
        <div>
          {isDelete && (
            <FontAwesomeIcon
              onClick={onDelete}
              icon={faTrashAlt}
              className="plus-icon float-end "
              style={{
                width: '18px',
                height: '18px',
                color: '#fff'
              }}
            />
          )}
        </div>
      </div>
      <div className="table-wrapper__content">{children}</div>
    </div>
  )
}

export default TableWrapper
