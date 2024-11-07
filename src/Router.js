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
} from './Router/RouteConfiguration'
import NotFound from './pages/NotFound'
import PublicLayout from './pages/Layout/publicLayout'
import renderRoutes from './Router/renderRoutes'
import AppLocale from './lang'
import ReSigninModal from './pages/Auth/Login/ReSigninModal'
import { useTokenAuthentication } from './hooks/useTokenAuthentication'
import useImpersonation from './hooks/useImpersonation'

function Router(props) {
  const originalToken = localStorage.getItem('original_access_token')

  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const { authModal, handleLoginRedirect, handleCloseModal } =
    useTokenAuthentication(isAuthenticated)

  useImpersonation(originalToken)

  return (
    <>
      {authModal && (
        <ReSigninModal
          show={authModal}
          onHide={handleCloseModal}
          onLogin={handleLoginRedirect}
        />
      )}
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
    </>
  )
}

const mapStateToProps = ({ lang }) => {
  const { locale } = lang
  return { locale }
}

export default connect(mapStateToProps, {})(Router)
