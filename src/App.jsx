import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberList from './components/members/MemberList';
import AddEditMember from './components/members/AddEditMember';
import FeeCollection from './components/fees/FeeCollection';
import FeeReports from './components/fees/FeeReports';
import AccessMonitor from './components/access/AccessMonitor';
import AttendanceHistory from './components/attendance/AttendanceHistory';
import FlapBarrier from './components/barrier/FlapBarrier';
import Settings from './components/settings/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/add" element={<AddEditMember />} />
          <Route path="/members/edit/:id" element={<AddEditMember />} />
          <Route path="/fees" element={<FeeCollection />} />
          <Route path="/fees/reports" element={<FeeReports />} />
          <Route path="/access" element={<AccessMonitor />} />
          <Route path="/attendance" element={<AttendanceHistory />} />
          <Route path="/barrier" element={<FlapBarrier />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
