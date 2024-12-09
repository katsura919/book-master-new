import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import './Overview.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

function Overview() {
  const apiBaseUrl = 'https://book-master-server.onrender.com'; 
  const user = useSelector((state) => state.auth.user);

  const [requests, setRequests] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
  });
  const [counts, setCounts] = useState({ todayCount: 0, yesterdayCount: 0, totalCount: 0 });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [statusData, setStatusData] = useState({
    labels: ['Pending', 'Approved', 'Rejected', 'Overdue'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336', '#ff9800'],
      },
    ],
  });

  const [currentTime, setCurrentTime] = useState('');

   // Function to format time in hh:mm am/pm format
   const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // add leading zero for minutes
    return `${hours}:${minutes} ${ampm}`;
  };

  // Fetch counts and request data
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/request-date`);
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching request counts:', error);
      }
    };

    const fetchRequestCounts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/request-counts`);
        setRequests(response.data);
        setStatusData({
          labels: ['Pending', 'Approved', 'Overdue'],
          datasets: [
            {
              data: [
                response.data.pending || 0,
                response.data.approved || 0,

                response.data.overdue || 0,
              ],
              backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching request counts:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/chart-data`);
        const data = response.data || {};
        setChartData({
          labels: (data.months || []).map((month) =>
            new Date(0, month - 1).toLocaleString('default', { month: 'short' })
          ),
          datasets: [
            {
              label: 'Pending Requests',
              data: data.pending || [],
              backgroundColor: '#4caf50',
              borderColor: '#8e44ad',
              borderWidth: 1,
              barPercentage: 0.4,
              categoryPercentage: 0.5,
            },
            {
              label: 'Approved Requests',
              data: data.approved || [],
              backgroundColor: '#2196f3',
              borderWidth: 1,
              barPercentage: 0.4,
              categoryPercentage: 0.5,
            },
            {
              label: 'Overdue Requests',
              data: data.overdue || [],
              backgroundColor: '#f44336',
              borderWidth: 1,
              barPercentage: 0.4,
              categoryPercentage: 0.5,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchCounts();
    fetchRequestCounts();
    fetchChartData();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    }, 60000); // Update every 60 seconds

    // Initialize with the current time
    setCurrentTime(formatTime(new Date()));

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);

  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Request Statistics' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Status Breakdown',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value}%`; // Show value with percentage
          },
        },
      },
    },
  };
  
  
  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1>Welcome to Dashboard</h1>
      </header>

            {/* Cards Section */}
      <div className="cards-section">
        <div className="summary-card card-earnings">
          <div className="summary-card-header">
            <div className="summary-card-value">{counts.todayCount}</div>
            <div className="summary-card-title">New Requests</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="summary-card card-views">
          <div className="summary-card-header">
            <div className="summary-card-value">{requests.pending}</div>
            <div className="summary-card-title">Pending Requests</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="summary-card card-tasks">
          <div className="summary-card-header">
            <div className="summary-card-value">{requests.overdue}</div>
            <div className="summary-card-title">Overdue Requests</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>

        <div className="summary-card card-downloads">
          <div className="summary-card-header">
            <div className="summary-card-value">{counts.totalCount}</div>
            <div className="summary-card-title">Total Requests</div>
          </div>
          <div className="summary-card-footer">
            <div className="update-info">
              <div className="update-info-icon"></div>
              <span>Updated: {currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-container">
          <div className="chart-section">
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-container">
              <Pie data={statusData} options={pieChartOptions}/>
            </div>
          </div>
      </div>

    </div>
  );
}

export default Overview;
