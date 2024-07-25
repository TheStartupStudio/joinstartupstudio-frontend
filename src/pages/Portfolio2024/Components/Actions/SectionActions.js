import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaCheck, FaEye, FaPlus, FaTrash } from 'react-icons/fa6'
import { FaPencilAlt } from 'react-icons/fa'
import TooltipAction from './TooltipAction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { IoMdOpen } from 'react-icons/io'

function SectionActions(props) {
  const foundedAction = (type) =>
    props.actions?.find((action) => action.type === type)
  const addButton = foundedAction('add')
  const editButton = foundedAction('edit')
  const saveButton = foundedAction('save')
  const hideButton = foundedAction('hide')
  const trashButton = foundedAction('trash')
  const openButton = foundedAction('open')

  return (
    <React.Fragment>
      <div
        className={`portfolio-actions ${
          props.positionRelative ? 'position-relative' : ''
        }`}
        style={{ ...props.styles }}
      >
        <React.Fragment>
          {editButton?.isDisplayed && (
            <TooltipAction
              onClick={() => editButton?.action()}
              icon={<FaPencilAlt className={'action-icon pencil-icon'} />}
              tooltipContent={
                <Tooltip id='tooltip' className={'tooltip-content'}>
                  Click here to return to edit mode
                </Tooltip>
              }
            />
          )}

          {saveButton?.isDisplayed && (
            <TooltipAction
              onClick={() => saveButton?.action()}
              icon={
                !saveButton?.isSaving ? (
                  <FaCheck className={'action-icon public-icon'} />
                ) : (
                  <div className='text-center' style={{ color: '#01c5d1' }}>
                    <FontAwesomeIcon icon={faSpinner} className='' spin />
                  </div>
                )
              }
              tooltipContent={
                <Tooltip id='tooltip' className={'tooltip-content '}>
                  Click here to save
                </Tooltip>
              }
            />
          )}

          {/*{saveButton?.isDisplayed && !saveButton?.containSpinner && (*/}
          {/*  <TooltipAction*/}
          {/*    onClick={() => saveButton?.action()}*/}
          {/*    icon={<FaCheck className={'action-icon public-icon'} />}*/}
          {/*    tooltipContent={*/}
          {/*      <Tooltip id="tooltip" className={'tooltip-content '}>*/}
          {/*        Click here to save*/}
          {/*      </Tooltip>*/}
          {/*    }*/}
          {/*  />*/}
          {/*)}*/}
          {hideButton?.isDisplayed && (
            <TooltipAction
              onClick={() => hideButton?.action()}
              icon={<FaEye className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id='tooltip' className={'tooltip-content '}>
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
                <Tooltip id='tooltip' className={'tooltip-content '}>
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
                <Tooltip id='tooltip' className={'tooltip-content '}>
                  {trashButton?.description ?? `Click here to delete item`}
                </Tooltip>
              }
            />
          )}
          {openButton?.isDisplayed && (
            <TooltipAction
              onClick={() => openButton?.action()}
              icon={<IoMdOpen className={'action-icon public-icon'} />}
              tooltipContent={
                <Tooltip id='tooltip' className={'tooltip-content '}>
                  {openButton?.description ?? `Click here to delete item`}
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
