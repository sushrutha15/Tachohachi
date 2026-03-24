import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.name === newItem.name);
      
      // Parse price if it's a string (e.g., "$9.99" -> 9.99)
      const price = typeof newItem.price === 'string' 
        ? parseFloat(newItem.price.replace(/[^0-9.]/g, '')) 
        : newItem.price;
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          price: price
        });
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      console.log('Cart updated:', state.items);
    },
    
    removeFromCart: (state, action) => {
      const itemName = action.payload;
      const existingItem = state.items.find(item => item.name === itemName);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.name !== itemName);
        } else {
          existingItem.quantity -= 1;
        }
        
        // Recalculate totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    
    deleteItem: (state, action) => {
      const itemName = action.payload;
      state.items = state.items.filter(item => item.name !== itemName);
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { itemName, quantity } = action.payload;
      const existingItem = state.items.find(item => item.name === itemName);
      
      if (existingItem) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(item => item.name !== itemName);
        } else {
          existingItem.quantity = quantity;
        }
        
        // Recalculate totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, deleteItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;