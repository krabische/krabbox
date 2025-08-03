import { Link } from "react-router-dom";
import { Luggage, Facebook, Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Luggage className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">LugSpace</span>
            </Link>
            <p className="text-gray-400">
              The world's largest luggage rental marketplace. Travel light, pack smart.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/browse" className="hover:text-white">Browse Luggage</Link></li>
              <li><Link to="/locations" className="hover:text-white">Popular Locations</Link></li>
              <li><Link to="/travel-guides" className="hover:text-white">Travel Guides</Link></li>
              <li><Link to="/mobile-app" className="hover:text-white">Mobile App</Link></li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-semibold mb-4">Host</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/host" className="hover:text-white">Become a Host</Link></li>
              <li><Link to="/host-calculator" className="hover:text-white">Earnings Calculator</Link></li>
              <li><Link to="/host-resources" className="hover:text-white">Host Resources</Link></li>
              <li><Link to="/host-community" className="hover:text-white">Host Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white">Safety & Insurance</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/cancellation" className="hover:text-white">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white">Cookies</Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 LugSpace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
