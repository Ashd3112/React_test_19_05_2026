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
  Globe 
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
