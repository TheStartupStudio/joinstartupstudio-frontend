import React, { useEffect, useState } from 'react'

import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../utils/hooks/useWindowWidth'

export const ActionIcon = (props) => {
  return (
    <>
      {!props.isPreview ? (
        <div
          style={{
            cursor: 'pointer',
            backgroundColor: 'rgba(229,229,229,0.57)',
            // borderRadius: '0px 6px 6px 0px',
            height: '50px',
            width: '50px',
            padding: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={props.handleOnClick}
        >
          <FontAwesomeIcon
            className="edit-pencil "
            icon={props.icon}
            style={{
              height: '25px',
              width: '25px'
            }}
          />
        </div>
      ) : null}
    </>
  )
}

const PortfolioSection = (props) => {
  const history = useHistory()
  const [isPreview, setIsPreview] = useState(null)
  // const isPreview = history.location.pathname.includes('preview')

  const windowWidth = useWindowWidth()
  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])

  return (
    <div
      style={{
        // height: 100,
        borderRadius: 6,
        border: '1px solid #BBBDBF',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        margin: '30px 0',
        width: '100%'
      }}
    >
      {!isPreview ? (
        <div
          style={{
            display: 'flex',
            justifyContent: props.title ? 'space-between' : 'flex-end',
            height: windowWidth < 500 ? '100%' : 50,
            flexDirection: windowWidth < 500 ? 'column-reverse' : 'row'
          }}
        >
          {props.title ? (
            <div
              style={{
                textAlign: 'left',
                font: `normal normal 600 ${
                  windowWidth < 700 ? '18px/27px' : '22px/27px'
                } Montserrat`,
                letterSpacing: 0,
                color: '#231F20',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 15
              }}
            >
              {props.title}
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {props.showInMyPortfolio && !isPreview ? (
              <div
                style={{
                  padding: windowWidth < 500 ? 10 : 0,

                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span
                  className="my_portfolio_publish pe-xxl-0 text-end"
                  style={{
                    font: `normal normal 600  ${
                      windowWidth < 700 ? '14px/22px' : '17px/22px'
                    } Montserrat`,
                    color: '#707070'
                  }}
                >
                  Show in my portfolio
                  {/*<IntlMessages id="portfolio.Publish.My.Portfolio" />*/}
                  <label className="px-0 ps-sm-1 ps-md-1 form-switch ml-2">
                    <input
                      type="checkbox"
                      checked={props.isShownInPortfolio}
                      onChange={props.handleShowInPortfolio}
                    />
                    <i></i>
                  </label>
                </span>
              </div>
            ) : null}
            {props.showLinkToProjects && !isPreview ? (
              <div
                style={{
                  display: 'flex',
                  padding: windowWidth < 500 ? 10 : 0,
                  alignItems: 'center'
                }}
              >
                <span
                  className="my_portfolio_publish pe-xxl-0"
                  style={{
                    font: 'normal normal 600 17px/20px Montserrat',
                    color: '#707070'
                  }}
                >
                  Show link to my projects in my portfolio
                  {/*<IntlMessages id="portfolio.Publish.My.Portfolio" />*/}
                  <label
                    className="px-0 ps-sm-1 ps-md-1 form-switch"
                    style={{ marginLeft: 4 }}
                  >
                    <input
                      type="checkbox"
                      checked={props.isShownLinkInPortfolio}
                      onChange={props.handleShowLinkInPortfolio}
                    />
                    <i></i>
                  </label>
                </span>
              </div>
            ) : null}
            {props.isAdd ? (
              <ActionIcon handleOnClick={props.onAdd} icon={faPlus} />
            ) : null}
            {props.isEdit ? (
              <ActionIcon handleOnClick={props.onEdit} icon={faPencilAlt} />
            ) : null}
          </div>
        </div>
      ) : null}

      {isPreview && !props.isIAMR && props.title && (
        <div
          style={{
            display: 'flex',
            justifyContent: props.title ? 'space-between' : 'flex-end',
            height: 50
            // ...(isPreview ? { height: '0px' } : { height: '50px' }),
          }}
        >
          {props.title && (
            <div
              style={{
                textAlign: 'left',
                font: 'normal normal 600 22px/27px Montserrat',
                letterSpacing: 0,
                color: '#231F20',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 15
              }}
            >
              {props.title}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: props.isPreview ? '15px' : '0 15px 15px 15px' }}>
        {props.children}
      </div>
    </div>
  )
}

export default PortfolioSection
