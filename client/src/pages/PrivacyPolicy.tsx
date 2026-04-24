import React, { useState, useEffect } from 'react';
import {
  Shield, Eye, Lock, Database, UserCheck, Globe,
  FileText, Bell, Trash2, RefreshCw, Mail, ChevronRight,
} from 'lucide-react';

const sections = [
  { id: 'information', title: 'Information We Collect' },
  { id: 'usage', title: 'How We Use Your Information' },
  { id: 'sharing', title: 'Information Sharing' },
  { id: 'security', title: 'Data Security' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'changes', title: 'Policy Changes' },
  { id: 'contact', title: 'Contact Us' },
];

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('information');

  useEffect(() => {
    const handleScroll = () => {
      const sectionEls = sections.map((s) => document.getElementById(s.id));
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* ── Hero ── */}
      <section className="gradient-green-brown text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-100 text-lg">
            We are committed to protecting your privacy and your agricultural data.
          </p>
          <p className="text-gray-200 text-sm mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Lock className="w-6 h-6" />, title: 'Data Encrypted', desc: 'All data is encrypted in transit and at rest using AES-256.' },
              { icon: <Eye className="w-6 h-6" />, title: 'No Data Selling', desc: 'We never sell, rent, or trade your personal or agricultural data.' },
              { icon: <UserCheck className="w-6 h-6" />, title: 'You Own Your Data', desc: 'Request export or deletion of your data at any time.' },
              { icon: <Globe className="w-6 h-6" />, title: 'GDPR Aligned', desc: 'We follow global best practices for data privacy and protection.' },
            ].map((h, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center text-primary-cream flex-shrink-0">
                  {h.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{h.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-10">
            {/* Sticky Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={() => setActiveSection(s.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === s.id
                          ? 'bg-primary-green text-primary-cream font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="w-3 h-3" />
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-12">
              {/* Intro */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to FieldScope. This Privacy Policy explains how FieldScope ("we", "us", or "our")
                  collects, uses, shares, and protects your information when you use our field monitoring
                  platform. By using FieldScope, you agree to the collection and use of your information in
                  accordance with this policy.
                </p>
              </div>

              {/* Section 1 */}
              <div id="information" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                    <p className="text-sm leading-relaxed">When you register for FieldScope, we collect your full name, email address, role (Admin or Field Agent), and your chosen password (stored as a secure hash — never in plain text).</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Field & Agricultural Data</h3>
                    <p className="text-sm leading-relaxed">We collect and store all field data you enter into the platform, including field names, crop types, planting dates, stages, observations, notes, and sensor readings. This data belongs to you.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                    <p className="text-sm leading-relaxed">We automatically collect information about how you use the platform, including access times, pages viewed, features used, and device/browser information. This helps us improve FieldScope.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Communications</h3>
                    <p className="text-sm leading-relaxed">If you contact our support team, we retain those communications to resolve your issue and improve our service quality.</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="usage" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    'To provide, operate, and maintain the FieldScope platform',
                    'To authenticate your identity and secure your account',
                    'To send notifications about field updates, assignments, and alerts',
                    'To generate analytics, reports, and insights within your dashboard',
                    'To improve platform features based on aggregated usage patterns',
                    'To respond to your support requests and troubleshoot issues',
                    'To comply with applicable legal and regulatory requirements',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-primary-green flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3 */}
              <div id="sharing" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
                </div>
                <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                  <p><span className="font-semibold text-gray-900">We do not sell your data.</span> We do not sell, rent, or trade your personal information or agricultural data to any third parties under any circumstances.</p>
                  <p>We may share data with trusted service providers who help us operate the platform (hosting, database, analytics). These providers are contractually bound to keep your information confidential and use it only to provide services on our behalf.</p>
                  <p>We may disclose your information if required by law, court order, or governmental authority, or if we believe disclosure is necessary to protect the rights, property, or safety of FieldScope, its users, or the public.</p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="security" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'JWT Authentication', desc: 'Secure token-based authentication with automatic refresh and expiry.' },
                    { title: 'SSL/TLS Encryption', desc: 'All data in transit is encrypted using industry-standard TLS protocols.' },
                    { title: 'Encrypted Database', desc: 'Neon PostgreSQL with encryption at rest and SSL-required connections.' },
                    { title: 'Password Hashing', desc: 'Passwords are hashed using Django\'s PBKDF2 algorithm with SHA256.' },
                    { title: 'Role-Based Access', desc: 'Strict separation between Admin and Field Agent permissions.' },
                    { title: 'Regular Backups', desc: 'Automated database backups to prevent data loss.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <Shield className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5 */}
              <div id="retention" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
                </div>
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  <p>We retain your account data for as long as your account remains active. Field data, notes, and observations are retained indefinitely to support historical analytics and compliance unless you request deletion.</p>
                  <p>Activity logs are retained for up to 12 months. Notification records are retained for 6 months. When you delete your account, we delete all associated personal data within 30 days, except where retention is required by law.</p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="rights" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: <Eye className="w-4 h-4" />, title: 'Access', desc: 'Request a copy of all data we hold about you.' },
                    { icon: <RefreshCw className="w-4 h-4" />, title: 'Correction', desc: 'Request correction of inaccurate personal data.' },
                    { icon: <Trash2 className="w-4 h-4" />, title: 'Deletion', desc: 'Request permanent deletion of your account and data.' },
                    { icon: <FileText className="w-4 h-4" />, title: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
                    { icon: <Bell className="w-4 h-4" />, title: 'Opt-Out', desc: 'Opt out of non-essential communications at any time.' },
                    { icon: <Shield className="w-4 h-4" />, title: 'Objection', desc: 'Object to processing of your data in certain circumstances.' },
                  ].map((right, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                      <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center text-primary-cream flex-shrink-0">
                        {right.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{right.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-600">To exercise any of these rights, contact us at <a href="mailto:privacy@fieldscope.com" className="text-primary-green font-medium hover:underline">privacy@fieldscope.com</a>.</p>
              </div>

              {/* Section 7 — Cookies */}
              <div id="cookies" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">FieldScope uses minimal cookies and localStorage to maintain your session (JWT tokens), remember your preferences, and analyse platform performance. We do not use advertising cookies. You can clear cookies through your browser settings at any time.</p>
              </div>

              {/* Section 8 */}
              <div id="children" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">FieldScope is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it.</p>
              </div>

              {/* Section 9 */}
              <div id="changes" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Policy Changes</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">We may update this Privacy Policy from time to time. When we make significant changes, we will notify you through the platform or via email. Continued use of FieldScope after changes are posted constitutes your acceptance of the revised policy. We encourage you to review this page periodically.</p>
              </div>

              {/* Section 10 */}
              <div id="contact" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
                <div className="bg-green-50 rounded-xl p-6 space-y-2">
                  <p className="text-sm font-semibold text-gray-900">FieldScope Privacy Team</p>
                  <p className="text-sm text-gray-600">Email: <a href="mailto:privacy@fieldscope.com" className="text-primary-green hover:underline">privacy@fieldscope.com</a></p>
                  <p className="text-sm text-gray-600">Address: 123 Agriculture Ave, Farm District, Nairobi, Kenya</p>
                  <p className="text-sm text-gray-600">Phone: +254 707 528 980</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;