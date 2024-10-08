import { Route } from 'react-router-dom'

const renderRoutes = (routes, layout) => {
  return routes.map((route) => {
    const RouteComponent = route.props
      ? (props) => <route.component {...props} {...route.props} />
      : route.component
    return (
      <Route
        key={route.path}
        path={route.path}
        exact={route.exact || false}
        render={(props) => <RouteComponent {...props} />}
        breadcrumb={route.breadcrumb}
      />
    )
  })
}

export default renderRoutes
