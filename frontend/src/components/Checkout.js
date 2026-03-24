import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import { useCart } from "../hooks/Redux";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    totalQuantity: cartCount,
    totalAmount: cartTotal,
    addToCart,
    removeFromCart,
    clearCart
  } = useCart();

  const [toastMessage, setToastMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    specialInstructions: ""
  });

  const showToast = (message, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const updateQuantity = (item, delta) => {
    if (delta > 0) {
      addToCart(item);
    } else {
      removeFromCart(item.name);
    }
  };

  const removeItem = (itemName) => {
    removeFromCart(itemName);
    showToast("Item removed from cart");
  };

  const proceedToPayment = () => {
    console.log('🛒 Checkout: Starting payment process...');
    console.log('Cart items:', cartItems);
    console.log('Customer info:', customerInfo);
    
    if (!cartItems.length) {
      showToast("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Validate customer information
    const requiredFields = ['name', 'phone', 'email', 'address'];
    const missingFields = requiredFields.filter(field => !customerInfo[field].trim());
    
    if (missingFields.length > 0) {
      showToast(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      showToast("Please enter a valid email address.");
      return;
    }

    try {
      // Calculate totals
      const subtotal = cartTotal;
      const tax = subtotal * 0.08;
      const deliveryFee = subtotal > 25 ? 0 : 3.99;
      const total = subtotal + tax + deliveryFee;

      // Prepare cart data for payment (ensure proper format)
      const cartForPayment = cartItems.map(item => ({
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
        quantity: item.quantity,
        image: item.image || '',
        category: item.category || '',
        type: item.type || ''
      }));

      // Save data in consistent format
      const paymentData = {
        cart: cartForPayment,
        customerInfo: customerInfo,
        totals: {
          subtotal: subtotal,
          tax: tax,
          deliveryFee: deliveryFee,
          total: total
        }
      };

      console.log('💾 Saving payment data:', paymentData);

      // Save to sessionStorage
      sessionStorage.setItem("cart", JSON.stringify(cartForPayment));
      sessionStorage.setItem("customerInfo", JSON.stringify(customerInfo));
      sessionStorage.setItem("cartTotal", subtotal.toString());
      sessionStorage.setItem("finalTotal", total.toString());
      sessionStorage.setItem("paymentData", JSON.stringify(paymentData));
      
      console.log('✅ Data saved to sessionStorage');
      console.log('🚀 Navigating to payment page...');
      
      navigate("/payment");
      
    } catch (error) {
      console.error('❌ Error in proceedToPayment:', error);
      showToast("Error preparing payment. Please try again.");
    }
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 25 ? 0 : 3.99;
  const total = subtotal + tax + deliveryFee;

  // Empty cart state
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-6xl">🛒</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-xl text-gray-600 mb-8">Please add items to your cart before checkout.</p>
              <button 
                onClick={() => navigate("/menu")}
                className="bg-[#F56F27] hover:bg-[#e55a1f] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-lg text-gray-600">Review your order and complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Customer Information Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="Irving"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={customerInfo.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="75001"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                    <textarea
                      name="specialInstructions"
                      value={customerInfo.specialInstructions}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F56F27] focus:border-transparent"
                      placeholder="Any special delivery instructions or preferences..."
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Your Order</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={index} className="py-6 flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                            e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 12px; font-weight: bold;">🍛</div>';
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                        >
                          −
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeItem(item.name)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 25 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ${(25 - subtotal).toFixed(2)} more for free delivery!
                    </p>
                  </div>
                )}

                <button
                  onClick={proceedToPayment}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 mb-4"
                >
                  Proceed to Payment
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors duration-200"
                >
                  Back to Cart
                </button>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600">🚚</span>
                    <span className="font-medium text-green-900">Estimated Delivery</span>
                  </div>
                  <p className="text-sm text-green-700">30-45 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      <footer className="py-8 bg-gray-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p>&copy; 2025 The Curry Crate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;