import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const PRICES = {
  duo: 57,
  trio: 67,
  kids: 37,
  setup: 15,
  deposit: 200
};

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState({
    adultCount: "",
    kidsCount: "",
    package: "duo",
    addSetup: false,
    eventDate: "",
    location: "",
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuote((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      answer:
        "Our full-service hibachi includes a live cooking show, professional chef, all equipment, setup/cleanup, hibachi fried rice, assorted grilled vegetables, yum-yum sauce, and hot sauce.",
    },
    {
      question: "What's your minimum guest count?",
      answer:
        "We require a minimum of 20 guests for our live hibachi service. Reach out to us for smaller gatherings and we'll see what we can do!",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 2-3 weeks in advance, especially for weekend events. However, we can sometimes accommodate last-minute requests.",
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer:
        "Absolutely! We offer a kids meal and various protein options. Please let us know about any dietary needs when booking.",
    },
  ];

  const ChevronRight = () => (
    <svg
      className="w-4 h-4 text-slate-300 group-hover:text-[#FF7E21] ml-auto transition-colors duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="font-sans text-slate-800 bg-white">
      <Navbar />

      <section id="contact" className="py-20 bg-white pt-40">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-10 opacity-0"
            }`}
          >
            <span className="inline-block bg-amber-100 text-amber-800 text-md font-semibold px-4 py-2 rounded-full mb-4">
              Get In Touch
            </span>
            <h2 className="text-5xl font-bold text-[#E78229] mb-6">
              Contact Miyato Hibachi Dallas
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Use our instant quote calculator to get an estimate for your
              event, then reach out to book your date!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className=" border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-medium text-[#E78229] mb-4">Service Area</h3>
              <div className="space-y-2">
                <p className="text-slate-600">Dallas-Fort Worth Metroplex</p>
                <p className="text-slate-600">Mesquite, Irving, Plano, Frisco</p>
                <p className="text-slate-600">Custom travel available</p>
              </div>
            </div>
            <div className=" border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-medium text-[#E78229] mb-4">Call Us</h3>
              <div className="space-y-2">
                <p className="text-slate-600 font-semibold">(972) 589-1422</p>
                <p className="text-slate-600">Mon-Sun: 9AM - 8PM</p>
              </div>
            </div>
            <div className=" border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-medium text-[#E78229] mb-4">Email Us</h3>
              <div className="space-y-2">
                <p className="text-slate-600">salinaseduardo275@gmail.com</p>
                <p className="text-slate-600">We reply within 4 hours</p>
              </div>
            </div>
            <div className=" border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-medium text-[#E78229] mb-4">Event Types</h3>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Instant Quote Calculator
              </h3>
              <p className="text-slate-500 mb-6 text-sm">
                Fill in your event details to get an instant estimate.
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Adult Guests
                    </label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kids (10 & under)
                    </label>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adult Package
                  </label>
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
                    <p className="text-slate-500 mt-1">
                      Tables, chairs, tablecloths, napkins, plates, bowls,
                      utensils, and chopsticks included
                    </p>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={quote.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Location / City
                  </label>
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

              {hasQuote && (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    Estimated Quote
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600 border-b border-slate-200 pb-4 mb-4">
                    {adults > 0 && (
                      <div className="flex justify-between">
                        <span>Adults ({adults} x ${PRICES[quote.package]})</span>
                        <span>${adultCost.toLocaleString()}</span>
                      </div>
                    )}
                    {kids > 0 && (
                      <div className="flex justify-between">
                        <span>Kids ({kids} x ${PRICES.kids})</span>
                        <span>${kidsCost.toLocaleString()}</span>
                      </div>
                    )}
                    {quote.addSetup && (
                      <div className="flex justify-between">
                        <span>Event Setup ({totalGuests} x $15)</span>
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
                    For events 30+ min from Mesquite, TX a $50 travel fee may apply. For events 60+ min a $100 travel fee may apply.
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
              <div className="bg-slate-900 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Business Hours</h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monday - Sunday</span>
                  <span className="font-semibold">10:00 AM - 11:00 PM</span>
                </div>
                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-sm">
                    <strong>Call or Text:</strong> (972) 589-1422 for same-day
                    or urgent requests!
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-slate-900 mb-4">
                    Dallas-Fort Worth Coverage
                  </h4>
                  <p className="text-slate-600 mb-6">
                    We proudly serve the entire DFW metroplex with our live
                    hibachi service.
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
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Frequently Asked Questions
              </h3>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to know about our hibachi catering service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact & Social */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Quick Contact */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Quick Contact
              </h3>
              <div className="space-y-3">

                <a
                  href="tel:+19725891422"
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-[#FF7E21] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <PhoneIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Immediate Response
                    </p>
                    <p className="text-slate-900 font-bold">(972) 589-1422</p>
                  </div>
                  <ChevronRight />
                </a>

                <a
                  href="sms:+19725891422"
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-[#FF7E21] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <MessageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Text Us
                    </p>
                    <p className="text-slate-900 font-bold">(972) 589-1422</p>
                  </div>
                  <ChevronRight />
                </a>

                <a
                  href="mailto:salinaseduardo275@gmail.com"
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-[#FF7E21] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <EmailIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Email Us
                    </p>
                    <p className="text-slate-900 font-bold">
                      salinaseduardo275@gmail.com
                    </p>
                  </div>
                  <ChevronRight />
                </a>

              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Follow Miyato Hibachi Dallas
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Stay updated with live event highlights, behind-the-scenes, and
                our latest specials.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">

                <a
                  href="https://instagram.com/miyatohibachidallas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-[#FF7E21] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <InstagramIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Instagram</p>
                    <p className="text-slate-400 text-xs">@miyatohibachi</p>
                  </div>
                </a>

                <a
                  href="https://facebook.com/miyatohibachidallas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-[#FF7E21] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <FacebookIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Facebook</p>
                    <p className="text-slate-400 text-xs">Miyato Hibachi Dallas</p>
                  </div>
                </a>

                <a
                  href="https://tiktok.com/@miyatohibachidallas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-[#FF7E21] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <TikTokIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">TikTok</p>
                    <p className="text-slate-400 text-xs">@miyatohibachi</p>
                  </div>
                </a>

                <a
                  href="https://youtube.com/@miyatohibachidallas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-[#FF7E21] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-[#FF7E21] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <YoutubeIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">YouTube</p>
                    <p className="text-slate-400 text-xs">Miyato Hibachi Dallas</p>
                  </div>
                </a>

              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-700 font-medium">
                  Follow{" "}
                  <strong className="text-[#FF7E21]">@MiyatoHibachiDallas</strong>{" "}
                  for event highlights, food reels, and exclusive promos!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600">
            &copy; 2025 Miyato Hibachi Dallas. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;