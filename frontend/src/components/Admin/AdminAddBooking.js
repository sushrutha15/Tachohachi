// AdminAddBooking.js - Admin form to manually add bookings
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const AdminAddBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form data state - Based on your BookCatering.js structure
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Event Details
    eventType: '',
    eventDate: '',
    eventTime: '',
    eventAddress: '',
    eventCity: 'Dallas',
    eventState: 'TX',
    eventZip: '',
    adultsCount: '',
    kidsCount: '',
    specialRequests: '',
    
    // Package & Admin Settings
    selectedPackage: 'premium',
    addons: [],
    
    // Admin-specific fields
    paymentMethod: 'cash',
    paymentStatus: 'deposit_paid',
    depositAmount: '200',
    totalAmount: '',
    adminNotes: '',
    bookingSource: 'phone',
    sendConfirmationEmail: true
  });

  // Same packages as in BookCatering.js
  const packages = {
    duo: {
      name: 'Duo - Any 2 Proteins',
      pricePerPerson: 55,
      features: [
        'Starter salad with signature ginger dressing',
        'Any 2 proteins as combined main entree', 
        'Hibachi fried rice',
        'Assorted grilled vegetables',
        '"Yum yum" sauce and hot sauce',
        'Live hibachi cooking show'
      ]
    },
    trio: {
      name: 'Trio - Any 3 Proteins',
      pricePerPerson: 65,
      features: [
        'Starter salad with signature ginger dressing',
        'Any 3 proteins as combined main entree',
        'Hibachi fried rice', 
        'Assorted grilled vegetables',
        '"Yum yum" sauce and hot sauce',
        'Live hibachi cooking show'
      ]
    },
    kids: {
      name: 'Kids Meal (10 & Under)',
      pricePerPerson: 30,
      features: [
        'Starter salad with signature ginger dressing',
        'Any single protein as main entree',
        'Hibachi fried rice',
        'Assorted grilled vegetables', 
        '"Yum yum" sauce and hot sauce',
        'Kid-friendly hibachi show'
      ]
    }
  };

  const addons = [
    { 
      id: 'stress_free', 
      name: 'Stress-Free Event Setup', 
      price: 15, 
      priceType: 'per_person',
      description: 'Tables, chairs, tablecloths, napkins, plates, bowls, utensils, and chopsticks included'
    },
    { 
      id: 'travel_20min', 
      name: 'Travel Fee (20+ min from Forney)', 
      price: 50, 
      priceType: 'flat',
      description: 'For events 20+ minutes from Forney, TX (75126)'
    },
    { 
      id: 'travel_60min', 
      name: 'Travel Fee (60+ min from Forney)', 
      price: 100, 
      priceType: 'flat',
      description: 'For events 60+ minutes from Forney, TX (75126)'
    }
  ];

  const eventTypes = [
    'Corporate Event', 'Wedding Reception', 'Birthday Party',
    'Anniversary Celebration', 'Holiday Party', 'Family Gathering',
    'Graduation Party', 'Baby Shower', 'Quinceañera', 'Business Meeting', 'Other'
  ];

  // Calculate total price - Same logic as BookCatering.js
  const calculateTotal = () => {
    const adults = parseInt(formData.adultsCount) || 0;
    const kids = parseInt(formData.kidsCount) || 0;
    const totalGuests = adults + kids;
    
    let adultsCost = adults * packages[formData.selectedPackage].pricePerPerson;
    let kidsCost = kids * packages.kids.pricePerPerson;
    
    let subtotal = adultsCost + kidsCost;
    
    // Apply party size discounts
    let discount = 0;
    if (totalGuests >= 50) {
      discount = subtotal * 0.10;
    } else if (totalGuests >= 35) {
      discount = subtotal * 0.08;
    } else if (totalGuests >= 30) {
      discount = subtotal * 0.05;
    }
    
    subtotal -= discount;
    
    // Add addon costs
    const addonTotal = formData.addons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        if (addon.priceType === 'per_person') {
          return total + (addon.price * totalGuests);
        } else {
          return total + addon.price;
        }
      }
      return total;
    }, 0);
    
    const total = subtotal + addonTotal;
    const deposit = Math.round(total * 0.25 * 100) / 100;
    
    return { total, deposit, discount, addonTotal };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Phone number formatting
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Auto-calculate total when relevant fields change
  React.useEffect(() => {
    if (formData.adultsCount || formData.kidsCount) {
      const pricing = calculateTotal();
      setFormData(prev => ({
        ...prev,
        totalAmount: pricing.total.toFixed(2)
      }));
    }
  }, [formData.selectedPackage, formData.adultsCount, formData.kidsCount, formData.addons]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
    if (!formData.eventAddress.trim()) newErrors.eventAddress = 'Event address is required';
    if (!formData.eventZip.trim()) newErrors.eventZip = 'ZIP code is required';
    
    const adults = parseInt(formData.adultsCount) || 0;
    const kids = parseInt(formData.kidsCount) || 0;
    const totalGuests = adults + kids;
    
    if (totalGuests < 1) {
      newErrors.guestCount = 'At least 1 guest is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors above' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const totalGuests = (parseInt(formData.adultsCount) || 0) + (parseInt(formData.kidsCount) || 0);
      
      // Prepare booking data similar to BookCatering.js
      const bookingData = {
        contactInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          eventAddress: formData.eventAddress,
          city: formData.eventCity,
          zipCode: formData.eventZip
        },
        eventDetails: {
          eventType: formData.eventType,
          selectedDate: formData.eventDate,
          selectedTime: formData.eventTime,
          guestCount: totalGuests,
          adultsCount: parseInt(formData.adultsCount) || 0,
          kidsCount: parseInt(formData.kidsCount) || 0,
          specialRequests: formData.specialRequests
        },
        selectedPackage: formData.selectedPackage,
        pricing: calculateTotal(),
        // Admin-specific data
        adminCreated: true,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        depositAmount: parseFloat(formData.depositAmount),
        adminNotes: formData.adminNotes,
        bookingSource: formData.bookingSource,
        timestamp: new Date().toISOString()
      };

      console.log('💼 Admin creating booking:', bookingData);

      // Save booking directly (skip payment processing)
      const saveResponse = await fetch('https://miyatohibachi-backend-production.up.railway.app/api/save-catering-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData: bookingData,
          paymentIntentId: `admin_${Date.now()}`, // Generate admin payment ID
          depositAmount: bookingData.depositAmount
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save booking');
      }

      const saveResult = await saveResponse.json();
      console.log('✅ Booking saved:', saveResult);

      // Send confirmation email if requested
      if (formData.sendConfirmationEmail) {
        try {
          await fetch('https://miyatohibachi-backend-production.up.railway.app/api/send-catering-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: saveResult.bookingId,
              customerName: bookingData.contactInfo.name,
              customerEmail: bookingData.contactInfo.email,
              customerPhone: bookingData.contactInfo.phone,
              eventType: bookingData.eventDetails.eventType,
              eventDate: bookingData.eventDetails.selectedDate,
              eventTime: bookingData.eventDetails.selectedTime,
              eventAddress: bookingData.contactInfo.eventAddress,
              guestCount: bookingData.eventDetails.guestCount,
              selectedPackage: bookingData.selectedPackage,
              paymentIntentId: `admin_${Date.now()}`
            })
          });
          console.log('📧 Confirmation email sent');
        } catch (emailError) {
          console.warn('⚠️ Email failed but booking saved:', emailError);
        }
      }

      setMessage({ 
        type: 'success', 
        text: `Booking created successfully! Booking ID: ${saveResult.bookingId}` 
      });

      // Reset form
      setTimeout(() => {
        navigate('/admin/bookings');
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating booking:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to create booking. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Allow bookings from tomorrow
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Booking</h1>
              <p className="text-gray-600">Manually create catering bookings for phone orders</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              {message.text}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Customer Information Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="customer@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(214) 555-1234"
                    maxLength="14"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.eventType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.eventDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.eventTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.eventTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Adults *
                  </label>
                  <input
                    type="number"
                    name="adultsCount"
                    value={formData.adultsCount}
                    onChange={handleInputChange}
                    min="0"
                    max="200"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.guestCount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Address *
                </label>
                <input
                  type="text"
                  name="eventAddress"
                  value={formData.eventAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.eventAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street, Suite 100"
                />
                {errors.eventAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventAddress}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="eventCity"
                    value={formData.eventCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="eventState"
                    value={formData.eventState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP *</label>
                  <input
                    type="text"
                    name="eventZip"
                    value={formData.eventZip}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.eventZip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="75001"
                    maxLength="5"
                  />
                  {errors.eventZip && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventZip}</p>
                  )}
                </div>
              </div>
              
              {errors.guestCount && (
                <p className="mt-2 text-sm text-red-600">{errors.guestCount}</p>
              )}
            </div>

            {/* Package Selection */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Package Selection</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(packages).map(([key, pkg]) => {
                  const isSelected = formData.selectedPackage === key;
                  
                  return (
                    <div
                      key={key}
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, selectedPackage: key }))}
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          ${pkg.pricePerPerson}
                        </div>
                        <div className="text-sm text-gray-600">per person</div>
                      </div>
                      
                      <ul className="space-y-2 text-sm text-gray-600">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className={`mt-4 w-4 h-4 rounded-full border-2 mx-auto ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment & Admin Settings */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment & Admin Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="card_phone">Card (Over Phone)</option>
                    <option value="venmo">Venmo</option>
                    <option value="zelle">Zelle</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="deposit_pending">Deposit Pending</option>
                    <option value="fully_paid">Fully Paid</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount ($)
                  </label>
                  <input
                    type="text"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendConfirmationEmail"
                    checked={formData.sendConfirmationEmail}
                    onChange={handleInputChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Send confirmation email to customer
                  </span>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any dietary restrictions, preferences, or special requests..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Internal Only)
                  </label>
                  <textarea
                    name="adminNotes"
                    value={formData.adminNotes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Internal notes about this booking, payment details, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            {(formData.adultsCount || formData.kidsCount) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  {formData.adultsCount && parseInt(formData.adultsCount) > 0 && (
                    <div className="flex justify-between">
                      <span>Adults ({formData.adultsCount} × ${packages[formData.selectedPackage].pricePerPerson}):</span>
                      <span>${parseInt(formData.adultsCount) * packages[formData.selectedPackage].pricePerPerson}</span>
                    </div>
                  )}
                  {formData.kidsCount && parseInt(formData.kidsCount) > 0 && (
                    <div className="flex justify-between">
                      <span>Kids ({formData.kidsCount} × ${packages.kids.pricePerPerson}):</span>
                      <span>${parseInt(formData.kidsCount) * packages.kids.pricePerPerson}</span>
                    </div>
                  )}
                  
                  {calculateTotal().discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Party Discount:</span>
                      <span>-${calculateTotal().discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Event Cost:</span>
                      <span>${calculateTotal().total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Deposit Amount:</span>
                      <span>${formData.depositAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Balance Due on Event Day:</span>
                      <span>${(calculateTotal().total - parseFloat(formData.depositAmount)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Booking...
                  </span>
                ) : (
                  'Create Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBooking;