import React from 'react'
import { useSelector } from 'react-redux'
import TooltipAction from './TooltipAction'

function PortfolioActions(props) {
  const viewMode = useSelector((state) => state.portfolio.mode)
  const foundedAction = (type) =>
    props.actions?.find((action) => action.type === type)
  const editButton = foundedAction('edit')
  const previewButton = foundedAction('preview')
  const shareButton = foundedAction('share')
  const publishButton = foundedAction('publish')

  return (
    <React.Fragment>
      <div className={'portfolio-actions'}>
        {viewMode === 'preview' && (
          <React.Fragment>
            {editButton && (
              <TooltipAction
                onClick={() => editButton?.action()}
                icon={editButton.icon}
                tooltipContent={editButton.tooltipContent}
              />
            )}

            {publishButton?.isDisplayed && (
              <TooltipAction
                onClick={() => publishButton?.action()}
                icon={publishButton.icon}
                tooltipContent={publishButton.tooltipContent}
              />
            )}
            {shareButton?.isDisplayed && (
              <TooltipAction
                onClick={() => shareButton?.action()}
                icon={shareButton.icon}
                tooltipContent={shareButton.tooltipContent}
              />
            )}
          </React.Fragment>
        )}
        {viewMode === 'edit' && previewButton && (
          <React.Fragment>
            <TooltipAction
              onClick={() => previewButton.action()}
              icon={previewButton.icon}
              tooltipContent={previewButton.tooltipContent}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

export default PortfolioActions
