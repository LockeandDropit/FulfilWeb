import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const BarChartComponent = () => {

    const data = [
        {
          name: 'Average Cost',
          '4 Year College': 40000,
          'Technical School': 9000,
          amt: 2400,
        },
        {
          name: 'Average Salary',
          '4 Year College': 55000,
          'Technical School': 53000,
          amt: 2210,
        },
      
      ];

 
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={700}
              height={800}
              data={data}
              margin={{
                top: 5,
                right: 30,
                
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              
              <Legend />
              <Bar dataKey="Technical School" fill="#38BDF8"  />
              <Bar dataKey="4 Year College" fill="#6B7280" a />
            </BarChart>
          </ResponsiveContainer>
        );
      
    
}

export default BarChartComponent