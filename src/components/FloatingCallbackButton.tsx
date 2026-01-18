import React from 'react';
import { Phone } from 'lucide-react';

interface FloatingCallbackButtonProps {
  onClick: () => void;
}

const FloatingCallbackButton: React.FC<FloatingCallbackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all animate-bounce-slow group"
      aria-label="Request Callback"
    >
      <Phone className="h-6 w-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Request Callback
      </span>
    </button>
  );
};

export default FloatingCallbackButton;
