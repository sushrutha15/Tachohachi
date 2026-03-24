import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const PRICES = {
  duo: 57,
  trio: 67,
  kids: 37,
  setup: 15,
  deposit: 200
};

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState({
    adultCount: '',
    kidsCount: '',
    package: 'duo',
    addSetup: false,
    eventDate: '',
    location: ''
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuote(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const adults = parseInt(quote.adultCount) || 0;
  const kids = parseInt(quote.kidsCount) || 0;
  const totalGuests = adults + kids;

  const adultCost = adults * PRICES[quote.package];
  const kidsCost = kids * PRICES.kids;
  const setupCost = quote.addSetup ? totalGuests * PRICES.setup : 0;
  const totalCost = adultCost + kidsCost + setupCost;
  const balance = totalCost - PRICES.deposit;
  const hasQuote = totalGuests > 0;

  const faqs = [
    {
      question: "What's included in your hibachi service?",
      answer: "Our full-service hibachi includes a live cooking show, professional chef, all equipment, setup/cleanup, hibachi fried rice, assorted grilled vegetables, yum-yum sauce, and hot sauce."
    },
    {
      question: "What's your minimum guest count?",
      answer: "We require a minimum of 20 guests for our live hibachi service. Reach out to us for smaller gatherings and we'll see what we can do!"
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 2-3 weeks in advance, especially for weekend events. However, we can sometimes accommodate last-minute requests."
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Absolutely! We offer a kids meal and various protein options. Please let us know about any dietary needs when booking."
    }
  ];

  return (
    <div className="font-sans text-slate-800 bg-white">
      <Navbar />

      <section id="contact" className="py-20 bg-white pt-40">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
          }`}>
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
              Get In Touch
            </span>
            <h2 className="text-5xl font-bold text-[#E78229] mb-6">Contact Miyato Hibachi Dallas</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Use our instant quote calculator to get an estimate for your event, then reach out to book your date!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Service Area</h3>
              <div className="space-y-2">
                <p className="text-slate-600">Dallas-Fort Worth Metroplex</p>
                <p className="text-slate-600">Mesquite, Irving, Plano, Frisco</p>
                <p className="text-slate-600">Custom travel available</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Call Us</h3>
              <div className="space-y-2">
                <p className="text-slate-600 font-semibold">(972) 589-1422</p>
                <p className="text-slate-600">Mon-Sun: 9AM - 8PM</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Email Us</h3>
              <div className="space-y-2">
                <p className="text-slate-600">salinaseduardo275@gmail.com</p>
                <p className="text-slate-600">We reply within 4 hours</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Event Types</h3>
              <div className="space-y-2">
                <p className="text-slate-600">Corporate Events</p>
                <p className="text-slate-600">Weddings & Parties</p>
                <p className="text-slate-600">Private Gatherings</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

            {/* Quote Calculator */}
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Instant Quote Calculator</h3>
              <p className="text-slate-500 mb-6 text-sm">Fill in your event details to get an instant estimate.</p>

              <div className="space-y-5">
                {/* Guest Counts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adult Guests</label>
                    <input
                      type="number"
                      name="adultCount"
                      value={quote.adultCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kids (10 & under)</label>
                    <input
                      type="number"
                      name="kidsCount"
                      value={quote.kidsCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                      placeholder="e.g. 2"
                    />
                  </div>
                </div>

                {/* Package */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Adult Package</label>
                  <select
                    name="package"
                    value={quote.package}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  >
                    <option value="duo">Duo — Any 2 Proteins ($57/person)</option>
                    <option value="trio">Trio — Any 3 Proteins ($67/person)</option>
                  </select>
                </div>

                {/* Add-on */}
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    name="addSetup"
                    id="addSetup"
                    checked={quote.addSetup}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-orange-500"
                  />
                  <label htmlFor="addSetup" className="text-sm text-slate-700 cursor-pointer">
                    <span className="font-semibold">Stress-Free Event Setup</span> — $15/person
                    <p className="text-slate-500 mt-1">Tables, chairs, tablecloths, napkins, plates, bowls, utensils, and chopsticks included</p>
                  </label>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={quote.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Location / City</label>
                  <input
                    type="text"
                    name="location"
                    value={quote.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                    placeholder="e.g. Irving, TX"
                  />
                </div>
              </div>

              {/* Quote Result */}
              {hasQuote && (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Estimated Quote</h4>
                  <div className="space-y-2 text-sm text-slate-600 border-b border-slate-200 pb-4 mb-4">
                    {adults > 0 && (
                      <div className="flex justify-between">
                        <span>Adults ({adults} × ${PRICES[quote.package]})</span>
                        <span>${adultCost.toLocaleString()}</span>
                      </div>
                    )}
                    {kids > 0 && (
                      <div className="flex justify-between">
                        <span>Kids ({kids} × ${PRICES.kids})</span>
                        <span>${kidsCost.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.addSetup && (
                      <div className="flex justify-between">
                        <span>Event Setup ({totalGuests} × $15)</span>
                        <span>${setupCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-semibold text-slate-900 text-base">
                      <span>Total Event Cost</span>
                      <span>${totalCost.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Deposit to Secure Date</span>
                      <span>$200.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Balance Due on Event Day</span>
                      <span>${Math.max(balance, 0).toLocaleString()}.00</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    📍 For events 30+ min from Mesquite, TX — a $50 travel fee may apply. For events 60+ min — a $100 travel fee may apply.
                  </div>
                  <a
                    href="/book-catering"
                    className="mt-4 block w-full text-center bg-[#FF7E21] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8">

              {/* Hours */}
              <div className="bg-slate-900 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Business Hours</h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monday - Sunday</span>
                  <span className="font-semibold">10:00 AM - 11:00 PM</span>
                </div>
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm">
                    <strong>📞 Call or Text:</strong> (972) 589-1422 for same-day or urgent requests!
                  </p>
                </div>
              </div>

              {/* Service Area */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">Dallas-Fort Worth Coverage</h4>
                  <p className="text-slate-600 mb-6">
                    We proudly serve the entire DFW metroplex with our live hibachi service.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>✓ Dallas</div>
                    <div>✓ Fort Worth</div>
                    <div>✓ Irving</div>
                    <div>✓ Plano</div>
                    <div>✓ Frisco</div>
                    <div>✓ McKinney</div>
                    <div>✓ Arlington</div>
                    <div>✓ Garland</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to know about our hibachi catering service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h4>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact & Social */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Quick Contact */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold text-slate-900">Call or Text</p>
                    <p className="text-green-600 font-bold">(972) 589-1422</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-semibold text-slate-900">Email Us</p>
                    <p className="text-blue-600">salinaseduardo275@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-slate-900">Last-Minute Events?</p>
                    <p className="text-amber-600">Call or text us directly!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Follow Our Journey</h3>
              <p className="text-slate-600 mb-6">
                Stay updated with our latest hibachi events, highlights, and behind-the-scenes content!
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>📱 Follow @MiyatoHibachiDallas</strong> for event highlights and updates — social links coming soon!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600">&copy; 2025 Miyato Hibachi Dallas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;