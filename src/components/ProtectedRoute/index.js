import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { checkPermission, getDefaultRoute } from '../../utils/permissions'

const ProtectedRoute = ({ component: Component, roles = [], universityFeatures = [], ...rest }) => {
  const { user } = useSelector((state) => state.user.user)

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to='/' />
        }

        const hasPermission = checkPermission(user, roles, universityFeatures)

        if (!hasPermission) {
          return <Redirect to={getDefaultRoute(user)} />
        }

        return <Component {...props} />
      }}
    />
  )
}

export default ProtectedRoute