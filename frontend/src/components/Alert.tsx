import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg p-4 mb-4 ${colors[type]} animate-fadeIn`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;