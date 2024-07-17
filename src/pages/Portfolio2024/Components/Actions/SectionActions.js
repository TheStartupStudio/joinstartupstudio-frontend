import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaCheck, FaEye, FaPlus, FaTrash } from 'react-icons/fa6'
import { FaPencilAlt } from 'react-icons/fa'
import TooltipAction from './TooltipAction'

function SectionActions(props) {
  const foundedAction = (type) =>
    props.actions?.find((action) => action.type === type)
  const addButton = foundedAction('add')
  const editButton = foundedAction('edit')
  const saveButton = foundedAction('save')
  const hideButton = foundedAction('hide')
  const trashButton = foundedAction('trash')

  return (
    <React.Fragment>
      <div
        className={`portfolio-actions ${
          props.positionRelative ? 'position-relative' : ''
        }`}
      >
        <React.Fragment>
          {editButton?.isDisplayed && (
            <TooltipAction
              onClick={() => editButton?.action()}
              icon={<FaPencilAlt className={'action-icon pencil-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content'}>
                  Click here to return to edit mode
                </Tooltip>
              }
            />
          )}

          {saveButton?.isDisplayed && (
            <TooltipAction
              onClick={() => saveButton?.action()}
              icon={<FaCheck className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content '}>
                  Click here to save
                </Tooltip>
              }
            />
          )}
          {hideButton?.isDisplayed && (
            <TooltipAction
              onClick={() => hideButton?.action()}
              icon={<FaEye className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content '}>
                  Click here to HIDE this section
                </Tooltip>
              }
            />
          )}
          {addButton?.isDisplayed && (
            <TooltipAction
              onClick={() => addButton?.action()}
              icon={<FaPlus className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content '}>
                  {addButton?.description ?? `Click here to add a new item`}
                </Tooltip>
              }
            />
          )}
          {trashButton?.isDisplayed && (
            <TooltipAction
              onClick={() => trashButton?.action()}
              icon={<FaTrash className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id="tooltip" className={'tooltip-content '}>
                  {trashButton?.description ?? `Click here to delete item`}
                </Tooltip>
              }
            />
          )}
        </React.Fragment>
      </div>
    </React.Fragment>
  )
}

export default SectionActions
