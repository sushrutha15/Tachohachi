import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import Navbar from './Navbar';

const CateringConfirmation = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState(null);
  const [emailStatus, setEmailStatus] = useState('sending');
  const [calendarStatus, setCalendarStatus] = useState('creating');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem('cateringConfirmation');
    if (!storedData) {
      navigate('/book-catering');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setConfirmationData(data);
      setTimeout(() => setEmailStatus('sent'), 2000);
      setTimeout(() => setCalendarStatus('created'), 3000);
    } catch (error) {
      console.error('Error parsing confirmation data:', error);
      navigate('/book-catering');
      return;
    } finally {
      setLoading(false);
    }

    sessionStorage.removeItem('cateringBooking');
  }, [navigate]);

  if (loading || !confirmationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-gray-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

    const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };  

  const formatTime = (timeString) => new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  const StatusIndicator = ({ status, successText, loadingText }) => {
    if (status === 'sent' || status === 'created') {
      return (
        <div className="flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {successText}
        </div>
      );
    }
    return (
      <div className="flex items-center text-blue-600">
        <svg className="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {loadingText}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-44 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600">Your hibachi catering event has been successfully booked</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider">{confirmationData.bookingId}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Event Type:</span>
                  <span className="text-gray-900 font-semibold">{confirmationData.eventType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-900 font-semibold">{formatDate(confirmationData.eventDate)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-gray-900 font-semibold">{formatTime(confirmationData.eventTime)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Guests:</span>
                  <span className="text-gray-900 font-semibold">{confirmationData.guestCount}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Package:</span>
                  <span className="text-gray-900 font-semibold capitalize">{confirmationData.selectedPackage} Package</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="text-gray-900 font-semibold text-right">
                    {confirmationData.eventAddress}<br />
                    {confirmationData.eventCity}, {confirmationData.eventState} {confirmationData.eventZip}
                  </span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Event Cost:</span>
                    <span className="font-semibold text-gray-900">${confirmationData.pricing?.total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Deposit Paid:</span>
                    <span className="font-semibold">$200.00 ✅</span>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-2 border-t border-green-200">
                    <span>Balance Due on Event Day:</span>
                    <span className="font-semibold">${((confirmationData.pricing?.total || 200) - 200).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps & Status */}
            <div className="space-y-8">
              
              {/* Email & Calendar Status */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Confirmation Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Confirmation</p>
                      <p className="text-sm text-gray-600">Sent to {confirmationData.email}</p>
                    </div>
                    <StatusIndicator status={emailStatus} successText="Sent ✅" loadingText="Sending..." />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Calendar Invite</p>
                      <p className="text-sm text-gray-600">Google Calendar event</p>
                    </div>
                    <StatusIndicator status={calendarStatus} successText="Created ✅" loadingText="Creating..." />
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next</h3>
                <div className="space-y-6">
                  {[
                    { num: '1', color: 'blue', title: 'Check Your Email', desc: "You'll receive a detailed confirmation email with all event information and our contact details." },
                    { num: '2', color: 'blue', title: 'Pre-Event Call', desc: 'Eduardo will contact you 48 hours before your event to confirm final details and guest count.' },
                    { num: '3', color: 'blue', title: 'Chef Arrival', desc: 'Your chef will arrive early for setup and will call upon arrival to coordinate.' },
                    { num: '4', color: 'green', title: 'Live Hibachi Experience', desc: 'Enjoy the spectacular live hibachi cooking show with premium proteins cooked fresh on-site!' },
                  ].map(({ num, color, title, desc }) => (
                    <div key={num} className="flex items-start">
                      <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <span className={`text-${color}-600 font-bold text-sm`}>{num}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">{title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Reminders */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Important Reminders</h3>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li>• Final guest count must be confirmed 24 hours before your event</li>
                  <li>• Please ensure there is adequate outdoor or indoor space for the hibachi grill setup</li>
                  <li>• Remaining balance of ${((confirmationData.pricing?.total || 200) - 200).toLocaleString()} due on event day</li>
                  <li>• Cancellation requires 48+ hours notice for deposit refund</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-900 text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(972) 589-1422</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>salinaseduardo275@gmail.com</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-4">
                    Reference your booking ID: <span className="font-mono font-bold">{confirmationData.bookingId}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Print Confirmation
              </button>
              <Link
                to="/"
                className="bg-[#FF7E21] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Return to Home
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              Thank you for choosing Miyato Hibachi Dallas for your special event!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CateringConfirmation;