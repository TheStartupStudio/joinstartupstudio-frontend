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
import CheckSubscription from './pages/Register/CheckSubscription'
import CancelSubscription from './pages/Register/CancelSubscription'
import Payment from './pages/Register/Payment'
import Dashboard from './pages/Dashboard'
import LtsJournal from './pages/LtsJournal'
import MyCourseEntrepreneurship from './pages/MyCourseEntrepreneurship'
import PublicPortfolio2024 from './pages/Academy-Portfolio/index'
import SubscriptionSuccess from './pages/Register/SubscriptionSuccess'

function Router(props) {
  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user, authModal } = useSelector(
    (state) => state.user
  )

  const hasActiveSubscription = () => {
    if (!user?.user) return false
    
    const subscriptionStatus = user.user.subscription_status
    const stripeSubscriptionId = user.user.stripe_subscription_id
    const subscriptionExempt = user.user.subscription_exempt 
    
    return subscriptionExempt === true || 
           subscriptionStatus === 'active' || 
           (subscriptionStatus === 'canceling' && stripeSubscriptionId)
  }

  const roleRoutes = () => {
    if (!isAuthenticated) return publicRoutes

    const isSubscriptionSuccessPath = window.location.pathname === '/subscription/success'
    
    if (isSubscriptionSuccessPath) {
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        ...publicRoutes
      ]
    }

    if (!hasActiveSubscription()) {
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        { path: '/subscribe', component: CheckSubscription, exact: true },
        { path: '/cancel-payment', component: CancelSubscription, exact: true },
        { path: '/payment', component: Payment, exact: true },
        { path: '/dashboard', component: Dashboard, exact: true },
        { path: '/course', component: Dashboard, exact: true },
        // {
        //   path: '/my-course-in-entrepreneurship/journal',
        //   component: LtsJournal,
        //   props: { category: 'entrepreneurship' }
        // },
        {
          path: '/my-course-in-entrepreneurship',
          component: MyCourseEntrepreneurship,
          exact: true
        },
        {
          path: '/public-portfolio/:username',
          component: PublicPortfolio2024,
          exact: true
        },
        { path: '/logout', component: () => import('./pages/Auth/LogOut'), exact: false },
        { path: '/my-account', component: () => import('./pages/MyAccount'), exact: true },
        { path: '*', component: CheckSubscription }
      ]
    }

    switch (user?.user?.role_id) {
      case 1:
        return [
          { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
          ...mutualRoutes, 
          ...studentRoutes
        ]
      case 2:
        return [
          { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
          ...mutualRoutes, 
          ...instructorRoutes
        ]
      case 3:
        return [
          { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
          ...mutualRoutes, 
          ...instructorRoutes, 
          ...adminRoutes
        ]
      default:
        return [
          { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
          ...mutualRoutes
        ]
    }
  }

  const isResetPasswordRoute =
    window.location.pathname.startsWith('/reset-password')
  
  const isSubscriptionSuccessRoute = 
    window.location.pathname === '/subscription/success'

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
                {/* ✅ Always render SubscriptionSuccess route FIRST */}
                <Route 
                  exact 
                  path="/subscription/success" 
                  component={SubscriptionSuccess} 
                />
                {renderRoutes(roleRoutes())}
                {/* Only apply redirects for users with active subscriptions AND not on success page */}
                {hasActiveSubscription() && !isSubscriptionSuccessRoute && redirects.map((redirect) => (
                  (!redirect.condition || redirect.condition(user)) && (
                    <Redirect
                      key={redirect.from}
                      from={redirect.from}
                      to={redirect.to}
                      exact={redirect.exact || false}
                    />
                  )
                ))}
                <Route component={NotFound} />
              </Switch>
            </Layout>
          ) : (
            <PublicLayout>
              <Switch>
                {/* ✅ Render SubscriptionSuccess for public users too */}
                <Route 
                  exact 
                  path="/subscription/success" 
                  component={SubscriptionSuccess} 
                />
                {renderRoutes(publicRoutes)}
                {redirects.map((redirect) => (
                  (!redirect.condition || redirect.condition(user)) && (
                    <Redirect
                      key={redirect.from}
                      from={redirect.from}
                      to={redirect.to}
                      exact={redirect.exact || false}
                    />
                  )
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
