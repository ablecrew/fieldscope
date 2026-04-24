import React, { useState, useEffect } from 'react';
import {
  FileText, ChevronRight, Scale, UserCheck, Shield,
  AlertTriangle, Globe, RefreshCw, Mail, Ban,
  CheckCircle, Lock, Zap,
} from 'lucide-react';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'description', title: 'Service Description' },
  { id: 'accounts', title: 'User Accounts' },
  { id: 'acceptable', title: 'Acceptable Use' },
  { id: 'prohibited', title: 'Prohibited Activities' },
  { id: 'intellectual', title: 'Intellectual Property' },
  { id: 'data', title: 'Data Ownership' },
  { id: 'availability', title: 'Service Availability' },
  { id: 'termination', title: 'Termination' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'governing', title: 'Governing Law' },
  { id: 'contact', title: 'Contact' },
];

const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

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
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-100 text-lg">
            Please read these terms carefully before using FieldScope.
          </p>
          <p className="text-gray-200 text-sm mt-4">
            Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* ── Quick Summary ── */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Key Points Summary
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <UserCheck className="w-5 h-5" />, title: 'You Own Your Data', desc: 'All agricultural data you enter belongs to you.' },
              { icon: <Shield className="w-5 h-5" />, title: 'We Protect Your Data', desc: 'Encrypted, backed up, and never sold.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Fair Use', desc: 'Use FieldScope for lawful agricultural management only.' },
              { icon: <Zap className="w-5 h-5" />, title: 'We Can Improve', desc: 'We may update the service and notify you of major changes.' },
            ].map((h, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-9 h-9 bg-primary-brown rounded-lg flex items-center justify-center text-primary-cream flex-shrink-0">
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
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">Contents</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === s.id ? 'bg-primary-green text-primary-cream font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <ChevronRight className="w-3 h-3" />{s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-10">

              <div id="acceptance" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><FileText className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">By accessing or using FieldScope, you confirm that you are at least 18 years old, have the legal authority to enter into this agreement, and agree to be bound by these Terms of Service. If you are using FieldScope on behalf of an organization, you represent that you have the authority to bind that organization to these terms. If you do not agree to these terms, do not use the platform.</p>
              </div>

              <div id="description" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Globe className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">FieldScope is a web-based agricultural field monitoring platform that enables:</p>
                <ul className="space-y-2">
                  {[
                    'Creation and management of agricultural fields',
                    'Assignment of field agents to specific fields',
                    'Real-time tracking of crop stages and field statuses',
                    'Notes and observation management per field',
                    'Dashboard analytics and reporting for Admins and Agents',
                    'IoT sensor deployment and monitoring',
                    'Notification and activity logging systems',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-green flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div id="accounts" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><UserCheck className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
                </div>
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
                  <p>You must provide accurate and complete information when registering. You may not impersonate another person or use a false identity.</p>
                  <p>You must notify us immediately at <a href="mailto:security@fieldscope.com" className="text-primary-green hover:underline">security@fieldscope.com</a> if you suspect any unauthorized access to your account.</p>
                  <p>Each person may only maintain one account. Creating multiple accounts to circumvent platform restrictions is prohibited.</p>
                </div>
              </div>

              <div id="acceptable" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><CheckCircle className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Acceptable Use</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">You agree to use FieldScope only for:</p>
                <ul className="space-y-2">
                  {[
                    'Lawful agricultural field monitoring and management',
                    'Managing crop cycles, stages, and observations',
                    'Coordinating between Admin coordinators and field agents',
                    'Generating legitimate analytics and reports for agricultural purposes',
                    'Deploying and monitoring IoT sensors for field data collection',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-primary-green flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>

              <div id="prohibited" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white"><Ban className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Attempting to hack, disrupt, or overload the platform',
                    'Uploading malware, viruses, or malicious code',
                    'Scraping, harvesting, or mass-downloading platform data',
                    'Sharing credentials with unauthorized users',
                    'Using the platform for non-agricultural commercial purposes',
                    'Attempting to reverse-engineer or copy proprietary code',
                    'Creating false data to manipulate analytics or reports',
                    'Violating any applicable local, national, or international law',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div id="intellectual" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Lock className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">The FieldScope platform, including its design, code, branding, logos, and features, are the intellectual property of FieldScope and are protected by applicable copyright and trademark law. You may not reproduce, distribute, or create derivative works from any part of our platform without explicit written permission.</p>
              </div>

              <div id="data" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Shield className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Ownership</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">You retain full ownership of all agricultural data, field information, notes, and observations you enter into FieldScope. By using the platform, you grant FieldScope a limited, non-exclusive license to store and process that data solely for the purpose of providing the service to you. We do not claim ownership of your data.</p>
              </div>

              <div id="availability" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Zap className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Service Availability</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">We strive to maintain high availability of the FieldScope platform. However, we do not guarantee uninterrupted access and are not liable for downtime caused by maintenance, infrastructure issues, or factors outside our control. We will endeavour to notify users of planned maintenance in advance.</p>
              </div>

              <div id="termination" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><AlertTriangle className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">You may delete your account at any time through your profile settings or by contacting support. We reserve the right to suspend or terminate accounts that violate these Terms of Service, engage in prohibited activities, or pose a security risk to the platform or other users. Upon termination, your data will be handled in accordance with our Privacy Policy.</p>
              </div>

              <div id="liability" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Scale className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">FieldScope is provided "as is" without warranties of any kind. To the maximum extent permitted by law, FieldScope shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to crop loss, data loss, or business interruption. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
              </div>

              <div id="governing" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Globe className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">These Terms of Service are governed by the laws of Kenya. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya. If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>
              </div>

              <div id="contact" className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Mail className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">For questions about these Terms of Service, contact us:</p>
                <div className="bg-green-50 rounded-xl p-6 space-y-2">
                  <p className="text-sm font-semibold text-gray-900">FieldScope Legal Team</p>
                  <p className="text-sm text-gray-600">Email: <a href="mailto:legal@fieldscope.com" className="text-primary-green hover:underline">legal@fieldscope.com</a></p>
                  <p className="text-sm text-gray-600">Address: 123 Agriculture Ave, Farm District, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;