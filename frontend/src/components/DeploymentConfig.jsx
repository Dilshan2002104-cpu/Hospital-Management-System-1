// Deployment Configuration Switcher Component
// Add this to your AdminDashboard for easy deployment switching

import React, { useState } from 'react';
import { DEPLOYMENT_INFO, DEPLOYMENT_GUIDE } from '../config/apiConfig';

export default function DeploymentConfig() {
  const [showConfig, setShowConfig] = useState(false);

  const deploymentExamples = [
    {
      name: 'Local Development',
      config: `const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENVIRONMENT: 'development'
};`,
      description: 'For development on your computer'
    },
    {
      name: 'Network Access',
      config: `const API_CONFIG = {
  BASE_URL: 'http://192.168.1.105:8000',  // Your computer IP
  ENVIRONMENT: 'network'
};`,
      description: 'For access from other devices on same network'
    },
    {
      name: 'Server Deployment',
      config: `const API_CONFIG = {
  BASE_URL: 'http://your-server-ip:8000',
  ENVIRONMENT: 'staging'
};`,
      description: 'For deployment on a server'
    },
    {
      name: 'Production',
      config: `const API_CONFIG = {
  BASE_URL: 'https://yourdomain.com',
  ENVIRONMENT: 'production'
};`,
      description: 'For production deployment with domain'
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            🚀 API Configuration
          </h3>
          <p className="text-blue-700 text-sm">
            Current: <span className="font-mono bg-blue-100 px-2 py-1 rounded">
              {DEPLOYMENT_INFO.BASE_URL}
            </span> 
            <span className="ml-2 bg-blue-200 px-2 py-1 rounded text-xs">
              {DEPLOYMENT_INFO.ENVIRONMENT}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showConfig ? 'Hide' : 'Show'} Deployment Guide
        </button>
      </div>

      {showConfig && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold mb-2">📁 File to Edit:</h4>
            <code className="bg-gray-100 p-2 rounded block">
              src/config/apiConfig.js
            </code>
          </div>

          <div className="grid gap-4">
            {deploymentExamples.map((example, index) => (
              <div key={index} className="bg-white p-4 rounded border">
                <h4 className="font-semibold text-gray-900 mb-1">{example.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{example.description}</p>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  <code>{example.config}</code>
                </pre>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚡ Quick Steps:</h4>
            <ol className="list-decimal list-inside text-yellow-800 text-sm space-y-1">
              <li>Open <code>src/config/apiConfig.js</code></li>
              <li>Comment out current config (add // at start of lines)</li>
              <li>Uncomment the config you need</li>
              <li>Replace placeholder URLs with your actual URLs</li>
              <li>Save file and restart frontend server</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h4 className="font-semibold text-green-800 mb-2">💡 Find Your IP Address:</h4>
            <div className="text-green-800 text-sm">
              <p><strong>Windows:</strong> <code>ipconfig</code> (look for IPv4 Address)</p>
              <p><strong>Mac/Linux:</strong> <code>ifconfig</code> (look for inet)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}