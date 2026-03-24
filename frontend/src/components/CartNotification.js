// components/CartNotification.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CartNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [prevQuantity, setPrevQuantity] = useState(0);

  // Show notification when cart changes
  useEffect(() => {
    // Only show notification if quantity increased (item added)
    if (totalQuantity > prevQuantity && cartItems.length > 0) {
      const lastItem = cartItems[cartItems.length - 1];
      if (lastItem) {
        setNotification({
          show: true,
          message: `${lastItem.name} added to cart!`,
          type: 'success'
        });
        
        const timer = setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        
        // Update previous quantity
        setPrevQuantity(totalQuantity);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Update previous quantity for next comparison
      setPrevQuantity(totalQuantity);
    }
  }, [totalQuantity, cartItems, prevQuantity]);

  if (!notification.show) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 transform transition-all duration-300 animate-bounce">
      <div className={`${getNotificationColor(notification.type)} text-white px-6 py-3 rounded-lg shadow-lg`}>
        <div className="flex items-center">
          <span className="text-xl mr-2">{getNotificationIcon(notification.type)}</span>
          <span className="font-semibold">{notification.message}</span>
          <button
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;