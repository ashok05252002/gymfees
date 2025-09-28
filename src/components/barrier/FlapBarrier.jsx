import React, { useState, useEffect } from 'react';
import { 
  Settings,
  TestTube2,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';

export default function FlapBarrier() {
  const [config, setConfig] = useState({
    apiUrl: 'https://api.gymflow.com/barrier',
    secretKey: 'sk_test_1234567890abcdef',
    realTimeSync: true
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [barrierLogs, setBarrierLogs] = useState([]);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime
      setLastPing(new Date());
    }, 5000);

    // Generate initial barrier logs
    const generateLogs = () => {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        time: format(new Date(Date.now() - i * 1000 * 60 * Math.random() * 10), 'HH:mm:ss'),
        memberId: faker.string.alphanumeric(8).toUpperCase(),
        direction: faker.helpers.arrayElement(['Entry', 'Exit']),
        status: Math.random() > 0.1 ? 'Success' : 'Failed',
        response: Math.random() > 0.1 ? '200 OK' : '403 Forbidden'
      }));
    };

    setBarrierLogs(generateLogs());

    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTest = async () => {
    setTestResult('testing');
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setTestResult(success ? 'success' : 'failed');
      
      // Add test log
      const testLog = {
        id: Date.now(),
        time: format(new Date(), 'HH:mm:ss'),
        memberId: 'TEST001',
        direction: 'Test',
        status: success ? 'Success' : 'Failed',
        response: success ? '200 OK' : '500 Server Error'
      };
      
      setBarrierLogs(prev => [testLog, ...prev.slice(0, 9)]);
    }, 2000);
  };

  const handleSave = () => {
    // Simulate saving configuration
    alert('Configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Flap Barrier Integration</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">API Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API URL *
              </label>
              <input
                type="url"
                value={config.apiUrl}
                onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                placeholder="https://api.example.com/barrier"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key *
              </label>
              <input
                type="password"
                value={config.secretKey}
                onChange={(e) => handleConfigChange('secretKey', e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Real-time Sync</label>
                <p className="text-xs text-gray-500">Enable automatic synchronization</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={config.realTimeSync}
                  onChange={(e) => handleConfigChange('realTimeSync', e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => handleConfigChange('realTimeSync', !config.realTimeSync)}
                  className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
                    config.realTimeSync ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      config.realTimeSync ? 'transform translate-x-4' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleTest}
                disabled={testResult === 'testing'}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <TestTube2 className="h-4 w-4 mr-2" />
                {testResult === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>

            {testResult && testResult !== 'testing' && (
              <div className={`p-3 rounded-md ${
                testResult === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <div className="flex items-center">
                  {testResult === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm font-medium">
                    {testResult === 'success' ? 'Connection successful!' : 'Connection failed!'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Panel */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Live Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium">Connection Status</span>
              </div>
              <span className={`text-sm font-semibold ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm font-medium">Last Ping</span>
              </div>
              <span className="text-sm text-gray-600">
                {lastPing ? format(lastPing, 'HH:mm:ss') : 'Never'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm font-medium">Sync Status</span>
              </div>
              <span className={`text-sm font-semibold ${
                config.realTimeSync ? 'text-green-600' : 'text-gray-600'
              }`}>
                {config.realTimeSync ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Hardware Setup Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Hardware Setup Instructions</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>1. Connect the flap barrier to your network</li>
              <li>2. Configure the API endpoint in barrier settings</li>
              <li>3. Test the connection using the button above</li>
              <li>4. Enable real-time sync for instant updates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barrier Request Logs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Barrier Request Logs (Last 10)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {barrierLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.memberId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.direction === 'Entry' ? 'bg-green-100 text-green-800' :
                        log.direction === 'Exit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {log.status === 'Success' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm font-medium ${
                          log.status === 'Success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.response}
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
