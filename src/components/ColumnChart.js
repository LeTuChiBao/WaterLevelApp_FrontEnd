import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ColumnChart = ({data,damage_level}) => {
  const repeatedDamageLevel = new Array(data.length).fill(damage_level);

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.updated_at); // Chuyển chuỗi thành đối tượng Date
     const formattedDate = date.toLocaleDateString('vi-VN'); // Định dạng thành yyyy-mm-dd
      return `${item.sensor.name} - ${item.updated_at}`
    }), // Tên sensor
    datasets: [
      {
        label: 'Water Level',
        data: data.map(item => item.water_level), // Chiều cao cột
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu nền cho cột
        borderColor: 'rgba(75, 192, 192, 1)', // Màu viền cho cột
        borderWidth: 1,
      },
      {
        label: 'Damage Level',
        data: repeatedDamageLevel,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Màu khác cho damage level
        borderColor: 'rgba(255, 99, 132, 1)',
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
        text: 'Compare current water levels of the region', // Tiêu đề của biểu đồ
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ColumnChart;
