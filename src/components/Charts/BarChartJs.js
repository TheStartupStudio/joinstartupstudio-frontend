import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = (...options) => {
  const [totalCounts] = options

  return {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: totalCounts ?? 10,
        min: 0,
        ticks: {
          max: totalCounts ?? 10,
          min: 0,
          precision: 0
        },
        title: {
          display: true,
          text: 'Total Students'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  }
}

const BarChartJs = ({ data, loading }) => {
  const [certifiedStudents, setCertifiedStudents] = useState([])
  useEffect(() => {
    let transformedCertifiedDataType = {
      ...data,
      certification: data?.certification?.map((d) => {
        if (d.type === 'student-certification-1') {
          return {
            ...d,
            type: 'MR1'
          }
        } else if (d.type === 'student-certification-2') {
          return {
            ...d,
            type: 'MR2'
          }
        }
        return d
      })
    }

    setCertifiedStudents(transformedCertifiedDataType)
  }, [data])

  const uniqueYears = ['LTS1', 'LTS2', 'LTS3', 'LTS4']
  const uniqueStatuses = ['MR1', 'MR2']
  const datasets = uniqueStatuses.map((type) => {
    let backgroundColor
    switch (type) {
      case 'MR1':
        backgroundColor = '#51c7df'
        break
      case 'MR2':
        backgroundColor = '#99cc33'
        break
      default:
        break
    }

    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      data: uniqueYears?.map((year) => {
        const item = certifiedStudents?.certification?.find(
          (d) => d.type === type && d.year === year
        )
        return item ? item.count : 0
      }),
      backgroundColor
    }
  })

  const chartData = {
    labels: uniqueYears,
    datasets
  }

  return (
    <>
      <Bar
        options={chartOptions(certifiedStudents?.totalCounts)}
        data={chartData}
      />
    </>
  )
}
const LineChart = ({ datasets, rangeFilter, numberOfIntervals = 7 }) => {
  const [filter, setFilter] = useState(rangeFilter.value || 'last30Days')
  const currentDate = new Date()

  useEffect(() => {
    setFilter(rangeFilter)
  }, [rangeFilter])

  const generateLabels = (days, interval, nonZeroIndices) => {
    const labels = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(currentDate.getDate() - i)
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })

      if (nonZeroIndices.has(i) || i % interval === 0) {
        labels.push(formattedDate)
      }
    }
    return labels
  }

  const generateDays = (datasets, interval) => {
    const data = []
    const nonZeroIndices = new Set()

    datasets.forEach((value, index) => {
      if (value !== 0) {
        nonZeroIndices.add(index)
      }
    })

    for (let i = 0; i < datasets.length; i++) {
      if (nonZeroIndices.has(i) || i % interval === 0) {
        data.push(datasets[i])
      } else if (data.length > 0 && data[data.length - 1] !== datasets[i]) {
        data.push(0)
      }
    }
    return data
  }

  const getFilteredData = () => {
    let days
    let interval

    switch (filter.value) {
      case 'last7Days':
        days = 7
        interval = 2
        break
      case 'last30Days':
        days = 30
        interval = numberOfIntervals
        break
      case '1Day':
        days = 2
        interval = 1
        break
      default:
        days = 30
        interval = numberOfIntervals
    }

    const nonZeroIndices = new Set()
    datasets.forEach((dataset) => {
      dataset.data.forEach((value, index) => {
        if (value !== 0) {
          nonZeroIndices.add(index)
        }
      })
    })

    const labels = generateLabels(days, interval, nonZeroIndices)
    const data = datasets?.map((dataset) => ({
      ...dataset,
      data: generateDays(dataset.data, interval)
    }))

    return {
      labels: labels,
      datasets: data
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    type: 'line',

    plugins: {
      htmlLegend: {
        containerID: 'legend-container'
      },
      legend: {
        display: false
      }
    },
    title: {
      display: false,
      text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle
    },

    // plugins: [htmlLegendPlugin],
    // plugins: {
    //   legend: {
    //     position: 'right'
    //   },
    // title: {
    //   display: false,
    //   // text: 'Line Chart Example',
    //   text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle
    // }
    // },
    scales: {
      xAxis: {
        grid: {
          display: false // Disable vertical grid lines
        }
        // ticks: {
        //   callback: (value, index, values) => {
        //     // Custom tick display logic
        //     return index % 2 === 0 ? value : '';
        //   }
        // }
      },
      yAxis: {
        grid: {
          display: true // Disable horizontal grid lines
        },
        position: 'right'
      }
    }
  }

  return (
    <div style={{ height: '30vh' }}>
      <Line data={getFilteredData()} options={options} />
      <div id='legend-container'></div>
    </div>
  )
}

export { BarChartJs, LineChart }
