const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// ================================
// 3. MONGOOSE SCHEMAS (Much simpler than SQL!)
// ================================

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: String,
  city: String,
  zipCode: String,
  
  // Customer preferences
  preferredSpiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra_hot'],
    default: 'medium'
  },
  
  // Customer stats
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  lastOrderDate: Date,
  
  // Status flags
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  marketingConsent: { type: Boolean, default: false }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'customers' // Explicit collection name
});

// Food Order Schema
const foodOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' // Reference to Customer document
  },
  
  // Customer info (for guest orders or quick access)
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  deliveryAddress: { type: String, required: true },
  
  // Order items (embedded documents - no separate table needed!)
  items: [{
    name: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    category: String,
    type: { 
      type: String, 
      enum: ['veg', 'non-veg'],
      required: true
    },
    spiceLevel: String,
    isSpicy: { type: Boolean, default: false },
    customizations: mongoose.Schema.Types.Mixed // Any JSON data
  }],
  
  // Pricing
  subtotal: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
  // Payment info
  paymentIntentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  
  // Additional info
  specialInstructions: String,
  deliveryNotes: String
}, {
  timestamps: true,
  collection: 'food_orders'
});

// Catering Booking Schema
const cateringBookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  
  // Customer info
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  
  // Event details
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true }, // "18:00"
  eventAddress: { type: String, required: true },
  eventCity: String,
  eventZipCode: String,
  guestCount: { type: Number, required: true, min: 10 },
  
  // Package and pricing - UPDATED TO INCLUDE 'duo'
  packageType: {
    type: String,
    enum: ['duo', 'trio', 'kids'],
    required: true
  },
  basePrice: { type: Number, required: true },
  pricePerPerson: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  
  // Payment tracking
  depositPaymentIntentId: String,
  depositPaidAt: Date,
  finalPaymentIntentId: String,
  finalPaidAt: Date,
  paymentStatus: {
    type: String,
    enum: ['deposit_pending', 'deposit_paid', 'fully_paid', 'refunded'],
    default: 'deposit_pending'
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  
  // Special requirements
  specialRequests: String,
  dietaryRestrictions: String,
  kitchenRequirements: String,
  
  // Calendar integration
  googleCalendarEventId: String,
  calendarInviteSent: { type: Boolean, default: false },
  
  // Chef assignment (for future use)
  assignedChef: String,
  chefArrivalTime: Date,
  setupStartTime: Date,
  cookingStartTime: Date,
  serviceEndTime: Date,
  
  // Follow-up
  preEventCallCompleted: { type: Boolean, default: false },
  preEventCallNotes: String,
  postEventFeedback: String,
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true,
  collection: 'catering_bookings'
});

// Email Log Schema
const emailLogSchema = new mongoose.Schema({
  emailType: {
    type: String,
    required: true,
    enum: ['order_confirmation', 'catering_confirmation', 'reminder', 'marketing', 'support']
  },
  recipientEmail: { type: String, required: true },
  subject: { type: String, required: true },
  
  // Related records
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodOrder'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CateringBooking'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  
  // Email status
  status: {
    type: String,
    enum: ['sent', 'failed', 'bounced'],
    default: 'sent'
  },
  emailProviderId: String, // Gmail message ID
  errorMessage: String,
  
  // Email content tracking
  templateUsed: String,
  personalizationData: mongoose.Schema.Types.Mixed
}, {
  timestamps: { createdAt: 'sentAt', updatedAt: false },
  collection: 'email_logs'
});

// ================================
// 4. CREATE MODELS
// ================================

const Customer = mongoose.model('Customer', customerSchema);
const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);
const CateringBooking = mongoose.model('CateringBooking', cateringBookingSchema);
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// ================================
// 5. HELPER FUNCTIONS
// ================================

// Find or create customer
const findOrCreateCustomer = async (customerData) => {
  try {
    let customer = await Customer.findOne({ email: customerData.email });
    
    if (!customer) {
      customer = new Customer({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        zipCode: customerData.zipCode
      });
      await customer.save();
      console.log('✅ New customer created:', customer.email);
    } else {
      // Update customer info if provided
      if (customerData.name) customer.name = customerData.name;
      if (customerData.phone) customer.phone = customerData.phone;
      if (customerData.address) customer.address = customerData.address;
      await customer.save();
      console.log('✅ Customer updated:', customer.email);
    }
    
    return customer;
  } catch (error) {
    console.error('❌ Error with customer:', error);
    throw error;
  }
};

// Save food order
const saveFoodOrder = async (orderData) => {
  try {
    // Find or create customer
    const customer = await findOrCreateCustomer({
      name: orderData.customerName,
      email: orderData.customerEmail,
      phone: orderData.customerPhone
    });

    // Create order
    const order = new FoodOrder({
      orderNumber: orderData.orderNumber,
      customer: customer._id,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.price) * item.quantity,
        category: item.category,
        type: item.type,
        spiceLevel: item.spice_level,
        isSpicy: item.spicy || false
      })),
      subtotal: orderData.subtotal,
      taxAmount: orderData.taxAmount,
      deliveryFee: orderData.deliveryFee,
      totalAmount: orderData.totalAmount,
      paymentIntentId: orderData.paymentIntentId,
      paymentStatus: 'paid',
      specialInstructions: orderData.specialInstructions
    });

    await order.save();

    // Update customer stats
    customer.totalOrders += 1;
    customer.totalSpent += orderData.totalAmount;
    customer.lastOrderDate = new Date();
    await customer.save();

    console.log('✅ Food order saved:', order.orderNumber);
    return order;
    
  } catch (error) {
    console.error('❌ Error saving food order:', error);
    throw error;
  }
};

// Save catering booking
const saveCateringBooking = async (bookingData) => {
  try {
    // Find or create customer
    const customer = await findOrCreateCustomer({
      name: bookingData.customerName,
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone,
      address: bookingData.eventAddress,
      city: bookingData.eventCity,
      zipCode: bookingData.eventZipCode
    });

    // Create booking
    const booking = new CateringBooking({
      bookingNumber: bookingData.bookingNumber,
      customer: customer._id,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      eventType: bookingData.eventType,
      eventDate: new Date(bookingData.eventDate),
      eventTime: bookingData.eventTime,
      eventAddress: bookingData.eventAddress,
      eventCity: bookingData.eventCity,
      eventZipCode: bookingData.eventZipCode,
      guestCount: bookingData.guestCount,
      packageType: bookingData.packageType,
      basePrice: bookingData.basePrice,
      pricePerPerson: bookingData.pricePerPerson,
      totalAmount: bookingData.totalAmount,
      depositAmount: bookingData.depositAmount,
      remainingBalance: bookingData.totalAmount - bookingData.depositAmount,
      depositPaymentIntentId: bookingData.paymentIntentId,
      depositPaidAt: new Date(),
      paymentStatus: 'deposit_paid',
      specialRequests: bookingData.specialRequests,
      googleCalendarEventId: bookingData.calendarEventId
    });

    await booking.save();

    console.log('✅ Catering booking saved:', booking.bookingNumber);
    return booking;
    
  } catch (error) {
    console.error('❌ Error saving catering booking:', error);
    throw error;
  }
};

// Log email
const logEmail = async (emailData) => {
  try {
    const log = new EmailLog({
      emailType: emailData.type,
      recipientEmail: emailData.to,
      subject: emailData.subject,
      order: emailData.orderId,
      booking: emailData.bookingId,
      customer: emailData.customerId,
      status: emailData.status || 'sent',
      emailProviderId: emailData.messageId,
      templateUsed: emailData.template,
      personalizationData: emailData.data
    });
    
    await log.save();
    console.log('✅ Email logged:', log._id);
    return log;
  } catch (error) {
    console.error('❌ Error logging email:', error);
    // Don't throw - email logging shouldn't break main flow
  }
};

// Get orders with pagination
const getOrders = async (page = 1, limit = 50, status = null) => {
  try {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      FoodOrder.find(query)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FoodOrder.countDocuments(query)
    ]);
    
    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
};

// Get catering bookings
const getCateringBookings = async (page = 1, limit = 50, status = null) => {
  try {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      CateringBooking.find(query)
        .populate('customer', 'name email phone')
        .sort({ eventDate: 1 })
        .skip(skip)
        .limit(limit),
      CateringBooking.countDocuments(query)
    ]);
    
    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('❌ Error fetching catering bookings:', error);
    throw error;
  }
};

// Get dashboard stats
const getDashboardStats = async () => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [
      totalOrders,
      totalBookings,
      monthlyOrders,
      monthlyBookings,
      totalRevenue,
      monthlyRevenue,
      totalCustomers,
      avgOrderValue
    ] = await Promise.all([
      FoodOrder.countDocuments(),
      CateringBooking.countDocuments(),
      FoodOrder.countDocuments({ createdAt: { $gte: startOfMonth } }),
      CateringBooking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      FoodOrder.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      FoodOrder.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Customer.countDocuments(),
      FoodOrder.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
      ])
    ]);
    
    return {
      totalOrders,
      totalBookings,
      monthlyOrders,
      monthlyBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalCustomers,
      avgOrderValue: avgOrderValue[0]?.avg || 0
    };
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw error;
  }
};

// ================================
// 6. EXPORT EVERYTHING
// ================================

module.exports = {
  connectDB,
  
  // Models
  Customer,
  FoodOrder,
  CateringBooking,
  EmailLog,
  
  // Helper functions
  findOrCreateCustomer,
  saveFoodOrder,
  saveCateringBooking,
  logEmail,
  getOrders,
  getCateringBookings,
  getDashboardStats
};