import { Switch, Route } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import MyTrainingType from './MyTrainingType'

function MyTraining(props) {
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
