import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import LtsContainerWrapper from '../../ui/LtsContainerWrapper'
import IntMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import graphIcon from '../../assets/images/graph-up.png'
import dollarIcon from '../../assets/images/dollar.png'
import creaditCardIcon from '../../assets/images/credit-cards.png'
import groupIcon from '../../assets/images/group.png'
import totalEntrolledIcon from '../../assets/images/Total Enrolled Learners Icon.png'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import ViewOrganizationModal from '../../components/UserManagment/ViewOrganizationModal/index'
import './index.css'
import organizationLogo1 from '../../assets/images/academy-icons/Nord Anglia Schools.png'
import organizationLogo2 from '../../assets/images/academy-icons/Nord Anglia Schools-horizontal.png'
import potfolioIconDash from '../../assets/images/academy-icons/portfolio-admin-dash.png'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import NotificationBell from '../../components/NotificationBell'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import CustomSpinner from '../../components/CustomSpinner'
import VerticalBarChart from '../../components/AdminCharts/VerticalBarChart'
import HorizontalBarChart from '../../components/AdminCharts/HorizontalBarChart'
import LineChart from '../../components/AdminCharts/LineChart'
import {
  fetchMetrics,
  fetchLevelStatistics,
  fetchDemographicStatistics,
  fetchUserStatus,
  fetchAnalytics,
  fetchRevenueAnalytics
} from '../../redux/adminDashboard/actions'

import ViewFailedPayments from '../../components/UserManagment/ViewFailedPayments/index'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  
  const {
    metricsLoading,
    levelStatsLoading,
    demographicsLoading,
    userStatusLoading,
    analyticsLoading,
    revenueAnalyticsLoading,
    metrics,
    levelStatistics,
    demographics,
    userStatus,
    analytics: analyticsData,
    revenueAnalytics,
    lastFetched
  } = useSelector((state) => state.adminDashboard)

  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')
  const isInstructor = userRole === 2 || userRole === 'instructor' || userRole === 'trial'
  const universityId = user?.universityId || user?.University?.id

  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('demographics')
  const [showOrganizationModal, setShowOrganizationModal] = useState(false)
    const [showFailedPaymentsModal, setShowFailedPaymentsModal] = useState(false)
  const [revenueDateRange, setRevenueDateRange] = useState({
    from: '2025-01-01',
    to: '2025-12-31'
  })

  const isInitialLoading = !lastFetched && (
    metricsLoading || 
    levelStatsLoading || 
    demographicsLoading || 
    userStatusLoading || 
    analyticsLoading
  )

  useEffect(() => {
    dispatch(fetchMetrics())
    dispatch(fetchLevelStatistics())
    dispatch(fetchDemographicStatistics())
    dispatch(fetchUserStatus())

    if(!isInstructor){
        dispatch(fetchAnalytics())
    }
  }, [dispatch])

  useEffect(() => {

    if(!isInstructor){
      dispatch(fetchRevenueAnalytics(revenueDateRange.from, revenueDateRange.to))
    }
  }, [revenueDateRange, dispatch])

  const dashboardData = {
    paidUsers: metrics.paidUsers,
    totalRevenue: metrics.totalRevenue,
    churnRate: metrics.churnRate,
    ...levelStatistics,
    ...userStatus,
    totalCreatedPortfolios: levelStatistics.portfolioStatistics?.portfoliosCreated || 0,
    totalCompletedPortfolios: levelStatistics.portfolioStatistics?.totalCompletedPortfolios || 0,
    portfolioCompletionRate: levelStatistics.portfolioStatistics?.completionRate || 0
  }

  const { genderDistribution, ageDistribution, countryDistribution } = demographics
  const { paidUsersData, revenueData } = revenueAnalytics

  const handleRevenueDateChange = (dates) => {
    if (dates.from && dates.to) {
      setRevenueDateRange({
        from: dates.from,
        to: dates.to
      })
    }
  }

  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Transform data for charts
  const transformGenderDataForGroupedChart = () => {
    const years = Object.keys(genderDistribution || {})
    
    return years.map(year => ({
      label: year,
      bars: [
        {
          label: 'Female',
          value: genderDistribution[year]?.Female || 0,
          color: '#B8DB4F'
        },
        {
          label: 'Male',
          value: genderDistribution[year]?.Male || 0,
          color: '#54C7DF'
        },
        {
          label: 'Non-Binary',
          value: genderDistribution[year]?.['Non-binary'] || 0,
          color: '#FF3399'
        },
        {
          label: 'Other',
          value: genderDistribution[year]?.Other || 0,
          color: '#AEAEAE'
        }
      ]
    }))
  }

  const transformAgeDistributionData = () => {
    const ageGroups = ['0-12', '13-17', '18-25', '26-40', '41-60', '61+']
    const colorMap = {
      '0-12': '#B9DFEC',
      '13-17': '#FF3399',
      '18-25': '#51C7DF',
      '26-40': '#99CC33',
      '41-60': '#000000',
      '61+': '#AEAEAE'
    }

    return ageGroups.map(ageGroup => ({
      label: ageGroup,
      value: ageDistribution[ageGroup] || 0,
      color: colorMap[ageGroup]
    }))
  }

   const transformCountryDistributionData = () => {
    return Object.entries(countryDistribution || {}).map(([country, count]) => ({
      label: country,
      value: count
    }))
  }

  // Transform browser data from analytics
  const transformBrowserData = () => {
    const colorMap = {
      'Chrome': '#FF3399',
      'Safari': '#54C7DF',
      'Firefox': '#B8DB4F',
      'Edge': '#FFA500',
      'Other': '#4A4A4A'
    }

    return Object.entries(analyticsData.browserDistribution || {}).map(([browser, count]) => ({
      label: browser,
      value: count,
      color: colorMap[browser] || '#AEAEAE'
    }))
  }

  const transformDeviceData = () => {
    const colorMap = {
      'Desktop': '#FF3399',
      'Mobile': '#54C7DF',
      'Tablet': '#B8DB4F'
    }

    return Object.entries(analyticsData.deviceDistribution || {}).map(([device, count]) => ({
      label: device,
      value: count,
      color: colorMap[device] || '#AEAEAE'
    }))
  }

  const transformReferralSourceData = () => {
    const colorMap = {
      'Google Search': '#FF3399',
      'Direct': '#54C7DF',
      'Learntostart.com': '#B8DB4F',
      'Organic': '#FFA500',
      'Social Media': '#9C27B0'
    }

    return Object.entries(analyticsData.referralDistribution || {}).map(([source, count]) => ({
      label: source,
      value: count,
      color: colorMap[source] || '#AEAEAE'
    }))
  }

  const transformTrafficOriginData = () => {
    return Object.entries(analyticsData.trafficOrigin || {}).map(([country, data]) => ({
      label: country,
      value: data.count
    }))
  }

  const groupedGenderData = transformGenderDataForGroupedChart()
  const ageChartData = transformAgeDistributionData()
  const countryChartData = transformCountryDistributionData()
  const browserData = transformBrowserData()
  const deviceData = transformDeviceData()
  const referralSourceData = transformReferralSourceData()
  const trafficOriginData = transformTrafficOriginData()

  const calculateMaxYValue = (data) => {
    if (!data || data.length === 0) return 100
    
    let maxValue = 0
    
    if (data[0]?.bars) {
      maxValue = Math.max(...data.flatMap(group => group.bars.map(bar => bar.value)))
    } else if (typeof data === 'object' && !Array.isArray(data)) {
      maxValue = Math.max(...Object.values(data))
    } else {
      maxValue = Math.max(...data.map(item => item.value))
    }
    
    const bufferedValue = maxValue * 1.1
    return Math.ceil(bufferedValue / 10) * 10
  }

  const calculateRevenueMaxY = () => {
    if (revenueData.length === 0) return 35000
    const maxValue = Math.max(...revenueData.map(item => item.value))
    const bufferedValue = maxValue * 1.2
    return Math.ceil(bufferedValue / 1000) * 1000
  }

  const calculatePaidUsersMaxY = () => {
    if (paidUsersData.length === 0) return 400
    const maxValue = Math.max(...paidUsersData.map(item => item.value))
    const bufferedValue = maxValue * 1.2
    return Math.ceil(bufferedValue / 50) * 50
  }

  // if (isInitialLoading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
  //       <CustomSpinner />
  //     </div>
  //   )
  // }

  return (
    <div>
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4 flex-row">
          <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
            <div>
              <h3 className="page-title bold-page-title text-black mb-0">
                {userRole == 3 ? 'Super Admin Dashboard' : 'Organizational Admin Dashboard'}
              </h3>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-center">
            {userRole === 2 ? (<NotificationBell />) :  null}
            <img
              src={MenuIcon}
              alt='menu'
              className='menu-icon-cie self-start-tab cursor-pointer'
              onClick={() => dispatch(toggleCollapse())}
            />
          </div>
        </div>
      </div>

      <div className="admin-dashboard-container">
        <img src={blueManagerBG} alt="blue-manager-bg" className='position-absolute user-select-none' style={{right: '50%', translate: '50% 0'}} />
        <div className="admin-info-container">
          <div className="container-title">
            <img src={graphIcon} alt="Core Info Icon" className="core-info-icon" />
            <p>Core Information</p>
            {isInstructor ? (
              <button 
                className="view-org-details-btn"
                onClick={() => setShowOrganizationModal(true)}
              >
                View Organization Details
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.99984 10H15.4165M15.4165 10L10.4165 5M15.4165 10L10.4165 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
                <button 
                className="view-org-details-btn"
                onClick={() => setShowFailedPaymentsModal(true)}
              >
                View Failed Payments
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.99984 10H15.4165M15.4165 10L10.4165 5M15.4165 10L10.4165 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Remove loading check - always show data */}
          <div className="d-flex gap-4 flex-wrap">
            <div className="info-box">
              <div className="info-icon">
                <img src={creaditCardIcon} alt="Paid Users Icon" />
              </div>
              <p>All Time Paid Users</p>
              <h3>{dashboardData.paidUsers}</h3>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={dollarIcon} alt="Total Revenue Icon" />
              </div>
              <p>All Time Total Revenue</p>
              <h3>{formatRevenue(dashboardData.totalRevenue)}</h3>
            </div>

            {!isInstructor ? (
            <div className="info-box">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18.3334C8.95833 18.3334 7.98278 18.1356 7.07333 17.7401C6.16389 17.3445 5.37222 16.8098 4.69833 16.1359C4.02445 15.462 3.48972 14.6703 3.09417 13.7609C2.69861 12.8514 2.50056 11.8756 2.5 10.8334C2.49945 9.79116 2.6975 8.81561 3.09417 7.90672C3.49083 6.99783 4.02528 6.20616 4.6975 5.53172C5.36972 4.85727 6.16139 4.32255 7.0725 3.92755C7.98361 3.53255 8.95944 3.3345 10 3.33338H10.125L9.41667 2.62505C9.26389 2.47227 9.1875 2.28144 9.1875 2.05255C9.1875 1.82366 9.26389 1.62561 9.41667 1.45838C9.58333 1.29172 9.78139 1.20505 10.0108 1.19838C10.2403 1.19172 10.4381 1.27144 10.6042 1.43755L12.75 3.58338C12.9028 3.73616 12.9792 3.93061 12.9792 4.16672C12.9792 4.40283 12.9028 4.59727 12.75 4.75005L10.6042 6.89588C10.4375 7.06255 10.2397 7.14255 10.0108 7.13588C9.78194 7.12922 9.58389 7.04227 9.41667 6.87505C9.26389 6.70838 9.1875 6.51061 9.1875 6.28172C9.1875 6.05283 9.26389 5.86172 9.41667 5.70838L10.125 5.00005H10C8.375 5.00005 6.99667 5.56616 5.865 6.69838C4.73333 7.83061 4.16722 9.20894 4.16667 10.8334C4.16611 12.4578 4.73222 13.8364 5.865 14.9692C6.99778 16.102 8.37611 16.6678 10 16.6667C11.4722 16.6667 12.7569 16.1876 13.8542 15.2292C14.9514 14.2709 15.5972 13.0626 15.7917 11.6042C15.8194 11.382 15.9167 11.1978 16.0833 11.0517C16.25 10.9056 16.4444 10.8328 16.6667 10.8334C16.8889 10.8339 17.0833 10.9034 17.25 11.0417C17.4167 11.18 17.4861 11.3537 17.4583 11.5626C17.2639 13.4931 16.4583 15.1042 15.0417 16.3959C13.625 17.6875 11.9444 18.3334 10 18.3334Z" fill="black"/>
                </svg>
              </div>
              <p>All Time Total Churn Rate</p>
              <h3>{formatRevenue(dashboardData.churnRate)}</h3>
            </div>
            ) : null}

            {isInstructor ? (
              <div className="info-box">
                <div className="info-icon">
                  <img src={totalEntrolledIcon} alt="Group Icon" />
                </div>
                <p>Total Enrolled Learners</p>
                <h3>{dashboardData.totalEnrolledLearners}</h3>
                <div className='info-box-data'>
                  <p>Total Completed AIE</p>
                  <h3>{dashboardData.totalCompletedAIE}</h3>
                </div>
              </div>
            ) : null}
          </div>

          <div className="d-flex gap-4 flex-wrap">
            <div className="info-box">
              <div className="info-icon">
                <img src={groupIcon} alt="Group Icon" />
              </div>
              <p>L1 Learners</p>
              <h3>{dashboardData.l1Learners}</h3>
              <div className='info-box-data'>
                <p>Ave. Time to Completion</p>
                <h3>{dashboardData.avgDaysL1} days</h3>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={groupIcon} alt="Group Icon" />
              </div>
              <p>L2 Learners</p>
              <h3>{dashboardData.l2Learners}</h3>
              <div className='info-box-data'>
                <p>Ave. Time to Completion</p>
                <h3>{dashboardData.avgDaysL2} days</h3>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={groupIcon} alt="Group Icon" />
              </div>
              <p>L3 Learners</p>
              <h3>{dashboardData.l3Learners}</h3>
              <div className='info-box-data'>
                <p>Ave. Time to Completion</p>
                <h3>{dashboardData.avgDaysL3} days</h3>
              </div>
            </div>

            {isInstructor ? (
              <div className="info-box">
                <div className="info-icon">
                  <img src={potfolioIconDash} alt="Group Icon" />
                </div>
                <p>Portfolios Created</p>
                <h3>{dashboardData.totalCreatedPortfolios}</h3>
                <div className='info-box-data'>
                  <p>Total Completed Portfolios</p>
                  <h3>{dashboardData.totalCompletedPortfolios}</h3>
                </div>
              </div>
            ) : (
              <div className="info-box">
                <div className="info-icon">
                  <img src={totalEntrolledIcon} alt="Group Icon" />
                </div>
                <p>Total Enrolled Learners</p>
                <h3>{dashboardData.totalEnrolledLearners}</h3>
                <div className='info-box-data'>
                  <p>Total Completed AIE</p>
                  <h3>{dashboardData.totalCompletedAIE}</h3>
                  <p>Ave. Time to Completion</p>
                  <h3>{dashboardData.avgDaysAll} days</h3>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isInstructor && (
          <div className="admin-info-container">
            <div className="container-title">
              <img src={graphIcon} alt="Core Info Icon" className="core-info-icon" />
              <p>Trial Information</p>
            </div>
            
            {/* Remove loading check - always show data */}
            <div className="d-flex gap-4 flex-wrap">
              <div className="info-box">
                <div className="info-icon">
                  <img src={groupIcon} alt="Visitors Icon" />
                </div>
                <p>Visitors</p>
                <h3>{analyticsData.totalVisitors}</h3>
              </div>

              <div className="info-box">
                <div className="info-icon">
                  <img src={groupIcon} alt="Trials Icon" />
                </div>
                <p>Trials</p>
                <h3>{dashboardData.trials}</h3>
              </div>

              <div className="info-box">
                <div className="info-icon">
                  <img src={groupIcon} alt="Paid Icon" />
                </div>
                <p>Paid</p>
                <h3>{dashboardData.paid}</h3>
              </div>

              <div className="info-box">
                <div className="info-icon">
                  <img src={totalEntrolledIcon} alt="Cancelled Icon" />
                </div>
                <p>Cancelled</p>
                <h3>{dashboardData.cancelled}</h3>
              </div>
            </div>
          </div>
        )}

        {!isInstructor ? (

        <div className="analytics-nav-tabs" style={{ 
          display: 'flex', 
          gap: '10px', 
          margin: '20px 0px',
        }}>
          <button
            className={`analytics-tab-btn ${activeAnalyticsTab === 'demographics' ? 'active' : ''}`}
            onClick={() => setActiveAnalyticsTab('demographics')}
            style={{
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1
            }}
          >
            Demographic
          </button>
          <button
            className={`analytics-tab-btn ${activeAnalyticsTab === 'platform' ? 'active' : ''}`}
            onClick={() => setActiveAnalyticsTab('platform')}
            style={{
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1
            }}
          >
            Platform Analytics
          </button>

          <button
            className={`analytics-tab-btn ${activeAnalyticsTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveAnalyticsTab('revenue')}
            style={{
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1
            }}
          >
            Revenue Tracking
          </button>
        </div>

          ) : null}

        <div className="admin-info-container">
          <div className="container-title">
            <img src={graphIcon} alt="Core Info Icon" className="core-info-icon" />
            <p>Demographic Information</p>
          </div>

          {/* Demographic Information Tab Content - Remove loading check */}
          {activeAnalyticsTab === 'demographics' && (
            <>
              <div className="d-flex gap-4 flex-wrap">
                {/* Gender Distribution Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Gender Distribution by Year
                  </h4>
                  <VerticalBarChart
                    isGrouped={true}
                    groupedData={groupedGenderData}
                    height={400}
                    maxYValue={calculateMaxYValue(groupedGenderData)}
                    barWidth={16}
                    barGap={2}
                    groupGap={20}
                  />
                </div>

                {/* Age Distribution Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Age Distribution
                  </h4>
                  <VerticalBarChart
                    data={ageChartData}
                    height={400}
                    maxYValue={calculateMaxYValue(ageChartData)}
                    barWidth={45}
                    barGap={2}
                    xAxisLabel="Age Groups"
                  />
                </div>
              </div>

              {/* Country Distribution Chart */}
              <div className="d-flex gap-4 flex-wrap" style={{ marginTop: '20px' }}>
                <div style={{ flex: 1, width: '100%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Country Distribution
                  </h4>
                  <HorizontalBarChart
                    data={countryChartData}
                    height={350}
                    showLegend={false}
                    maxXValue={calculateMaxYValue(countryChartData)}
                    chartPadding={{ top: 20, right: 70, bottom: 40, left: 200 }}
                    barColor="#54C7DF"
                  />
                </div>
              </div>
            </>
          )}

          {/* Platform Analytics Tab Content - Remove loading check */}
          {activeAnalyticsTab === 'platform' && (
            <>
              {/* First Row - Browser and Device */}
              <div className="d-flex gap-4 flex-wrap">
                {/* Browser Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Browser
                  </h4>
                  <VerticalBarChart
                    data={browserData}
                    height={350}
                    xAxisLabel="Browser Type"
                    maxYValue={calculateMaxYValue(browserData)}
                    barWidth={60}
                    barGap={10}
                  />
                </div>

                {/* Device Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Device
                  </h4>
                  <VerticalBarChart
                    data={deviceData}
                    height={350}
                    xAxisLabel="Device Type"
                    maxYValue={calculateMaxYValue(deviceData)}
                    barWidth={60}
                    barGap={10}
                  />
                </div>
              </div>

              {/* Second Row - Referral Source and Traffic Origin */}
              <div className="d-flex gap-4 flex-wrap" style={{ marginTop: '20px' }}>
                {/* Referral Source Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Referral Source
                  </h4>
                  <VerticalBarChart
                    data={referralSourceData}
                    height={350}
                    xAxisLabel="Source"
                    maxYValue={calculateMaxYValue(referralSourceData)}
                    barWidth={50}
                    barGap={8}
                  />
                </div>

                {/* Traffic Origin Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '500', paddingLeft: '20px' }}>
                    Traffic Origin
                  </h4>
                  <HorizontalBarChart
                    data={trafficOriginData}
                    height={350}
                    showLegend={true}
                    legendLabel="Sessions"
                    maxXValue={calculateMaxYValue(trafficOriginData)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Revenue Tab Content - Remove loading check */}
          {activeAnalyticsTab === 'revenue' && (
            <>
              <div className="d-flex gap-4 flex-wrap">
                {/* Paid Users Over Time Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <LineChart
                    data={paidUsersData}
                    title="Paid Users Over Time"
                    fromDate={revenueDateRange.from}
                    toDate={revenueDateRange.to}
                    lineLabel="Paid Users"
                    lineColor="#60B7FF"
                    maxYValue={calculatePaidUsersMaxY()}
                    height={450}
                    showDatePickers={true}
                    onDateChange={handleRevenueDateChange}
                    width="550px"
                  />
                </div>

                {/* Revenue Over Time Chart */}
                <div style={{ flex: 1, minWidth: '45%' }}>
                  <LineChart
                    width="550px"
                    data={revenueData}
                    title="Revenue Over Time"
                    fromDate={revenueDateRange.from}
                    toDate={revenueDateRange.to}
                    lineLabel="Revenue ($)"
                    lineColor="#99CC33"
                    maxYValue={calculateRevenueMaxY()}
                    height={450}
                    showDatePickers={true}
                    onDateChange={handleRevenueDateChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isInstructor && (
        <ViewOrganizationModal
          show={showOrganizationModal}
          onHide={() => setShowOrganizationModal(false)}
          universityId={universityId}
        />
      )}

      {!isInstructor && (
        <ViewFailedPayments
          show={showFailedPaymentsModal}
          onHide={() => setShowFailedPaymentsModal(false)}
        />
      )}
      
    </div>
  )
}

export default AdminDashboard