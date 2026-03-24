// Updated AdminDashboard.js - Add the "Add Booking" button
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    thisMonthBookings: 0,
    totalRevenue: 0,
    upcomingBookings: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('https://miyatohibachi-backend-production.up.railway.app/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalBookings: data.totalBookings || 0,
          thisMonthBookings: data.thisMonthBookings || 0,
          totalRevenue: data.totalRevenue || 0,
          upcomingBookings: data.upcomingBookings || 0,
          recentBookings: data.recentBookings || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const goToBookings = () => {
    navigate('/admin/bookings');
  };

  const goToAddBooking = () => {
    navigate('/admin/add-booking');
  };

  const goToWebsite = () => {
    window.open('/', '_blank');
  };

  // Card click handlers for detailed views
  const handleCardClick = (cardType) => {
    switch(cardType) {
      case 'total':
        navigate('/admin/bookings');
        break;
      case 'revenue':
        navigate('/admin/bookings');
        break;
      case 'upcoming':
        navigate('/admin/bookings?filter=upcoming');
        break;
      case 'average':
        navigate('/admin/bookings');
        break;
      default:
        navigate('/admin/bookings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Catering Dashboard</h1>
            <div className="flex space-x-4">
              {/* UPDATED: Added Add Booking button */}
              <button
                onClick={goToAddBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Booking
              </button>
              <button
                onClick={goToBookings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                View All Bookings
              </button>
              <button
                onClick={goToWebsite}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Back to Website
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards - Now Clickable with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Bookings Card */}
          <div 
            onClick={() => handleCardClick('total')}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-sm text-green-600">
                  +{stats.thisMonthBookings} this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              Click to view all bookings →
            </div>
          </div>

          {/* Total Revenue Card */}
          <div 
            onClick={() => handleCardClick('revenue')}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">All time</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600 font-medium">
              Click to view revenue details →
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div 
            onClick={() => handleCardClick('upcoming')}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingBookings}</p>
                <p className="text-sm text-blue-600">Next 30 days</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-yellow-600 font-medium">
              Click to view upcoming events →
            </div>
          </div>

          {/* Average Booking Value Card */}
          <div 
            onClick={() => handleCardClick('average')}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
                </p>
                <p className="text-sm text-gray-600">Per event</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-600 font-medium">
              Click to view analytics →
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Catering Bookings</h2>
            <button
              onClick={goToBookings}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          
          {stats.recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🍽️</div>
              <p className="text-gray-500">No bookings yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Bookings will appear here once customers start booking catering events
              </p>
              {/* UPDATED: Added quick add booking button */}
              <button
                onClick={goToAddBooking}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Add First Booking
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {booking.eventType} • {new Date(booking.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.totalAmount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Quick Tips</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Click on any stat card above to view detailed information</li>
                  <li>Use "Add Booking" for phone orders during high traffic</li>
                  <li>Click on recent bookings to view full details</li>
                  <li>Use "View All Bookings" to manage all catering orders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;