
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router'; 

const BookingsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status === 'all' ? '' : filters.status,
        search: filters.search
      });
      
      console.log('Fetching bookings with params:', params.toString());
      
      const response = await fetch(`https://miyatohibachi-backend-production.up.railway.app/api/admin/bookings?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Bookings received:', data);
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`https://miyatohibachi-backend-production.up.railway.app/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchBookings(); // Refresh list
        console.log('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">All Catering Bookings</h1>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="text"
              placeholder="Search customers, booking IDs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 flex-1 max-w-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={fetchBookings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {filters.status !== 'all' || filters.search ? 
                  'No bookings match your current filters.' : 
                  'No catering bookings have been made yet.'}
              </p>
              {(filters.status !== 'all' || filters.search) && (
                <button
                  onClick={() => {
                    setFilters({ status: 'all', search: '' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.bookingNumber || booking._id.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerPhone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.eventType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.guestCount} guests
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {booking.selectedPackage || booking.packageType || 'Premium'} package
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.eventTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${booking.totalAmount || booking.pricing?.total || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Deposit: ${booking.depositAmount || '200'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status || 'confirmed')}`}>
                          {booking.status || 'confirmed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                        <div>
                          <button
                            onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                        <div>
                          <select
                            value={booking.status || 'confirmed'}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {bookings.length > 0 && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Showing {bookings.length} bookings</span>
              <span>
                Total Revenue: ${bookings.reduce((sum, booking) => sum + (booking.totalAmount || booking.pricing?.total || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsView;