import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Filter,
  Calendar,
  AlertTriangle,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { faker } from '@faker-js/faker';
import { format, subMonths } from 'date-fns';

export default function FeeReports() {
  const [dateFrom, setDateFrom] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('');

  // Mock data
  const generateReportData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      date: format(faker.date.between({ from: new Date(dateFrom), to: new Date(dateTo) }), 'MMM dd, yyyy'),
      memberName: faker.person.fullName(),
      amount: faker.number.int({ min: 1000, max: 5000 }),
      mode: faker.helpers.arrayElement(['Cash', 'Card', 'UPI', 'Net Banking']),
      receiptNumber: faker.string.alphanumeric(8).toUpperCase(),
      status: 'Paid'
    }));
  };

  const generateMonthlyData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: format(subMonths(new Date(), 11 - i), 'MMM'),
      income: faker.number.int({ min: 80000, max: 150000 }),
      expenses: faker.number.int({ min: 20000, max: 40000 })
    }));
  };

  const [reportData] = useState(generateReportData());
  const [monthlyData] = useState(generateMonthlyData());
  const blockedMembers = 15;

  // Summary calculations
  const totalCollected = reportData.reduce((sum, item) => sum + item.amount, 0);
  const cashPayments = reportData.filter(item => item.mode === 'Cash').reduce((sum, item) => sum + item.amount, 0);
  const cardPayments = totalCollected - cashPayments;
  const totalDue = faker.number.int({ min: 50000, max: 100000 });

  const monthlyChartOption = {
    title: { text: 'Monthly Income vs Expenses', textStyle: { fontSize: 16 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Income', 'Expenses'] },
    xAxis: {
      type: 'category',
      data: monthlyData.map(item => item.month)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Income',
        type: 'bar',
        data: monthlyData.map(item => item.income),
        itemStyle: { color: '#10B981' }
      },
      {
        name: 'Expenses',
        type: 'bar',
        data: monthlyData.map(item => item.expenses),
        itemStyle: { color: '#EF4444' }
      }
    ]
  };

  const paymentModeChartOption = {
    title: { text: 'Payment Mode Distribution', textStyle: { fontSize: 16 } },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: cashPayments, name: 'Cash' },
        { value: cardPayments, name: 'Card/UPI' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const filteredData = reportData.filter(item => {
    const matchesPaymentMode = paymentModeFilter === 'all' || item.mode.toLowerCase() === paymentModeFilter.toLowerCase();
    const matchesMember = memberFilter === '' || item.memberName.toLowerCase().includes(memberFilter.toLowerCase());
    return matchesPaymentMode && matchesMember;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fee Reports & Summary</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Alert for blocked members */}
      {blockedMembers > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {blockedMembers} members are blocked due to unpaid dues.
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Please follow up on overdue payments to maintain member access.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Modes</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="net banking">Net Banking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
            <input
              type="text"
              placeholder="Search member..."
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Collected</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{totalCollected.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Due</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{totalDue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cash Payments</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{cashPayments.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Card/UPI Payments</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{cardPayments.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <ReactECharts option={monthlyChartOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <ReactECharts option={paymentModeChartOption} style={{ height: '300px' }} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Payment Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.memberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.mode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {item.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
