import React from 'react';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

const CustomChart = ({ reviews }) => {
  let tempArray = [];
  reviews?.map((v) => {
    tempArray.push(v?.siteSafety);
  });
  let obj = {};
  for (let char of tempArray) {
    !obj[char] ? (obj[char] = 1) : obj[char]++;
  }
  const data = {
    labels: ['Malware', 'Phishing', 'Adware', 'Safe', 'Others'],
    datasets: [
      {
        data: [
          obj?.Malware,
          obj?.Phishing,
          obj?.Adware,
          obj?.Safe,
          obj?.Others,
        ],
        backgroundColor: ['#E289F2', '#FF0000', 'blue', '#1EDE98', 'grey'],
      },
    ],
  };
  return Object.keys(obj).length > 0 ? (
    <Pie
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
      height={200}
    />
  ) : (
    <p>No reviews found</p>
  );
};

export default CustomChart;
