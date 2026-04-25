import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../../assets/FSS_I.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                                  src={logo}
                                  alt="FieldScope Logo"
                                  className="h-24 w-24 object-contain"
                                  onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src =
                                       'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23008800" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Montserrat" font-size="20" fill="%23FFFDD0" font-weight="bold"%3EFS%3C/text%3E%3C/svg%3E';
                                  }}
                              />
              <span className="text-xl font-bold text-primary-cream">FieldScope</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Advanced field monitoring solutions for modern agriculture. Track, manage, and optimize your crops with precision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary-green transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-primary-green transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-green transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm hover:text-primary-green transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-green transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-green transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <Link to="/support" className="text-sm hover:text-primary-green transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-primary-green transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-primary-green transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-green mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Agriculture Ave, Farm District, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-green flex-shrink-0" />
                <a href="tel:+254707528980" className="text-sm hover:text-primary-green transition-colors">
                  +254 707 528 980
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-green flex-shrink-0" />
                <a href="mailto:info@fieldscope.com" className="text-sm hover:text-primary-green transition-colors">
                  info@fieldscope.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} FieldScope. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-primary-green transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-primary-green transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-primary-green transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Built with ❤️ for modern agriculture
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;