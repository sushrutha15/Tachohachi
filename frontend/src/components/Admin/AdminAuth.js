import React, { useState, useEffect } from 'react';

const AdminAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin is already logged in (simple check)
    const adminToken = localStorage.getItem('adminAuth');
    if (adminToken === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simple hardcoded authentication (replace with your credentials)
    if (loginForm.email === 'psushrutha1506@gmail.com' && loginForm.password === 'Admin2025') {
      localStorage.setItem('adminAuth', 'authenticated');
      setIsAuthenticated(true);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Miyato Hibachi Dallas Taquizas Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@thecurrycrate.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="bg-red-600 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-md font-medium">
             Admin Dashboard - Miyato Hibachi Dallas Taquizas
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-700 hover:bg-red-800 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminAuth;