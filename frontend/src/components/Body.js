import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import About from "./About";
import Contact from "./Contact";
import Navbar from "./Navbar";
import { menuData } from "../data/MenuData";
import hibachiProteins from '../hibachi-proteins.jpg';

const Body = () => {
  const [menu, setMenu] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    setMenu(menuData);
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const popularDishes = menu.slice(0, 6);

  const handlePackageSelect = (packageName) => {
    setSelectedPackage(packageName);
  };

  return (
    <div className="font-sans text-gray-800 bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen flex items-center pt-20"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${
              isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
            }`}>
              <div className="mb-6">
                <span className="inline-block bg-amber-100 text-amber-800 text-md font-semibold px-4 py-2 rounded-full mb-4">
                  Live Catering
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-[#E78229] leading-tight mb-6">
                  Miyato Hibachi Dallas
                  <span className="block text-slate-600 text-4xl md:text-5xl font-light">
                    
                  </span>
                </h1>
              </div>

              <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-lg">
                Experience authentic hibachi cooking at your event. Professional chefs bring the 
                complete hibachi experience directly to your location with live cooking entertainment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/book-catering"
                  className="bg-[#FF7E21] hover:bg-[#e66a1c] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 text-center"
                >
                  Book Your Event
                </Link>
               
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#06B800]">500+</div>
                  <div className="text-sm text-[#023400]">Events Catered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#06B800]">8+</div>
                  <div className="text-sm text-[#023400]">Protein Options</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#06B800]">4.9 <span className="text-amber-400">★</span></div>
                  <div className="text-sm text-[#023400]">Client Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG_2344.jpeg/:/cr=t:16.67%25,l:0%25,w:100%25,h:66.67%25/rs=w:1200,h:600,cg:true"
                  alt="Live Hibachi Cooking Experience"
                  className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-amber-500 text-black p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-medium">Live Cooking</div>
                  <div className="text-xs text-black">Entertainment Included</div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-slate-900 rounded-full opacity-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-slate-100 text-slate-700 text-md font-semibold px-4 py-2 rounded-full mb-4">
              Catering Packages
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Choose Your Hibachi Package</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All packages include premium ingredients, live cooking entertainment, and full service.
              Priced per person based on your guest count.
            </p>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

            {/* Duo Package - Most Popular */}
            {/* Duo Package */}
<div 
  className={`bg-white border-2 rounded-xl p-6 relative hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
    selectedPackage === 'duo' ? 'border-[#FF7E21] bg-orange-50 shadow-lg' : 'border-[#FF7E21]'
  }`}
  onClick={() => handlePackageSelect('duo')}
>
  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
    <span className="bg-[#FF7E21] text-white px-3 py-1 rounded-full text-xs font-medium">
      MOST POPULAR
    </span>
  </div>
  <div className="flex-1">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Duo — Any 2 Proteins</h3>
      <div className="text-3xl font-bold text-[#FF7E21] mb-1">$57</div>
      <div className="text-sm text-slate-500">per person</div>
    </div>
    <ul className="space-y-2 text-sm text-slate-600 mb-6">
      <li>✓ 1 Chef & 1 Server</li>
      <li>✓ Starter salad with signature ginger dressing</li>
      <li>✓ 2 Proteins: Steak / Shrimp / Chicken / Salmon / Mahi-Mahi / Tuna</li>
      <li>✓ Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20</li>
      <li>✓ Hibachi fried rice</li>
      <li>✓ Assorted grilled vegetables</li>
      <li>✓ Yum-yum sauce & hot sauce</li>
      <li>✓ Live hibachi cooking show</li>
    </ul>
  </div>
  <Link
    to="/book-catering"
    className="w-full bg-[#FF7E21] hover:bg-[#e66a1c] text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center block text-sm mt-auto"
  >
    Book This Package
  </Link>
</div>

{/* Trio Package */}
<div 
  className={`bg-white border-2 rounded-xl p-6 relative hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
    selectedPackage === 'trio' ? 'border-[#FF7E21] bg-orange-50 shadow-lg' : 'border-slate-200'
  }`}
  onClick={() => handlePackageSelect('trio')}
>
  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 invisible">
    <span className="bg-transparent px-3 py-1 rounded-full text-xs font-medium">
      PLACEHOLDER
    </span>
  </div>
  <div className="flex-1">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Trio — Any 3 Proteins</h3>
      <div className="text-3xl font-bold text-[#FF7E21] mb-1">$67</div>
      <div className="text-sm text-slate-500">per person</div>
    </div>
    <ul className="space-y-2 text-sm text-slate-600 mb-6">
      <li>✓ 1 Chef & 1 Server</li>
      <li>✓ Starter salad with signature ginger dressing</li>
      <li>✓ 3 Proteins: Steak / Shrimp / Chicken / Salmon / Mahi-Mahi / Tuna</li>
      <li>✓ Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20</li>
      <li>✓ Hibachi fried rice</li>
      <li>✓ Assorted grilled vegetables</li>
      <li>✓ Yum-yum sauce & hot sauce</li>
      <li>✓ Live hibachi cooking show</li>
    </ul>
  </div>
  <Link
    to="/book-catering"
    className="w-full bg-[#FF7E21] hover:bg-[#e66a1c] text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center block text-sm mt-auto"
  >
    Book This Package
  </Link>
</div>

{/* Kids Meal Package */}
<div 
  className={`bg-gradient-to-br from-slate-50 to-slate-100 border-2 rounded-xl p-6 relative hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
    selectedPackage === 'kids' ? 'border-[#FF7E21] bg-orange-50 shadow-lg' : 'border-slate-300'
  }`}
  onClick={() => handlePackageSelect('kids')}
>
  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">
      KIDS (10 & UNDER)
    </span>
  </div>
  <div className="flex-1">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Kids Meal</h3>
      <div className="text-3xl font-bold text-slate-900 mb-1">$37</div>
      <div className="text-sm text-slate-500">per person</div>
    </div>
    <ul className="space-y-2 text-sm text-slate-600 mb-6">
      <li>✓ 1 Chef & 1 Server</li>
      <li>✓ Starter salad with signature ginger dressing</li>
      <li>✓ 1 Protein: Steak / Shrimp / Chicken</li>
      <li>✓ Upgrades: Scallop +$7 | Filet +$15 | Lobster +$20</li>
      <li>✓ Hibachi fried rice</li>
      <li>✓ Assorted grilled vegetables</li>
      <li>✓ Yum-yum sauce & hot sauce</li>
      <li>✓ Live hibachi cooking show</li>
    </ul>
  </div>
  <Link
    to="/book-catering"
    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center block text-sm mt-auto"
  >
    Book This Package
  </Link>
</div>

          </div>

          {/* Package Details */}
          <div className="bg-slate-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">What's Included in Every Package</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Every package includes our signature hibachi experience with live cooking entertainment
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center border border-gray-200 shadow-md p-4 rounded-md">
                <h4 className="font-semibold text-slate-900 mb-3">Choose Your Proteins</h4>
                <p className="text-sm text-slate-600">Steak, Shrimp, Chicken, Salmon, Mahi-Mahi, or Tuna. Upgrade to Scallop, Filet Mignon, or Lobster.</p>
              </div>
              <div className="text-center border border-gray-200 shadow-md p-4 rounded-md">
                <h4 className="font-semibold text-slate-900 mb-3">Full Hibachi Sides</h4>
                <p className="text-sm text-slate-600">Starter salad with signature ginger dressing, hibachi fried rice, and assorted grilled vegetables.</p>
              </div>
              <div className="text-center border border-gray-200 shadow-md p-4 rounded-md">
                <h4 className="font-semibold text-slate-900 mb-3">Sauces & Service</h4>
                <p className="text-sm text-slate-600">Yum-yum sauce, hot sauce, 1 professional chef and 1 server for your entire event.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Book?</h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              All packages include setup, live cooking entertainment, and cleanup
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-catering"
                className="bg-[#FF7E21] hover:bg-[#e66a1c] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Book Your Package
              </Link>
              <Link
                to="/contact"
                className="border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Choose Miyato Hibachi Dallas?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We bring authentic hibachi entertainment and delicious food directly to your event location
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/3F06A88C-5B4D-4FE5-8285-024AE71DED15.jpeg/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:730,h:730,cg:true"
                  alt="Professional Hibachi Chef"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Professional Chefs</h3>
              <p className="text-slate-600">Experienced hibachi chefs who entertain while they cook</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/fb_153846440727752_960x720.jpg/:/"
                  alt="Live Hibachi Cooking Show"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Live Hibachi Show</h3>
              <p className="text-slate-600">Interactive cooking performance with tricks and entertainment</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://wendypolisi.com/wp-content/uploads/2024/03/hibachi-steak-h.jpg"
                  alt="Premium Fresh Ingredients"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Premium Proteins</h3>
              <p className="text-slate-600">Fresh chicken, steak, salmon, shrimp, and premium upgrades</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/20230421_193256.jpg/:/rs=w:2320,h:1740"
                  alt="Complete Professional Service"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Complete Service</h3>
              <p className="text-slate-600">Full setup, cooking, service, and cleanup included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Perfect for Every Occasion</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From intimate gatherings to large celebrations, we bring the hibachi experience to any event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/c3353617-2558-458d-9b2f-17905dc2c507.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1160,h:870"
                alt="Corporate Event Catering"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 text-black">
                <h4 className="text-xl font-bold mb-2">Corporate Events</h4>
                <p className="text-sm">Team building and business celebrations with live entertainment</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG_0317.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:2320,h:1740"
                alt="Wedding Reception Catering"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 text-black">
                <h4 className="text-xl font-bold mb-2">Wedding Receptions</h4>
                <p className="text-sm">Memorable culinary experiences for your special day</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img 
                src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG-20230423-WA0007.jpg/:/rs=w:1160,h:870"
                alt="Private Party Catering"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 text-black">
                <h4 className="text-xl font-bold mb-2">Private Parties</h4>
                <p className="text-sm">Birthday celebrations and family gatherings made special</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From booking to cleanup, we handle everything for a seamless hibachi experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1667807521536-bc35c8d8b64b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGliYWNoaSUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
                  alt="Book Your Event Online"
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6abb0d] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Book Your Event</h4>
              <p className="text-sm text-slate-600">Easy online booking with instant confirmation</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/A0F80FAF-2581-443A-9F30-F69BD849F88B.jpeg/:/rs=w:1160,h:870"
                  alt="Chef Preparation"
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6abb0d] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">We Prepare</h4>
              <p className="text-sm text-slate-600">Fresh ingredients sourced and prepared for your event</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG-20230423-WA0007.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1160,h:870"
                  alt="Chef Arrives and Sets Up"
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6abb0d] text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Chef Arrives</h4>
              <p className="text-sm text-slate-600">Professional setup at your location</p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG_2850.jpeg/:/cr=t:0%25,l:0.12%25,w:99.75%25,h:100%25/rs=w:1200,h:902,cg:true"
                  alt="Enjoy the Experience"
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#6abb0d] text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Enjoy the Show</h4>
              <p className="text-sm text-slate-600">Live cooking entertainment and delicious food</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-[#1C1D21] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Live Hibachi?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Book your hibachi experience today and treat your guests to an unforgettable live cooking 
            show with delicious food prepared fresh at your event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-catering"
              className="bg-[#EB7100] hover:bg-[#EB7100]/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Book Your Event Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/30 text-white hover:bg-[#EB7100] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#1C1D21] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white">&copy; 2025 Miyato Hibachi Dallas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Body;