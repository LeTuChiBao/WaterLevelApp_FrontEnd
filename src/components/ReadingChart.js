import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReadingChart = ({ data }) => {
 
  const chartData = {
    labels: data.map(item => {
      return `${item.updated_at} `
    }), // Tên sensor
    datasets: [
      {
        label:  `Water Lever ${data[0]?.sensor.name}`,
        data: data.map(item => item.water_level), // Chiều cao cột
        backgroundColor: 'rgba(39, 76, 245, 0.6)', // Màu nền cho cột
        borderColor: 'rgba(39, 76, 245, 1)', // Màu viền cho cột
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Vị trí của legend
      },
      title: {
        display: true,
        text: 'All Reading For This sensor ', 
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ReadingChart;
