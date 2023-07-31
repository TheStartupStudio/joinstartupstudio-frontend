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
  useRouteMatch
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

function TestJournal(props) {
  console.log('props', props)
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
              />
            </>
          )}
        />
      </Switch>
    </>
  )
}

export default injectIntl(TestJournal, {
  withRef: false
})
