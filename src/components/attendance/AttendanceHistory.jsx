import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Printer,
  User,
  Search,
  Grid,
  List
} from 'lucide-react';
import { faker } from '@faker-js/faker';
import { format, subDays, differenceInMinutes } from 'date-fns';

export default function AttendanceHistory() {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Generate mock members
  const members = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    membershipId: faker.string.alphanumeric(8).toUpperCase(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`,
    plan: faker.helpers.arrayElement(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']),
    expiryDate: format(faker.date.future(), 'MMM dd, yyyy')
  }));

  // Generate attendance data for selected member
  const generateAttendanceData = (memberId) => {
    if (!memberId) return [];
    
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      const hasAttendance = Math.random() > 0.3; // 70% chance of attendance
      
      if (!hasAttendance) return null;
      
      const entryTime = new Date(date);
      entryTime.setHours(6 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60)); // 6-10 AM
      
      const exitTime = new Date(entryTime);
      exitTime.setHours(entryTime.getHours() + 1 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60)); // 1-4 hours later
      
      return {
        id: i + 1,
        date: format(date, 'yyyy-MM-dd'),
        entryTime: format(entryTime, 'HH:mm'),
        exitTime: format(exitTime, 'HH:mm'),
        duration: differenceInMinutes(exitTime, entryTime)
      };
    }).filter(Boolean);
  };

  const selectedMember = members.find(m => m.membershipId === selectedMemberId);
  const attendanceData = generateAttendanceData(selectedMemberId);
  
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCalendarData = () => {
    const calendar = {};
    attendanceData.forEach(record => {
      calendar[record.date] = record;
    });
    return calendar;
  };

  const calendarData = getCalendarData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Member Attendance History</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4 mr-1" />
              Calendar
            </button>
          </div>
          {selectedMember && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          )}
        </div>
      </div>

      {/* Member Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Member</h3>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or membership ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {searchQuery && (
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md mb-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => {
                  setSelectedMemberId(member.membershipId);
                  setSearchQuery('');
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">ID: {member.membershipId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMember && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedMember.avatar} 
                alt={selectedMember.name}
                className="h-16 w-16 rounded-full"
              />
              <div className="flex-1">
                <h4 className="text-xl font-medium text-gray-900">{selectedMember.name}</h4>
                <p className="text-sm text-gray-600">Membership ID: {selectedMember.membershipId}</p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Plan:</span> {selectedMember.plan}
                  </div>
                  <div>
                    <span className="font-medium">Expiry:</span> {selectedMember.expiryDate}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{attendanceData.length}</p>
                <p className="text-sm text-gray-500">Days Attended</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Data */}
      {selectedMember && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Attendance Records (Last 30 Days)
              </h3>
              {viewMode === 'calendar' && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entry Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exit Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-green-500 mr-2" />
                            {record.entryTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-red-500 mr-2" />
                            {record.exitTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {formatDuration(record.duration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar Header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = format(subDays(new Date(), 34 - i), 'yyyy-MM-dd');
                  const hasAttendance = calendarData[date];
                  
                  return (
                    <div key={i} className={`p-2 text-center text-sm border border-gray-200 ${
                      hasAttendance ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-400'
                    }`}>
                      <div className="font-medium">
                        {format(new Date(date), 'd')}
                      </div>
                      {hasAttendance && (
                        <div className="text-xs mt-1">
                          {hasAttendance.entryTime}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {attendanceData.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
                <p className="mt-1 text-sm text-gray-500">No attendance data found for the last 30 days.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
