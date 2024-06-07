import React from 'react'

import { Switch, Route } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import './BreakdownTextAccordion.css'
import TestJournalType from './TestJournalType'

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
