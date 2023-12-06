import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './Bar.css'
import SelectInput from '../SelectInput'

const data = [
  {
    name: 'LTS 1',
    proficient: 30,
    developing: 75,
    certified: 90
  },
  {
    name: 'LTS 2',
    proficient: 30,
    developing: 95,
    certified: 80
  },
  {
    name: 'LTS 3',
    proficient: 30,
    developing: 75,
    certified: 80
  },
  {
    name: 'LTS 4',
    proficient: 30,
    developing: 75,
    certified: 80
  }
]

const BarChartComponent = ({ certification, handleChangeMRType }) => {
  const transformedData = []

  // Iterate through the original data
  certification?.forEach((item) => {
    const existingEntry = transformedData?.find(
      (entry) => entry.name === item.year
    )

    if (existingEntry) {
      // Update existing entry
      existingEntry[item.status.toLowerCase()] = item.percentage
    } else {
      // Create a new entry
      const newEntry = {
        name: item.year,
        proficient: 0,
        developing: 0,
        certified: 0
      }
      newEntry[item.status.toLowerCase()] = item.percentage
      transformedData.push(newEntry)
    }
  })
  console.log(transformedData)
  return (
    <>
      <SelectInput
        options={[
          { name: 'MR1', value: 'mr1' },
          { name: 'MR2', value: 'mr2' }
        ]}
        onChange={(e) => handleChangeMRType(e)}
      />
      <BarChart
        width={500}
        height={300}
        data={transformedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey="name" />
        <YAxis
          width={40}
          axisLine={false}
          tickLine={false}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          // domain={[0, 100]}
          interval="preserveStartEnd"
          allowDataOverflow={true}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="proficient"
          fill="#51c7df"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="developing"
          fill="#ff3399"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
        <Bar
          dataKey="certified"
          fill="#99cc33"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </>
  )
}
export default BarChartComponent
