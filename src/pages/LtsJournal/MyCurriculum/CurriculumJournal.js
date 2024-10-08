import React from 'react'

import { Switch, Route } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import CurriculumJournalType from './CurriculumJournalType'

function CurriculumJournal(props) {
  return (
    <>
      <Switch>
        <Route
          path={`${props.match.url}/:type/`}
          render={(renderprops) => (
            <>
              <CurriculumJournalType
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

export default injectIntl(CurriculumJournal, {
  withRef: false
})
