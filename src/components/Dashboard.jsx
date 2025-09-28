import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CreditCard, 
  AlertCircle, 
  TrendingUp,
  Search,
  Filter,
  Bell,
  Download
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { faker } from '@faker-js/faker';
import { format, subDays, startOfDay } from 'date-fns';

export default function Dashboard() {
  const [feeView, setFeeView] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data generation
  const generateAccessLogs = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      memberName: faker.person.fullName(),
      memberId: faker.string.alphanumeric(6).toUpperCase(),
      timestamp: format(new Date(Date.now() - i * 1000 * 60 * Math.random() * 120), 'MMM dd, HH:mm'),
      type: Math.random() > 0.5 ? 'entry' : 'exit',
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
      status: Math.random() > 0.9 ? 'blocked' : 'allowed'
    }));
  };

  const generateAttendanceData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd');
      data.push({
        date,
        attendance: Math.floor(Math.random() * 50) + 20
      });
    }
    return data;
  };

  const generatePaymentData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = format(subDays(new Date(), i * 30), 'MMM');
      data.push({
        month: date,
        amount: Math.floor(Math.random() * 50000) + 30000
      });
    }
    return data;
  };

  const [accessLogs] = useState(generateAccessLogs());
  const [attendanceData] = useState(generateAttendanceData());
  const [paymentData] = useState(generatePaymentData());

  const attendanceChartOption = {
    title: { text: 'Attendance Trends (Last 30 Days)', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: attendanceData.map(item => item.date),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value' },
    series: [{
      data: attendanceData.map(item => item.attendance),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#3B82F6' }
    }]
  };

  const paymentChartOption = {
    title: { text: 'Payment Collection Trends', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: paymentData.map(item => item.month)
    },
    yAxis: { type: 'value' },
    series: [{
      data: paymentData.map(item => item.amount),
      type: 'bar',
      itemStyle: { color: '#10B981' }
    }]
  };

  // Mock stats
  const stats = {
    activeMembers: 1247,
    inactiveMembers: 83,
    pendingDues: 156,
    dailyCollection: 12500,
    weeklyCollection: 87500,
    monthlyCollection: 365000
  };

  const notifications = [
    { id: 1, type: 'reminder', message: '12 payment reminders sent today', time: '2 hours ago' },
    { id: 2, type: 'block', message: '3 members blocked due to unpaid dues', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'Monthly report generated successfully', time: '6 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeMembers.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive Members</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inactiveMembers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Dues</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingDues}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Growth</dt>
                  <dd className="text-lg font-medium text-gray-900">+12.5%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Log Panel */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Real-time Access Log</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accessLogs.map((log) => (
                <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={log.photo} 
                    alt={log.memberName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{log.memberName}</p>
                    <p className="text-sm text-gray-500">ID: {log.memberId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.type === 'entry' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  {log.status === 'blocked' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Collection Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Fee Collection</h3>
            
            <div className="mb-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['daily', 'weekly', 'monthly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setFeeView(period)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      feeView === period
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Collected</span>
                <span className="text-lg font-semibold text-green-600">
                  ₹{stats[`${feeView}Collection`].toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Cash</span>
                <span className="text-sm font-medium">₹{Math.floor(stats[`${feeView}Collection`] * 0.3).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Card/UPI</span>
                <span className="text-sm font-medium">₹{Math.floor(stats[`${feeView}Collection`] * 0.7).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <ReactECharts option={attendanceChartOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <ReactECharts option={paymentChartOption} style={{ height: '300px' }} />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="dues">Pending Dues</option>
            </select>
            
            <input
              type="date"
              className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'reminder' ? 'bg-blue-500' :
                  notification.type === 'block' ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
