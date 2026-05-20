import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CreditCard,
  HandCoins,
  Wrench,
  Play,
  CheckCircle,
  Menu,
  X,
  Lock,
  Check,
  Users
} from 'lucide-react';
import { useAuth } from '../App';
import { translations } from '../utils/translations';
import '../landing.css';

const Landing = () => {
  // Reactive auth state from context
  const { isLoggedIn, user, visitCount, language, setLanguage } = useAuth();
  const t = translations[language] || translations.en;

  // Dynamic stats & admin overview state
  const [publicStats, setPublicStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    // 1. Fetch public platform statistics
    fetch('http://localhost:5000/api/public-stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch public stats');
        return res.json();
      })
      .then(data => setPublicStats(data))
      .catch(err => console.error('Error fetching public stats:', err));

    // 2. Fetch full user list if logged in user is Admin or Editor
    if (isLoggedIn && user && ['Admin', 'Editor'].includes(user.role)) {
      fetch('http://localhost:5000/api/users', {
        headers: {
          'x-user-role': user.role
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch admin users');
          return res.json();
        })
        .then(data => setAdminUsers(data))
        .catch(err => console.error('Error fetching admin user list:', err));
    }
  }, [isLoggedIn, user]);

  const handleManageClick = () => {
    localStorage.setItem('dashboard_active_tab', 'User Details');
  };

  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState('10000');
  const [calcRate, setCalcRate] = useState('5.5');
  const [calcTerm, setCalcTerm] = useState('36');

  const calculateInstallment = () => {
    const P = parseFloat(calcAmount);
    const r = parseFloat(calcRate) / 1200;
    const n = parseFloat(calcTerm);

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r <= 0 || n <= 0) {
      return '0.00';
    }

    const installment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return installment.toFixed(2);
  };

  return (
    <div className="landing-body animate-fade">
      {/* Background glowing decorations */}
      <div className="landing-bg-decor decor-purple"></div>
      <div className="landing-bg-decor decor-cyan"></div>
      <div className="landing-bg-decor decor-amber"></div>

      {/* Header / Navbar */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo">
            <div className="logo-icon-box">
              <Zap size={22} fill="white" />
            </div>
            <span>BankDash</span>
          </Link>

          <ul className="landing-nav-links">
            <li><a href="#features">{t.features}</a></li>
            <li><a href="#calculator">{t.calculator}</a></li>
            <li><a href="#testimonials">{t.reviews}</a></li>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-slide">
          <div className="hero-tag">
            <Zap size={14} /> {t.hero_tag}
          </div>
          <h1 className="hero-title">
            {t.hero_title_1} <br />
            {t.hero_title_2}
          </h1>
          <p className="hero-desc">
            {t.hero_desc}
          </p>
          <div className="hero-ctas">
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn-primary">
                {t.dashboard} <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  {t.open_account} <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary">
                  <Play size={16} fill="currentColor" /> {t.sign_in}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-media">
          <div className="visual-cards-container">
            {/* Main Premium Card Visual */}
            <div className="hero-main-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#c084fc', letterSpacing: '0.1em', fontWeight: 600 }}>{t.platinum_prestige}</div>
                <Zap size={22} color="#c084fc" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: '1rem 0' }}>$48,950.00</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>{t.card_holder}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>ALEX RAHMAN</div>
              </div>
            </div>

            {/* Sub-card Visual */}
            <div className="hero-sub-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#e0f2fe', letterSpacing: '0.1em', fontWeight: 600 }}>{t.business_smart}</div>
                <CreditCard size={22} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0.8rem 0' }}>$12,400.00</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#7dd3fc' }}>{t.card_holder}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>ATIQUR R.</div>
              </div>
            </div>

            {/* Floating Glassmorphic Widgets */}
            <div className="glass-widget widget-balance">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ld-text-muted)' }}>{t.income_stream}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ld-text-main)' }}>+$5,230.00</div>
                </div>
              </div>
            </div>

            <div className="glass-widget widget-activity">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <Activity size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ld-text-muted)' }}>{t.transactions_status}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ld-text-main)' }}>99.98% {t.approved}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Brand Logo Showcase */}
      <section className="trust-section">
        <h4 className="trust-title">{t.trust_title}</h4>
        <div className="brands-grid">
          <div className="brand-item">stripe</div>
          <div className="brand-item">payoneer</div>
          <div className="brand-item">PayPal</div>
          <div className="brand-item">mastercard</div>
          <div className="brand-item">VISA</div>
          <div className="brand-item">shopify</div>
        </div>
      </section>

      {/* Dynamic Statistics Banner */}
      <section className="stats-banner-container animate-fade">
        <div className="stats-grid-4">
          <div className="stat-glow-card">
            <div className="stat-glow-number">
              {publicStats ? publicStats.totalUsers : '3'}
            </div>
            <div className="stat-glow-label">{t.stat_users}</div>
          </div>
          <div className="stat-glow-card">
            <div className="stat-glow-number">
              {publicStats ? publicStats.admins : '1'}
            </div>
            <div className="stat-glow-label">{t.stat_admins}</div>
          </div>
          <div className="stat-glow-card">
            <div className="stat-glow-number">
              {publicStats ? publicStats.editors + publicStats.viewers : '2'}
            </div>
            <div className="stat-glow-label">{t.stat_staff}</div>
          </div>
          <div className="stat-glow-card">
            <div className="stat-glow-number" style={{ fontSize: '1.25rem', padding: '0.6rem 0' }}>
              {publicStats && publicStats.latestUsers && publicStats.latestUsers.length > 0 
                ? publicStats.latestUsers[publicStats.latestUsers.length - 1].name 
                : 'Test User'}
            </div>
            <div className="stat-glow-label">{t.stat_newest}</div>
          </div>
        </div>
      </section>

      {/* Dynamic Live Admin Control Center Preview */}
      {isLoggedIn && user && ['Admin', 'Editor'].includes(user.role) && adminUsers.length > 0 && (
        <section className="admin-preview-section animate-slide">
          <div className="admin-preview-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span className="section-tag" style={{ marginBottom: '0.5rem' }}>{t.admin_view_tag}</span>
                <h3 className="section-title" style={{ margin: 0, fontSize: '2rem' }}>{t.admin_view_title}</h3>
                <p className="section-desc" style={{ margin: '0.5rem 0 0 0', maxWidth: '600px' }}>
                  {t.admin_view_desc}
                </p>
              </div>
              <Link to="/dashboard" onClick={handleManageClick} className="btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
                {t.go_to_settings} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.user}</th>
                    <th>{t.email}</th>
                    <th>{t.role}</th>
                    <th>{t.permissions_config}</th>
                    <th>{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--ld-text-muted)' }}>{u.email}</td>
                      <td>
                        <span className={`admin-badge badge-${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span className={`permission-pill ${u.permissions?.manage_tx ? 'active' : ''}`}>TX</span>
                          <span className={`permission-pill ${u.permissions?.manage_cards ? 'active' : ''}`}>Card</span>
                          <span className={`permission-pill ${u.permissions?.manage_loans ? 'active' : ''}`}>Loan</span>
                          <span className={`permission-pill ${u.permissions?.manage_services ? 'active' : ''}`}>Serv</span>
                          <span className={`permission-pill ${u.permissions?.manage_users ? 'active' : ''}`}>User</span>
                        </div>
                      </td>
                      <td>
                        <Link 
                          to="/dashboard" 
                          onClick={handleManageClick} 
                          className="btn-table-action"
                        >
                          <Lock size={12} /> {t.manage}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-head">
          <span className="section-tag">{t.unmatched_power}</span>
          <h2 className="section-title">{t.features_title}</h2>
          <p className="section-desc">
            {t.features_desc}
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Safe & Secure */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <ShieldCheck size={24} />
                </div>
                <h4>{t.f1_title}</h4>
                <p>{t.f1_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f1_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f1_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f1_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f1_back_h1}</span>
                  <span>✦ {t.f1_back_h2}</span>
                  <span>✦ {t.f1_back_h3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Instant transfers */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <Zap size={24} />
                </div>
                <h4>{t.f2_title}</h4>
                <p>{t.f2_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f2_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f2_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f2_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f2_back_h1}</span>
                  <span>✦ {t.f2_back_h2}</span>
                  <span>✦ {t.f2_back_h3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Custom Cards */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <CreditCard size={24} />
                </div>
                <h4>{t.f3_title}</h4>
                <p>{t.f3_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f3_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f3_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f3_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f3_back_h1}</span>
                  <span>✦ {t.f3_back_h2}</span>
                  <span>✦ {t.f3_back_h3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Real-time insights */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Activity size={24} />
                </div>
                <h4>{t.f4_title}</h4>
                <p>{t.f4_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f4_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f4_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f4_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f4_back_h1}</span>
                  <span>✦ {t.f4_back_h2}</span>
                  <span>✦ {t.f4_back_h3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Smart Loans */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <HandCoins size={24} />
                </div>
                <h4>{t.f5_title}</h4>
                <p>{t.f5_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f5_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f5_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f5_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f5_back_h1}</span>
                  <span>✦ {t.f5_back_h2}</span>
                  <span>✦ {t.f5_back_h3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Services integration */}
          <div className="feature-card-wrapper">
            <div className="feature-card-inner">
              <div className="feature-card-front">
                <div className="feature-icon-box" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                  <Wrench size={24} />
                </div>
                <h4>{t.f6_title}</h4>
                <p>{t.f6_desc}</p>
                <div className="flip-hint">{t.hover_hint}</div>
              </div>
              <div className="feature-card-back">
                <div style={{ width: '100%' }}>
                  <span className="back-badge">{t.f6_back_badge}</span>
                  <h4 style={{ margin: '0.5rem 0 1rem 0' }}>{t.f6_back_title}</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--ld-text-muted)' }}>
                    {t.f6_back_desc}
                  </p>
                </div>
                <div className="back-highlights">
                  <span>✦ {t.f6_back_h1}</span>
                  <span>✦ {t.f6_back_h2}</span>
                  <span>✦ {t.f6_back_h3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section id="calculator" className="features-section" style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--ld-border)', borderBottom: '1px solid var(--ld-border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-tag">{t.calc_section_tag}</span>
            <h2 className="section-title">{t.calc_section_title}</h2>
            <p className="section-desc" style={{ marginBottom: '2rem' }}>
              {t.calc_section_desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{t.calc_item_1}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{t.calc_item_2}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle size={18} color="#10b981" />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{t.calc_item_3}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="calc-card">
              <h3 className="calc-title">{t.calc_card_title}</h3>

              <div className="calc-group">
                <label>{t.calc_label_principal}</label>
                <input
                  type="number"
                  className="calc-input"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                />
              </div>

              <div className="calc-group">
                <label>{t.calc_label_rate}</label>
                <input
                  type="number"
                  step="0.1"
                  className="calc-input"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                />
              </div>

              <div className="calc-group">
                <label>{t.calc_label_duration}</label>
                <input
                  type="number"
                  className="calc-input"
                  value={calcTerm}
                  onChange={(e) => setCalcTerm(e.target.value)}
                />
              </div>

              <div className="calc-result">
                <div style={{ fontSize: '0.8rem', color: 'var(--ld-text-muted)', marginBottom: '0.25rem' }}>{t.calc_monthly_payment}</div>
                <div className="calc-val">${calculateInstallment()} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ld-text-muted)' }}>{t.per_month}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews/Testimonials section */}
      <section id="testimonials" className="features-section">
        <div className="section-head">
          <span className="section-tag">{t.reviews_tag}</span>
          <h2 className="section-title">{t.reviews_title}</h2>
          <p className="section-desc">{t.reviews_desc}</p>
        </div>

        <div className="features-grid">
          {/* Testimonial 1 */}
          <div className="feature-card" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                alt="Sarah"
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--ld-primary)' }}
              />
              <div>
                <h5 style={{ color: 'var(--ld-text-main)', fontWeight: 600 }}>{t.t1_name}</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>{t.t1_role}</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "{t.t1_text}"
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="feature-card" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                alt="David"
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--ld-secondary)' }}
              />
              <div>
                <h5 style={{ color: 'var(--ld-text-main)', fontWeight: 600 }}>{t.t2_name}</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>{t.t2_role}</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "{t.t2_text}"
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="feature-card" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop"
                alt="Elena"
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--ld-accent)' }}
              />
              <div>
                <h5 style={{ color: 'var(--ld-text-main)', fontWeight: 600 }}>{t.t3_name}</h5>
                <span style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>{t.t3_role}</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              "{t.t3_text}"
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section id="cta" className="cta-banner-section">
        <div className="cta-banner-card animate-slide">
          <h3>{t.cta_title}</h3>
          <p>{t.cta_desc}</p>
          <Link to={isLoggedIn ? "/dashboard" : "/register"} className="btn-primary" style={{ padding: '1.1rem 3rem', fontSize: '1.1rem' }}>
            {isLoggedIn ? t.go_to_dashboard : t.get_started_now} <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
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
              <li><a href="#features">{t.features}</a></li>
              <li><a href="#calculator">{t.calculator}</a></li>
              <li><a href="/login">{t.dashboard} Preview</a></li>
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

export default Landing;
