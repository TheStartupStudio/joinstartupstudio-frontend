import { Route } from 'react-router-dom'

const renderRoutes = (routes) => {
  return routes.map((route) => {
    const RouteComponent = route.component
    return (
      <Route
        key={route.path}
        path={route.path}
        exact={route.exact || false}
        // render={(props) => <RouteComponent {...props} />}
        render={(props) => (
          <RouteComponent {...props} {...(route.props || {})} />
        )}
        breadcrumb={route.breadcrumb}
      />
    )
  })
}

export default renderRoutes
