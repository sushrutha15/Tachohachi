import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const stats = [
    { number: "15+", label: "Years in the Industry" },
    { number: "10+", label: "Years Professional Cooking" },
    { number: "DFW", label: "Metroplex Coverage" },
    { number: "4.9★", label: "Average Rating" }
  ];

  return (
    <div className="font-sans text-slate-800 bg-white">
      <Navbar />

      <section id="about" className="py-20 bg-white pt-40">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero Section */}
          <div className={`text-center p-6 rounded-md mb-20 transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
          }`}>
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Story
            </span>
            <h2 className="text-5xl font-bold text-[#E78229] mb-6">About Miyato Hibachi Dallas</h2>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              Bringing the full hibachi experience directly to you — live cooking, premium proteins, and unforgettable entertainment at your next event.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Our Journey</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  My name is Eduardo Salinas. I got my start at Benihana at 21 years old, and after 15 years in the restaurant industry, I founded Miyato Hibachi Dallas. What began as a weekend side hustle during the pandemic quickly grew into a full-time business — and I wouldn't have it any other way.
                </p>
                <p>
                  Today, people all across the DFW Metroplex can enjoy the authentic hibachi experience from the comfort of their own home. We bring the grill, the show, and the energy directly to you. I love what I do because I love showing people a great time — whether it's an intimate backyard dinner or a large celebration, every event deserves to be memorable.
                </p>
                <p>
                  With over 10 years of professional cooking experience, I've had the privilege of working in some of the finest restaurants and refining my craft across a wide range of cuisines. I bring that expertise to every event I cater, working closely with each client to create a customized experience tailored to their tastes and occasion.
                </p>
                <p>
                  I believe great food should be both delicious and made with care — that means fresh, quality ingredients and a commitment to the experience from start to finish. Book us today and let us create something unforgettable for you and your loved ones.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 mt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                    <div className="text-slate-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-50 rounded-2xl p-8">
                <img
                  src="https://img1.wsimg.com/isteam/ip/a2f5a7ed-820f-4841-b058-1db07e3e0bd1/IMG_6333.jpeg/:/cr=t:21.8%25,l:0%25,w:100%25,h:56.39%25/rs=w:2480,h:1865,cg:true"
                  alt="Live Hibachi Cooking Experience"
                  className="rounded-xl shadow-lg w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-400 p-6 rounded-xl shadow-lg">
                <div className="text-slate-900 font-bold text-lg">Est. 2020</div>
                <div className="text-slate-700 text-sm">Dallas, Texas</div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-slate-900 rounded-2xl p-12 text-center text-white mb-20">
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto text-slate-300">
              To bring the full hibachi restaurant experience directly to your event — with premium proteins, live cooking entertainment, and professional service that makes every gathering truly special.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="bg-slate-300 text-black bg-opacity-10 px-4 py-2 rounded-full text-sm font-medium">Fresh Ingredients</span>
              <span className="bg-slate-300 text-black bg-opacity-10 px-4 py-2 rounded-full text-sm font-medium">Live Hibachi Show</span>
              <span className="bg-slate-300 text-black bg-opacity-10 px-4 py-2 rounded-full text-sm font-medium">DFW Metroplex</span>
              <span className="bg-slate-300 text-black bg-opacity-10 px-4 py-2 rounded-full text-sm font-medium">Professional Service</span>
            </div>
          </div>

          {/* Live Cooking Gallery Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Experience the Live Hibachi Magic</h3>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Watch as our skilled chef prepares your hibachi meal right before your eyes, creating an unforgettable dining experience.
              </p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem'}}>
              <div style={{position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', height: '256px'}}>
                <img
                  src="https://res.cloudinary.com/do3cybcyl/image/upload/v1773358586/rs_w-1160_h-870_h4fzvc.jpg"
                  alt="Professional Hibachi Setup"
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem'}}>
                  <div style={{color: 'white'}}>
                    <h4 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Professional Setup</h4>
                    <p style={{fontSize: '0.875rem'}}>Mobile hibachi station with all professional equipment</p>
                  </div>
                </div>
              </div>

              <div style={{position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', height: '256px'}}>
                <img
                  src="https://res.cloudinary.com/do3cybcyl/image/upload/v1773358586/rs_w-730_h-730_cg-true_p9qkys.jpg"
                  alt="Premium Fresh Ingredients"
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem'}}>
                  <div style={{color: 'white'}}>
                    <h4 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Premium Ingredients</h4>
                    <p style={{fontSize: '0.875rem'}}>Fresh proteins, vegetables, and house-made sauces</p>
                  </div>
                </div>
              </div>

              <div style={{position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', height: '256px'}}>
                <img
                  src="https://res.cloudinary.com/do3cybcyl/image/upload/v1773358587/rs_w-1200_h-600_cg-true_jn0rgr.jpg"
                  alt="Chef Entertainment and Skills"
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem'}}>
                  <div style={{color: 'white'}}>
                    <h4 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Entertainment & Skills</h4>
                    <p style={{fontSize: '0.875rem'}}>Spectacular cooking show with knife skills and fire displays</p>
                  </div>
                </div>
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

export default About;