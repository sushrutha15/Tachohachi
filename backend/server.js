require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const { google } = require('googleapis');
const { SquareClient, SquareEnvironment } = require('square');
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const {
  connectDB,
  saveCateringBooking,
  logEmail,
  getDashboardStats,
  CateringBooking,
  EmailLog
} = require('./Database');

console.log('🔍 Environment check:');
console.log('- SQUARE_ACCESS_TOKEN exists:', !!process.env.SQUARE_ACCESS_TOKEN);
console.log('- EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('- EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('- GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Production
});

const app = express();

// ================================================================
// CORS
// ================================================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:1234'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(express.json());

// ================================================================
// RATE LIMITING
// ================================================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many payment attempts, please try again later.' }
});
app.use(generalLimiter);

// ================================================================
// CALENDAR SETUP
// ================================================================
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

connectDB().then(success => {
  if (!success) { console.error('❌ Failed to connect to MongoDB.'); process.exit(1); }
});

const sentEmails = new Set();

// ================================================================
// HELPERS
// ================================================================
const normalizeBookingData = (bookingData) => ({
  contactInfo: {
    name: bookingData.contactInfo?.name || `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim() || 'N/A',
    email: bookingData.contactInfo?.email || bookingData.email || '',
    phone: bookingData.contactInfo?.phone || bookingData.phone || '',
    eventAddress: bookingData.contactInfo?.eventAddress || bookingData.eventAddress || '',
    city: bookingData.contactInfo?.city || bookingData.eventCity || '',
    zipCode: bookingData.contactInfo?.zipCode || bookingData.eventZip || ''
  },
  eventDetails: {
    eventType: bookingData.eventDetails?.eventType || bookingData.eventType || '',
    selectedDate: bookingData.eventDetails?.selectedDate || bookingData.eventDate || '',
    selectedTime: bookingData.eventDetails?.selectedTime || bookingData.eventTime || '',
    guestCount: bookingData.eventDetails?.guestCount || bookingData.guestCount || 0,
    specialRequests: bookingData.eventDetails?.specialRequests || bookingData.specialRequests || ''
  },
  selectedPackage: bookingData.selectedPackage || 'duo',
  pricing: bookingData.pricing || { total: 200, deposit: 200 }
});

function getPackageName(packageType) {
  return { duo: 'Duo — Any 2 Proteins', trio: 'Trio — Any 3 Proteins', kids: 'Kids Meal (10 & Under)' }[packageType] || 'Duo — Any 2 Proteins';
}
function getPackagePricePerPerson(packageType) {
  return { duo: 57, trio: 67, kids: 37 }[packageType] || 57;
}
function validateAndMapPackage(packageName) {
  const map = { 'duo': 'duo', 'trio': 'trio', 'kids': 'kids', 'basic': 'duo', 'premium': 'duo', 'luxury': 'trio' };
  const mapped = map[packageName] || packageName;
  return ['duo', 'trio', 'kids'].includes(mapped) ? mapped : 'duo';
}

// ================================================================
// ROUTES
// ================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    square: process.env.SQUARE_ACCESS_TOKEN ? 'configured ✅' : 'missing ❌',
    email: process.env.RESEND_API_KEY ? 'configured ✅' : 'missing ❌',
    mongodb: process.env.MONGODB_URI ? 'configured ✅' : 'missing ❌'
  });
});

app.get('/', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ message: '🔥 Miyato Hibachi Dallas Server is running!', stats });
  } catch {
    res.json({ message: '🔥 Miyato Hibachi Dallas Server is running!' });
  }
});

// 1. PROCESS SQUARE PAYMENT
app.post('/api/create-catering-payment', paymentLimiter, async (req, res) => {
  try {
    const { sourceId, amount, email, bookingData } = req.body;
    if (!sourceId || !email) {
      return res.status(400).json({ error: 'Missing required fields: sourceId and email' });
    }
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const normalizedData = normalizeBookingData(bookingData || {});
    const { payment: paymentResult } = await squareClient.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(Math.round((amount || 200) * 100)),
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      buyerEmailAddress: email,
      note: `Miyato Hibachi Dallas — Catering Deposit | ${normalizedData.eventDetails.eventType} | ${normalizedData.eventDetails.selectedDate}`,
      referenceId: `CATERING-${Date.now()}`
    });
    const payment = paymentResult;
    console.log(`✅ Square payment created: ${payment.id}`);
    res.json({ success: true, paymentId: payment.id, status: payment.status, receiptUrl: payment.receiptUrl });
  } catch (error) {
    console.error('❌ Square payment error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
});

// 2. SAVE CATERING BOOKING
app.post('/api/save-catering-booking', async (req, res) => {
  try {
    const { bookingData, paymentId, depositAmount } = req.body;
    const normalizedData = normalizeBookingData(bookingData);
    const validatedPackage = validateAndMapPackage(normalizedData.selectedPackage);
    const booking = await saveCateringBooking({
      bookingNumber: 'CATERING-' + Date.now(),
      customerName: normalizedData.contactInfo.name,
      customerEmail: normalizedData.contactInfo.email,
      customerPhone: normalizedData.contactInfo.phone,
      eventType: normalizedData.eventDetails.eventType,
      eventDate: normalizedData.eventDetails.selectedDate,
      eventTime: normalizedData.eventDetails.selectedTime,
      eventAddress: normalizedData.contactInfo.eventAddress,
      eventCity: normalizedData.contactInfo.city,
      eventZipCode: normalizedData.contactInfo.zipCode,
      guestCount: normalizedData.eventDetails.guestCount,
      packageType: validatedPackage,
      basePrice: getPackagePricePerPerson(validatedPackage),
      pricePerPerson: getPackagePricePerPerson(validatedPackage),
      totalAmount: normalizedData.pricing.total,
      depositAmount: depositAmount || 200,
      paymentIntentId: paymentId,
      specialRequests: normalizedData.eventDetails.specialRequests
    });
    console.log('✅ Catering booking saved:', booking.bookingNumber);
    res.json({ success: true, bookingId: booking.bookingNumber, databaseId: booking._id });
  } catch (error) {
    console.error('❌ Save booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. SEND CONFIRMATION EMAIL
app.post('/api/send-catering-confirmation', async (req, res) => {
  try {
    const { bookingId, customerName, customerEmail, customerPhone, eventType, eventDate, eventTime, eventAddress, guestCount, selectedPackage } = req.body;
    const emailKey = `catering_${bookingId}_${customerEmail}`;
    if (sentEmails.has(emailKey)) return res.json({ success: true, duplicate: true });
    if (!customerEmail || !customerName || !bookingId) return res.status(400).json({ error: 'Missing required fields' });

    const [year, month, day] = eventDate.split('-');
    const formattedEventDate = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEventTime = new Date(`2000-01-01T${eventTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const validatedPackage = validateAndMapPackage(selectedPackage);
    const packageName = getPackageName(validatedPackage);
    const pricePerPerson = getPackagePricePerPerson(validatedPackage);

    const eventStartDateTime = new Date(`${eventDate}T${eventTime}`);
    const eventEndDateTime = new Date(eventStartDateTime.getTime() + 4 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const calTitle = encodeURIComponent(`Miyato Hibachi Dallas — ${eventType}`);
    const calDesc = encodeURIComponent(`Hibachi catering by Miyato Hibachi Dallas\nGuests: ${guestCount}\nPackage: ${packageName}\nBooking: ${bookingId}\nContact: (972) 589-1422`);
    const calLoc = encodeURIComponent(eventAddress);
    const googleCalURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${fmt(eventStartDateTime)}/${fmt(eventEndDateTime)}&details=${calDesc}&location=${calLoc}`;
    const outlookCalURL = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${calTitle}&startdt=${fmt(eventStartDateTime)}&enddt=${fmt(eventEndDateTime)}&body=${calDesc}&location=${calLoc}`;

    let calendarEventCreated = false;
    try {
      const calRes = await calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: `Miyato Hibachi Dallas — ${eventType} for ${customerName}`,
          description: `Customer: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\nGuests: ${guestCount}\nPackage: ${packageName}\nBooking: ${bookingId}`,
          start: { dateTime: eventStartDateTime.toISOString(), timeZone: 'America/Chicago' },
          end: { dateTime: eventEndDateTime.toISOString(), timeZone: 'America/Chicago' },
          location: eventAddress,
          attendees: [{ email: customerEmail }, { email: 'miyatohibachidallas@gmail.com' }],
          reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 1440 }, { method: 'email', minutes: 120 }] }
        },
        sendUpdates: 'all'
      });
      calendarEventCreated = true;
      console.log('📅 Calendar event created:', calRes.data.id);
    } catch (calErr) {
      console.warn('⚠️ Calendar failed:', calErr.message);
    }

    const emailHTML = `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0}
        .container{max-width:700px;margin:0 auto;background:white;border:1px solid #ddd;border-radius:8px}
        .header{background:linear-gradient(135deg,#E78229,#ff9a4a);padding:40px;text-align:center;color:white}
        .header h1{margin:0;font-size:26px}.header p{margin:10px 0 0;opacity:.9}
        .content{padding:40px}
        .summary{background:#f8f9fa;padding:25px;margin:20px 0;border-left:4px solid #28a745;border-radius:8px}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e9ecef}
        .label{font-weight:600;color:#495057}
        .cal-btn{display:inline-block;margin:6px;padding:10px 18px;background:#333;color:white;text-decoration:none;border-radius:6px;font-weight:bold;font-size:13px}
        .footer{background:#f8f9fa;padding:25px;text-align:center;border-top:1px solid #dee2e6;color:#555;font-size:13px}
      </style></head><body>
        <div class="container">
          <div class="header"><h1>🔥 Catering Booking Confirmed!</h1><p>Your hibachi experience is scheduled</p></div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for choosing Miyato Hibachi Dallas! Your booking is confirmed and your $200 deposit has been processed.</p>
            <div class="summary">
              <h3>📋 Booking Details</h3>
              <div class="row"><span class="label">Booking ID:</span><span><strong>${bookingId}</strong></span></div>
              <div class="row"><span class="label">Event Type:</span><span>${eventType}</span></div>
              <div class="row"><span class="label">Date:</span><span>${formattedEventDate}</span></div>
              <div class="row"><span class="label">Time:</span><span>${formattedEventTime}</span></div>
              <div class="row"><span class="label">Location:</span><span>${eventAddress}</span></div>
              <div class="row"><span class="label">Guests:</span><span>${guestCount} people</span></div>
              <div class="row"><span class="label">Package:</span><span>${packageName} ($${pricePerPerson}/person)</span></div>
              <div class="row"><span class="label">Deposit Paid:</span><span style="color:#28a745;font-weight:bold;">✅ $200.00</span></div>
            </div>
            <div style="text-align:center;margin:20px 0">
              <p><strong>📅 Add to your calendar:</strong></p>
              <a href="${googleCalURL}" target="_blank" class="cal-btn">📅 Google Calendar</a>
              <a href="${outlookCalURL}" target="_blank" class="cal-btn">📅 Outlook</a>
            </div>
            <p>Questions? Call or text <strong>(972) 589-1422</strong> or email <strong>salinaseduardo275@gmail.com</strong></p>
            <p>We can't wait to bring the hibachi experience to your event!</p>
            <p>— Eduardo Salinas, Miyato Hibachi Dallas</p>
          </div>
          <div class="footer">
            <p><strong>Miyato Hibachi Dallas</strong></p>
            <p>📞 (972) 589-1422 | ✉️ salinaseduardo275@gmail.com | 🌐 miyatohibachidallas.co</p>
          </div>
        </div>
      </body></html>
    `;

    // Send confirmation to customer
    const { data, error } = await resend.emails.send({
      from: 'Miyato Hibachi Dallas <noreply@miyatohibachidallas.co>',
      to: customerEmail,
      subject: `🔥 Booking Confirmed — ${bookingId} | ${formattedEventDate}`,
      html: emailHTML
    });
    if (error) throw new Error(error.message);

    await logEmail({ type: 'catering_confirmation', to: customerEmail, subject: `Booking Confirmed — ${bookingId}`, messageId: data?.id, status: 'sent' });
    sentEmails.add(emailKey);

    // SMS notification to Eduardo
    try {
      await twilioClient.messages.create({
        body: `New Booking: ${customerName}, ${eventType}, ${formattedEventDate} at ${formattedEventTime}. Guests: ${guestCount}. Call: ${customerPhone}`,
        from: process.env.TWILIO_PHONE,
        to: process.env.EDUARDO_PHONE
      });
      console.log('✅ SMS sent to Eduardo');
    } catch (smsError) {
      console.warn('⚠️ SMS failed:', smsError.message);
    }

    // Send notification to Eduardo
    await resend.emails.send({
      from: 'Miyato Hibachi Dallas <noreply@miyatohibachidallas.co>',
      to: 'salinaseduardo275@gmail.com',
      subject: `🔥 New Booking — ${bookingId} | ${eventType} | ${formattedEventDate}`,
      html: `
        <h2>New Catering Booking!</h2>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Date:</strong> ${formattedEventDate}</p>
        <p><strong>Time:</strong> ${formattedEventTime}</p>
        <p><strong>Location:</strong> ${eventAddress}</p>
        <p><strong>Guests:</strong> ${guestCount}</p>
        <p><strong>Package:</strong> ${packageName} ($${pricePerPerson}/person)</p>
        <p><strong>Deposit Paid:</strong> $200.00 ✅</p>
      `
    });

    console.log('✅ Eduardo notification email sent');
    console.log('✅ Confirmation email sent');
    res.json({ success: true, emailSent: true, calendarEventCreated });
  } catch (error) {
    await logEmail({ type: 'catering_confirmation', to: req.body.customerEmail, subject: `Catering Confirmation ${req.body.bookingId}`, status: 'failed', errorMessage: error.message });
    console.error('❌ Email failed:', error);
    res.status(500).json({ success: false, error: 'Failed to send confirmation email' });
  }
});

// ================================================================
// ADMIN ENDPOINTS
// ================================================================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const totalBookings = await CateringBooking.countDocuments();
    const thisMonthBookings = await CateringBooking.countDocuments({ createdAt: { $gte: startOfMonth } });
    const revenueResult = await CateringBooking.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const upcomingBookings = await CateringBooking.countDocuments({ eventDate: { $gte: now, $lte: thirtyDaysFromNow } });
    const recentBookings = await CateringBooking.find().sort({ createdAt: -1 }).limit(10).select('customerName eventType eventDate totalAmount status createdAt');
    res.json({ totalBookings, thisMonthBookings, totalRevenue, upcomingBookings, recentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search?.trim()) {
      const r = new RegExp(search.trim(), 'i');
      filter.$or = [{ customerName: r }, { customerEmail: r }, { bookingNumber: r }];
    }
    const bookings = await CateringBooking.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit));
    const totalCount = await CateringBooking.countDocuments(filter);
    res.json({ bookings, totalCount, currentPage: parseInt(page), totalPages: Math.ceil(totalCount / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/admin/bookings/:id', async (req, res) => {
  try {
    const booking = await CateringBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

app.put('/api/admin/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const booking = await CateringBooking.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ================================================================
// START SERVER
// ================================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🔥 Miyato Hibachi Dallas Server Started!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`💳 Square: ${process.env.SQUARE_ACCESS_TOKEN ? 'Ready ✅' : 'Missing ❌'}`);
  console.log(`📧 Email: ${process.env.RESEND_API_KEY ? 'Ready ✅' : 'Missing ❌'}`);
  console.log(`🍃 MongoDB: ${process.env.MONGODB_URI ? 'Ready ✅' : 'Missing ❌'}`);
  console.log(`📅 Google Calendar: ${process.env.GOOGLE_CLIENT_ID ? 'Ready ✅' : 'Missing ❌'}`);
});