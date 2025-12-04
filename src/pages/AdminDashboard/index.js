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
  const [loading, setLoading] = useState(false)
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [levelStatsLoading, setLevelStatsLoading] = useState(true)
  const [demographicsLoading, setDemographicsLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showOrganizationModal, setShowOrganizationModal] = useState(false)

  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')
  const isInstructor = userRole === 2 || userRole === 'instructor' || userRole === 'trial'

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])



  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const [dashboardData, setDashboardData] = useState({
    paidUsers: 0,
    totalRevenue: 0,
    churnRate: 0,
    l1Learners: 0,
    l2Learners: 0,
    l3Learners: 0,
    totalEnrolledLearners: 0,
    completedL1: 0,
    completedL2: 0,
    completedL3: 0,
    totalCompletedAIE: 0,
    avgDaysL1: 0,
    avgDaysL2: 0,
    avgDaysL3: 0,
    avgDaysAll: 0,
    totalCreatedPortfolios: 201,
    totalCompletedPortfolios: 150
  })

  const [genderYearData, setGenderYearData] = useState([])
  const [ageDistributionData, setAgeDistributionData] = useState([])
  const [countryDistributionData, setCountryDistributionData] = useState([])

  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true)
      try {
        const response = await axiosInstance.get('/admin-info/metrics')
        
        if (response.data.success) {
          const { allTimePaidUsers, allTimeTotalRevenue, allTimeChurnRate } = response.data.data
          
          setDashboardData(prevData => ({
            ...prevData,
            paidUsers: allTimePaidUsers,
            totalRevenue: parseFloat(allTimeTotalRevenue),
            churnRate: parseFloat(allTimeChurnRate)
          }))
        }
      } catch (error) {
        console.error('Error fetching admin metrics:', error)
        toast.error('Failed to load dashboard metrics')
      } finally {
        setMetricsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  useEffect(() => {
    const fetchLevelStatistics = async () => {
      setLevelStatsLoading(true)
      try {
        const response = await axiosInstance.get('/admin-info/level-statistics')
        
        if (response.data.success) {
          const { totalEnrolledLearners, completedAllLevels, avgDaysToCompleteAll, levelBreakdown } = response.data.data
          
          setDashboardData(prevData => ({
            ...prevData,
            totalEnrolledLearners: totalEnrolledLearners,
            l1Learners: levelBreakdown.L1.learnersCompleted,
            l2Learners: levelBreakdown.L2.learnersCompleted,
            l3Learners: levelBreakdown.L3.learnersCompleted,
            completedL1: levelBreakdown.L1.learnersCompleted,
            completedL2: levelBreakdown.L2.learnersCompleted,
            completedL3: levelBreakdown.L3.learnersCompleted,
            totalCompletedAIE: completedAllLevels,
            avgDaysL1: levelBreakdown.L1.avgDaysToComplete,
            avgDaysL2: levelBreakdown.L2.avgDaysToComplete,
            avgDaysL3: levelBreakdown.L3.avgDaysToComplete,
            avgDaysAll: avgDaysToCompleteAll
          }))
        }
      } catch (error) {
        console.error('Error fetching level statistics:', error)
        toast.error('Failed to load level statistics')
      } finally {
        setLevelStatsLoading(false)
      }
    }

    fetchLevelStatistics()
  }, [])

  useEffect(() => {
    const fetchDemographicStatistics = async () => {
      setDemographicsLoading(true)
      try {
        const response = await axiosInstance.get('/admin-info/demographic-statistics')
        
        if (response.data.success) {
          const { genderDistribution, ageDistribution, countryDistribution } = response.data.data
          
          // Transform gender distribution data
          const genderData = Object.keys(genderDistribution).map(year => ({
            year: year,
            female: genderDistribution[year].Female || 0,
            male: genderDistribution[year].Male || 0,
            nonBinary: genderDistribution[year]['Non-binary'] || 0,
            other: genderDistribution[year].Other || 0
          }))
          setGenderYearData(genderData)
          
          // Transform age distribution data
          const ageData = Object.keys(ageDistribution).map(ageGroup => ({
            ageGroup: ageGroup,
            count: ageDistribution[ageGroup]
          }))
          setAgeDistributionData(ageData)
          
          // Transform country distribution data
          const countryData = Object.keys(countryDistribution).map(country => ({
            country: country,
            count: countryDistribution[country]
          }))
          setCountryDistributionData(countryData)
        }
      } catch (error) {
        console.error('Error fetching demographic statistics:', error)
        toast.error('Failed to load demographic statistics')
      } finally {
        setDemographicsLoading(false)
      }
    }

    fetchDemographicStatistics()
  }, [])

  const organizationData = {
    name: 'Nord Anglia Schools',
    address: '2108 S Conroy-Windermere Rd, Orlando, FL 34708',
    adminName: 'Angela Nguyen',
    adminEmail: 'anguyen@ordanglia.com',
    domain: 'nordanglia.aie.com',
    pricing: [
      { amount: 15, frequency: 'Per month' },
      { amount: 150, frequency: 'Per year' }
    ],
    logo1: organizationLogo1, 
    logo2: organizationLogo2
  }

  const createGradientPattern = (ctx, color, isHorizontal = false) => {
    const gradient = ctx.createLinearGradient(
      0, 
      isHorizontal ? 0 : ctx.canvas.height, 
      isHorizontal ? ctx.canvas.width : 0, 
      0
    )
    
    const hexToRgba = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, hexToRgba(color, 0.2))
    
    return gradient
  }

  const dataLabelsPlugin = {
    id: 'dataLabels',
  }

  const genderChartData = {
    labels: genderYearData.map(item => item.year),
    datasets: [
      {
        label: 'Female',
        data: genderYearData.map(item => item.female),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          return createGradientPattern(ctx, '#B8DB4F')
        },
        borderRadius: 4,
        barThickness: 30,  
      },
      {
        label: 'Male',
        data: genderYearData.map(item => item.male),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          return createGradientPattern(ctx, '#30C3EC')
        },
        borderRadius: 4,
        barThickness: 30,  
      },
      {
        label: 'Non-Binary',
        data: genderYearData.map(item => item.nonBinary),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          return createGradientPattern(ctx, '#FF69B4')
        },
        borderRadius: 4,
        barThickness: 30,  
      },
      {
        label: 'Other',
        data: genderYearData.map(item => item.other),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          return createGradientPattern(ctx, '#D3D3D3')
        },
        borderRadius: 4,
        barThickness: 30,  
      }
    ]
  }

  const ageChartData = {
    labels: ageDistributionData.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Age Distribution',
        data: ageDistributionData.map(item => item.count),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          const ageGroup = ageDistributionData[context.dataIndex]?.ageGroup
          
          // Define colors for each age group
          const colorMap = {
            '0-12': '#B9DFEC',
            '13-17': '#FF3399',
            '18-25': '#51C7DF',
            '26-40': '#99CC33',
            '41-60': '#000000',
            '61+': '#AEAEAE'
          }
          
          const color = colorMap[ageGroup] || '#54C7DF'
          return createGradientPattern(ctx, color)
        },
        borderRadius: 4,
        barThickness: 40,
      }
    ]
  }

  const countryChartData = {
    labels: countryDistributionData.map(item => item.country),
    datasets: [
      {
        label: 'Students',
        data: countryDistributionData.map(item => item.count),
        backgroundColor: function(context) {
          const ctx = context.chart.ctx
          return createGradientPattern(ctx, '#30C3EC', true)
        },
        borderRadius: 4,
        barThickness: 40,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50
        },
        grid: {
          color: '#f0f0f0'
        }
      },
      x: {
        grid: {
          color: '#f0f0f0'
        }
      }
    },
    layout: {
      padding: {
        top: 25
      }
    }
  }

  const ageChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      }
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        categoryPercentage: 1.0,
        barPercentage: 1.0         
      }
    }
  }

  const countryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.x}`
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 40
        },
        grid: {
          color: '#f0f0f0'
        }
      },
      y: {
        grid: {
          color: '#f0f0f0'
        }
      }
    },
    layout: {
      padding: {
        right: 50
      }
    }
  }

  return (
    <div>
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4 flex-row">
          <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
            <div>
              <h3 className="page-title bold-page-title text-black mb-0">
                Organizational Admin Dashboard
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
            {isInstructor && (
              <button 
                className="view-org-details-btn"
                onClick={() => setShowOrganizationModal(true)}
              >
                View Organization Details

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.99984 10H15.4165M15.4165 10L10.4165 5M15.4165 10L10.4165 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {metricsLoading || levelStatsLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <CustomSpinner />
            </div>
          ) : (
            <>
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

                <div className="info-box">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 18.3334C8.95833 18.3334 7.98278 18.1356 7.07333 17.7401C6.16389 17.3445 5.37222 16.8098 4.69833 16.1359C4.02445 15.462 3.48972 14.6703 3.09417 13.7609C2.69861 12.8514 2.50056 11.8756 2.5 10.8334C2.49945 9.79116 2.6975 8.81561 3.09417 7.90672C3.49083 6.99783 4.02528 6.20616 4.6975 5.53172C5.36972 4.85727 6.16139 4.32255 7.0725 3.92755C7.98361 3.53255 8.95944 3.3345 10 3.33338H10.125L9.41667 2.62505C9.26389 2.47227 9.1875 2.28144 9.1875 2.05255C9.1875 1.82366 9.26389 1.62561 9.41667 1.45838C9.58333 1.29172 9.78139 1.20505 10.0108 1.19838C10.2403 1.19172 10.4381 1.27144 10.6042 1.43755L12.75 3.58338C12.9028 3.73616 12.9792 3.93061 12.9792 4.16672C12.9792 4.40283 12.9028 4.59727 12.75 4.75005L10.6042 6.89588C10.4375 7.06255 10.2397 7.14255 10.0108 7.13588C9.78194 7.12922 9.58389 7.04227 9.41667 6.87505C9.26389 6.70838 9.1875 6.51061 9.1875 6.28172C9.1875 6.05283 9.26389 5.86172 9.41667 5.70838L10.125 5.00005H10C8.375 5.00005 6.99667 5.56616 5.865 6.69838C4.73333 7.83061 4.16722 9.20894 4.16667 10.8334C4.16611 12.4578 4.73222 13.8364 5.865 14.9692C6.99778 16.102 8.37611 16.6678 10 16.6667C11.4722 16.6667 12.7569 16.1876 13.8542 15.2292C14.9514 14.2709 15.5972 13.0626 15.7917 11.6042C15.8194 11.382 15.9167 11.1978 16.0833 11.0517C16.25 10.9056 16.4444 10.8328 16.6667 10.8334C16.8889 10.8339 17.0833 10.9034 17.25 11.0417C17.4167 11.18 17.4861 11.3537 17.4583 11.5626C17.2639 13.4931 16.4583 15.1042 15.0417 16.3959C13.625 17.6875 11.9444 18.3334 10 18.3334Z" fill="black"/>
                    </svg>
                  </div>
                  <p>All Time Total Churn Rate</p>
                  <h3>{formatRevenue(dashboardData.churnRate)}</h3>
                </div>

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
            </>
          )}
        </div>

        <div className="admin-info-container">
          <div className="container-title">
            <img src={graphIcon} alt="Core Info Icon" className="core-info-icon" />
            <p>Demographic Information</p>
          </div>

          <div className="d-flex gap-4 flex-wrap">
            <div style={{
              boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
              padding: '20px',
              flex: 1,
              borderRadius: '20px',
              minWidth: '600px'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '16px' }}>
                Gender Distribution by Year
              </h4>
              <div 
                className="chart-container" 
                style={{ 
                  width: '100%', 
                  height: '350px',
                  overflowX: windowWidth <= 1000 ? 'auto' : 'hidden',
                  overflowY: 'hidden',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div style={{ 
                  height: '280px',
                  minWidth: windowWidth <= 1000 ? '700px' : 'auto',
                  width: '100%'
                }}>
                  <Bar 
                    data={genderChartData} 
                    options={{
                      ...chartOptions,
                      responsive: windowWidth <= 1000 ? false : true,
                      maintainAspectRatio: false
                    }} 
                    plugins={[dataLabelsPlugin]}
                    width={windowWidth <= 1000 ? 700 : undefined}
                    height={280}
                  />
                </div>
              </div>
            </div>

            <div style={{
              boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
              padding: '20px',
              flex: 1,
              borderRadius: '20px',
                minWidth: '600px'

            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '16px' }}>
                Age Distribution
              </h4>
              <div className="chart-container" style={{ width: '100%', height: '350px' }}>
                <div style={{ height: '280px' }}>
                  <Bar 
                    data={ageChartData} 
                    options={ageChartOptions} 
                    plugins={[dataLabelsPlugin]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-4 flex-wrap" style={{ marginTop: '20px' }}>
            <div style={{
              boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
              padding: '20px',
              flex: 1,
              borderRadius: '20px'
            }}>
              <h4 style={{ marginBottom: '20px', fontSize: '16px' }}>
                Country Distribution
              </h4>
              <div className="chart-container" style={{ width: '100%', height: '350px' }}>
                <div style={{ height: '280px' }}>
                  <Bar 
                    data={countryChartData} 
                    options={countryChartOptions} 
                    plugins={[dataLabelsPlugin]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewOrganizationModal
        show={showOrganizationModal}
        onHide={() => setShowOrganizationModal(false)}
        organizationData={organizationData}
      />
    </div>
  )
}

export default AdminDashboard