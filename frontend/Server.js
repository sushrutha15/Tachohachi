// // server.js - Complete Professional Food Ordering System Backend
// const express = require('express');
// const cors = require('cors');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const nodemailer = require('nodemailer');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/invoices', express.static('invoices')); // Serve PDF files

// // Database simulation (in production, use MongoDB/PostgreSQL)
// let orders = [];
// let customers = [];
// let invoiceCounter = 1000;

// // Email configuration
// const emailTransporter = nodemailer.createTransporter({
//   service: 'gmail', // or your preferred service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Generate Invoice Number
// const generateInvoiceNumber = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   invoiceCounter++;
//   return `INV-${year}${month}-${String(invoiceCounter).padStart(4, '0')}`;
// };

// // Generate Professional PDF Invoice
// const generateInvoicePDF = async (orderData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
//       const invoiceNumber = orderData.invoiceNumber || generateInvoiceNumber();
//       const filename = `invoice-${invoiceNumber}.pdf`;
//       const filepath = path.join(__dirname, 'invoices', filename);
      
//       // Ensure invoices directory exists
//       if (!fs.existsSync(path.join(__dirname, 'invoices'))) {
//         fs.mkdirSync(path.join(__dirname, 'invoices'));
//       }
      
//       const stream = fs.createWriteStream(filepath);
//       doc.pipe(stream);
      
//       // Header with restaurant branding
//       doc.fillColor('#F56F27')
//          .fontSize(28)
//          .text('The Curry Crate', 50, 50)
//          .fillColor('#4ECDC4')
//          .fontSize(14)
//          .text('Authentic Indian Cuisine', 50, 85)
//          .fillColor('#333333')
//          .fontSize(10)
//          .text('📧 orders@thecurrycrate.com | 📞 (555) 123-CURRY', 50, 105)
//          .text('🌐 www.thecurrycrate.com | 📍 123 Spice Street, Flavor City', 50, 120);
      
//       // Invoice title and number
//       doc.fillColor('#000000')
//          .fontSize(24)
//          .text('INVOICE', 400, 50)
//          .fontSize(12)
//          .text(`Invoice #: ${invoiceNumber}`, 400, 80)
//          .text(`Date: ${new Date(orderData.orderTime).toLocaleDateString()}`, 400, 95)
//          .text(`Order ID: ${orderData.orderId}`, 400, 110);
      
//       // Customer information
//       doc.fontSize(14)
//          .text('Bill To:', 50, 180)
//          .fontSize(12)
//          .text(orderData.customer.name, 50, 200)
//          .text(orderData.customer.email, 50, 215)
//          .text(orderData.customer.phone, 50, 230)
//          .text(`${orderData.customer.address}`, 50, 245)
//          .text(`${orderData.customer.city}, ${orderData.customer.zipCode}`, 50, 260);
      
//       // Payment information
//       doc.text('Payment Method:', 300, 180)
//          .text(orderData.paymentMethod === 'stripe' ? 'Credit/Debit Card' : 'Cash on Delivery', 300, 195)
//          .text(`Status: ${orderData.paymentStatus || 'Completed'}`, 300, 210);
      
//       // Table header
//       const tableTop = 320;
//       doc.font('Helvetica-Bold')
//          .text('Item', 50, tableTop)
//          .text('Qty', 300, tableTop)
//          .text('Price', 350, tableTop)
//          .text('Total', 450, tableTop);
      
//       // Draw line under header
//       doc.moveTo(50, tableTop + 15)
//          .lineTo(550, tableTop + 15)
//          .stroke();
      
//       // Table items
//       let currentY = tableTop + 30;
//       doc.font('Helvetica');
      
//       orderData.items.forEach((item, index) => {
//         const price = typeof item.price === 'string' ? 
//           parseFloat(item.price.replace(/[^0-9.]/g, '')) : 
//           parseFloat(item.price);
//         const total = price * item.quantity;
        
//         doc.text(item.name, 50, currentY)
//            .text(item.quantity.toString(), 300, currentY)
//            .text(`$${price.toFixed(2)}`, 350, currentY)
//            .text(`$${total.toFixed(2)}`, 450, currentY);
        
//         // Add item description if available
//         if (item.description) {
//           currentY += 15;
//           doc.fillColor('#666666')
//              .fontSize(9)
//              .text(item.description, 50, currentY)
//              .fillColor('#000000')
//              .fontSize(12);
//         }
        
//         currentY += 25;
//       });
      
//       // Totals section
//       const totalsY = currentY + 20;
//       doc.moveTo(350, totalsY)
//          .lineTo(550, totalsY)
//          .stroke();
      
//       doc.text(`Subtotal:`, 350, totalsY + 10)
//          .text(`$${orderData.totals.subtotal.toFixed(2)}`, 450, totalsY + 10)
//          .text(`Delivery Fee:`, 350, totalsY + 25)
//          .text(orderData.totals.deliveryFee > 0 ? `$${orderData.totals.deliveryFee.toFixed(2)}` : 'FREE', 450, totalsY + 25)
//          .text(`Tax (8%):`, 350, totalsY + 40)
//          .text(`$${orderData.totals.tax.toFixed(2)}`, 450, totalsY + 40);
      
//       if (orderData.totals.codFee && orderData.totals.codFee > 0) {
//         doc.text(`COD Fee:`, 350, totalsY + 55)
//            .text(`$${orderData.totals.codFee.toFixed(2)}`, 450, totalsY + 55);
//       }
      
//       // Total line
//       doc.moveTo(350, totalsY + 70)
//          .lineTo(550, totalsY + 70)
//          .stroke();
      
//       doc.font('Helvetica-Bold')
//          .fontSize(14)
//          .text(`TOTAL:`, 350, totalsY + 80)
//          .text(`$${orderData.totals.total.toFixed(2)}`, 450, totalsY + 80);
      
//       // Special instructions
//       if (orderData.customer.specialInstructions) {
//         doc.font('Helvetica')
//            .fontSize(12)
//            .text('Special Instructions:', 50, totalsY + 120)
//            .text(orderData.customer.specialInstructions, 50, totalsY + 135);
//       }
      
//       // Footer
//       doc.fontSize(10)
//          .fillColor('#666666')
//          .text('Thank you for choosing The Curry Crate!', 50, doc.page.height - 100)
//          .text('Estimated delivery: 30-45 minutes | Questions? Call (555) 123-CURRY', 50, doc.page.height - 85)
//          .text('Follow us: @TheCurryCrate | Visit: www.thecurrycrate.com', 50, doc.page.height - 70);
      
//       doc.end();
      
//       stream.on('finish', () => {
//         resolve(filepath);
//       });
      
//       stream.on('error', reject);
      
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// // Send professional email with invoice
// const sendInvoiceEmail = async (orderData, invoicePath) => {
//   const emailTemplate = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .header { background: linear-gradient(135deg, #F56F27, #ff8f57); padding: 30px; text-align: center; color: white; }
//         .content { padding: 30px; background: white; }
//         .order-summary { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
//         .total { font-size: 18px; font-weight: bold; color: #28a745; }
//         .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
//         .button { background: #F56F27; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>🍛 Order Confirmed!</h1>
//         <p>Thank you for choosing The Curry Crate, ${orderData.customer.name}!</p>
//       </div>
      
//       <div class="content">
//         <h2>📋 Order Details</h2>
//         <div class="order-summary">
//           <p><strong>Order ID:</strong> ${orderData.orderId}</p>
//           <p><strong>Invoice #:</strong> ${orderData.invoiceNumber}</p>
//           <p><strong>Order Time:</strong> ${new Date(orderData.orderTime).toLocaleString()}</p>
//           <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'stripe' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
//           <p class="total"><strong>Total Amount: $${orderData.totals.total.toFixed(2)}</strong></p>
//         </div>
        
//         <h3>🍽️ Your Items:</h3>
//         <ul>
//           ${orderData.items.map(item => `
//             <li><strong>${item.name}</strong> x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
//           `).join('')}
//         </ul>
        
//         <h3>📍 Delivery Information</h3>
//         <p><strong>Address:</strong> ${orderData.customer.address}, ${orderData.customer.city} ${orderData.customer.zipCode}</p>
//         <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
//         <p><strong>Estimated Delivery:</strong> 30-45 minutes</p>
        
//         ${orderData.customer.specialInstructions ? `
//           <h3>📝 Special Instructions</h3>
//           <p>${orderData.customer.specialInstructions}</p>
//         ` : ''}
        
//         <div style="text-align: center; margin: 30px 0;">
//           <a href="http://localhost:1234/track/${orderData.orderId}" class="button">Track Your Order</a>
//         </div>
//       </div>
      
//       <div class="footer">
//         <p>📧 Questions? Reply to this email or call <strong>(555) 123-CURRY</strong></p>
//         <p>🌐 Visit us: www.thecurrycrate.com | Follow us: @TheCurryCrate</p>
//         <p>The Curry Crate - Authentic Indian Cuisine Delivered Fresh</p>
//       </div>
//     </body>
//     </html>
//   `;
  
//   const mailOptions = {
//     from: `"The Curry Crate" <${process.env.EMAIL_USER}>`,
//     to: orderData.customer.email,
//     subject: `Invoice & Order Confirmation - ${orderData.invoiceNumber} | The Curry Crate`,
//     html: emailTemplate,
//     attachments: [{
//       filename: `Invoice-${orderData.invoiceNumber}.pdf`,
//       path: invoicePath
//     }]
//   };
  
//   await emailTransporter.sendMail(mailOptions);
// };

// // Send restaurant notification
// const sendRestaurantNotification = async (orderData) => {
//   const restaurantEmailTemplate = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; }
//         .alert { background: #dc3545; color: white; padding: 20px; text-align: center; }
//         .order-details { background: #fff3cd; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107; }
//         .customer-info { background: #d1ecf1; padding: 20px; margin: 20px 0; border-left: 4px solid #17a2b8; }
//         .items { background: #d4edda; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745; }
//         .urgent { background: #f8d7da; padding: 15px; text-align: center; font-weight: bold; }
//       </style>
//     </head>
//     <body>
//       <div class="alert">
//         <h1>🚨 NEW ORDER RECEIVED</h1>
//         <h2>Order #${orderData.orderId}</h2>
//       </div>
      
//       <div class="order-details">
//         <h3>📊 Order Summary</h3>
//         <p><strong>Order Time:</strong> ${new Date(orderData.orderTime).toLocaleString()}</p>
//         <p><strong>Total Amount:</strong> $${orderData.totals.total.toFixed(2)}</p>
//         <p><strong>Payment:</strong> ${orderData.paymentMethod === 'stripe' ? 'PAID - Credit Card' : 'COD - Cash on Delivery'}</p>
//         <p><strong>Invoice #:</strong> ${orderData.invoiceNumber}</p>
//       </div>
      
//       <div class="customer-info">
//         <h3>👤 Customer Details</h3>
//         <p><strong>Name:</strong> ${orderData.customer.name}</p>
//         <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
//         <p><strong>Email:</strong> ${orderData.customer.email}</p>
//         <p><strong>Address:</strong> ${orderData.customer.address}, ${orderData.customer.city} ${orderData.customer.zipCode}</p>
//         ${orderData.customer.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.customer.specialInstructions}</p>` : ''}
//       </div>
      
//       <div class="items">
//         <h3>🍽️ Items to Prepare</h3>
//         ${orderData.items.map(item => `
//           <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px;">
//             <strong>${item.name}</strong> x${item.quantity}
//             ${item.type ? `<span style="background: ${item.type === 'veg' ? '#28a745' : '#dc3545'}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px;">${item.type.toUpperCase()}</span>` : ''}
//             ${item.spicy ? '<span style="color: #dc3545;">🌶️ SPICY</span>' : ''}
//           </div>
//         `).join('')}
//       </div>
      
//       ${orderData.totals.total > 50 ? '<div class="urgent">🔥 HIGH VALUE ORDER - PRIORITY PREPARATION 🔥</div>' : ''}
      
//       <div style="text-align: center; padding: 20px; background: #f8f9fa;">
//         <h3>⏰ ESTIMATED PREP TIME: 25-30 MINUTES</h3>
//         <p>Please start preparation immediately and update order status.</p>
//       </div>
//     </body>
//     </html>
//   `;
  
//   const mailOptions = {
//     from: `"Order System" <${process.env.EMAIL_USER}>`,
//     to: process.env.RESTAURANT_EMAIL || 'kitchen@thecurrycrate.com',
//     subject: `🚨 NEW ORDER - ${orderData.orderId} | $${orderData.totals.total.toFixed(2)}`,
//     html: restaurantEmailTemplate
//   };
  
//   await emailTransporter.sendMail(mailOptions);
// };

// // API ROUTES

// // 1. Create Stripe Checkout Session with Invoice Generation
// app.post('/api/create-comprehensive-checkout', async (req, res) => {
//   try {
//     const orderData = req.body;
    
//     // Generate invoice number
//     orderData.invoiceNumber = generateInvoiceNumber();
//     orderData.orderId = 'CC' + Date.now().toString().slice(-8);
    
//     // Create line items for Stripe
//     const lineItems = orderData.items.map(item => {
//       const price = typeof item.price === 'string' ? 
//         parseFloat(item.price.replace(/[^0-9.]/g, '')) : 
//         parseFloat(item.price);
      
//       return {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: item.name,
//             description: item.description || `Delicious ${item.name} from The Curry Crate`,
//             metadata: {
//               type: item.type || 'food',
//               spicy: item.spicy ? 'yes' : 'no'
//             }
//           },
//           unit_amount: Math.round(price * 100),
//         },
//         quantity: item.quantity,
//       };
//     });
    
//     // Add delivery fee if applicable
//     if (orderData.totals.deliveryFee > 0) {
//       lineItems.push({
//         price_data: {
//           currency: 'usd',
//           product_data: { name: 'Delivery Fee' },
//           unit_amount: Math.round(orderData.totals.deliveryFee * 100),
//         },
//         quantity: 1,
//       });
//     }
    
//     // Add tax
//     lineItems.push({
//       price_data: {
//         currency: 'usd',
//         product_data: { name: 'Tax (8%)' },
//         unit_amount: Math.round(orderData.totals.tax * 100),
//       },
//       quantity: 1,
//     });

//     // Create Stripe session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL || 'http://localhost:1234'}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:1234'}/cart`,
//       customer_email: orderData.customer.email,
//       metadata: {
//         orderId: orderData.orderId,
//         invoiceNumber: orderData.invoiceNumber,
//         customerData: JSON.stringify(orderData.customer),
//         orderData: JSON.stringify(orderData)
//       }
//     });

//     res.json({ id: session.id });
    
//   } catch (error) {
//     console.error('Checkout session creation error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // 2. Create Cash on Delivery Order
// app.post('/api/create-cod-order', async (req, res) => {
//   try {
//     const orderData = req.body;
//     orderData.orderId = 'CC' + Date.now().toString().slice(-8);
//     orderData.invoiceNumber = generateInvoiceNumber();
//     orderData.paymentStatus = 'pending';
    
//     // Generate PDF invoice
//     const invoicePath = await generateInvoicePDF(orderData);
    
//     // Send customer email with invoice
//     await sendInvoiceEmail(orderData, invoicePath);
    
//     // Send restaurant notification
//     await sendRestaurantNotification(orderData);
    
//     // Store order
//     orders.push(orderData);
    
//     res.json({ 
//       success: true, 
//       orderId: orderData.orderId,
//       invoiceNumber: orderData.invoiceNumber,
//       message: 'Order created successfully'
//     });
    
//   } catch (error) {
//     console.error('COD order creation error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // 3. Stripe Webhook Handler
// app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.log(`Webhook signature verification failed.`, err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
    
//     try {
//       // Parse order data from metadata
//       const orderData = JSON.parse(session.metadata.orderData);
//       orderData.paymentStatus = 'completed';
//       orderData.stripeSessionId = session.id;
      
//       // Generate PDF invoice
//       const invoicePath = await generateInvoicePDF(orderData);
      
//       // Send customer email with invoice
//       await sendInvoiceEmail(orderData, invoicePath);
      
//       // Send restaurant notification
//       await sendRestaurantNotification(orderData);
      
//       // Store order
//       orders.push(orderData);
      
//       console.log(`Order ${orderData.orderId} processed successfully`);
      
//     } catch (error) {
//       console.error('Webhook processing error:', error);
//     }
//   }

//   res.json({received: true});
// });

// // 4. Get Checkout Session Details
// app.get('/api/checkout-session/:sessionId', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
//     res.json(session);
//   } catch (error) {
//     res.status(404).json({ error: 'Session not found' });
//   }
// });

// // 5. Get All Orders (for restaurant dashboard)
// app.get('/api/orders', (req, res) => {
//   res.json({
//     orders: orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)),
//     stats: {
//       totalOrders: orders.length,
//       totalRevenue: orders.reduce((sum, order) => sum + order.totals.total, 0),
//       pendingOrders: orders.filter(order => order.status !== 'delivered').length
//     }
//   });
// });

// // 6. Update Order Status
// app.post('/api/update-order-status', async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
    
//     const order = orders.find(o => o.orderId === orderId);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
    
//     order.status = status;
//     order.lastUpdated = new Date().toISOString();
    
//     // Send status update email to customer
//     const statusMessages = {
//       'confirmed': '✅ Your order has been confirmed and is being prepared!',
//       'preparing': '👨‍🍳 Your delicious food is being prepared right now!',
//       'ready': '✅ Your order is ready for delivery!',
//       'out-for-delivery': '🚚 Your order is on the way!',
//       'delivered': '🎉 Order delivered! Enjoy your meal!'
//     };
    
//     // Send update email (simplified version)
//     const updateEmailOptions = {
//       from: `"The Curry Crate" <${process.env.EMAIL_USER}>`,
//       to: order.customer.email,
//       subject: `Order Update - ${orderId}`,
//       html: `
//         <h2>${statusMessages[status]}</h2>
//         <p>Hi ${order.customer.name},</p>
//         <p>Your order ${orderId} status has been updated.</p>
//         <p><strong>Current Status:</strong> ${status.toUpperCase()}</p>
//         <p>Thank you for choosing The Curry Crate!</p>
//       `
//     };
    
//     await emailTransporter.sendMail(updateEmailOptions);
    
//     res.json({ success: true, message: 'Order status updated' });
//   } catch (error) {
//     console.error('Status update error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // 7. Download Invoice
// app.get('/api/invoice/:invoiceNumber', (req, res) => {
//   const invoicePath = path.join(__dirname, 'invoices', `invoice-${req.params.invoiceNumber}.pdf`);
  
//   if (fs.existsSync(invoicePath)) {
//     res.download(invoicePath);
//   } else {
//     res.status(404).json({ error: 'Invoice not found' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 The Curry Crate API Server running on port ${PORT}`);
//   console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing STRIPE_SECRET_KEY'}`);
//   console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Missing EMAIL_USER'}`);
//   console.log(`📁 Invoices: ./invoices/ directory`);
// });