import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Users,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: 'Real-Time Field Monitoring',
      description: 'Track crop progress and field conditions in real-time with our advanced monitoring system.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Agent Management',
      description: 'Efficiently assign and manage field agents across multiple locations and crops.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Get actionable insights with comprehensive analytics and reporting tools.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your agricultural data is always protected.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Notifications',
      description: 'Receive immediate alerts for critical field conditions and updates.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Accessible Anywhere',
      description: 'Access your field data from any device, anywhere, anytime.'
    }
  ];

  const benefits = [
    'Increase crop yield by up to 30%',
    'Reduce field monitoring costs',
    'Real-time crop stage tracking',
    'Data-driven decision making',
    'Streamlined team collaboration',
    'Comprehensive reporting tools'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-green via-green-700 to-primary-brown text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Field Monitoring for
                <span className="block text-primary-cream">Modern Agriculture</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                Track crop progress, manage field agents, and make data-driven decisions with FieldScope's comprehensive monitoring platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-green text-primary-cream rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-brown bg-primary-brown text-primary-cream rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary-cream" size={20} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary-cream" size={20} />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary-cream" size={20} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-cream rounded-full blur-3xl opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop"
                  alt="Field Monitoring Dashboard"
                  className="relative rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">500+</div>
              <div className="text-gray-600">Active Fields</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">50+</div>
              <div className="text-gray-600">Field Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Field Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to monitor, manage, and optimize your agricultural operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 gradient-green-brown rounded-lg flex items-center justify-center text-primary-cream mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose FieldScope?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines cutting-edge technology with agricultural expertise to deliver unmatched field monitoring capabilities.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-primary-green flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center text-primary-green font-semibold hover:underline"
              >
                Learn more about us
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=700&fit=crop"
                alt="Agriculture Technology"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-green text-primary-cream p-6 rounded-xl shadow-xl">
                <div className="text-3xl font-bold mb-1">30%</div>
                <div className="text-sm">Yield Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-green-brown text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Field Management?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join hundreds of farmers and agricultural coordinators who trust FieldScope for their monitoring needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-green text-primary-cream rounded-lg font-semibold hover:bg-green-700 transition-all shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-brown border-2 border-primary-brown text-primary-cream rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'James Kariuki',
                role: 'Farm Manager',
                content: 'FieldScope has revolutionized how we manage our 50+ fields. The real-time monitoring saves us hours every day.',
                rating: 5
              },
              {
                name: 'Sarah Mwangi',
                role: 'Agricultural Coordinator',
                content: 'The agent management features are phenomenal. We can now track all our field agents effortlessly.',
                rating: 5
              },
              {
                name: 'David Ochieng',
                role: 'Field Agent',
                content: 'As a field agent, this platform makes my job so much easier. The mobile interface is intuitive and fast.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-primary-cream font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;