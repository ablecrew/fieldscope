import React, { useState } from 'react';
import {
  Search, BookOpen, MessageCircle, Phone, Mail,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle,
  Clock, Zap, Shield, FileText, Video, Download,
  HeadphonesIcon, AlertCircle, RefreshCw, Wifi,
  Smartphone, Monitor, Lock, HelpCircle, Send,
  Loader2,
} from 'lucide-react';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I create my first field in FieldScope?',
    answer:
      'After signing in, navigate to your dashboard and click "Add Field". Fill in the field name, crop type, planting date, current stage, and optionally assign a field agent. Click "Save Field" to create it. The system will automatically compute the field status based on its data.',
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'What is the difference between an Admin and a Field Agent?',
    answer:
      'Admins (Coordinators) have full system access — they can create, edit, archive, and delete fields and agents, view all fields across the system, access analytics, deploy sensors, and generate reports. Field Agents have access only to their assigned fields, where they can update crop stages and add notes or observations.',
  },
  {
    id: 3,
    category: 'Field Management',
    question: 'How is the field status (Active, At Risk, Completed) determined?',
    answer:
      'Field status is computed automatically. A field is marked "Completed" once its stage reaches "Harvested". If a field has not been updated for more than 14 days, it is flagged as "At Risk". All other active fields are marked "Active". Admins can also manually flag fields through the dashboard.',
  },
  {
    id: 4,
    category: 'Field Management',
    question: 'Can I assign multiple agents to one field?',
    answer:
      'Currently, each field can be assigned to one primary field agent. However, Admins can view and add notes to any field, and re-assign fields to different agents at any time. Multi-agent field support is on our roadmap for a future release.',
  },
  {
    id: 5,
    category: 'Field Management',
    question: 'What does archiving a field do?',
    answer:
      'Archiving a field hides it from the active fields list without permanently deleting it. Archived fields retain all their data, notes, and history and can be unarchived at any time. This is useful for off-season fields or fields that have completed their lifecycle.',
  },
  {
    id: 6,
    category: 'Notifications',
    question: 'Why am I not receiving notifications?',
    answer:
      'Notifications are generated automatically when key events occur (field assigned, stage updated, at-risk flagged). If you are not seeing them, check your notification bell in the top navigation bar. Ensure you are logged in with the correct account. Email notification support is coming in a future update.',
  },
  {
    id: 7,
    category: 'Account & Security',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot password?" on the Sign In page and enter your registered email address. You will receive a password reset link within a few minutes. If you do not receive the email, check your spam folder or contact our support team.',
  },
  {
    id: 8,
    category: 'Account & Security',
    question: 'Is my agricultural data secure?',
    answer:
      'Yes. FieldScope uses industry-standard JWT authentication, encrypted HTTPS connections, and a secure Neon PostgreSQL database with SSL. All data is backed up regularly and your credentials are never stored in plain text. We are committed to keeping your data private and secure.',
  },
  {
    id: 9,
    category: 'Sensors',
    question: 'How do I deploy a sensor to a field?',
    answer:
      'Sensor deployment is an Admin-only feature. Navigate to the Admin Dashboard, click "Deploy Sensor" in the sidebar, select the target field, enter the sensor ID and type, then click "Deploy Sensor". Once deployed, the sensor will appear in your Active Sensors list with its real-time status.',
  },
  {
    id: 10,
    category: 'Analytics',
    question: 'What analytics data does FieldScope track?',
    answer:
      'FieldScope tracks total fields, status breakdown (Active, At Risk, Completed), stage distribution (Planted, Growing, Ready, Harvested), harvest rates, agent performance, average field sizes, and total notes submitted. Admins also have access to system-wide analytics across all agents and fields.',
  },
];

const categories = ['All', 'Getting Started', 'Field Management', 'Notifications', 'Account & Security', 'Sensors', 'Analytics'];

const SupportCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFAQs = faqs.filter((faq) => {
    const matchSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const resources = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Documentation', desc: 'Detailed guides for every feature', link: '#' },
    { icon: <Video className="w-6 h-6" />, title: 'Video Tutorials', desc: 'Step-by-step video walkthroughs', link: '#' },
    { icon: <Download className="w-6 h-6" />, title: 'Quick Start Guide', desc: 'PDF guide to get started fast', link: '#' },
    { icon: <FileText className="w-6 h-6" />, title: 'API Reference', desc: 'Full REST API documentation', link: '#' },
  ];

  const contactOptions = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      desc: 'Chat with our team in real time',
      action: 'Start Chat',
      badge: 'Fastest',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      desc: 'support@fieldscope.com',
      action: 'Send Email',
      badge: '< 24h',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Support',
      desc: '+254 700 000 000',
      action: 'Call Now',
      badge: 'Mon–Fri',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
  ];

  const statusItems = [
    { name: 'API & Authentication', status: 'Operational', color: 'bg-green-500' },
    { name: 'Field Management', status: 'Operational', color: 'bg-green-500' },
    { name: 'Notifications', status: 'Operational', color: 'bg-green-500' },
    { name: 'Analytics & Reports', status: 'Operational', color: 'bg-green-500' },
    { name: 'Sensor Integrations', status: 'Operational', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* ── Hero ── */}
      <section className="gradient-green-brown text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <HeadphonesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-gray-100 mb-10">
            Everything you need to get the most out of FieldScope.
          </p>
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ── Quick Contact Options ── */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 -mt-20">
            {contactOptions.map((opt, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    {opt.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${opt.badgeColor}`}>
                    {opt.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{opt.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{opt.desc}</p>
                <button className="w-full py-2.5 bg-primary-green text-primary-cream rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                  {opt.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Learning Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((r, i) => (
              <a
                key={i}
                href={r.link}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group"
              >
                <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {r.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500">{r.desc}</p>
                <div className="flex items-center gap-1 text-primary-green text-sm font-medium mt-3">
                  View <ArrowRight className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Browse answers to our most common questions</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-green text-primary-cream'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No results found</p>
                <p className="text-sm">Try a different search term or category</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-semibold text-primary-green bg-green-50 px-2 py-1 rounded-full mt-0.5 flex-shrink-0">
                        {faq.category}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                    </div>
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-5 border-t border-gray-100 bg-gray-50">
                      <p className="text-gray-600 text-sm leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── System Status ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">All Systems Operational</span>
              </div>
            </div>
            <div className="space-y-3">
              {statusItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">{item.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <RefreshCw className="w-3 h-3" />
              <span>Last checked: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Still Need Help?</h2>
            <p className="text-gray-500">Send us a message and we'll get back to you within 24 hours</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <CheckCircle className="w-16 h-16 text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-gray-50 rounded-2xl p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                >
                  <option value="">Select a subject…</option>
                  <option>Technical Issue</option>
                  <option>Account & Billing</option>
                  <option>Feature Request</option>
                  <option>General Inquiry</option>
                  <option>Sensor Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-green resize-none"
                  placeholder="Describe your issue or question in detail…"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary-green text-primary-cream rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" />Sending…</> : <><Send className="w-5 h-5" />Send Message</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SupportCenter;