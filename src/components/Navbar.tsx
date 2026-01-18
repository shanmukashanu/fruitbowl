import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Leaf, User, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  onCallbackClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCallbackClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [floatingText, setFloatingText] = useState('');
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { getItemCount, setIsCartOpen } = useCart();

  const itemCount = getItemCount();

  useEffect(() => {
    fetchFloatingText();
  }, []);

  const fetchFloatingText = async () => {
    const { data } = await supabase
      .from('floating_texts')
      .select('text')
      .eq('is_active', true)
      .limit(1)
      .single();
    if (data) setFloatingText(data.text);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/insights', label: 'Insights' },
    { path: '/lucky', label: 'winners' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Floating Text Banner */}
      {floatingText && (
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4">{floatingText}</span>
            <span className="mx-4">{floatingText}</span>
            <span className="mx-4">{floatingText}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-full">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">Annadata</h1>
                <p className="text-xs text-orange-500 font-medium">Fruit Bowl</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/track-order"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  location.pathname === '/track-order'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Track Order</span>
              </Link>
              
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Right Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium ${
                    location.pathname === link.path
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/track-order"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium ${
                  location.pathname === '/track-order'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Track Order</span>
              </Link>
              
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
