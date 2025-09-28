import React, { useState } from 'react';
import { 
  Save,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  User,
  Bell,
  Shield,
  CreditCard
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('plans');
  const [settings, setSettings] = useState({
    feeReminders: {
      daily: true,
      weekly: false
    },
    autoBlockOnDue: true
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { id: 1, name: 'Monthly', duration: 1, amount: 2500, description: 'Basic monthly membership' },
    { id: 2, name: 'Quarterly', duration: 3, amount: 6500, description: '3-month membership with 10% discount' },
    { id: 3, name: 'Half-Yearly', duration: 6, amount: 12000, description: '6-month membership with 20% discount' },
    { id: 4, name: 'Yearly', duration: 12, amount: 22000, description: '12-month membership with 25% discount' }
  ]);

  const [admins, setAdmins] = useState([
    { id: 1, name: 'John Doe', email: 'john@gymflow.com', role: 'Super Admin', lastLogin: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@gymflow.com', role: 'Admin', lastLogin: '1 day ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@gymflow.com', role: 'Staff', lastLogin: '3 days ago' }
  ]);

  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const tabs = [
    { id: 'plans', name: 'Subscription Plans', icon: CreditCard },
    { id: 'reminders', name: 'Fee Reminders', icon: Bell },
    { id: 'access', name: 'Access Control', icon: Shield },
    { id: 'admins', name: 'Admin Users', icon: User }
  ];

  const handleSaveSettings = () => {
    // Simulate saving settings
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    setSettings({
      feeReminders: {
        daily: true,
        weekly: false
      },
      autoBlockOnDue: true
    });
  };

  const handleDeletePlan = (planId) => {
    setSubscriptionPlans(plans => plans.filter(plan => plan.id !== planId));
  };

  const renderPlansTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Subscription Plans Management</h3>
        <button 
          onClick={() => setEditingPlan({ id: null, name: '', duration: '', amount: '', description: '' })}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setEditingPlan(plan)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-medium">{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-green-600">₹{plan.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingPlan.id ? 'Edit Plan' : 'Add New Plan'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                    <input
                      type="number"
                      value={editingPlan.duration}
                      onChange={(e) => setEditingPlan({...editingPlan, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={editingPlan.amount}
                      onChange={(e) => setEditingPlan({...editingPlan, amount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingPlan.description}
                      onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    if (editingPlan.id) {
                      setSubscriptionPlans(plans => plans.map(plan => 
                        plan.id === editingPlan.id ? editingPlan : plan
                      ));
                    } else {
                      setSubscriptionPlans(plans => [...plans, {...editingPlan, id: Date.now()}]);
                    }
                    setEditingPlan(null);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRemindersTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Default Fee Reminders</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm font-medium text-gray-900">Daily Reminders</span>
            <p className="text-xs text-gray-500">Send daily reminder notifications for overdue payments</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.feeReminders.daily}
              onChange={(e) => setSettings({
                ...settings,
                feeReminders: { ...settings.feeReminders, daily: e.target.checked }
              })}
              className="sr-only"
            />
            <div
              onClick={() => setSettings({
                ...settings,
                feeReminders: { ...settings.feeReminders, daily: !settings.feeReminders.daily }
              })}
              className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                settings.feeReminders.daily ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  settings.feeReminders.daily ? 'transform translate-x-4' : ''
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm font-medium text-gray-900">Weekly Reminders</span>
            <p className="text-xs text-gray-500">Send weekly summary of pending payments</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.feeReminders.weekly}
              onChange={(e) => setSettings({
                ...settings,
                feeReminders: { ...settings.feeReminders, weekly: e.target.checked }
              })}
              className="sr-only"
            />
            <div
              onClick={() => setSettings({
                ...settings,
                feeReminders: { ...settings.feeReminders, weekly: !settings.feeReminders.weekly }
              })}
              className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                settings.feeReminders.weekly ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  settings.feeReminders.weekly ? 'transform translate-x-4' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Access Control Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm font-medium text-gray-900">Auto Block on Due</span>
            <p className="text-xs text-gray-500">Automatically block member access when payment is overdue</p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.autoBlockOnDue}
              onChange={(e) => setSettings({ ...settings, autoBlockOnDue: e.target.checked })}
              className="sr-only"
            />
            <div
              onClick={() => setSettings({ ...settings, autoBlockOnDue: !settings.autoBlockOnDue })}
              className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                settings.autoBlockOnDue ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  settings.autoBlockOnDue ? 'transform translate-x-4' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Admin User Management</h3>
        <button 
          onClick={() => setShowAddAdmin(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <li key={admin.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{admin.role}</div>
                    <div className="text-sm text-gray-500">Last login: {admin.lastLogin}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleResetSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button 
            onClick={handleSaveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'plans' && renderPlansTab()}
          {activeTab === 'reminders' && renderRemindersTab()}
          {activeTab === 'access' && renderAccessTab()}
          {activeTab === 'admins' && renderAdminsTab()}
        </div>
      </div>
    </div>
  );
}
