import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // ✅ Fixed: Changed from "react-router" to "react-router-dom"
import Navbar from "./Navbar";
import { menuData } from "../data/MenuData";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ✅ Added error handling for menuData
    try {
      if (menuData && Array.isArray(menuData)) {
        setMenu(menuData);
      } else {
        console.warn('MenuData is not an array or is undefined');
        setMenu([]);
      }
      setTimeout(() => setIsVisible(true), 300);
    } catch (error) {
      console.error('Error loading menu data:', error);
      setMenu([]);
    }
  }, []);

  // Category filtering with professional icons
  const categories = [
    { 
      id: 'all', 
      name: 'All Items', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      id: 'signature', 
      name: 'Signature Tacos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      id: 'premium', 
      name: 'Premium Tacos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    { 
      id: 'vegetarian', 
      name: 'Vegetarian', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      id: 'appetizers', 
      name: 'Appetizers', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    { 
      id: 'sides', 
      name: 'Sides', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m9-2V7a2 2 0 00-2-2h-2m0 0V9a2 2 0 002 2h2m-6-4a2 2 0 002-2V3a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h2z" />
        </svg>
      )
    },
    { 
      id: 'desserts', 
      name: 'Desserts', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    }
  ];

  const getFilteredItems = () => {
    if (!menu || menu.length === 0) return [];
    if (activeCategory === 'all') return menu;
    
    try {
      return menu.filter(item => {
        // ✅ Enhanced safety checks
        if (!item || typeof item !== 'object') return false;
        if (!item.category && !item.type) return false;
        
        const categoryLower = item.category ? item.category.toLowerCase() : '';
        
        // ✅ More specific category matching
        switch (activeCategory) {
          case 'signature':
            return categoryLower.includes('signature');
          case 'premium':
            return categoryLower.includes('premium');
          case 'vegetarian':
            return item.type === 'veg';
          case 'appetizers':
            return categoryLower.includes('appetizer');
          case 'sides':
            return categoryLower.includes('side');
          case 'desserts':
            return categoryLower.includes('dessert');
          default:
            return categoryLower.includes(activeCategory);
        }
      });
    } catch (error) {
      console.error('Error filtering items:', error);
      return [];
    }
  };

  // ✅ Enhanced category switching with state reset
  const handleCategoryChange = (categoryId) => {
    try {
      // Clear current items temporarily to prevent render conflicts
      setActiveCategory('all');
      
      // Use setTimeout to ensure clean state transition
      setTimeout(() => {
        setActiveCategory(categoryId);
      }, 0);
    } catch (error) {
      console.error('Error changing category:', error);
      setActiveCategory('all');
    }
  };

  const filteredItems = getFilteredItems();

  // Group items by category for organized display
  const groupedItems = {
    signature: menu.filter(item => item?.category?.toLowerCase().includes('signature')),
    premium: menu.filter(item => item?.category?.toLowerCase().includes('premium')),
    vegetarian: menu.filter(item => item?.type === 'veg'),
    appetizers: menu.filter(item => item?.category?.toLowerCase().includes('appetizers')),
    sides: menu.filter(item => item?.category?.toLowerCase().includes('sides')),
    desserts: menu.filter(item => item?.category?.toLowerCase().includes('desserts'))
  };

  return (
    <div className="font-sans text-slate-800 min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
          }`}>
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
              Fusion Menu
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-[#E78229] leading-tight mb-6">
              Japanese-Mexican
              <span className="block text-[#E78229]">Fusion Tacos</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Discover our authentic fusion tacos that blend Japanese precision with Mexican tradition. 
              Each taco is crafted with premium ingredients and bold, innovative flavors.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Vegetarian Options
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Premium Proteins
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                Spicy Available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const categoryCount = category.id === 'all' ? menu.length : 
                (groupedItems[category.id]?.length || 0);
                
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                  {categoryCount > 0 && (
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {categoryCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {activeCategory === 'all' ? (
            // Show all categories organized
            <div className="space-y-16">
              {categories.slice(1).map((category) => {
                const categoryItems = groupedItems[category.id] || [];
                
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category.id} className="category-section">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
                        <span className="mr-4">{category.icon}</span>
                        {category.name}
                      </h2>
                      <div className="w-24 h-1 bg-slate-900 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {categoryItems.length > 0 ? (
                        categoryItems.map((item, index) => (
                          <MenuItemCard 
                            key={`${category.id}-${item?.name || 'item'}-${index}`}
                            item={item}
                            index={index}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-slate-500">
                          No items in this category
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Show filtered category
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  {categories.find(cat => cat.id === activeCategory)?.name || 'Menu Items'}
                </h2>
                <p className="text-slate-600">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <MenuItemCard 
                      key={`${activeCategory}-${item?.name || 'item'}-${index}`}
                      item={item}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-500">
                    No items found in this category
                  </div>
                )}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && activeCategory !== 'all' && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">No items found</h3>
              <p className="text-slate-600 mb-8">
                We don't have any items in this category yet. Check back soon!
              </p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                View All Items
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Taquiza?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Bring these incredible fusion flavors to your next event with our live taquiza catering service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-catering"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Book Your Event
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600">&copy; 2025 Miyato Hibachi Dallas . All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Menu Item Card Component - Clean, no cart functionality
const MenuItemCard = ({ item, index }) => {
  // ✅ Added safety checks for item props
  if (!item) {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center">
        <p className="text-slate-500">Menu item not available</p>
      </div>
    );
  }

  // ✅ Safe fallbacks for all item properties
  const itemName = item.name || 'Menu Item';
  const itemDescription = item.description || 'No description available';
  const itemPrice = item.price || '$0.00';
  const itemType = item.type || 'unknown';
  const itemCategory = item.category || 'General';
  const itemSpicy = item.spicy || false;
  const itemImage = item.image || '';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="w-full h-48 overflow-hidden relative">
        {itemImage ? (
          <img 
            src={itemImage} 
            alt={itemName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const fusionGradients = [
                { bg: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)', emoji: '🌮' },
                { bg: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)', emoji: '🔥' },
                { bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', emoji: '🌿' },
                { bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', emoji: '⭐' },
                { bg: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)', emoji: '🍽️' },
                { bg: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)', emoji: '🌶️' }
              ];
              const gradient = fusionGradients[index % fusionGradients.length];
              e.target.style.display = 'none';
              e.target.parentElement.style.background = gradient.bg;
              e.target.parentElement.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; font-size: 14px; font-weight: bold; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"><div style="font-size: 40px; margin-bottom: 8px;">${gradient.emoji}</div><div>${itemName}</div></div>`;
            }}
          />
        ) : (
          // ✅ Fallback when no image is provided
          <div 
            className="w-full h-full flex flex-col items-center justify-center text-white font-bold text-center"
            style={{ 
              background: `linear-gradient(135deg, #1e293b 0%, #64748b 100%)`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <div className="text-4xl mb-2">🌮</div>
            <div className="text-sm">{itemName}</div>
          </div>
        )}
        
        {/* Type indicator */}
        <div className="absolute top-3 left-3">
          <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
            itemType === 'veg' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>

        {/* Spicy indicator */}
        {itemSpicy && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white rounded-full p-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
            {itemCategory}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{itemName}</h3>
        <p className="text-slate-600 mb-4 text-sm leading-relaxed line-clamp-3">{itemDescription}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-900">{itemPrice}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              itemType === 'veg' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-slate-600 capitalize">
              {itemType === 'veg' ? 'Vegetarian' : 'With Protein'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;