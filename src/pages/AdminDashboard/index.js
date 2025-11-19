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
    paidUsers: 764,
    totalRevenue: 310982,
    l1Learners: 379,
    l2Learners: 289,
    l3Learners: 212,
    totalEnrolledLearners: 823,
    completedL1: 125,
    completedL2: 98,
    completedL3: 75,
    totalCompletedAIE: 298,
    totalCreatedPortfolios: 201,
    totalCompletedPortfolios: 150
  })

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

  const genderYearData = [
    { year: '2022', female: 80, male: 124, nonBinary: 5, other: 0 },
    { year: '2023', female: 92, male: 206, nonBinary: 12, other: 2 },
    { year: '2024', female: 124, male: 361, nonBinary: 15, other: 4 },
    { year: '2025', female: 198, male: 424, nonBinary: 13, other: 3 }
  ]

  const ageDistributionData = [
    { ageGroup: '0-12', count: 0 },
    { ageGroup: '13-17', count: 26 },
    { ageGroup: '18-25', count: 126 },
    { ageGroup: '26-40', count: 241 },
    { ageGroup: '41-60', count: 68 },
    { ageGroup: '61+', count: 3 }
  ]

  const countryDistributionData = [
    { country: 'United States', count: 328 },
    { country: 'EU', count: 129 },
    { country: 'Kosovo', count: 16 },
    { country: 'Canada', count: 49 }
  ]

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
    afterDatasetsDraw(chart, args, options) {
      const { ctx, data } = chart
      
      ctx.save()
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = '#333'
      
      data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex)
        
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index]
          if (value > 0) {
            const isHorizontal = chart.config.options.indexAxis === 'y'
            
            if (isHorizontal) {
              ctx.textAlign = 'left'
              ctx.textBaseline = 'middle'
              ctx.fillText(value, bar.x + 5, bar.y)
            } else {
              ctx.textAlign = 'center'
              ctx.textBaseline = 'bottom'
              ctx.fillText(value, bar.x, bar.y - 5)
            }
          }
        })
      })
      
      ctx.restore()
    }
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
          const colors = ['#E8E8E8', '#FF69B4', '#30C3EC', '#B8DB4F', '#666666', '#333333']
          const index = context.dataIndex
          return createGradientPattern(ctx, colors[index])
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
        categoryPercentage: 0.6,
        barPercentage: 0.8
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
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
            <div>
              <h3 className="page-title bold-page-title text-black mb-0">
                Organizational Admin Dashboard
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
                  <path d="M4.99984 10H15.4165M15.4165 10L10.4165 5M15.4165 10L10.4165 15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          <div className="d-flex gap-4 flex-wrap">
            <div className="info-box">
              <div className="info-icon">
                <img src={creaditCardIcon} alt="Paid Users Icon" />
              </div>
              <p>Paid Users</p>
              <h3>{dashboardData.paidUsers}</h3>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={dollarIcon} alt="Total Revenue Icon" />
              </div>
              <p>Total Revenue</p>
              <h3>{formatRevenue(dashboardData.totalRevenue)}</h3>
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
                <p>Completed L1</p>
                <h3>{dashboardData.completedL1}</h3>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={groupIcon} alt="Group Icon" />
              </div>
              <p>L2 Learners</p>
              <h3>{dashboardData.l2Learners}</h3>
              <div className='info-box-data'>
                <p>Completed L2</p>
                <h3>{dashboardData.completedL2}</h3>
              </div>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <img src={groupIcon} alt="Group Icon" />
              </div>
              <p>L3 Learners</p>
              <h3>{dashboardData.l3Learners}</h3>
              <div className='info-box-data'>
                <p>Completed L3</p>
                <h3>{dashboardData.completedL3}</h3>
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
              </div>
            </div>
            )}
          </div>
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