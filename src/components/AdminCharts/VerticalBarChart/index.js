import React, { useRef, useEffect, useState } from 'react'
import './index.css'

const VerticalBarChart = ({
  data = [],
  width = 500,
  height = 350,
  backgroundColor = '#ffffff',
  chartPadding = { top: 40, right: 30, bottom: 80, left: 50 },
  barWidth = 60,
  barGap = 10,
  groupGap = 40, // Gap between year groups
  showGrid = true,
  gridColor = '#f0f0f0',
  gridStrokeWidth = 1,
  xAxisLabel = '',
  showValues = true,
  valueFontSize = 14,
  valueColor = '#333',
  axisColor = '#666',
  axisFontSize = 12,
  legendPosition = 'bottom',
  legendFontSize = 12,
  legendGap = 15,
  maxYValue = null,
  minWidth = 600,
  isGrouped = false, // New prop to enable grouped mode
  groupedData = null // New prop for grouped data structure
}) => {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(width)

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

  // Process grouped data if provided
  const processedData = isGrouped && groupedData ? groupedData : data

  // Calculate dimensions for grouped layout
  let totalBarsWidth, requiredWidth, svgWidth, chartWidth

  if (isGrouped && groupedData) {
    // For grouped data: calculate width based on groups
    const numGroups = groupedData.length
    const barsPerGroup = groupedData[0]?.bars?.length || 0
    const groupWidth = barsPerGroup * barWidth + (barsPerGroup - 1) * barGap
    totalBarsWidth = numGroups * groupWidth + (numGroups - 1) * groupGap
    requiredWidth = totalBarsWidth + chartPadding.left + chartPadding.right
  } else {
    // For single data: use original calculation
    totalBarsWidth = data.length * (barWidth + barGap) - barGap
    requiredWidth = totalBarsWidth + chartPadding.left + chartPadding.right
  }

  const shouldScroll = requiredWidth > containerWidth
  svgWidth = shouldScroll ? requiredWidth : Math.max(containerWidth, minWidth)
  chartWidth = svgWidth - chartPadding.left - chartPadding.right
  const chartHeight = height - chartPadding.top - chartPadding.bottom

  // Find max value for scaling
  let allValues
  if (isGrouped && groupedData) {
    allValues = groupedData.flatMap(group => group.bars.map(bar => bar.value))
  } else {
    allValues = data.map(item => item.value)
  }
  const maxValue = maxYValue || Math.ceil(Math.max(...allValues, 1) / 50) * 50

  // Calculate Y-axis steps
  const ySteps = 6
  const yStepValue = maxValue / ySteps

  // Scale value to chart height
  const scaleY = (value) => {
    return chartHeight - (value / maxValue) * chartHeight
  }

  // Render grouped bars
  const renderGroupedBars = () => {
    const barsPerGroup = groupedData[0]?.bars?.length || 0
    const groupWidth = barsPerGroup * barWidth + (barsPerGroup - 1) * barGap
    const totalGroupsWidth = groupedData.length * groupWidth + (groupedData.length - 1) * groupGap
    const startX = chartPadding.left + (chartWidth - totalGroupsWidth) / 2

    return groupedData.map((group, groupIndex) => {
      const groupX = startX + groupIndex * (groupWidth + groupGap)

      return (
        <g key={`group-${groupIndex}`}>
          {/* Group bars */}
          {group.bars.map((bar, barIndex) => {
            const x = groupX + barIndex * (barWidth + barGap)
            const barHeight = chartHeight - scaleY(bar.value)
            const y = chartPadding.top + scaleY(bar.value)

            return (
              <g key={`bar-${groupIndex}-${barIndex}`}>
                {/* Bar with gradient */}
                <defs>
                  <linearGradient id={`gradient-${groupIndex}-${barIndex}`} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor={bar.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={bar.color} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#gradient-${groupIndex}-${barIndex})`}
                  rx={4}
                  ry={4}
                />

                {/* Value on top of bar */}
                {showValues && bar.value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize={valueFontSize}
                    fill={valueColor}
                    fontWeight="600"
                    fontFamily="Montserrat, sans-serif"
                  >
                    {bar.value}
                  </text>
                )}
              </g>
            )
          })}

          {/* Group label (year) */}
          <text
            x={groupX + groupWidth / 2}
            y={height - chartPadding.bottom + 25}
            textAnchor="middle"
            fontSize={axisFontSize}
            fill={axisColor}
            fontFamily="Montserrat, sans-serif"
            fontWeight="600"
          >
            {group.label}
          </text>
        </g>
      )
    })
  }

  // Render single bars (original)
  const renderSingleBars = () => {
    const startX = chartPadding.left + (chartWidth - totalBarsWidth) / 2

    return data.map((item, index) => {
      const x = startX + index * (barWidth + barGap)
      const barHeight = chartHeight - scaleY(item.value)
      const y = chartPadding.top + scaleY(item.value)

      return (
        <g key={`bar-${index}`}>
          <defs>
            <linearGradient id={`gradient-${index}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={item.color} stopOpacity="1" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={`url(#gradient-${index})`}
            rx={4}
            ry={4}
          />

          {showValues && (
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize={valueFontSize}
              fill={valueColor}
              fontWeight="600"
              fontFamily="Montserrat, sans-serif"
            >
              {item.value}
            </text>
          )}
        </g>
      )
    })
  }

  // Get unique legend items
  const getLegendItems = () => {
    if (isGrouped && groupedData && groupedData.length > 0) {
      return groupedData[0].bars.map(bar => ({
        label: bar.label,
        color: bar.color
      }))
    }
    return data.map(item => ({
      label: item.label,
      color: item.color
    }))
  }

  return (
    <div 
      ref={containerRef}
      className="vertical-bar-chart-wrapper" 
      style={{ 
        width: '100%',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
        borderRadius: '20px',
        padding: '20px',
        backgroundColor,
        overflow: 'hidden'
      }}
    >
      <div 
        className="vertical-bar-chart-container"
        style={{
          overflowX: shouldScroll ? 'auto' : 'hidden',
          overflowY: 'hidden',
          width: '100%'
        }}
      >
        <svg width={svgWidth} height={height} style={{ display: 'block' }}>
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

          {/* Bars */}
          {isGrouped && groupedData ? renderGroupedBars() : renderSingleBars()}

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

          {/* X-axis label (only for non-grouped) */}
          {!isGrouped && xAxisLabel && (
            <text
              x={svgWidth / 2}
              y={height - chartPadding.bottom + 35}
              textAnchor="middle"
              fontSize={axisFontSize}
              fill={axisColor}
              fontFamily="Montserrat, sans-serif"
            >
              {xAxisLabel}
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      {legendPosition !== 'none' && (
        <div 
          className="chart-legend" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: `${legendGap}px`,
            marginTop: legendPosition === 'bottom' ? '20px' : '0',
            marginBottom: legendPosition === 'top' ? '20px' : '0',
            flexWrap: 'wrap',
            paddingTop: '10px'
          }}
        >
          {getLegendItems().map((item, index) => (
            <div 
              key={`legend-${index}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              <span 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: item.color,
                  display: 'inline-block'
                }}
              />
              <span style={{ 
                fontSize: `${legendFontSize}px`, 
                color: axisColor,
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VerticalBarChart