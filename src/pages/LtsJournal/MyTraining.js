import { Switch, Route } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import './BreakdownTextAccordion.css'
import MyTrainingType from './MyTrainingType'

function MyTraining(props) {
  console.log('props', props)
  return (
    <>
      <Switch>
        <Route
          path={`${props.match.url}`}
          render={(renderprops) => (
            <>
              <MyTrainingType
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

export default injectIntl(MyTraining, {
  withRef: false
})
