import { Switch, Route, Redirect } from 'react-router-dom'
import Layout from './pages/Layout'
import { connect, useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import {
  adminRoutes,
  authRoutes,
  authRoutesWithProps,
  publicRoutes,
  redirects
} from './pages/Router/RouteConfiguration'
import NotFound from './pages/NotFound'
import PublicLayout from './pages/Layout/publicLayout'
import renderRoutes from './pages/Router/renderRoutes'
import AppLocale from './lang'

function NewRouter(props) {
  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user } = useSelector((state) => state.user)

  console.log('user', user)

  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
      onError={() => ''}
    >
      {isAuthenticated ? (
        <Layout>
          <Switch>
            {renderRoutes(authRoutes)}
            {user?.isAdmin && renderRoutes(adminRoutes)}
            {renderRoutes(authRoutesWithProps)}
            {redirects.map((redirect) => (
              <Redirect
                key={redirect.from}
                from={redirect.from}
                to={redirect.to}
                exact={redirect.exact || false}
              />
            ))}
            <Route component={NotFound} />
          </Switch>
        </Layout>
      ) : (
        <PublicLayout>
          <Switch>
            {renderRoutes(publicRoutes)}
            {redirects.map((redirect) => (
              <Redirect
                key={redirect.from}
                from={redirect.from}
                to={redirect.to}
                exact={redirect.exact || false}
              />
            ))}
            <Route component={NotFound} />
          </Switch>
        </PublicLayout>
      )}
    </IntlProvider>
  )
}

const mapStateToProps = ({ lang }) => {
  const { locale } = lang
  return { locale }
}

export default connect(mapStateToProps, {})(NewRouter)
