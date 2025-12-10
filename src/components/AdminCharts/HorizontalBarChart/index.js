import React, { useRef, useEffect, useState } from 'react'
import './index.css'

const HorizontalBarChart = ({
  data = [],
  height = 350,
  backgroundColor = '#ffffff',
  chartPadding = { top: 20, right: 50, bottom: 40, left: 120 },
  barHeight = 46,
  barGap = 30,
  showGrid = true,
  gridColor = '#f0f0f0',
  gridStrokeWidth = 1,
  barColor = '#54C7DF',
  showValues = true,
  valueFontSize = 12,
  valueColor = '#333',
  axisColor = '#666',
  axisFontSize = 12,
  labelFontSize = 12,
  showLegend = false,
  legendLabel = 'Sessions',
  legendColor = '#54C7DF',
  maxXValue = null,
  barRadius = 4
}) => {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

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

  // Use full container width
  const svgWidth = containerWidth || 600
  const chartWidth = svgWidth - chartPadding.left - chartPadding.right
  const chartHeight = height - chartPadding.top - chartPadding.bottom

  // Find max value for scaling
  const maxValue = maxXValue || Math.ceil(Math.max(...data.map(d => d.value)) / 40) * 40

  // Calculate X-axis steps
  const xSteps = 10
  const xStepValue = maxValue / xSteps

  // Calculate bar positions
  const totalBars = data.length
  const totalHeight = totalBars * barHeight + (totalBars - 1) * barGap
  const startY = chartPadding.top + (chartHeight - totalHeight) / 2

  // Scale value to chart width
  const scaleX = (value) => {
    return (value / maxValue) * chartWidth
  }

  return (
    <div 
      ref={containerRef}
      className="horizontal-bar-chart-wrapper" 
      style={{ 
        width: '100%',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
        borderRadius: '20px',
        padding: '20px',
        backgroundColor,
        overflow: 'hidden'
      }}
    >
      <svg width="100%" height={height} style={{ display: 'block' }}>
        {/* Grid lines */}
        {showGrid && Array.from({ length: xSteps + 1 }).map((_, index) => {
          const x = chartPadding.left + (chartWidth / xSteps) * index
          return (
            <line
              key={`grid-${index}`}
              x1={x}
              y1={chartPadding.top}
              x2={x}
              y2={height - chartPadding.bottom}
              stroke={gridColor}
              strokeWidth={gridStrokeWidth}
            />
          )
        })}

        {/* X-axis labels */}
        {Array.from({ length: xSteps + 1 }).map((_, index) => {
          const value = xStepValue * index
          const x = chartPadding.left + (chartWidth / xSteps) * index
          return (
            <text
              key={`x-label-${index}`}
              x={x}
              y={height - chartPadding.bottom + 20}
              textAnchor="middle"
              fontSize={axisFontSize}
              fill={axisColor}
              fontFamily="Montserrat, sans-serif"
            >
              {Math.round(value)}
            </text>
          )
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const y = startY + index * (barHeight + barGap)
          const barWidth = scaleX(item.value)
          const itemColor = item.color || barColor

          return (
            <g key={`bar-${index}`}>
              {/* Y-axis label (country name) */}
              <text
                x={chartPadding.left - 10}
                y={y + barHeight / 2 + 5}
                textAnchor="end"
                fontSize={labelFontSize}
                fill={axisColor}
                fontFamily="Montserrat, sans-serif"
              >
                {item.label}
              </text>

              {/* Bar with gradient */}
              <defs>
                <linearGradient id={`h-gradient-${index}`} x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor={itemColor} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={itemColor} stopOpacity="1" />
                </linearGradient>
              </defs>
              
              <rect
                x={chartPadding.left}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#h-gradient-${index})`}
                rx={barRadius}
                ry={barRadius}
              />

              {/* Value on the right of bar */}   
              {showValues && (
                <text
                  x={chartPadding.left + barWidth + 10}
                  y={y + barHeight / 2 + 5}
                  textAnchor="start"
                  fontSize={valueFontSize}
                  fill={valueColor}
                  fontWeight="500"
                  fontFamily="Montserrat, sans-serif"
                >
                  {item.value}
                </text>
              )}
            </g>
          )
        })}

        {/* Y-axis */}
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={height - chartPadding.bottom}
          stroke={axisColor}
          strokeWidth={1}
        />

        {/* X-axis */}
        <line
          x1={chartPadding.left}
          y1={height - chartPadding.bottom}
          x2={svgWidth - chartPadding.right}
          y2={height - chartPadding.bottom}
          stroke={axisColor}
          strokeWidth={1}
        />
      </svg>

      {/* Legend */}
      {showLegend && (
        <div 
          className="chart-legend" 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px',
            marginTop: '15px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span 
              style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                backgroundColor: legendColor,
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: `${axisFontSize}px`, color: axisColor, fontFamily: 'Montserrat, sans-serif' }}>
              {legendLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default HorizontalBarChart