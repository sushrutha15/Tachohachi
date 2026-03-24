// Complete Confirmation.js with Duplicate Email Prevention - Replace your entire Confirmation.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const Confirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [totals, setTotals] = useState({});
  const [emailStatus, setEmailStatus] = useState('sending');
  
  // Use ref to prevent double execution in React Strict Mode
  const emailSentRef = useRef(false);

  useEffect(() => {
    // Check if order data exists
    const confirmedOrderData = sessionStorage.getItem("confirmedOrderData");
    const orderId = sessionStorage.getItem("orderId");

    if (!confirmedOrderData || !orderId) {
      alert("Your session has expired. Redirecting to home.");
      navigate('/');
      return;
    }

    // Parse order data
    const parsedOrderData = JSON.parse(confirmedOrderData) || [];
    const totalAmount = parseFloat(sessionStorage.getItem("totalAmount") || "0");

    // Get customer info
    const customerName = sessionStorage.getItem("customerName") || 'N/A';
    const customerPhone = sessionStorage.getItem("customerPhone") || 'N/A';
    const customerEmail = sessionStorage.getItem("customerEmail") || 'N/A';
    const transactionTime = sessionStorage.getItem("transactionTime") || new Date().toLocaleString();

    // Calculate totals
    let subtotal = 0;
    parsedOrderData.forEach(item => {
      let price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : parseFloat(item.price || 0);
      subtotal += price * item.quantity;
    });

    const tax = subtotal * 0.08;
    const deliveryFee = subtotal > 25 ? 0 : 3.99;
    const final = subtotal + tax + deliveryFee;

    // Set state
    setOrderData(parsedOrderData);
    setCustomerInfo({
      name: customerName,
      phone: customerPhone,
      email: customerEmail
    });
    setPaymentInfo({
      orderId: orderId,
      transactionTime: transactionTime
    });
    setTotals({
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      final: final.toFixed(2)
    });

    // Send email confirmation (with strict duplicate prevention)
    if (customerEmail && customerEmail !== 'N/A' && !emailSentRef.current) {
      emailSentRef.current = true; // Immediately mark as sending
      sendEmailConfirmation(customerEmail, customerName, orderId, parsedOrderData, final, transactionTime);
    } else if (emailSentRef.current) {
      console.log('🔒 Email already being sent - prevented by useRef');
      setEmailStatus('sent');
    } else {
      setEmailStatus('failed');
    }

  }, [navigate]);

  const sendEmailConfirmation = async (email, name, orderId, items, total, orderTime) => {
    try {
      console.log('📧 Sending email confirmation (useRef protected)...');
      setEmailStatus('sending');
      
      // Email content
      const emailContent = {
        to: email,
        customerName: name,
        orderId: orderId,
        items: items,
        total: total,
        orderTime: orderTime
      };

      console.log('📧 Sending email to:', email);

      const response = await fetch('https://miyatohibachi-backend-production.up.railway.app/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailContent)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email sent successfully:', result);
        
        // Check if it was a duplicate from backend
        if (result.duplicate) {
          console.log('🔒 Backend prevented duplicate email');
        }
        
        setEmailStatus('sent');
        console.log('🔒 Email process completed for order:', orderId);
      } else {
        console.error('❌ Email failed to send - HTTP status:', response.status);
        setEmailStatus('failed');
        emailSentRef.current = false; // Reset on failure so they can retry
      }
    } catch (error) {
      console.error('❌ Email error:', error);
      setEmailStatus('failed');
      emailSentRef.current = false; // Reset on failure so they can retry
    }
  };

  const handleGoHome = () => {
    // Clear session data
    sessionStorage.removeItem("confirmedOrderData");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("totalAmount");
    sessionStorage.removeItem("customerName");
    sessionStorage.removeItem("customerEmail");
    sessionStorage.removeItem("customerPhone");
    sessionStorage.removeItem("transactionTime");
    
    // Reset email ref
    emailSentRef.current = false;
    
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    if (!customerInfo.email || customerInfo.email === 'N/A') {
      alert('No email address available to resend to.');
      return;
    }

    // Reset the ref to allow resending
    emailSentRef.current = false;
    
    // Resend email
    emailSentRef.current = true;
    await sendEmailConfirmation(
      customerInfo.email, 
      customerInfo.name, 
      paymentInfo.orderId, 
      orderData, 
      parseFloat(totals.final), 
      paymentInfo.transactionTime
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-lg text-gray-700">
            Thank you for choosing The Curry Crate!
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-sm text-green-600 font-medium mb-1">Your Order ID</p>
          <p className="text-3xl font-bold text-green-800 mb-2">{paymentInfo.orderId}</p>
          <p className="text-sm text-gray-600">Keep this for your records</p>
        </div>

        {/* Email Confirmation Status */}
        <div className={`border rounded-lg p-4 mb-6 ${
          emailStatus === 'sent' ? 'bg-green-50 border-green-200' :
          emailStatus === 'failed' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {emailStatus === 'sent' ? '✅' : 
                 emailStatus === 'failed' ? '❌' : 
                 '📧'}
              </span>
              <div>
                <p className={`font-semibold ${
                  emailStatus === 'sent' ? 'text-green-800' :
                  emailStatus === 'failed' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {emailStatus === 'sent' ? 'Confirmation Email Sent!' :
                   emailStatus === 'failed' ? 'Email Notification Failed' :
                   'Sending Confirmation Email...'}
                </p>
                <p className={`text-sm ${
                  emailStatus === 'sent' ? 'text-green-600' :
                  emailStatus === 'failed' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {emailStatus === 'sent' ? `Order details and invoice sent to ${customerInfo.email}` :
                   emailStatus === 'failed' ? 'Please save this page for your records' :
                   `Sending to ${customerInfo.email}...`}
                </p>
              </div>
            </div>
            
            {/* Resend Email Button */}
            {emailStatus === 'failed' && (
              <button
                onClick={handleResendEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Resend Email
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3 mb-4">
              {orderData.map((item, index) => {
                let price = typeof item.price === 'string' 
                  ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                  : parseFloat(item.price || 0);
                
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 text-sm ml-2">× {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-300 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>${totals.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8%):</span>
                <span>${totals.tax}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee:</span>
                <span>{parseFloat(totals.deliveryFee) === 0 ? 'FREE' : `$${totals.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-2">
                <span>Total Paid:</span>
                <span className="text-green-600">${totals.final}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h3>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <p><strong>Customer:</strong> {customerInfo.name}</p>
            <p><strong>Email:</strong> {customerInfo.email}</p>
            <p><strong>Phone:</strong> {customerInfo.phone}</p>
            <p><strong>Order Time:</strong> {paymentInfo.transactionTime}</p>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🚚</span>
            <h4 className="font-semibold text-yellow-800">Delivery Status</h4>
          </div>
          <div className="space-y-1 text-yellow-700 text-sm">
            <p><strong>Status:</strong> Order confirmed - Kitchen is preparing your food</p>
            <p><strong>Estimated Delivery:</strong> 30-45 minutes</p>
            <p><strong>Tracking:</strong> You'll receive SMS updates as your order progresses</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleGoHome}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105"
          >
            <span className="mr-2">🏠</span>
            Continue Shopping
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 flex items-center justify-center"
          >
            <span className="mr-2">🖨️</span>
            Print Receipt
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-2">Need Help? 📞</h4>
            <p className="text-gray-600 text-sm">
              Questions about your order? Contact us at{' '}
              <span className="font-medium text-blue-600">support@thecurrycrate.com</span> or{' '}
              <span className="font-medium text-blue-600">(555) 123-CURRY</span>
            </p>
          </div>
        </div>

        {/* Debug Info (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Debug Info (Dev Only):</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Order ID:</strong> {paymentInfo.orderId}</p>
              <p><strong>Email Status:</strong> {emailStatus}</p>
              <p><strong>Email Ref:</strong> {emailSentRef.current ? 'Sent' : 'Not Sent'}</p>
              <p><strong>Customer Email:</strong> {customerInfo.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;