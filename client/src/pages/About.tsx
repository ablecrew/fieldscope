import React from 'react';
import { Target, Users, Award, TrendingUp, Heart, Globe } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Mission Driven',
      description: 'Empowering farmers with technology to optimize crop management and increase yields.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'User Focused',
      description: 'Building intuitive tools that make field monitoring accessible to everyone.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Excellence',
      description: 'Committed to delivering reliable, high-quality solutions for agriculture.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge agricultural technology.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Sustainability',
      description: 'Supporting sustainable farming practices for a better future.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Impact',
      description: 'Making a difference in agricultural communities worldwide.'
    }
  ];

  const team = [
    {
      name: 'Dande Teddy',
      role: 'Chief Executive Officer',
      image: 'https://ui-avatars.com/api/?name=Dande+Teddy&size=200&background=008800&color=FFFDD0',
      bio: '15+ years in agricultural technology and farm management'
    },
    {
      name: 'Daltone Oketch',
      role: 'Chief Technology Officer',
      image: 'https://ui-avatars.com/api/?name=Daltone+Oketch&size=200&background=9A7B4F&color=FFFDD0',
      bio: 'Expert in IoT and agricultural monitoring systems'
    },
    {
      name: 'Ian Dan',
      role: 'Head of Operations',
      image: 'https://ui-avatars.com/api/?name=Ian+Dan&size=200&background=008800&color=FFFDD0',
      bio: 'Specialist in field operations and agent coordination'
    },
    {
      name: 'Dave Gitau',
      role: 'Lead Data Scientist',
      image: 'https://ui-avatars.com/api/?name=Dave+Gitau&size=200&background=9A7B4F&color=FFFDD0',
      bio: 'PhD in Agricultural Analytics and Predictive Modeling'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-green-brown text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About FieldScope
            </h1>
            <p className="text-xl text-gray-100">
              We're on a mission to revolutionize agricultural field monitoring through innovative technology and data-driven insights.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  FieldScope was born from a simple observation: farmers and agricultural coordinators needed better tools to monitor their fields efficiently.
                </p>
                <p>
                  Founded in 2020 by a team of agricultural experts and technology enthusiasts, we set out to create a platform that would make field monitoring accessible, efficient, and data-driven.
                </p>
                <p>
                  Today, we serve hundreds of farms across multiple regions, helping them track crop progress, manage field agents, and make informed decisions that increase yields and reduce costs.
                </p>
                <p>
                  Our commitment to innovation and user satisfaction drives us to continuously improve and expand our platform's capabilities.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=700&fit=crop"
                alt="Agriculture Field"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 gradient-green-brown rounded-lg flex items-center justify-center text-primary-cream mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The experts behind FieldScope's success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-green font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-green-brown text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-cream mb-2">500+</div>
              <div className="text-gray-100">Active Fields</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-cream mb-2">50+</div>
              <div className="text-gray-100">Field Agents</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-cream mb-2">15</div>
              <div className="text-gray-100">Crop Types</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-cream mb-2">98%</div>
              <div className="text-gray-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;