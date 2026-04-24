import React, { useState } from 'react';
import {
  Cookie, Shield, BarChart2, Settings2, Globe,
  CheckCircle, XCircle, RefreshCw, Mail, Info,
  Lock, Monitor, Smartphone, ChevronDown, ChevronUp,
} from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);
  const [expandedType, setExpandedType] = useState<string | null>('essential');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cookieTypes = [
    {
      id: 'essential',
      icon: <Lock className="w-6 h-6" />,
      title: 'Essential Cookies',
      desc: 'Required for the platform to function correctly.',
      required: true,
      color: 'bg-green-100 text-green-700',
      cookies: [
        { name: 'access_token', purpose: 'JWT authentication token to keep you signed in', duration: '2 hours', type: 'localStorage' },
        { name: 'refresh_token', purpose: 'Token used to renew your session without re-signing in', duration: '7 days', type: 'localStorage' },
        { name: 'fieldscope_user', purpose: 'Stores your user role and profile for fast UI rendering', duration: 'Session', type: 'localStorage' },
      ],
    },
    {
      id: 'functional',
      icon: <Settings2 className="w-6 h-6" />,
      title: 'Functional Cookies',
      desc: 'Enhance your experience with preferences and settings.',
      required: false,
      color: 'bg-blue-100 text-blue-700',
      cookies: [
        { name: 'sidebar_state', purpose: 'Remembers whether your dashboard sidebar is open or collapsed', duration: '30 days', type: 'localStorage' },
        { name: 'active_tab', purpose: 'Remembers your last active dashboard tab', duration: '30 days', type: 'localStorage' },
        { name: 'theme_preference', purpose: 'Stores your display preferences', duration: '1 year', type: 'localStorage' },
      ],
    },
    {
      id: 'analytics',
      icon: <BarChart2 className="w-6 h-6" />,
      title: 'Analytics Cookies',
      desc: 'Help us understand how the platform is used so we can improve it.',
      required: false,
      color: 'bg-purple-100 text-purple-700',
      cookies: [
        { name: '_fs_session', purpose: 'Tracks page views and feature usage to improve UX', duration: '90 days', type: 'Cookie' },
        { name: '_fs_source', purpose: 'Tracks how users found FieldScope', duration: '30 days', type: 'Cookie' },
      ],
    },
    {
      id: 'marketing',
      icon: <Globe className="w-6 h-6" />,
      title: 'Marketing Cookies',
      desc: 'Used to show relevant content and measure campaign effectiveness.',
      required: false,
      color: 'bg-amber-100 text-amber-700',
      cookies: [
        { name: '_fs_campaign', purpose: 'Tracks marketing campaign performance', duration: '60 days', type: 'Cookie' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* ── Hero ── */}
      <section className="gradient-green-brown text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-100 text-lg">
            How FieldScope uses cookies and similar technologies.
          </p>
          <p className="text-gray-200 text-sm mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'No Advertising Cookies', desc: 'We do not use cookies for advertising or retargeting across other websites.' },
              { icon: <CheckCircle className="w-6 h-6" />, title: 'Minimal Tracking', desc: 'FieldScope uses the minimum cookies necessary to operate the platform.' },
              { icon: <Settings2 className="w-6 h-6" />, title: 'Your Choice', desc: 'You can control non-essential cookies using the preference centre below.' },
            ].map((h, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center text-primary-cream flex-shrink-0">{h.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{h.title}</h3>
                  <p className="text-sm text-gray-600">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Are Cookies ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 gradient-green-brown rounded-xl flex items-center justify-center text-white"><Info className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and how you've previously interacted with it. FieldScope primarily uses <strong>localStorage</strong> (a browser-based storage mechanism similar to cookies) to store authentication tokens and user preferences.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unlike traditional cookies, localStorage data is not transmitted to the server with every request — it stays on your device and is only sent when explicitly needed. You can clear localStorage at any time through your browser's developer tools or privacy settings.
            </p>
          </div>

          {/* ── Cookie Types ── */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedType(expandedType === type.id ? null : type.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {type.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">{type.title}</h3>
                        {type.required ? (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">Always On</span>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${type.color}`}>Optional</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {/* Toggle */}
                    {!type.required && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreferences((p) => ({
                            ...p,
                            [type.id]: !p[type.id as keyof typeof p],
                          }));
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          preferences[type.id as keyof typeof preferences]
                            ? 'bg-primary-green'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences[type.id as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    )}
                    {expandedType === type.id
                      ? <ChevronUp className="w-5 h-5 text-gray-400" />
                      : <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </button>

                {expandedType === type.id && (
                  <div className="border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {['Cookie / Key Name', 'Purpose', 'Duration', 'Type'].map((h) => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {type.cookies.map((cookie, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-6 py-3 font-mono text-xs text-primary-green font-semibold">{cookie.name}</td>
                              <td className="px-6 py-3 text-gray-600 text-xs">{cookie.purpose}</td>
                              <td className="px-6 py-3 text-gray-500 text-xs">{cookie.duration}</td>
                              <td className="px-6 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{cookie.type}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preference Centre ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-primary-green/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-white">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cookie Preference Centre</h2>
                <p className="text-sm text-gray-500">Manage your cookie preferences below</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {cookieTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.required ? 'bg-primary-green text-primary-cream' : 'bg-gray-100 text-gray-600'}`}>
                      {type.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{type.title}</p>
                      <p className="text-xs text-gray-500">{type.cookies.length} cookie(s)</p>
                    </div>
                  </div>
                  {type.required ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Required</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPreferences((p) => ({
                        ...p,
                        [type.id]: !p[type.id as keyof typeof p],
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences[type.id as keyof typeof preferences] ? 'bg-primary-green' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences[type.id as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary-green text-primary-cream rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {saved ? <><CheckCircle className="w-5 h-5" />Saved!</> : 'Save Preferences'}
              </button>
              <button
                onClick={() => setPreferences({ essential: true, functional: false, analytics: false, marketing: false })}
                className="flex-1 py-3 border-2 border-primary-brown text-primary-brown rounded-xl font-semibold hover:bg-primary-brown hover:text-primary-cream transition-colors"
              >
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Control ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to Control Cookies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Monitor className="w-6 h-6" />,
                title: 'Browser Settings',
                desc: 'You can configure your browser to block cookies or alert you when cookies are set. Note that blocking essential cookies may prevent FieldScope from functioning properly.',
                browsers: ['Chrome: Settings → Privacy → Cookies', 'Firefox: Settings → Privacy & Security', 'Safari: Preferences → Privacy', 'Edge: Settings → Cookies and site permissions'],
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Mobile Devices',
                desc: 'On mobile devices, you can manage cookie settings through your device\'s browser settings or system privacy settings.',
                browsers: ['iOS Safari: Settings → Safari → Privacy', 'Android Chrome: Settings → Site settings → Cookies', 'Samsung Browser: Settings → Privacy', 'Firefox Mobile: Settings → Privacy & Security'],
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 gradient-green-brown rounded-xl flex items-center justify-center text-white mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                <ul className="space-y-1">
                  {item.browsers.map((b, bi) => (
                    <li key={bi} className="text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary-green rounded-full flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-primary-cream">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Questions About Cookies?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              If you have questions about how FieldScope uses cookies or want to exercise your privacy rights, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> <a href="mailto:privacy@fieldscope.com" className="text-primary-green hover:underline">privacy@fieldscope.com</a></p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Address:</span> 123 Agriculture Ave, Farm District, Nairobi, Kenya</p>
              <p className="text-sm text-gray-700"><span className="font-semibold">Phone:</span> +254 707 528 980</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;