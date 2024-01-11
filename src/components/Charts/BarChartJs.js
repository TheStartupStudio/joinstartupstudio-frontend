import React from 'react'
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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      min: 0,
      stepSize: 10,
      ticks: {
        max: 100,
        min: 0,
        stepSize: 10
      }
    }
  }
}

export default function BarChartJs({ data, dataTypes, handleChangeDataType }) {
  const uniqueYears = ['LS', 'MS', 'HS', 'LTS1', 'LTS2', 'LTS3', 'LTS4']
  const uniqueStatuses = ['developing', 'proficient', 'certified']

  const datasets = uniqueStatuses.map((status) => {
    let backgroundColor
    switch (status) {
      case 'developing':
        backgroundColor = '#ff3399'
        break
      case 'proficient':
        backgroundColor = '#51c7df'
        break
      case 'certified':
        backgroundColor = '#99cc33'
        break
      default:
        backgroundColor = getRandomColor()
    }

    return {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: uniqueYears.map((year) => {
        const item = data.find((d) => d.status === status && d.year === year)
        return item ? parseFloat(item.percentage) : 0
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
      <Bar options={options} data={chartData} />
    </>
  )
}
