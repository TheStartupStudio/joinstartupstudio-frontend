import { Switch, Route, Redirect } from 'react-router-dom'
import Layout from './pages/Layout'
import { connect, useDispatch, useSelector } from 'react-redux'
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
import { userLogout } from './redux'
import { setAuthModal } from './redux/user/Actions'
import { setGeneralLoading } from './redux/general/Actions'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

function Router(props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user, authModal, loading } = useSelector(
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

  const handleAuthModalClose = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        history.push('/')
        // window.location.href = '/'
        localStorage.clear()
        dispatch(setAuthModal(false))
      })
      .catch((error) => {
        console.log('error', error)
        dispatch(setGeneralLoading(false))
      })
      .finally(() => {
        dispatch(setGeneralLoading(false))
      })
  }

  return (
    <>
      {authModal ? (
        <ReSigninModal
          show={authModal}
          onHide={handleAuthModalClose}
          onLogin={handleAuthModalClose}
        />
      ) : null}
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
        onError={() => ''}
      >
        {isAuthenticated ? (
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
      </IntlProvider>
    </>
  )
}

const mapStateToProps = ({ lang }) => {
  const { locale } = lang
  return { locale }
}

export default connect(mapStateToProps, {})(Router)
