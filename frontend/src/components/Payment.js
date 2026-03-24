// Fixed Payment.js with enhanced error handling and debugging
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import Navbar from './Navbar';
import { useCart } from '../hooks/Redux';

// Initialize Stripe with your working publishable key
const stripePromise = loadStripe('pk_test_51RXEPZRXCr9rwdbsr5vUe4EPdfQ9O0SjOn2SQzHjfxcZB9ilKNG4y57AWsJafPbDk9IfTT2VpHqVsqCXeR4Jdzzj00DCq6oiGF');

const Payment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentState, setPaymentState] = useState('loading');
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const initializePayment = async () => {
      try {
        console.log('💳 Initializing payment...');
        
        // Get cart data from checkout
        const storedCart = sessionStorage.getItem("cart");
        const storedCustomerInfo = sessionStorage.getItem("customerInfo");
        const storedCartTotal = sessionStorage.getItem("cartTotal");
        const storedFinalTotal = sessionStorage.getItem("finalTotal");
        const storedPaymentData = sessionStorage.getItem("paymentData");

        console.log('📦 Checking stored data:');
        console.log('- cart exists:', !!storedCart);
        console.log('- customerInfo exists:', !!storedCustomerInfo);
        console.log('- cartTotal exists:', !!storedCartTotal);
        console.log('- finalTotal exists:', !!storedFinalTotal);

        if (!storedCart || !storedCustomerInfo) {
          console.log('❌ Missing required data, redirecting to cart');
          navigate('/cart');
          return;
        }

        const cartData = JSON.parse(storedCart);
        const customerInfo = JSON.parse(storedCustomerInfo);
        let finalTotal;

        // Try to get total from different sources
        if (storedPaymentData) {
          const paymentDataParsed = JSON.parse(storedPaymentData);
          finalTotal = paymentDataParsed.totals?.total || parseFloat(storedFinalTotal || "0");
        } else {
          const cartTotal = parseFloat(storedCartTotal || "0");
          const tax = cartTotal * 0.08;
          const deliveryFee = cartTotal > 25 ? 0 : 3.99;
          finalTotal = cartTotal + tax + deliveryFee;
        }

        console.log('💰 Payment details:');
        console.log('- cart items:', cartData.length);
        console.log('- customer:', customerInfo.name);
        console.log('- final total:', finalTotal);

        if (!customerInfo.email || finalTotal <= 0) {
          throw new Error('Invalid payment data: missing email or invalid total');
        }

        // Create payment intent
        console.log('🔄 Creating payment intent...');
        const response = await fetch('https://miyatohibachi-backend-production.up.railway.app/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            email: customerInfo.email,
            orderType: 'food_delivery'
          }),
        });

        console.log('🌐 API Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('📄 API Response data:', data);

        if (!data.clientSecret) {
          throw new Error('No client secret received from server');
        }

        if (isMounted) {
          setClientSecret(data.clientSecret);
          setPaymentData({
            cartData,
            customerInfo,
            finalTotal
          });
          setPaymentState('ready');
          console.log('✅ Payment initialization complete');
        }

      } catch (error) {
        console.error('❌ Payment initialization error:', error);
        if (isMounted) {
          setErrorMessage(error.message);
          setPaymentState('error');
        }
      }
    };

    initializePayment();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Loading state
  if (paymentState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up secure payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (paymentState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Setup Failed</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                Back to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment ready
  if (paymentState === 'ready' && clientSecret && paymentData) {
    return (
      <PaymentPage
        clientSecret={clientSecret}
        paymentData={paymentData}
        onSuccess={() => {
          clearCart();
          navigate('/confirmation');
        }}
      />
    );
  }

  return null;
};

// Main payment page component
const PaymentPage = React.memo(({ clientSecret, paymentData, onSuccess }) => {
  const options = React.useMemo(() => ({
    clientSecret: clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '6px',
        borderRadius: '12px',
      },
      rules: {
        '.Input': {
          borderRadius: '8px',
          border: '1px solid #e6e6e6',
          boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03)',
          padding: '12px',
        },
        '.Input:focus': {
          border: '1px solid #0570de',
          boxShadow: '0 0 0 2px rgba(5, 112, 222, 0.2)',
        },
        '.Label': {
          fontWeight: '500',
          fontSize: '14px',
          marginBottom: '6px',
        }
      }
    }
  }), [clientSecret]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Secure checkout powered by Stripe</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
                
                <Elements stripe={stripePromise} options={options}>
                  <PaymentForm paymentData={paymentData} onSuccess={onSuccess} />
                </Elements>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary paymentData={paymentData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Payment form component
const PaymentForm = ({ paymentData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('🛒 Starting payment submission...');
    console.log('Stripe loaded:', !!stripe);
    console.log('Elements loaded:', !!elements);
    console.log('Payment data:', paymentData);

    if (!stripe || !elements) {
      const errorMsg = 'Payment system not ready. Please wait...';
      console.error('❌', errorMsg);
      setMessage(errorMsg);
      return;
    }

    if (!paymentData || !paymentData.customerInfo || !paymentData.finalTotal) {
      const errorMsg = 'Payment data is missing. Please try again.';
      console.error('❌', errorMsg);
      setMessage(errorMsg);
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      console.log('💳 Confirming payment...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          receipt_email: paymentData.customerInfo.email,
          return_url: `${window.location.origin}/confirmation`,
        }
      });

      if (error) {
        console.error('💳 Stripe payment error:', error);
        console.error('Error type:', error.type);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Provide user-friendly error messages
        let userMessage = error.message;
        if (error.type === 'card_error') {
          userMessage = `Card error: ${error.message}`;
        } else if (error.type === 'validation_error') {
          userMessage = 'Please check your card details and try again.';
        } else if (error.code === 'payment_intent_authentication_failure') {
          userMessage = 'Card authentication failed. Please try a different card.';
        }
        
        setMessage(userMessage);
        setIsProcessing(false);
        return;
      }

      if (!paymentIntent) {
        console.error('❌ No payment intent returned');
        setMessage('Payment failed. No response from payment processor.');
        setIsProcessing(false);
        return;
      }

      console.log('💳 Payment intent status:', paymentIntent.status);

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful:', paymentIntent.id);
        setPaymentSuccess(true);
        
        try {
          // Save order to backend
          await saveOrder(paymentIntent);
          
          // Show success animation then redirect
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } catch (saveError) {
          console.error('❌ Error saving order:', saveError);
          // Still redirect to confirmation even if save fails
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        console.error('❌ Payment not succeeded. Status:', paymentIntent.status);
        setMessage(`Payment status: ${paymentIntent.status}. Please try again.`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('💳 Payment exception:', error);
      console.error('Exception details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setMessage('Payment failed due to an unexpected error. Please try again.');
      setIsProcessing(false);
    }
  };

  const saveOrder = async (paymentIntent) => {
    try {
      console.log('💾 Saving order to database...');
      
      const orderData = {
        customerName: paymentData.customerInfo.name,
        customerEmail: paymentData.customerInfo.email,
        customerPhone: paymentData.customerInfo.phone || 'N/A',
        customerAddress: paymentData.customerInfo.address || 'N/A',
        customerCity: paymentData.customerInfo.city || 'N/A',
        customerZip: paymentData.customerInfo.zipCode || 'N/A',
        items: paymentData.cartData || [],
        total: paymentData.finalTotal,
        paymentIntentId: paymentIntent.id,
        specialInstructions: paymentData.customerInfo.specialInstructions || ''
      };

      console.log('📦 Order data to save:', orderData);

      const response = await fetch('https://miyatohibachi-backend-production.up.railway.app/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      console.log('🌐 Save order response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Save order error:', errorText);
        throw new Error(`Failed to save order: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Order saved successfully:', result);
      
      // Save to session for confirmation page
      sessionStorage.setItem("orderId", result.orderId);
      sessionStorage.setItem("confirmedOrderData", JSON.stringify(paymentData.cartData));
      sessionStorage.setItem("totalAmount", paymentData.finalTotal.toFixed(2));
      sessionStorage.setItem("customerName", paymentData.customerInfo.name);
      sessionStorage.setItem("customerEmail", paymentData.customerInfo.email);
      sessionStorage.setItem("customerPhone", paymentData.customerInfo.phone || 'N/A');
      sessionStorage.setItem("transactionTime", new Date().toLocaleString());
      
      console.log('✅ Order data saved to session storage');
    } catch (error) {
      console.error('❌ Error in saveOrder:', error);
      throw error;
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4 animate-bounce">✅</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Thank you for your order!</p>
        <div className="animate-pulse text-sm text-gray-500">
          Redirecting to confirmation...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Customer Info Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Billing Information</h3>
        <p className="text-sm text-gray-600">
          {paymentData.customerInfo.name} • {paymentData.customerInfo.email}
        </p>
        <p className="text-sm text-gray-600">
          {paymentData.customerInfo.address}, {paymentData.customerInfo.city} {paymentData.customerInfo.zipCode}
        </p>
      </div>

      {/* Payment Element */}
      <div className="mb-6">
        <PaymentElement />
      </div>

      {/* Error Message */}
      {message && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center">
            <span className="mr-2">⚠️</span>
            {message}
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="text-blue-600 text-xl mr-3">🔒</span>
          <div>
            <p className="text-sm font-medium text-blue-900">Secure Payment</p>
            <p className="text-xs text-blue-700">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          !stripe || isProcessing
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ${paymentData.finalTotal.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

// Order Summary Component
const OrderSummary = ({ paymentData }) => {
  const cartData = paymentData.cartData || [];
  const finalTotal = paymentData.finalTotal || 0;
  
  // Calculate breakdown
  const subtotal = cartData.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 25 ? 0 : 3.99;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items */}
      <div className="space-y-3 mb-6">
        {cartData.map((item, index) => {
          const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
          return (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-sm">
                ${(price * item.quantity).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span>{deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-green-600">🚚</span>
          <span className="font-medium text-green-900">Estimated Delivery</span>
        </div>
        <p className="text-sm text-green-700">30-45 minutes</p>
      </div>
    </div>
  );
};

export default Payment;