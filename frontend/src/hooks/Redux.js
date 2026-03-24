// Clean Redux.js - Replace your hooks/Redux.js with this

import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart as addToCartAction, 
  removeFromCart as removeFromCartAction,
  deleteItem as deleteItemAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction
} from '../store/CartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addToCart = (item) => {
    console.log('Adding to cart:', item); // Keep this one for debugging
    dispatch(addToCartAction(item));
  };

  const removeFromCart = (itemName) => {
    console.log('Removing from cart:', itemName); // Keep this one for debugging
    dispatch(removeFromCartAction(itemName));
  };

  const deleteItem = (itemName) => {
    dispatch(deleteItemAction(itemName));
  };

  const updateQuantity = (itemName, quantity) => {
    dispatch(updateQuantityAction({ itemName, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const getItemQuantity = (itemName) => {
    const item = cart.items.find(item => item.name === itemName);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (itemName) => {
    return cart.items.some(item => item.name === itemName);
  };

  // REMOVED THE SPAM LOGS:
  // console.log('Cart state:', cart);
  // console.log('Total items:', cart.totalQuantity);

  return {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
    addToCart,
    removeFromCart,
    deleteItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
  };
};