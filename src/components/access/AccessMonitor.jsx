import React, { useState, useEffect } from 'react';
import { 
  Filter,
  Calendar,
  AlertCircle,
  Eye,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { faker } from '@faker-js/faker';
import { format, startOfDay, endOfDay } from 'date-fns';

export default function AccessMonitor() {
  const [dateFrom, setDateFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [memberIdFilter, setMemberIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    // Generate real-time access logs
    const generateLogs = () => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        memberName: faker.person.fullName(),
        membershipId: faker.string.alphanumeric(8).toUpperCase(),
        entryTime: format(new Date(Date.now() - i * 1000 * 60 * Math.random() * 120), 'HH:mm:ss'),
        exitTime: Math.random() > 0.3 ? format(new Date(Date.now() - i * 1000 * 60 * Math.random() * 60), 'HH:mm:ss') : null,
        direction: faker.helpers.arrayElement(['Entry', 'Exit']),
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
        status: Math.random() > 0.1 ? 'Allowed' : 'Blocked',
        date: format(new Date(), 'yyyy-MM-dd')
      }));
    };

    setAccessLogs(generateLogs());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAccessLogs(prev => {
        const newLog = {
          id: Date.now(),
          memberName: faker.person.fullName(),
          membershipId: faker.string.alphanumeric(8).toUpperCase(),
          entryTime: format(new Date(), 'HH:mm:ss'),
          exitTime: null,
          direction: faker.helpers.arrayElement(['Entry', 'Exit']),
          photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
          status: Math.random() > 0.1 ? 'Allowed' : 'Blocked',
          date: format(new Date(), 'yyyy-MM-dd')
        };
        return [newLog, ...prev.slice(0, 29)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = accessLogs.filter(log => {
    const matchesDate = log.date >= dateFrom && log.date <= dateTo;
    const matchesMemberId = memberIdFilter === '' || log.membershipId.toLowerCase().includes(memberIdFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesDate && matchesMemberId && matchesStatus;
  });

  const todayAttendance = accessLogs.filter(log => log.date === format(new Date(), 'yyyy-MM-dd') && log.direction === 'Entry').length;
  const blockedAttempts = accessLogs.filter(log => log.status === 'Blocked').length;
  const currentlyInside = accessLogs.filter(log => log.direction === 'Entry' && !log.exitTime).length;

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Access Monitor</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="ml-2 text-sm text-gray-600">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Attendance</dt>
                  <dd className="text-lg font-medium text-gray-900">{todayAttendance}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Currently Inside</dt>
                  <dd className="text-lg font-medium text-gray-900">{currentlyInside}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Blocked Attempts</dt>
                  <dd className="text-lg font-medium text-gray-900">{blockedAttempts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Peak Hour</dt>
                  <dd className="text-lg font-medium text-gray-900">18:00-20:00</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
            <input
              type="text"
              placeholder="Search by Member ID..."
              value={memberIdFilter}
              onChange={(e) => setMemberIdFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="allowed">Allowed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Access Log */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Real-time Access Log</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={log.photo} 
                          alt={log.memberName}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{log.memberName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.membershipId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.entryTime}
                      {log.exitTime && <div className="text-xs text-gray-500">Exit: {log.exitTime}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.direction === 'Entry' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'Allowed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                        {log.status === 'Blocked' && (
                          <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleMemberClick(log)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Access Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedMember.photo} 
                      alt={selectedMember.memberName}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedMember.memberName}</p>
                      <p className="text-sm text-gray-500">ID: {selectedMember.membershipId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Direction:</span> {selectedMember.direction}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {selectedMember.entryTime}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedMember.status === 'Allowed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedMember.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {selectedMember.date}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
