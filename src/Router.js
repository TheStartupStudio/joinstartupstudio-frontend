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
import { filterRoutesByAccess, getDefaultDashboard } from './utils/routeHelpers'


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

        const userRoleId = user?.user?.role_id
            const filteredMutualRoutes = filterRoutesByAccess(mutualRoutes, user)



    switch (userRoleId) {
    case 1: // Student
      const filteredStudentRoutes = filterRoutesByAccess(studentRoutes, user)
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        ...filteredMutualRoutes, 
        ...filteredStudentRoutes
      ]
    
    case 2: // Instructor
      const filteredInstructorRoutes = filterRoutesByAccess(instructorRoutes, user)
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        ...filteredMutualRoutes, 
        ...filteredInstructorRoutes
      ]
    
    case 3: // Super Admin
      const filteredInstructorRoutesAdmin = filterRoutesByAccess(instructorRoutes, user)
      const filteredAdminRoutes = filterRoutesByAccess(adminRoutes, user)
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        ...filteredMutualRoutes, 
        ...filteredInstructorRoutesAdmin,
        ...filteredAdminRoutes
      ]
    
    default:
      return [
        { path: '/subscription/success', component: SubscriptionSuccess, exact: true },
        ...filteredMutualRoutes
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
                
                {/* ✅ Only apply redirects for users with active subscriptions AND not on success page */}
                {hasActiveSubscription() && !isSubscriptionSuccessRoute && (
                  <Switch>
                    {/* Root redirect based on role */}
                    <Redirect 
                      exact 
                      from="/" 
                      to={user?.user?.role_id === 2 || user?.user?.role_id === 3 ? '/admin-dashboard' : '/dashboard'} 
                    />
                    
                    {/* Dashboard redirect for clients/admins */}
                    <Redirect 
                      exact 
                      from="/dashboard" 
                      to={user?.user?.role_id === 2 || user?.user?.role_id === 3 ? '/admin-dashboard' : '/dashboard'} 
                    />
                    
                    {/* Register/Login redirects */}
                    <Redirect 
                      exact 
                      from="/register" 
                      to={user?.user?.role_id === 2 || user?.user?.role_id === 3 ? '/admin-dashboard' : '/dashboard'} 
                    />
                    <Redirect 
                      exact 
                      from="/ims-login" 
                      to={user?.user?.role_id === 2 || user?.user?.role_id === 3 ? '/admin-dashboard' : '/dashboard'} 
                    />
                    
                    {/* Subscription redirect - only if needed */}
                    {redirects.find(r => r.from === '*' && r.to === '/subscribe' && (!r.condition || r.condition(user))) && (
                      <Redirect from="*" to="/subscribe" />
                    )}
                  </Switch>
                )}
                
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
