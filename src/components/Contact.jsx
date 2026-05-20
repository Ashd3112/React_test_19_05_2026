import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeft, 
  Check, 
  User, 
  MessageSquare, 
  Zap, 
  Globe,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../App';
import { translations } from '../utils/translations';
import '../landing.css';

const Contact = () => {
  const { isLoggedIn, visitCount, language, setLanguage } = useAuth();
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeBranch, setActiveBranch] = useState(0);

  const branches = [
    {
      name: language === 'hi' ? 'सैन फ्रांसिस्को मुख्यालय' : 'San Francisco Headquarters',
      address: '100 Pine St, San Francisco, CA 94111',
      phone: '+1 (800) 555-0199',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.973419992389!2d-122.40243452422026!3d37.790695071981295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808b8b0e8c07%3A0xe2cae2d53bfefeb4!2s100%20Pine%20St%2C%20San%20Francisco%2C%20CA%2094111!5e0!3m2!1sen!2sus!4v1716220000000!5m2!1sen!2sus'
    },
    {
      name: language === 'hi' ? 'न्यूयॉर्क वित्तीय केंद्र' : 'New York Financial Hub',
      address: '120 Broadway, New York, NY 10271',
      phone: '+1 (212) 555-0245',
      hours: 'Mon-Fri: 8:30 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.3644400938166!2d-74.01256032402773!3d40.70792377933181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a172775f0a3%3A0x673cccd59c0be7cd!2s120%20Broadway%2C%20New%20York%2C%20NY%2010271!5e0!3m2!1sen!2sus!4v1716220100000!5m2!1sen!2sus'
    },
    {
      name: language === 'hi' ? 'लंदन ग्लोबल ऑफिस' : 'London Global Office',
      address: '30 St Mary Axe, London EC3A 8BF, UK',
      phone: '+44 20 7555 0188',
      hours: 'Mon-Fri: 9:00 AM - 5:30 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.9078170068153!2d-0.08373372338048259!3d51.51449447181608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876034c54466b07%3A0x7d6f54c9c1b827e8!2s30%20St%20Mary%20Axe!5e0!3m2!1sen!2sus!4v1716220200000!5m2!1sen!2sus'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorMsg(t.val_name_req);
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg(t.val_email_req);
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg(t.val_subj_req);
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMsg(t.val_msg_req);
      return;
    }

    setIsSubmitting(true);

    // Mock API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="landing-body animate-fade">
      {/* Background glowing decorations */}
      <div className="landing-bg-decor decor-purple"></div>
      <div className="landing-bg-decor decor-cyan"></div>
      <div className="landing-bg-decor decor-amber"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo">
            <div className="logo-icon-box">
              <Zap size={22} fill="white" />
            </div>
            <span>BankDash</span>
          </Link>

          <ul className="landing-nav-links">
            <li><Link to="/">{language === 'hi' ? 'होम' : 'Home'}</Link></li>
            <li><Link to="/#features">{t.features}</Link></li>
            <li><Link to="/#calculator">{t.calculator}</Link></li>
            <li><Link to="/contact">{t.support}</Link></li>
          </ul>

          <div className="landing-nav-actions">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select"
              style={{ marginRight: '0.5rem' }}
            >
              <option value="en">English 🇬🇧</option>
              <option value="hi">हिंदी 🇮🇳</option>
            </select>
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn-nav-signup">{t.dashboard}</Link>
            ) : (
              <>
                <Link to="/login" className="btn-nav-login">{t.login}</Link>
                <Link to="/register" className="btn-nav-signup">{t.signup}</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="contact-container animate-slide">
        <Link to="/" className="back-home-link">
          <ArrowLeft size={16} /> {t.back_to_home}
        </Link>

        {!isSubmitted ? (
          <>
            <div className="contact-header">
              <span className="section-tag">{language === 'hi' ? 'संपर्क करें' : 'GET IN TOUCH'}</span>
              <h1 className="section-title" style={{ fontSize: '3rem' }}>{t.contact_title}</h1>
              <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
                {t.contact_subtitle}
              </p>
            </div>

            <div className="contact-grid">
              {/* Left Column: Contact details */}
              <div className="contact-info-panel">
                <div>
                  <h3 className="contact-info-title">{t.contact_info_title}</h3>
                  <p className="contact-info-desc">
                    {t.contact_info_desc}
                  </p>

                  <div className="contact-details-list">
                    <div className="contact-detail-item">
                      <div className="contact-icon-box">
                        <Mail size={20} />
                      </div>
                      <div className="contact-detail-content">
                        <h5>{t.email_us}</h5>
                        <p>support@bankdash.com</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-icon-box">
                        <Phone size={20} />
                      </div>
                      <div className="contact-detail-content">
                        <h5>{t.call_support}</h5>
                        <p>+1 (800) 555-0199</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-icon-box">
                        <MapPin size={20} />
                      </div>
                      <div className="contact-detail-content">
                        <h5>{t.headquarters}</h5>
                        <p>100 Pine St, San Francisco, CA</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-socials">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Github">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
              </div>

              {/* Right Column: Contact form */}
              <div className="contact-form-panel">
                {errorMsg && (
                  <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    {errorMsg}
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className="contact-form-group">
                      <label htmlFor="name">{t.label_name}</label>
                      <div className="contact-input-wrapper">
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          className="contact-form-input" 
                          placeholder={t.placeholder_name}
                          value={formData.name}
                          onChange={handleChange}
                        />
                        <User className="contact-input-icon" size={18} />
                      </div>
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="email">{t.label_email}</label>
                      <div className="contact-input-wrapper">
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          className="contact-form-input" 
                          placeholder={t.placeholder_email}
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <Mail className="contact-input-icon" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="subject">{t.label_subject}</label>
                    <div className="contact-input-wrapper">
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        className="contact-form-input" 
                        placeholder={t.placeholder_subject}
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      <MessageSquare className="contact-input-icon" size={18} />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="message">{t.label_message}</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="contact-form-textarea" 
                      placeholder={t.placeholder_message}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-contact-submit" 
                    disabled={isSubmitting}
                    style={isSubmitting ? { opacity: 0.8, cursor: 'not-allowed' } : {}}
                  >
                    {isSubmitting ? t.btn_sending : t.btn_submit}
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Branch Locations & Map Section */}
            <div className="contact-map-section" style={{ marginTop: '4rem' }}>
              <div className="section-head" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="section-tag">{t.branch_locator_tag}</span>
                <h2 className="section-title" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{t.branch_locator_title}</h2>
                <p className="section-desc" style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto', fontSize: '0.95rem' }}>
                  {t.branch_locator_desc}
                </p>
              </div>

              <div className="map-layout-grid">
                {/* Branch details list */}
                <div className="branch-list-panel">
                  {branches.map((branch, idx) => (
                    <div 
                      key={idx} 
                      className={`branch-card-item ${activeBranch === idx ? 'active' : ''}`}
                      onClick={() => setActiveBranch(idx)}
                    >
                      <div className="branch-card-header">
                        <div className="branch-pin-indicator">
                          <MapPin size={18} />
                        </div>
                        <h4 className="branch-name-text">{branch.name}</h4>
                      </div>
                      
                      <div className="branch-details-body">
                        <p className="branch-detail-line">
                          <strong>{language === 'hi' ? 'पता:' : 'Address:'}</strong> {branch.address}
                        </p>
                        <p className="branch-detail-line">
                          <strong>{t.branch_phone}:</strong> {branch.phone}
                        </p>
                        <div className="branch-detail-line" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                          <Clock size={13} style={{ color: 'var(--ld-text-muted)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem' }}>{branch.hours}</span>
                        </div>
                      </div>

                      <div className="branch-card-action">
                        <span className="branch-action-text">{t.branch_view_map}</span>
                        <ChevronRight size={14} className="branch-action-chevron" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map iframe */}
                <div className="branch-map-iframe-container">
                  <iframe 
                    title={branches[activeBranch].name}
                    src={branches[activeBranch].mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="contact-map-iframe"
                  ></iframe>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="contact-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="contact-success-card">
              <div className="success-icon-box">
                <Check size={40} />
              </div>
              <h2 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{t.success_title}</h2>
              <p className="section-desc" style={{ maxWidth: '480px', marginBottom: '2.5rem' }}>
                {t.alert_success} {language === 'hi' ? 'हम आपसे संपर्क करेंगे' : 'We will reach out to you at'} <strong>{formData.email}</strong>.
              </p>
              <Link to="/" className="btn-primary">
                {t.return_home}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="landing-footer" style={{ marginTop: '5rem' }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="landing-logo">
              <div className="logo-icon-box">
                <Zap size={22} fill="white" />
              </div>
              <span>BankDash</span>
            </Link>
            <p className="footer-desc">
              {t.footer_desc}
            </p>
          </div>

          <div className="footer-col">
            <h5>{t.col_product}</h5>
            <ul className="footer-links">
              <li><Link to="/#features">{t.features}</Link></li>
              <li><Link to="/#calculator">{t.calculator}</Link></li>
              <li><Link to="/login">{t.dashboard} Preview</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.col_security}</h5>
            <ul className="footer-links">
              <li><a href="#">Encryption Standards</a></li>
              <li><a href="#">Access Management</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.col_company}</h5>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><Link to="/contact">{t.support}</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} BankDash. All rights reserved.</div>
          
          {visitCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--ld-border)', fontSize: '0.85rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }}></span>
              <span style={{ color: 'var(--ld-text-muted)', fontWeight: 500 }}>{t.visit_count} <strong style={{ color: 'var(--ld-text-main)' }}>{visitCount.toLocaleString()}</strong></span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--ld-text-muted)', textDecoration: 'none' }}>{t.terms}</a>
            <a href="#" style={{ color: 'var(--ld-text-muted)', textDecoration: 'none' }}>{t.privacy}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
