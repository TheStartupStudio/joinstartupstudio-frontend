import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Bar.css'
const data = [
  {
    name: 'LTS 1',
    submitted: 65,
    proficient: 30,
    developing: 75,
    certified: 90,
  },
  {
    name: 'LTS 2',
    submitted: 65,
    proficient: 30,
    developing: 95,
    certified: 80,
  },
  {
    name: 'LTS 3',
    submitted: 65,
    proficient: 30,
    developing: 75,
    certified: 80,
  },
  {
    name: 'LTS 4',
    submitted: 65,
    proficient: 30,
    developing: 75,
    certified: 80,
  },

];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    return (
      <>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis axisLine={false}
                 tickLine={false} dataKey="name" />
          <YAxis
            width={40}
            axisLine={false}
            tickLine={false}
            ticks={[0,10,20,30,40,50,60,70,80,90,100]}
                 // domain={[0, 100]}
            interval="preserveStartEnd"
                 allowDataOverflow={true}/>
          <Tooltip />
          <Legend  verticalAlign="top" height={36}/>
          <Bar dataKey="submitted" fill="#5e72e4" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          <Bar dataKey="proficient" fill="#51c7df" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="developing" fill="#ff3399" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          <Bar dataKey="certified" fill="#99cc33" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </>
    );
  }
}
