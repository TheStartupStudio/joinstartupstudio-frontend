import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  NavLink,
  Link,
  useParams,
  useHistory,
  Switch,
  Route,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import searchIcon from '../../assets/images/search-icon.png'
import triangleIcon from '../../../src/assets/images/triangle.png'
import testOne from '../../../src/assets/images/test-1.PNG'

import TestJournalContent from './TestJournalContent'
import BreakdownTextAccordion from './BreakdownTextAccordion'
import './BreakdownTextAccordion.css'
import axiosInstance from '../../utils/AxiosInstance'
import LtsJournalContent from './content'
import TestJournalType from './TestJournalType'

const AccordionImage = (props) => {
  return (
    <img
      src={props.image}
      alt={'test1'}
      className={'accordion-content-image'}
    />
  )
}

const SidebarMenuItem = (props) => {
  return (
    <div className={`accordion-menu__item`}>
      <NavLink
        className={
          window.location.pathname.includes('lts-journal') ||
          window.location.pathname.includes('personal-finance-journal')
            ? 'accordion-menu__item-toggle'
            : ''
        }
        to={`${props.toUrl}`}
      >
        <span className={'text-uppercase'}>{props.title}</span>
      </NavLink>
    </div>
  )
}
function TestJournal(props) {
  return (
    <>
      <Switch>
        <Route
          path={`${props.match.url}/:type/`}
          render={(renderprops) => (
            <>
              <TestJournalType
                {...renderprops}
                backRoute={props.match.url}
                category={props.category}
                // saved={journalChanged}
              />
            </>
          )}
        />
      </Switch>
    </>
  )
}

export default injectIntl(TestJournal, {
  withRef: false,
})
