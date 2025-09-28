import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Receipt, 
  CreditCard,
  Calendar,
  User,
  DollarSign,
  FileText
} from 'lucide-react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import Toast from '../common/Toast';

export default function FeeCollection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [generateReceipt, setGenerateReceipt] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [members] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: faker.person.fullName(),
      membershipId: faker.string.alphanumeric(8).toUpperCase(),
      plan: faker.helpers.arrayElement(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']),
      dueAmount: faker.number.int({ min: 1000, max: 5000 }),
      lastPaymentDate: format(faker.date.past(), 'MMM dd, yyyy'),
      phone: faker.phone.number(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`
    }))
  );

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember || !amount) return;
    
    // Simulate payment processing
    setShowToast(true);
    
    // Reset form
    setSelectedMember(null);
    setAmount('');
    setNotes('');
    setSearchQuery('');
    
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    setSelectedMember(null);
    setAmount('');
    setNotes('');
    setSearchQuery('');
    setPaymentDate(format(new Date(), 'yyyy-MM-dd'));
    setPaymentMode('cash');
    setGenerateReceipt(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Receipt className="h-4 w-4 mr-2" />
            Recent Receipts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Search */}
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
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    setSelectedMember(member);
                    setSearchQuery('');
                    setAmount(member.dueAmount.toString());
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
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">₹{member.dueAmount}</p>
                      <p className="text-xs text-gray-500">Due</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMember && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedMember.avatar} 
                  alt={selectedMember.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{selectedMember.name}</h4>
                  <p className="text-sm text-gray-600">ID: {selectedMember.membershipId}</p>
                  <p className="text-sm text-gray-600">Plan: {selectedMember.plan}</p>
                  <p className="text-sm text-gray-600">Last Payment: {selectedMember.lastPaymentDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">₹{selectedMember.dueAmount}</p>
                  <p className="text-sm text-gray-500">Due Amount</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Paid *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Mode *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="generateReceipt"
                checked={generateReceipt}
                onChange={(e) => setGenerateReceipt(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="generateReceipt" className="ml-2 block text-sm text-gray-900">
                Generate Receipt
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={!selectedMember || !amount}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Payment
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(Date.now() - i * 1000 * 60 * 60), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {faker.person.fullName()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{faker.number.int({ min: 1000, max: 5000 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {faker.helpers.arrayElement(['Cash', 'Card', 'UPI'])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <button className="hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showToast && (
        <Toast
          type="success"
          message="Payment collected successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
