import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RegionChart = ({ data }) => {
  // Chuyển đổi dữ liệu thành định dạng mà Chart.js có thể sử dụng
  const chartData = {
    labels: data.map(item => {
      return `${item.ward}-${item.district} `
    }), // Tên sensor
    datasets: [
      {
        label: 'Damage Level Ward',
        data: data.map(item => item.damage_level), // Chiều cao cột
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
        text: 'Region Damage Level ', // Tiêu đề của biểu đồ
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RegionChart;
