import React from 'react';
import { Link } from 'react-router';
import Navbar from './Navbar';
import { useCart } from '../hooks/Redux';

const Cart = () => {
  const {
    items: cartItems,
    totalQuantity: cartCount,
    totalAmount: cartTotal,
    addToCart,
    removeFromCart,
    clearCart
  } = useCart();

  const isEmpty = cartItems.length === 0;

  // Calculate totals
  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6"> {/* Increased max width */}
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Cart</h1> {/* Larger heading */}
            <p className="text-xl text-gray-600"> {/* Larger text */}
              {isEmpty ? 'Your cart is empty' : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>

          {isEmpty ? (
            /* Empty Cart State */
            <div className="text-center py-20"> {/* More padding */}
              <div className="w-40 h-40 mx-auto mb-10 bg-gray-200 rounded-full flex items-center justify-center"> {/* Larger empty state icon */}
                <span className="text-7xl">🛒</span> {/* Larger emoji */}
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your cart is empty</h2> {/* Larger text */}
              <p className="text-xl text-gray-600 mb-10"> {/* Larger text */}
                Looks like you haven't added any delicious items to your cart yet.
              </p>
              <Link 
                to="/menu"
                className="bg-[#F56F27] hover:bg-[#e55a1f] text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105" // Larger button
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12"> {/* Larger gap, changed breakpoint */}
              
              {/* Cart Items List */}
              <div className="xl:col-span-2"> {/* Takes 2/3 of the width */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden"> {/* Larger border radius */}
                  <div className="p-8 border-b border-gray-200"> {/* More padding */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gray-900">Order Items</h2> {/* Larger heading */}
                      <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 text-base font-medium transition-colors duration-200" // Larger text
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item, index) => (
                      <div key={index} className="p-8 flex items-center space-x-6"> {/* More padding and spacing */}
                        
                        {/* Item Image */}
                        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0"> {/* Larger image */}
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                              e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 20px; font-weight: bold;">🍛</div>';
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3> {/* Larger text */}
                          <p className="text-gray-600 text-base mb-3">{item.description}</p> {/* Larger text */}
                          <div className="flex items-center space-x-3"> {/* More spacing */}
                            <span className={`w-4 h-4 rounded-full ${
                              item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                            {item.spicy && <span className="text-red-500 text-lg">🌶️</span>}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4"> {/* More spacing */}
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center font-bold transition-colors duration-200" // Larger buttons
                          >
                            −
                          </button>
                          <span className="font-semibold text-xl w-10 text-center">{item.quantity}</span> {/* Larger text */}
                          <button
                            onClick={() => addToCart(item)}
                            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center font-bold transition-colors duration-200" // Larger buttons
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-semibold text-gray-900"> {/* Larger text */}
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-base text-gray-500"> {/* Larger text */}
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32"> {/* More padding, larger border radius */}
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">Order Summary</h2> {/* Larger heading and spacing */}
                  
                  <div className="space-y-6 mb-8"> {/* More spacing */}
                    <div className="flex justify-between">
                      <span className="text-lg text-gray-600">Subtotal ({cartCount} items)</span> {/* Larger text */}
                      <span className="font-medium text-lg">${subtotal.toFixed(2)}</span> {/* Larger text */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg text-gray-600">Tax (8%)</span> {/* Larger text */}
                      <span className="font-medium text-lg">${tax.toFixed(2)}</span> {/* Larger text */}
                    </div>
                    <div className="border-t border-gray-200 pt-6"> {/* More padding */}
                      <div className="flex justify-between">
                        <span className="text-xl font-semibold text-gray-900">Total</span> {/* Larger text */}
                        <span className="text-xl font-bold text-green-600">${finalTotal.toFixed(2)}</span> {/* Larger text */}
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 text-center block mb-4" // Larger button
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    to="/menu"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-xl font-medium text-lg transition-colors duration-200 text-center block" // Larger button
                  >
                    Continue Shopping
                  </Link>

                  {/* Delivery Info */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl"> {/* More padding and larger border radius */}
                    <div className="flex items-center space-x-3 mb-3"> {/* More spacing */}
                      <span className="text-blue-600 text-xl">🚚</span> {/* Larger emoji */}
                      <span className="font-medium text-blue-900 text-lg">Free Delivery</span> {/* Larger text */}
                    </div>
                    <p className="text-base text-blue-700"> {/* Larger text */}
                      Orders over $25 qualify for free delivery. Estimated time: 30-45 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="py-10 bg-gray-900 text-white text-center"> {/* More padding */}
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-lg">&copy; 2025 The Curry Crate. All rights reserved.</p> {/* Larger text */}
        </div>
      </footer>
    </div>
  );
};

export default Cart;