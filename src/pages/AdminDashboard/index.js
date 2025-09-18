import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import LtsContainerWrapper from '../../ui/LtsContainerWrapper'
import IntMessages from '../../utils/IntlMessages';
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import graphIcon from '../../assets/images/graph-up.png'
import dollarIcon from '../../assets/images/dollar.png'
import creaditCardIcon from '../../assets/images/credit-cards.png'
import groupIcon from '../../assets/images/group.png'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import './index.css'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    paidUsers: 764,
    totalRevenue: 310982,
    l1Learners: 379,
    l2Learners: 289,
    l3Learners: 212,
    totalEnrolledLearners: 823,
    completedL1: 125,
    completedL2: 98,
    completedL3: 75,
    totalCompletedAIE: 298
  })

  return (
<div>
    <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
            <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
                <div>
                    <h3 className="page-title bold-page-title text-black mb-0">
                        AIE super Admin Dashboard
                    </h3>
                </div>
                   
            </div>
                <img
                    src={MenuIcon}
                    alt='menu'
                    className='menu-icon-cie self-start-tab cursor-pointer'
                    onClick={() => dispatch(toggleCollapse())}
                />
            </div>
        </div>

      <div className="admin-dashboard-container">
        <div className="admin-info-container">
            <div className="container-title">
                <img src={graphIcon} alt="Core Info Icon" className="core-info-icon" />
                <p>Core Information</p>
            </div>
            <div className="d-flex gap-4 flex-wrap">
                <div className="info-box">
                    <img src={creaditCardIcon} alt="Paid Users Icon" className="info-icon" />
                    <p>Paid Users</p>
                    <h3>{dashboardData.paidUsers}</h3>
                </div>

                <div className="info-box">
                    <img src={dollarIcon} alt="Total Revenue Icon" className="info-icon" />
                    <p>Total Revenue</p>
                    <h3>${dashboardData.totalRevenue}</h3>
                </div>
            </div>


            <div className="d-flex gap-4 flex-wrap">
                <div className="info-box">
                    <img src={groupIcon} alt="Group Icon" className="info-icon" />
                    <p>L1 Learners</p>
                    <h3>{dashboardData.l1Learners}</h3>

                    <div>
                        <p>Completed L1</p>
                        <h3>{dashboardData.completedL1}</h3>
                    </div>
                </div>

                <div className="info-box">
                    <img src={groupIcon} alt="Group Icon" className="info-icon" />
                    <p>L2 Learners</p>
                    <h3>{dashboardData.l2Learners}</h3>

                    <div>
                        <p>Completed L2</p>
                        <h3>{dashboardData.completedL2}</h3>
                    </div>
                </div>


                <div className="info-box">
                    <img src={groupIcon} alt="Group Icon" className="info-icon" />
                    <p>L3 Learners</p>
                    <h3>{dashboardData.l3Learners}</h3>

                    <div>
                        <p>Completed L3</p>
                        <h3>{dashboardData.completedL3}</h3>
                    </div>
                </div>


                <div className="info-box">
                    <img src={groupIcon} alt="Group Icon" className="info-icon" />
                    <p>Total Enrolled Learners</p>
                    <h3>{dashboardData.totalEnrolledLearners}</h3>

                    <div>
                        <p>Total Completed AIE</p>
                        <h3>{dashboardData.totalCompletedAIE}</h3>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard