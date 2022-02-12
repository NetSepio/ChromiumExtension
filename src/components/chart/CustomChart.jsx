import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

const data = {
  labels: ['Malware', 'Phishing', 'Adware', 'Safe', 'Others'],
  datasets: [
    {
      data: [12, 19, 3, 5, 2],
      backgroundColor: ['#E289F2', '#FF0000', 'blue', '#1EDE98', 'grey'],
    },
  ],
};
const CustomChart = () => {
  return (
    <Pie
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
      height={200}
    />
  );
};

export default CustomChart;
