// Updated App.js - Add the new AdminAddBooking route
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import store from './store/Store';
import Body from './components/Body';
// import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import BookCatering from './components/BookCatering';
import CateringPayment from './components/CateringPayment';
import CateringConfirmation from './components/CateringConfirmation';

import AdminAuth from './components/Admin/AdminAuth';
import AdminDashboard from './components/Admin/AdminDashboard';
import BookingsView from './components/Admin/BookingsView';
import BookingDetails from './components/Admin/BookingDetails';
import AdminAddBooking from './components/Admin/AdminAddBooking'; // NEW IMPORT

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Website Routes */}
            <Route path="/" element={<Body />} />
            {/* <Route path="/menu" element={<Menu />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            
            {/* Catering Routes */}
            <Route path="/book-catering" element={<BookCatering />} />
            <Route path="/catering-payment" element={<CateringPayment />} />
            <Route path="/catering-confirmation" element={<CateringConfirmation />} />
            
            {/* Admin Routes - UPDATED with new Add Booking route */}
            <Route path="/admin/*" element={
              <AdminAuth>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="bookings" element={<BookingsView />} />
                  <Route path="bookings/:id" element={<BookingDetails />} />
                  <Route path="add-booking" element={<AdminAddBooking />} /> {/* NEW ROUTE */}
                </Routes>
              </AdminAuth>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={<Body />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;