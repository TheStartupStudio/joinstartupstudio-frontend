import React, { useRef, useEffect, useState } from 'react'
import './index.css'

const LineChart = ({
  data = [],
  width = 500,
  height = 400,
  backgroundColor = '#ffffff',
  chartPadding = { top: 60, right: 30, bottom: 80, left: 60 },
  showGrid = true,
  gridColor = '#e5e5e5',
  gridStrokeWidth = 1,
  lineColor = '#60B7FF',
  lineWidth = 2,
  dotRadius = 5,
  dotColor = '#60B7FF',
  showValues = true,
  valueFontSize = 12,
  valueColor = '#333',
  axisColor = '#666',
  axisFontSize = 12,
  legendPosition = 'bottom',
  legendFontSize = 12,
  maxYValue = null,
  minWidth = 400,
  showDatePickers = true,
  title = 'Paid Users Over Time',
  titleFontSize = 20,
  titleColor = '#333',
  fromDate = null,
  toDate = null,
  onDateChange = null,
  lineLabel = 'Paid Users',
  smoothCurve = true
}) => {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(width)
  const [startDate, setStartDate] = useState(fromDate || '')
  const [endDate, setEndDate] = useState(toDate || '')

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const svgWidth = Math.max(containerWidth, containerWidth)
  const chartWidth = svgWidth - chartPadding.left - chartPadding.right
  const chartHeight = height - chartPadding.top - chartPadding.bottom

  // Find max value for scaling
  const values = data.map(item => item.value)
  const maxValue = maxYValue || Math.ceil(Math.max(...values, 1) / 100) * 100

  // Calculate Y-axis steps
  const ySteps = 5
  const yStepValue = maxValue / ySteps

  // Scale functions
  const scaleY = (value) => {
    return chartHeight - (value / maxValue) * chartHeight
  }

  const scaleX = (index) => {
    return (chartWidth / (data.length - 1)) * index
  }

  // Generate smooth curve path
  const generatePath = () => {
    if (data.length === 0) return ''
    
    if (!smoothCurve) {
      // Simple line path
      return data.map((item, index) => {
        const x = chartPadding.left + scaleX(index)
        const y = chartPadding.top + scaleY(item.value)
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      }).join(' ')
    }

    // Smooth curve using bezier curves
    let path = ''
    data.forEach((item, index) => {
      const x = chartPadding.left + scaleX(index)
      const y = chartPadding.top + scaleY(item.value)

      if (index === 0) {
        path += `M ${x} ${y}`
      } else {
        const prevX = chartPadding.left + scaleX(index - 1)
        const prevY = chartPadding.top + scaleY(data[index - 1].value)
        
        const cpX1 = prevX + (x - prevX) / 3
        const cpY1 = prevY
        const cpX2 = prevX + 2 * (x - prevX) / 3
        const cpY2 = y

        path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`
      }
    })
    return path
  }

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    if (data.length === 0) return ''
    
    const linePath = generatePath()
    const lastX = chartPadding.left + scaleX(data.length - 1)
    const firstX = chartPadding.left + scaleX(0)
    const bottomY = chartPadding.top + chartHeight

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
  }

  const handleDateChange = (type, value) => {
    if (type === 'from') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
    
    if (onDateChange) {
      onDateChange({ from: type === 'from' ? value : startDate, to: type === 'to' ? value : endDate })
    }
  }

  const clearDate = (type) => {
    handleDateChange(type, '')
  }

  return (
    <div 
      ref={containerRef}
      className="line-chart-wrapper" 
      style={{ 
        width: '100%',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '20px',
        padding: '30px',
        backgroundColor,
        overflow: 'hidden'
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: `15px`, 
          color: titleColor,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: '500',
          margin: 0,
          color: '#231F20'
        }}>
          {title}
        </h3>
      </div>

      {/* Date Pickers */}
      {showDatePickers && (
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500',
              color: '#333'
            }}>
              From:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('from', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 40px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                  background: '#FFF',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'Montserrat, sans-serif',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                pointerEvents: 'none'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.2 9.6C7.97333 9.6 7.78347 9.5232 7.6304 9.3696C7.4768 9.21653 7.4 9.02667 7.4 8.8C7.4 8.57333 7.4768 8.3832 7.6304 8.2296C7.78347 8.07653 7.97333 8 8.2 8C8.42667 8 8.6168 8.07653 8.7704 8.2296C8.92347 8.3832 9 8.57333 9 8.8C9 9.02667 8.92347 9.21653 8.7704 9.3696C8.6168 9.5232 8.42667 9.6 8.2 9.6ZM5 9.6C4.77333 9.6 4.5832 9.5232 4.4296 9.3696C4.27653 9.21653 4.2 9.02667 4.2 8.8C4.2 8.57333 4.27653 8.3832 4.4296 8.2296C4.5832 8.07653 4.77333 8 5 8C5.22667 8 5.4168 8.07653 5.5704 8.2296C5.72347 8.3832 5.8 8.57333 5.8 8.8C5.8 9.02667 5.72347 9.21653 5.5704 9.3696C5.4168 9.5232 5.22667 9.6 5 9.6ZM11.4 9.6C11.1733 9.6 10.9835 9.5232 10.8304 9.3696C10.6768 9.21653 10.6 9.02667 10.6 8.8C10.6 8.57333 10.6768 8.3832 10.8304 8.2296C10.9835 8.07653 11.1733 8 11.4 8C11.6267 8 11.8165 8.07653 11.9696 8.2296C12.1232 8.3832 12.2 8.57333 12.2 8.8C12.2 9.02667 12.1232 9.21653 11.9696 9.3696C11.8165 9.5232 11.6267 9.6 11.4 9.6ZM8.2 12.8C7.97333 12.8 7.78347 12.7232 7.6304 12.5696C7.4768 12.4165 7.4 12.2267 7.4 12C7.4 11.7733 7.4768 11.5835 7.6304 11.4304C7.78347 11.2768 7.97333 11.2 8.2 11.2C8.42667 11.2 8.6168 11.2768 8.7704 11.4304C8.92347 11.5835 9 11.7733 9 12C9 12.2267 8.92347 12.4165 8.7704 12.5696C8.6168 12.7232 8.42667 12.8 8.2 12.8ZM5 12.8C4.77333 12.8 4.5832 12.7232 4.4296 12.5696C4.27653 12.4165 4.2 12.2267 4.2 12C4.2 11.7733 4.27653 11.5835 4.4296 11.4304C4.5832 11.2768 4.77333 11.2 5 11.2C5.22667 11.2 5.4168 11.2768 5.5704 11.4304C5.72347 11.5835 5.8 11.7733 5.8 12C5.8 12.2267 5.72347 12.4165 5.5704 12.5696C5.4168 12.7232 5.22667 12.8 5 12.8ZM11.4 12.8C11.1733 12.8 10.9835 12.7232 10.8304 12.5696C10.6768 12.4165 10.6 12.2267 10.6 12C10.6 11.7733 10.6768 11.5835 10.8304 11.4304C10.9835 11.2768 11.1733 11.2 11.4 11.2C11.6267 11.2 11.8165 11.2768 11.9696 11.4304C12.1232 11.5835 12.2 11.7733 12.2 12C12.2 12.2267 12.1232 12.4165 11.9696 12.5696C11.8165 12.7232 11.6267 12.8 11.4 12.8ZM2.6 16C2.16 16 1.7832 15.8435 1.4696 15.5304C1.15653 15.2168 1 14.84 1 14.4V3.2C1 2.76 1.15653 2.38347 1.4696 2.0704C1.7832 1.7568 2.16 1.6 2.6 1.6H3.4V0H5V1.6H11.4V0H13V1.6H13.8C14.24 1.6 14.6168 1.7568 14.9304 2.0704C15.2435 2.38347 15.4 2.76 15.4 3.2V14.4C15.4 14.84 15.2435 15.2168 14.9304 15.5304C14.6168 15.8435 14.24 16 13.8 16H2.6ZM2.6 14.4H13.8V6.4H2.6V14.4Z" fill="black"/>
                </svg>
              </span>
              {startDate && (
                <button
                  onClick={() => clearDate('from')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    fontSize: '18px',
                    padding: '0 4px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '500',
              color: '#333'
            }}>
              To:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('to', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 40px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                  background: '#FFF',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'Montserrat, sans-serif',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                pointerEvents: 'none'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.2 9.6C7.97333 9.6 7.78347 9.5232 7.6304 9.3696C7.4768 9.21653 7.4 9.02667 7.4 8.8C7.4 8.57333 7.4768 8.3832 7.6304 8.2296C7.78347 8.07653 7.97333 8 8.2 8C8.42667 8 8.6168 8.07653 8.7704 8.2296C8.92347 8.3832 9 8.57333 9 8.8C9 9.02667 8.92347 9.21653 8.7704 9.3696C8.6168 9.5232 8.42667 9.6 8.2 9.6ZM5 9.6C4.77333 9.6 4.5832 9.5232 4.4296 9.3696C4.27653 9.21653 4.2 9.02667 4.2 8.8C4.2 8.57333 4.27653 8.3832 4.4296 8.2296C4.5832 8.07653 4.77333 8 5 8C5.22667 8 5.4168 8.07653 5.5704 8.2296C5.72347 8.3832 5.8 8.57333 5.8 8.8C5.8 9.02667 5.72347 9.21653 5.5704 9.3696C5.4168 9.5232 5.22667 9.6 5 9.6ZM11.4 9.6C11.1733 9.6 10.9835 9.5232 10.8304 9.3696C10.6768 9.21653 10.6 9.02667 10.6 8.8C10.6 8.57333 10.6768 8.3832 10.8304 8.2296C10.9835 8.07653 11.1733 8 11.4 8C11.6267 8 11.8165 8.07653 11.9696 8.2296C12.1232 8.3832 12.2 8.57333 12.2 8.8C12.2 9.02667 12.1232 9.21653 11.9696 9.3696C11.8165 9.5232 11.6267 9.6 11.4 9.6ZM8.2 12.8C7.97333 12.8 7.78347 12.7232 7.6304 12.5696C7.4768 12.4165 7.4 12.2267 7.4 12C7.4 11.7733 7.4768 11.5835 7.6304 11.4304C7.78347 11.2768 7.97333 11.2 8.2 11.2C8.42667 11.2 8.6168 11.2768 8.7704 11.4304C8.92347 11.5835 9 11.7733 9 12C9 12.2267 8.92347 12.4165 8.7704 12.5696C8.6168 12.7232 8.42667 12.8 8.2 12.8ZM5 12.8C4.77333 12.8 4.5832 12.7232 4.4296 12.5696C4.27653 12.4165 4.2 12.2267 4.2 12C4.2 11.7733 4.27653 11.5835 4.4296 11.4304C4.5832 11.2768 4.77333 11.2 5 11.2C5.22667 11.2 5.4168 11.2768 5.5704 11.4304C5.72347 11.5835 5.8 11.7733 5.8 12C5.8 12.2267 5.72347 12.4165 5.5704 12.5696C5.4168 12.7232 5.22667 12.8 5 12.8ZM11.4 12.8C11.1733 12.8 10.9835 12.7232 10.8304 12.5696C10.6768 12.4165 10.6 12.2267 10.6 12C10.6 11.7733 10.6768 11.5835 10.8304 11.4304C10.9835 11.2768 11.1733 11.2 11.4 11.2C11.6267 11.2 11.8165 11.2768 11.9696 11.4304C12.1232 11.5835 12.2 11.7733 12.2 12C12.2 12.2267 12.1232 12.4165 11.9696 12.5696C11.8165 12.7232 11.6267 12.8 11.4 12.8ZM2.6 16C2.16 16 1.7832 15.8435 1.4696 15.5304C1.15653 15.2168 1 14.84 1 14.4V3.2C1 2.76 1.15653 2.38347 1.4696 2.0704C1.7832 1.7568 2.16 1.6 2.6 1.6H3.4V0H5V1.6H11.4V0H13V1.6H13.8C14.24 1.6 14.6168 1.7568 14.9304 2.0704C15.2435 2.38347 15.4 2.76 15.4 3.2V14.4C15.4 14.84 15.2435 15.2168 14.9304 15.5304C14.6168 15.8435 14.24 16 13.8 16H2.6ZM2.6 14.4H13.8V6.4H2.6V14.4Z" fill="black"/>
                </svg>
              </span>
              {endDate && (
                <button
                  onClick={() => clearDate('to')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    fontSize: '18px',
                    padding: '0 4px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chart SVG */}
      <div 
        className="line-chart-container"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%'
        }}
      >
        <svg width={svgWidth} height={height} style={{ display: 'block' }}>
          <defs>
            {/* Gradient for area fill */}
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {showGrid && Array.from({ length: ySteps + 1 }).map((_, index) => {
            const y = chartPadding.top + (chartHeight / ySteps) * index
            return (
              <line
                key={`grid-${index}`}
                x1={chartPadding.left}
                y1={y}
                x2={svgWidth - chartPadding.right}
                y2={y}
                stroke={gridColor}
                strokeWidth={gridStrokeWidth}
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Y-axis labels */}
          {Array.from({ length: ySteps + 1 }).map((_, index) => {
            const value = maxValue - (yStepValue * index)
            const y = chartPadding.top + (chartHeight / ySteps) * index
            return (
              <text
                key={`y-label-${index}`}
                x={chartPadding.left - 15}
                y={y + 5}
                textAnchor="end"
                fontSize={axisFontSize}
                fill={axisColor}
                fontFamily="Montserrat, sans-serif"
              >
                {Math.round(value)}
              </text>
            )
          })}

          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="url(#lineGradient)"
            transform="translate(10, 0)"
          />

          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke={lineColor}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(10, 0)"
          />

          {/* Data points and values */}
          {data.map((item, index) => {
            const x = chartPadding.left + scaleX(index)
            const y = chartPadding.top + scaleY(item.value)

            return (
              <g key={`point-${index}`}>

                {/* Value label */}
                {showValues && (
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fontSize={valueFontSize}
                    fill={valueColor}
                    fontWeight="600"
                    fontFamily="Montserrat, sans-serif"
                    transform="translate(10, 0)"
                  >
                    {item.value}
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={x}
                  y={height - chartPadding.bottom + 25}
                  textAnchor="middle"
                  fontSize={axisFontSize}
                  fill={axisColor}
                  fontFamily="Montserrat, sans-serif"
                  transform="translate(10, 0)"
                >
                  {item.label}
                </text>
              </g>
            )
          })}

          {/* X-axis line */}
          <line
            x1={chartPadding.left}
            y1={height - chartPadding.bottom}
            x2={svgWidth - chartPadding.right}
            y2={height - chartPadding.bottom}
            stroke={axisColor}
            strokeWidth={1}
          />

          {/* Y-axis line */}
          <line
            x1={chartPadding.left}
            y1={chartPadding.top}
            x2={chartPadding.left}
            y2={height - chartPadding.bottom}
            stroke={axisColor}
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* Legend */}
      {legendPosition !== 'none' && (
        <div 
          className="chart-legend" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px',
            marginTop: legendPosition === 'bottom' ? '20px' : '0',
            marginBottom: legendPosition === 'top' ? '20px' : '0',
            paddingTop: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px',
              height: '3px',
              backgroundColor: lineColor,
              borderRadius: '2px'
            }} />
            <span style={{ 
              fontSize: `${legendFontSize}px`, 
              color: axisColor,
              fontFamily: 'Montserrat, sans-serif'
            }}>
              {lineLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LineChart