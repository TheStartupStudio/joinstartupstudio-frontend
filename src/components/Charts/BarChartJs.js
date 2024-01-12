import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartOptions = (...options) => {
  const [totalCounts] = options

  return {
    responsive: true,
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

export default function BarChartJs({
  data,
  dataTypes,
  handleChangeDataType,
  loading
}) {
  const [certifiedStudents, setCertifiedStudents] = useState([])
  console.log(certifiedStudents)
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

  // console.log(certifiedStudents)
  const uniqueYears = ['ES1', 'LTS1', 'LTS2', 'LTS3', 'LTS4']
  // const uniqueStatuses = ['developing', 'proficient', 'certified']
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
        backgroundColor = getRandomColor()
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

  function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  return (
    <>
      <Bar
        options={chartOptions(certifiedStudents?.totalCounts, 'test')}
        data={chartData}
      />
    </>
  )
}
