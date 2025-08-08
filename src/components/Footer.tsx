
import { Salad, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f141f057-f674-4b5a-8778-666475e154d3.png" 
                alt="Madras Salad Logo" 
                className="h-24 w-auto"
              />
            </div>
            <p className="text-gray-600 max-w-xs">
              Delivering farm-fresh fruits and gourmet salad ingredients to your doorstep every week.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-2">
                <span className="sr-only">Facebook</span>
                📘
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-2">
                <span className="sr-only">Instagram</span>
                📷
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-2">
                <span className="sr-only">Twitter</span>
                🐦
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Sample Boxes</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Recipes</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Delivery Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-600">hello@madrassalad.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-600">1-800-FRESH-BOX</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-gray-600">Nationwide Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Madras Salad. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
