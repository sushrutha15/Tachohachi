import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from './Navbar';

const BookCatering = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
    selectedPackage: 'duo',
    selectedProteins: [],
    addons: [],
    agreedToTerms: false
  });

  const packages = {
    duo: {
      name: 'Duo - Any 2 Proteins',
      pricePerPerson: 57,
      features: [
        '1 Chef & 1 Server',
        'Starter salad with signature ginger dressing',
        '2 Proteins: Steak / Shrimp / Chicken / Salmon / Mahi-Mahi / Tuna',
        'Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20',
        'Hibachi fried rice',
        'Assorted grilled vegetables',
        '"Yum yum" sauce and hot sauce',
        'Live hibachi cooking show'
      ],
      popular: true
    },
    trio: {
      name: 'Trio - Any 3 Proteins',
      pricePerPerson: 67,
      features: [
        '1 Chef & 1 Server',
        'Starter salad with signature ginger dressing',
        '3 Proteins: Steak / Shrimp / Chicken / Salmon / Mahi-Mahi / Tuna',
        'Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20',
        'Hibachi fried rice',
        'Assorted grilled vegetables',
        '"Yum yum" sauce and hot sauce',
        'Live hibachi cooking show'
      ],
      popular: false
    },
    kids: {
      name: 'Kids Meal (10 & Under)',
      pricePerPerson: 37,
      features: [
        '1 Chef & 1 Server',
        'Starter salad with signature ginger dressing',
        '1 Protein: Steak / Shrimp / Chicken',
        'Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20',
        'Hibachi fried rice',
        'Assorted grilled vegetables',
        '"Yum yum" sauce and hot sauce',
        'Live hibachi cooking show'
      ],
      popular: false
    }
  };

  const proteins = [
    { name: 'Chicken', price: 0 },
    { name: 'Steak', price: 0 },
    { name: 'Salmon', price: 0 },
    { name: 'Tuna', price: 0 },
    { name: 'Shrimp', price: 0 },
    { name: 'Mahi-mahi', price: 0 },
    { name: 'Scallops', price: 7 },
    { name: 'Lobster', price: 20 },
    { name: 'Filet Mignon', price: 15 }
  ];

  const addons = [
    {
      id: 'stress_free',
      name: 'Stress-Free Event Setup',
      price: 15,
      priceType: 'per_person',
      description: 'Tables, chairs, tablecloths, napkins, plates, bowls, utensils, and chopsticks included'
    }
  ];

  const eventTypes = [
    'Corporate Event',
    'Wedding Reception',
    'Birthday Party',
    'Anniversary Celebration',
    'Holiday Party',
    'Family Gathering',
    'Graduation Party',
    'Baby Shower',
    'Quinceañera',
    'Business Meeting',
    'Other'
  ];

  const DEPOSIT_AMOUNT = 200;

  const calculateTotal = () => {
    const adults = parseInt(formData.adultsCount) || 0;
    const kids = parseInt(formData.kidsCount) || 0;
    const totalGuests = adults + kids;

    let adultsCost = adults * packages[formData.selectedPackage].pricePerPerson;
    let kidsCost = kids * packages.kids.pricePerPerson;
    let subtotal = adultsCost + kidsCost;

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
    const deposit = DEPOSIT_AMOUNT;

    return { total, deposit, addonTotal };
  };

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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
    if (!formData.eventAddress.trim()) newErrors.eventAddress = 'Event address is required';
    if (!formData.eventZip.trim()) newErrors.eventZip = 'ZIP code is required';
    const adults = parseInt(formData.adultsCount) || 0;
    const kids = parseInt(formData.kidsCount) || 0;
    if (adults + kids < 1) {
      newErrors.guestCount = 'At least 1 guest is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (isValid && currentStep === 3) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsLoading(true);
    try {
      const totalGuests = (parseInt(formData.adultsCount) || 0) + (parseInt(formData.kidsCount) || 0);
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
        selectedProteins: formData.selectedProteins,
        pricing: calculateTotal(),
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('cateringBooking', JSON.stringify(bookingData));
      navigate('/catering-payment');
    } catch (error) {
      console.error('Error processing booking:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-40 pb-12">
        <div className="max-w-4xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
              Book Your Hibachi Experience
            </span>
            <h1 className="text-4xl font-bold text-[#E78229] mb-4">Book Live Hibachi Catering</h1>
            <p className="text-xl text-slate-600">Professional hibachi cooking experience for your special event</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}>
                    {step}
                  </div>
                  <div className={`ml-3 font-medium ${currentStep >= step ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step === 1 && 'Contact Info'}
                    {step === 2 && 'Event Details'}
                    {step === 3 && 'Package & Payment'}
                  </div>
                  {step < 3 && (
                    <div className={`ml-8 w-16 h-0.5 transition-all duration-300 ${
                      currentStep > step ? 'bg-slate-900' : 'bg-slate-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8">

            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.firstName ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.lastName ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="(214) 555-1234"
                    maxLength="14"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Event Details</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.eventType ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.eventDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Time *</label>
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.eventTime ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.eventTime && <p className="mt-1 text-sm text-red-600">{errors.eventTime}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Address *</label>
                  <input
                    type="text"
                    name="eventAddress"
                    value={formData.eventAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.eventAddress ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="123 Main Street, Suite 100"
                  />
                  {errors.eventAddress && <p className="mt-1 text-sm text-red-600">{errors.eventAddress}</p>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="eventCity"
                      value={formData.eventCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="eventState"
                      value={formData.eventState}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                      maxLength="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="eventZip"
                      value={formData.eventZip}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.eventZip ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="75001"
                      maxLength="5"
                    />
                    {errors.eventZip && <p className="mt-1 text-sm text-red-600">{errors.eventZip}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Adults *</label>
                    <input
                      type="number"
                      name="adultsCount"
                      value={formData.adultsCount}
                      onChange={handleInputChange}
                      min="0"
                      max="200"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.guestCount ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Kids (10 & Under)</label>
                    <input
                      type="number"
                      name="kidsCount"
                      value={formData.kidsCount}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors ${errors.guestCount ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="0"
                    />
                  </div>
                </div>
                {errors.guestCount && <p className="mt-1 text-sm text-red-600">{errors.guestCount}</p>}
                {(formData.adultsCount || formData.kidsCount) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600">
                      <strong>Total Guests:</strong> {(parseInt(formData.adultsCount) || 0) + (parseInt(formData.kidsCount) || 0)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Special Requests or Dietary Requirements</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                    placeholder="Any dietary restrictions, preferences, or special requests..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Package Selection */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Hibachi Package</h2>

                {/* Package Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(packages).map(([key, pkg]) => {
                    const isSelected = formData.selectedPackage === key;
                    return (
                      <div
                        key={key}
                        className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                          isSelected ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, selectedPackage: key }))}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-6 bg-slate-900 text-white px-3 py-1 rounded text-xs font-semibold">
                            MOST POPULAR
                          </div>
                        )}
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
                          <div className="text-2xl font-bold text-slate-900 mt-2">${pkg.pricePerPerson}</div>
                          <div className="text-sm text-slate-600">per person</div>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className={`mt-4 w-4 h-4 rounded-full border-2 mx-auto ${
                          isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add-ons */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Optional Add-ons</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {addons.map((addon) => (
                      <label key={addon.id} className="flex items-start p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={formData.addons.includes(addon.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, addons: [...prev.addons, addon.id] }));
                            } else {
                              setFormData(prev => ({ ...prev, addons: prev.addons.filter(id => id !== addon.id) }));
                            }
                          }}
                          className="mr-3 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500 mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{addon.name}</div>
                          <div className="text-sm text-slate-600 mt-1">{addon.description}</div>
                          <div className="text-sm font-medium text-slate-900 mt-1">
                            ${addon.price}{addon.priceType === 'per_person' ? '/person' : ' flat fee'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Travel Fee Disclaimer */}
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">📍 Travel Fee Notice</p>
                    <p className="text-sm text-amber-700">
                      For events 30+ minutes from Mesquite, TX — a <strong>$50 travel fee</strong> will be added.<br />
                      For events 60+ minutes from Mesquite, TX — a <strong>$100 travel fee</strong> will be added.
                    </p>
                  </div>
                </div>

                {/* Pricing Summary */}
                {(formData.adultsCount || formData.kidsCount) && (
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing Summary</h3>
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
                      {calculateTotal().addonTotal > 0 && (
                        <div className="flex justify-between">
                          <span>Add-ons:</span>
                          <span>${calculateTotal().addonTotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Event Cost:</span>
                          <span>${calculateTotal().total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Deposit Required (to secure your date):</span>
                          <span>${DEPOSIT_AMOUNT}.00</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Balance Due on Event Day:</span>
                          <span>${(calculateTotal().total - DEPOSIT_AMOUNT).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="border-t pt-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      className="mt-1 mr-3 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <label className="text-sm text-slate-700">
                      I agree to the <span className="text-slate-900 font-semibold">terms and conditions</span> including
                      the $200 deposit requirement, 48-hour cancellation policy, and service agreement.
                      Final guest count must be confirmed 24 hours before the event.
                    </label>
                  </div>
                  {errors.agreedToTerms && <p className="mt-2 text-sm text-red-600">{errors.agreedToTerms}</p>}
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Previous
              </button>
              <div className="text-sm text-slate-500">Step {currentStep} of 3</div>
              <button
                onClick={nextStep}
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isLoading
                    ? 'bg-slate-400 text-white cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  currentStep === 3 ? 'Proceed to Payment' : 'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCatering;