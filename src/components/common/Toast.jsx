import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400'
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-md border p-4 ${colors[type]}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                  type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
                  'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
