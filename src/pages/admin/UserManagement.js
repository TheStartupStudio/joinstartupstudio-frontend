import React, { useState } from 'react'
import LoadingAnimation from '../../ui/loadingAnimation'
import UserManagementComponent from '../../components/admin/UserManagement/index'

const UserManagement = () => {
  const [loading, setLoading] = useState(false)
  return (
    <div className="container-fluid iamr-page">
      <div className="pt-4 ">
        <h3 className="fw-bold">USER MANAGEMENT</h3>
        <h5 className="py-3">VIEW ALL CLASSROOMS</h5>
      </div>
      {loading ? (
        <LoadingAnimation show={loading} />
      ) : (
        <UserManagementComponent />
      )}
    </div>
  )
}

export default UserManagement
