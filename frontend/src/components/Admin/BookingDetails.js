import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`https://miyatohibachi-backend-production.up.railway.app/api/admin/bookings/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            ← Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking {booking.bookingNumber}
              </h1>
              <p className="text-gray-600">
                Created {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              ← Back to Bookings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{booking.customerName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">
                  <a href={`mailto:${booking.customerEmail}`} className="text-blue-600 hover:text-blue-700">
                    {booking.customerEmail}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">
                  <a href={`tel:${booking.customerPhone}`} className="text-blue-600 hover:text-blue-700">
                    {booking.customerPhone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <p className="mt-1 text-gray-900">{booking.eventType}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="mt-1 text-gray-900">
                  {new Date(booking.eventDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <p className="mt-1 text-gray-900">{booking.eventTime}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Guests</label>
                <p className="mt-1 text-gray-900">{booking.guestCount} people</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Package</label>
                <p className="mt-1 text-gray-900 capitalize">{booking.packageType} Package</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Location</h3>
            <p className="text-gray-900">{booking.eventAddress}</p>
            {booking.eventCity && (
              <p className="text-gray-600 mt-1">{booking.eventCity}, {booking.eventZipCode}</p>
            )}
          </div>

          {/* Package & Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package & Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span>${booking.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Person:</span>
                <span>${booking.pricePerPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid:</span>
                <span className="text-green-600">${booking.depositAmount}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>${booking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Balance Due:</span>
                  <span>${booking.totalAmount - booking.depositAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                <p className="mt-1 text-gray-900">{booking.specialRequests || 'None'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <p className="mt-1 text-gray-900 capitalize">{booking.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chef Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Chef Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Arrival Time:</strong> 2 hours before event ({new Date(new Date(`${booking.eventDate}T${booking.eventTime}`) - 2*60*60*1000).toLocaleTimeString()})</p>
              <p><strong>Setup Duration:</strong> 1.5 hours</p>
              <p><strong>Service Duration:</strong> 3-4 hours</p>
            </div>
            <div>
              <p><strong>Guest Count:</strong> {booking.guestCount} people</p>
              <p><strong>Package:</strong> {booking.packageType} menu</p>
              <p><strong>Contact:</strong> {booking.customerPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;