
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BuyNowButtonProps {
  swiggyUrl: string | null;
  zomatoUrl: string | null;
  productName: string;
}

const BuyNowButton = ({ swiggyUrl, zomatoUrl, productName }: BuyNowButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExternalRedirect = (url: string | null, platform: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsOpen(false);
    } else {
      alert(`${platform} link not available for ${productName}`);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Buy Now
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-[9999]">
          {/* Single horizontal row with equal spacing */}
          <div className="grid grid-cols-4 gap-3">
            {/* Swiggy Icon */}
            <button
              onClick={() => handleExternalRedirect(swiggyUrl, 'Swiggy')}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              title="Order on Swiggy"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors mb-2">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-xs text-gray-600 text-center">Swiggy</span>
            </button>
            
            {/* Zomato Icon */}
            <button
              onClick={() => handleExternalRedirect(zomatoUrl, 'Zomato')}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              title="Order on Zomato"
            >
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors mb-2">
                <span className="text-white text-sm font-bold">Z</span>
              </div>
              <span className="text-xs text-gray-600 text-center">Zomato</span>
            </button>
            
            {/* Blinkit Icon */}
            <button
              onClick={() => alert('Blinkit integration coming soon!')}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              title="Order on Blinkit"
            >
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center group-hover:bg-yellow-600 transition-colors mb-2">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <span className="text-xs text-gray-600 text-center">Blinkit</span>
            </button>
            
            {/* Zepto Icon */}
            <button
              onClick={() => alert('Zepto integration coming soon!')}
              className="flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              title="Order on Zepto"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors mb-2">
                <span className="text-white text-sm font-bold">Z</span>
              </div>
              <span className="text-xs text-gray-600 text-center">Zepto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNowButton;
