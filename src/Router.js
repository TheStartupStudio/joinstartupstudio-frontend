import { Switch, Route, Redirect } from 'react-router-dom'
import Layout from './pages/Layout'
import { connect, useSelector } from 'react-redux'
import { IntlProvider } from 'react-intl'
import {
  adminRoutes,
  instructorRoutes,
  mutualRoutes,
  publicRoutes,
  redirects,
  studentRoutes
} from './Router/RouteConfiguration'
import NotFound from './pages/NotFound'
import PublicLayout from './pages/Layout/publicLayout'
import renderRoutes from './Router/renderRoutes'
import AppLocale from './lang'
import ReSigninModal from './pages/Auth/Login/ReSigninModal'

function Router(props) {
  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user, authModal } = useSelector(
    (state) => state.user
  )

  const roleRoutes = () => {
    if (!isAuthenticated) return publicRoutes

    switch (user?.user?.role_id) {
      case 1:
        return [...mutualRoutes, ...studentRoutes]
      case 2:
        return [...mutualRoutes, ...instructorRoutes]
      case 3:
        return [...mutualRoutes, ...instructorRoutes, ...adminRoutes]
      default:
        return mutualRoutes
    }
  }

  const isResetPasswordRoute =
    window.location.pathname.startsWith('/reset-password')

  return (
    <>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
        onError={() => ''}
      >
        <>
          {authModal ? <ReSigninModal show={authModal} /> : null}
          {isAuthenticated && !isResetPasswordRoute ? (
            <Layout>
              <Switch>
                {renderRoutes(roleRoutes())}
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
        </>
      </IntlProvider>
    </>
  )
}

const mapStateToProps = ({ lang }) => {
  const { locale } = lang
  return { locale }
}

export default connect(mapStateToProps, {})(Router)
