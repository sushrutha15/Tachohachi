import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Navbar from './Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'https://miyatohibachi-backend-production.up.railway.app';
const SQUARE_APP_ID = process.env.REACT_APP_SQUARE_APP_ID || 'sq0idp-cz7uIE4--mRjwsMLq4Q2Mg';
const SQUARE_LOCATION_ID = process.env.REACT_APP_SQUARE_LOCATION_ID || 'LMW3PPMDK9JJ3';

const CateringPayment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');
  const [squareReady, setSquareReady] = useState(false);
  const cardRef = useRef(null);
  const squareCardRef = useRef(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('cateringBooking');
    if (!storedData) { navigate('/book-catering'); return; }
    try {
      setBookingData(JSON.parse(storedData));
    } catch {
      navigate('/book-catering');
      return;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Load Square Web Payments SDK
  useEffect(() => {
    if (!bookingData) return;

    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.onload = async () => {
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const card = await payments.card();
        await card.attach('#card-container');
        squareCardRef.current = card;
        setSquareReady(true);
      } catch (err) {
        console.error('Square init error:', err);
        setError('Payment form failed to load. Please refresh and try again.');
      }
    };
    script.onerror = () => setError('Failed to load payment SDK. Please refresh.');
    document.head.appendChild(script);

    return () => {
      if (squareCardRef.current) squareCardRef.current.destroy().catch(() => {});
    };
  }, [bookingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!squareCardRef.current || !squareReady) {
      setError('Payment form is not ready. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProcessingStep('Tokenizing card...');

    try {
      const result = await squareCardRef.current.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Card tokenization failed');
      }

      const sourceId = result.token;
      const customerEmail = bookingData.contactInfo?.email || bookingData.email;
      const customerName = bookingData.contactInfo?.name || `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim();
      const customerPhone = bookingData.contactInfo?.phone || bookingData.phone || '';
      const eventAddress = bookingData.contactInfo?.eventAddress || bookingData.eventAddress || '';
      const eventCity = bookingData.contactInfo?.city || bookingData.eventCity || '';
      const eventZip = bookingData.contactInfo?.zipCode || bookingData.eventZip || '';
      const eventType = bookingData.eventDetails?.eventType || bookingData.eventType || '';
      const eventDate = bookingData.eventDetails?.selectedDate || bookingData.eventDate || '';
      const eventTime = bookingData.eventDetails?.selectedTime || bookingData.eventTime || '';
      const guestCount = bookingData.eventDetails?.guestCount || bookingData.guestCount || 0;
      const specialRequests = bookingData.eventDetails?.specialRequests || bookingData.specialRequests || '';

      if (!customerEmail || !customerName) throw new Error('Customer email and name are required');

      setProcessingStep('Processing payment...');

      const paymentResponse = await fetch(`${API_URL}/api/create-catering-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          amount: 200,
          email: customerEmail,
          bookingData: {
            contactInfo: { name: customerName, email: customerEmail, phone: customerPhone, eventAddress, city: eventCity, zipCode: eventZip },
            eventDetails: { eventType, selectedDate: eventDate, selectedTime: eventTime, guestCount: parseInt(guestCount) || 0, specialRequests },
            selectedPackage: bookingData.selectedPackage || 'duo',
            pricing: bookingData.pricing || { total: 200, deposit: 200 }
          }
        }),
      });

      if (!paymentResponse.ok) {
        const err = await paymentResponse.json().catch(() => ({}));
        throw new Error(err.error || `Payment failed: ${paymentResponse.status}`);
      }

      const { paymentId } = await paymentResponse.json();
      if (!paymentId) throw new Error('No payment ID received');

      setProcessingStep('Saving booking...');

      const saveResponse = await fetch(`${API_URL}/api/save-catering-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData: {
            contactInfo: { name: customerName, email: customerEmail, phone: customerPhone, eventAddress, city: eventCity, zipCode: eventZip },
            eventDetails: { eventType, selectedDate: eventDate, selectedTime: eventTime, guestCount: parseInt(guestCount) || 0, specialRequests },
            selectedPackage: bookingData.selectedPackage || 'duo',
            pricing: bookingData.pricing || { total: 200, deposit: 200 }
          },
          paymentId,
          depositAmount: 200
        }),
      });

      if (!saveResponse.ok) {
        const err = await saveResponse.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save booking');
      }

      const saveResult = await saveResponse.json();
      if (!saveResult.success) throw new Error('Booking could not be saved. Please contact support.');

      setProcessingStep('Sending confirmation...');

      try {
        await fetch(`${API_URL}/api/send-catering-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: saveResult.bookingId,
            customerName, customerEmail, customerPhone,
            eventType, eventDate, eventTime, eventAddress,
            guestCount, selectedPackage: bookingData.selectedPackage || 'duo', paymentId
          }),
        });
      } catch (emailErr) {
        console.warn('Email error (non-fatal):', emailErr);
      }

      sessionStorage.setItem('cateringConfirmation', JSON.stringify({
        bookingId: saveResult.bookingId,
        paymentId,
        customerName, email: customerEmail, phone: customerPhone,
        eventType, eventDate, eventTime, eventAddress, eventCity,
        eventState: 'TX', eventZip, guestCount,
        selectedPackage: bookingData.selectedPackage || 'duo',
        pricing: bookingData.pricing || { total: 200 },
        timestamp: new Date().toISOString()
      }));

      setTimeout(() => navigate('/catering-confirmation'), 1500);

    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment failed: ${err.message}. Please try again or contact support.`);
      setProcessingStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-gray-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) return null;

  const formatDate = (d) => {
  const [year, month, day] = d.split('-');
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const formatTime = (t) => new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-44 pb-12">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Catering Booking</h1>
            <p className="text-xl text-gray-600">Secure your hibachi experience with a $200 deposit</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
              <div className="space-y-4 mb-6">
                {[
                  ['Event Type', bookingData.eventDetails?.eventType || bookingData.eventType],
                  ['Date', formatDate(bookingData.eventDetails?.selectedDate || bookingData.eventDate || '')],
                  ['Time', formatTime(bookingData.eventDetails?.selectedTime || bookingData.eventTime || '')],
                  ['Location', `${bookingData.contactInfo?.eventAddress || bookingData.eventAddress || 'N/A'}, ${bookingData.contactInfo?.city || bookingData.eventCity || 'N/A'}, TX`],
                  ['Guests', bookingData.eventDetails?.guestCount || bookingData.guestCount],
                  ['Package', bookingData.selectedPackage ? `${bookingData.selectedPackage.charAt(0).toUpperCase() + bookingData.selectedPackage.slice(1)}` : 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{label}:</span>
                    <span className="font-medium text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Event Cost:</span><span className="font-semibold">${bookingData.pricing?.total?.toLocaleString() || 'N/A'}</span></div>
                  <div className="flex justify-between text-green-600"><span>Deposit Today:</span><span className="font-semibold">$200.00</span></div>
                  <div className="flex justify-between text-gray-600"><span>Balance on Event Day:</span><span>${((bookingData.pricing?.total || 200) - 200).toLocaleString()}.00</span></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-sm text-gray-600">
                  {bookingData.contactInfo?.name || 'N/A'}<br />
                  {bookingData.contactInfo?.email || bookingData.email || 'N/A'}<br />
                  {bookingData.contactInfo?.phone || bookingData.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                  {/* Square card element mounts here */}
                  <div
                    id="card-container"
                    ref={cardRef}
                    className="p-4 border border-gray-300 rounded-lg min-h-[60px]"
                    style={{ minHeight: '60px' }}
                  ></div>
                  {!squareReady && (
                    <p className="text-sm text-gray-500 mt-2">Loading secure payment form...</p>
                  )}
                </div>

                {isProcessing && processingStep && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Processing Your Booking</p>
                      <p className="text-sm text-blue-700">{processingStep}</p>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                  <p className="font-medium text-green-800 mb-1">After payment you'll receive:</p>
                  <p>✅ Instant email confirmation</p>
                  <p>📅 Google Calendar invitation</p>
                  <p>🔔 Event day reminders</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-700">Your payment is encrypted and secure via Square. We never store your card details.</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800">Payment Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!squareReady || isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                    !squareReady || isProcessing
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {processingStep || 'Processing...'}
                    </span>
                  ) : 'Pay $200 Deposit & Book Chef'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By completing this payment, you agree to our terms. The remaining balance is due on the day of your event.
                </p>
              </form>
            </div>
          </div>

          <div className="text-center mt-8">
            <button onClick={() => navigate('/book-catering')} className="text-gray-600 hover:text-gray-900 font-medium">
              ← Back to Booking Form
            </button>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Questions about your booking?</h4>
            <p className="text-gray-600 text-sm">
              Call or text <a href="tel:+19725891422" className="text-orange-500 hover:text-orange-700 font-medium">(972) 589-1422</a> or
              email <a href="mailto:salinaseduardo275@gmail.com" className="text-orange-500 hover:text-orange-700 font-medium">salinaseduardo275@gmail.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CateringPayment;