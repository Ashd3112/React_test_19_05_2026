import { useState, useEffect, useRef } from 'react';
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
  Users,
  Search,
  Phone,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  Smartphone,
  Info,
  HelpCircle,
  TrendingUp,
  Percent,
  Sparkles,
  Landmark
} from 'lucide-react';
import { useAuth } from '../App';
import { translations } from '../utils/translations';
import '../landing.css';

const Landing = () => {
  const { isLoggedIn, user, visitCount, language, setLanguage } = useAuth();
  const t = translations[language] || translations.en;

  // Search state & suggestion logic
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const searchInputRef = useRef(null);

  // Modals & Overlays
  const [activeModal, setActiveModal] = useState(null); // 'apply', 'forms', 'locator'
  const [applyProduct, setApplyProduct] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', income: '' });

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: language === 'en' ? "Gold Loan @ 7.20% interest rate" : "स्वर्ण ऋण @ 7.20% ब्याज दर",
      desc: language === 'en' ? "Instant approval with minimal paperwork. Safeguard your gold while unlocking its value." : "न्यूनतम कागजी कार्रवाई के साथ तत्काल स्वीकृति। अपने सोने को सुरक्षित रखते हुए उसका मूल्य अनलॉक करें।",
      badge: language === 'en' ? "FESTIVE OFFER" : "उत्सव ऑफर",
      btnText: language === 'en' ? "Apply Gold Loan" : "स्वर्ण ऋण के लिए आवेदन करें",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
      target: "Gold Loan"
    },
    {
      title: language === 'en' ? "100% Paperless Digital Personal Loan" : "100% पेपरलेस डिजिटल पर्सनल लोन",
      desc: language === 'en' ? "Get credit up to $25,000 instantly in your savings account within 5 minutes." : "5 मिनट के भीतर अपने बचत खाते में $25,000 तक का तत्काल ऋण प्राप्त करें।",
      badge: language === 'en' ? "DIGITAL EXCLUSIVE" : "डिजिटल विशेष",
      btnText: language === 'en' ? "Check Eligibility" : "पात्रता जांचें",
      bgGradient: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
      target: "Digital Personal Loan"
    },
    {
      title: language === 'en' ? "BankDash World Mobile App Launch" : "BankDash World मोबाइल ऐप लॉन्च",
      desc: language === 'en' ? "Experience next-gen banking on your phone. Scan, transfer, pay bills & invest on the go." : "अपने फोन पर अगली पीढ़ी की बैंकिंग का अनुभव करें। स्कैन, ट्रांसफर, बिल भुगतान और निवेश करें।",
      badge: language === 'en' ? "NEW RELEASE" : "नया रिलीज",
      btnText: language === 'en' ? "Download App" : "ऐप डाउनलोड करें",
      bgGradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
      target: "BankDash App"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Product Showcase Tabs
  const [activeTab, setActiveTab] = useState('Accounts');
  const products = {
    Accounts: [
      { name: "Advantage Savings Account", desc: "Premium interest rates up to 4.2% p.a. with zero balance option for students.", benefit: "Free Debit Card & Unlimited ATM withdrawals" },
      { name: "Platinum Prestige Account", desc: "Designed for high-net-worth individuals. Multi-currency support & private manager.", benefit: "Complimentary Airport Lounge access & zero fee transfers" }
    ],
    Loans: [
      { name: "Home Loan", desc: "Build or buy your dream home. Interest rates starting from 7.20% p.a.", benefit: "Zero processing fees & flexible repayment tenure" },
      { name: "Car Loan", desc: "Drive home your dream car. Fast processing and competitive interest rates.", benefit: "Up to 90% on-road financing" },
      { name: "Gold Loan", desc: "Unlock value of your gold instantly. Minimal documentation and secure vaults.", benefit: "Low interest rates starting @ 7.20%" }
    ],
    Cards: [
      { name: "Visa Signature Credit Card", desc: "Earn premium reward points on every dining, travel, and online purchase.", benefit: "10% instant discount with key retail partners" },
      { name: "RuPay Select Card", desc: "Domestic lounge access and wellness benefits with zero annual fee.", benefit: "Cashback up to 5% on utility bills" }
    ],
    Deposits: [
      { name: "Double Dhamaka FD", desc: "Double your principal amount in a fixed term under secure government guarantees.", benefit: "Higher interest rates for senior citizens (+0.50%)" },
      { name: "Recurring Deposit Saver", desc: "Build your savings systematically with monthly deposits starting from just $10.", benefit: "Compounded quarterly interest rates" }
    ]
  };

  // Interactive Calculator State & Auto Fill logic
  const [calcAmount, setCalcAmount] = useState('10000');
  const [calcRate, setCalcRate] = useState('7.2');
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

  const handleRateCardClick = (rate, typicalAmount, label) => {
    setCalcRate(rate.toString());
    setCalcAmount(typicalAmount.toString());
    const section = document.getElementById('calculator');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Suggestion Pill trigger
  const handlePillClick = (term) => {
    setSearchQuery(term);
    triggerSearch(term);
  };

  // Search logic
  const triggerSearch = (query) => {
    if (!query) return;
    // Simple search catalog mapping keywords to sections or products
    const q = query.toLowerCase();
    let result = null;

    if (q.includes('loan') || q.includes('home') || q.includes('gold') || q.includes('car')) {
      result = {
        title: language === 'en' ? "Related Loan Products Found" : "संबंधित ऋण उत्पाद मिले",
        desc: language === 'en' ? "We offer Home Loans (7.20%), Gold Loans (7.20%), Car Loans (7.80%), and Personal Loans (10.15%). You can calculate rates and apply." : "हम होम लोन (7.20%), गोल्ड लोन (7.20%), कार लोन (7.80%) और पर्सनल लोन (10.15%) प्रदान करते हैं।",
        action: () => {
          setActiveTab('Loans');
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        },
        btnText: language === 'en' ? "View Loan Products" : "ऋण उत्पाद देखें"
      };
    } else if (q.includes('account') || q.includes('saving') || q.includes('current')) {
      result = {
        title: language === 'en' ? "Savings & Current Accounts" : "बचत और चालू खाते",
        desc: language === 'en' ? "BOB Advantage and Platinum Savings accounts offer dynamic interest, custom debit cards, and multi-currency wallets." : "बीओबी एडवांटेज और प्लेटिनम बचत खाते गतिशील ब्याज और कस्टम डेबिट कार्ड प्रदान करते हैं।",
        action: () => {
          setActiveTab('Accounts');
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        },
        btnText: language === 'en' ? "View Accounts" : "खाते देखें"
      };
    } else if (q.includes('offer') || q.includes('discount') || q.includes('cashback')) {
      result = {
        title: language === 'en' ? "Active Promotional Offers" : "सक्रिय प्रचार ऑफर",
        desc: language === 'en' ? "Get instant 10% discount on dining, cashback on grocery, or free 3 months OTT subscriptions with BankDash cards." : "बैंकडैश कार्ड के साथ डाइनिंग पर तत्काल 10% छूट, किराना पर कैशबैक या मुफ्त 3 महीने का ओटीटी सब्सक्रिप्शन प्राप्त करें।",
        action: () => {
          document.getElementById('offers-section')?.scrollIntoView({ behavior: 'smooth' });
        },
        btnText: language === 'en' ? "View Special Offers" : "विशेष ऑफर देखें"
      };
    } else if (q.includes('rate') || q.includes('interest')) {
      result = {
        title: language === 'en' ? "Live Interest Rates Finder" : "लाइव ब्याज दर खोजक",
        desc: language === 'en' ? "Check our dynamic interest rate grid. Starting from 7.20% for Gold/Home loans and up to 10.15% for Personal Loans." : "हमारी गतिशील ब्याज दर ग्रिड की जाँच करें। गोल्ड/होम लोन के लिए 7.20% से शुरू होकर पर्सनल लोन के लिए 10.15% तक।",
        action: () => {
          document.getElementById('rates-section')?.scrollIntoView({ behavior: 'smooth' });
        },
        btnText: language === 'en' ? "View Interest Rates" : "ब्याज दरें देखें"
      };
    } else {
      result = {
        title: language === 'en' ? "Search Results" : "खोज परिणाम",
        desc: language === 'en' ? `Looking for '${query}'? Explore our online banking services by opening an account today.` : `'${query}' की तलाश है? आज ही खाता खोलकर हमारी ऑनलाइन बैंकिंग सेवाओं का अन्वेषण करें।`,
        action: () => {
          setActiveModal('apply');
          setApplyProduct('General Digital Account');
        },
        btnText: language === 'en' ? "Open Free Account" : "मुफ़्त खाता खोलें"
      };
    }

    setSearchResult(result);
    setShowSuggestions(false);
  };

  // Handle Application Submit
  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email || !applyForm.phone) {
      alert(language === 'en' ? "Please fill in all required fields." : "कृपया सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: applyForm.name,
        email: applyForm.email,
        phone: applyForm.phone,
        income: applyForm.income,
        product: applyProduct
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
      })
      .then(() => {
        setApplySuccess(true);
        setTimeout(() => {
          setActiveModal(null);
          setApplySuccess(false);
          setApplyForm({ name: '', email: '', phone: '', income: '' });
        }, 3000);
      })
      .catch(err => {
        console.error('Error submitting application:', err);
        alert(language === 'en' ? "Failed to submit application. Please try again." : "आवेदन जमा करने में विफल। कृपया पुन: प्रयास करें।");
      });
  };

  return (
    <div className="landing-body animate-fade">
      {/* Background glowing decorations */}
      <div className="landing-bg-decor decor-purple"></div>
      <div className="landing-bg-decor decor-cyan"></div>
      <div className="landing-bg-decor decor-amber"></div>

      {/* TOP UTILITY BAR (Bank of Baroda Inspired) */}
      <div className="top-utility-bar">
        <div className="top-utility-container">
          <div className="utility-left">
            <span className="utility-item"><Phone size={13} /> {t.toll_free}</span>
            <span className="utility-item cursor-pointer" onClick={() => setActiveModal('locator')}><MapPin size={13} /> {language === 'en' ? "Branch Locator" : "शाखा खोजक"}</span>
            <span className="utility-item cursor-pointer" onClick={() => setActiveModal('forms')}><Download size={13} /> {t.download_forms}</span>
          </div>
          <div className="utility-right">
            <a href="#rates-section" className="utility-link"><TrendingUp size={13} /> {t.rates_cards}</a>
            <Link to="/contact" className="utility-link"><HelpCircle size={13} /> {t.cust_care}</Link>
            <div className="language-selector-wrapper">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="lang-select-utility"
              >
                <option value="en">English 🇬🇧</option>
                <option value="hi">हिंदी 🇮🇳</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo">
            <div className="logo-icon-box">
              <Zap size={22} fill="white" />
            </div>
            <span>BankDash</span>
          </Link>

          {/* Categorized Mega-nav items */}
          <nav className="mega-nav">
            <div className="nav-item-dropdown">
              <span className="nav-drop-label">{t.nav_personal}</span>
              <div className="nav-dropdown-content">
                <a href="#products-section" onClick={() => setActiveTab('Accounts')}>Savings Accounts</a>
                <a href="#products-section" onClick={() => setActiveTab('Loans')}>Home Loans</a>
                <a href="#products-section" onClick={() => setActiveTab('Cards')}>Credit Cards</a>
              </div>
            </div>
            <div className="nav-item-dropdown">
              <span className="nav-drop-label">{t.nav_business}</span>
              <div className="nav-dropdown-content">
                <a href="#products-section" onClick={() => setActiveTab('Accounts')}>Current Accounts</a>
                <a href="#products-section" onClick={() => setActiveTab('Deposits')}>Fixed Term Deposits</a>
                <a href="#products-section" onClick={() => setActiveTab('Loans')}>Business Overdrafts</a>
              </div>
            </div>
            <div className="nav-item-dropdown">
              <span className="nav-drop-label">{t.nav_agri}</span>
              <div className="nav-dropdown-content">
                <a href="#products-section" onClick={() => setActiveTab('Loans')}>Crop Gold Loans</a>
                <a href="#products-section" onClick={() => setActiveTab('Loans')}>Tractor Finance</a>
              </div>
            </div>
            <Link to="/contact" className="nav-direct-link">{t.nav_about}</Link>
          </nav>

          {/* Search bar inside header */}
          <div className="header-search-container">
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.search_placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') triggerSearch(searchQuery);
                }}
                className="header-search-input"
              />
              <Search size={16} className="search-icon" onClick={() => triggerSearch(searchQuery)} />
            </div>

            {showSuggestions && (
              <div className="search-suggestions-overlay">
                <div className="suggestion-item" onClick={() => handlePillClick('Gold Loan')}>Gold Loan Rates</div>
                <div className="suggestion-item" onClick={() => handlePillClick('Savings Account')}>Savings Account Details</div>
                <div className="suggestion-item" onClick={() => handlePillClick('Special Offers')}>Special Cashback Offers</div>
                <div className="suggestion-item" onClick={() => handlePillClick('Home Loan')}>Home Loan Calculator</div>
              </div>
            )}
          </div>

          <div className="landing-nav-actions">
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

      {/* SEARCH RESULT OVERLAY CARD */}
      {searchResult && (
        <div className="search-result-banner-container">
          <div className="search-result-banner animate-slide">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="search-result-badge"><Sparkles size={12} /> {language === 'en' ? "Match Found" : "मैच मिला"}</span>
                <h4 className="search-result-title">{searchResult.title}</h4>
                <p className="search-result-desc">{searchResult.desc}</p>
              </div>
              <button className="btn-close-search" onClick={() => setSearchResult(null)}><X size={18} /></button>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }} onClick={() => { searchResult.action(); setSearchResult(null); }}>
                {searchResult.btnText}
              </button>
              <button className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }} onClick={() => setSearchResult(null)}>
                {language === 'en' ? "Clear Search" : "खोज साफ़ करें"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SUGGESTIONS PILLS */}
      <div className="quick-suggestions-bar">
        <div className="quick-suggestions-container">
          <span className="suggestion-label"><Info size={14} /> {t.quick_suggestions}:</span>
          <div className="suggestion-pills">
            <button className="pill-btn" onClick={() => handlePillClick('Digital Savings Account')}>{language === 'en' ? "Digital Savings" : "डिजिटल बचत"}</button>
            <button className="pill-btn" onClick={() => handlePillClick('Gold Loan')}>{language === 'en' ? "Gold Loan @ 7.20%" : "गोल्ड लोन @ 7.20%"}</button>
            <button className="pill-btn" onClick={() => handlePillClick('Home Loan')}>{language === 'en' ? "Home Loan 7.20%" : "होम लोन 7.20%"}</button>
            <button className="pill-btn" onClick={() => handlePillClick('Offers')}>{language === 'en' ? "Special Offers" : "विशेष ऑफर"}</button>
            <button className="pill-btn" onClick={() => handlePillClick('Interest Rates')}>{language === 'en' ? "Interest Rates" : "ब्याज दरें"}</button>
          </div>
        </div>
      </div>

      {/* WHAT'S NEW CAROUSEL / SLIDER */}
      <section className="whats-new-section animate-fade">
        <div className="whats-new-container">
          <div className="whats-new-header">
            <h2 className="section-title"><Sparkles size={20} color="var(--ld-primary)" style={{ marginRight: '0.5rem' }} />{t.whats_new_title}</h2>
            <div className="carousel-nav">
              <button className="carousel-nav-btn" onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}><ChevronLeft size={20} /></button>
              <button className="carousel-nav-btn" onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="carousel-viewport">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
                style={{ background: slide.bgGradient }}
              >
                <div className="slide-content">
                  <span className="slide-badge">{slide.badge}</span>
                  <h3 className="slide-title">{slide.title}</h3>
                  <p className="slide-desc">{slide.desc}</p>
                  <button className="btn-slide-action" onClick={() => {
                    setActiveModal('apply');
                    setApplyProduct(slide.target);
                  }}>
                    {slide.btnText} <ArrowRight size={16} />
                  </button>
                </div>
                <div className="slide-visual">
                  <div className="visual-circle-decor">
                    <TrendingUp size={80} color="rgba(255,255,255,0.15)" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-indicators">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`indicator-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* HERO SECTION */}
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

      {/* INTERACTIVE PRODUCTS SHOWCASE TABS */}
      <section id="products-section" className="features-section" style={{ background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid var(--ld-border)', borderBottom: '1px solid var(--ld-border)' }}>
        <div className="section-head">
          <span className="section-tag">{language === 'en' ? "BROWSE OUR PORTFOLIO" : "हमारे पोर्टफोलियो ब्राउज़ करें"}</span>
          <h2 className="section-title">{language === 'en' ? "Explore Banking Products" : "बैंकिंग उत्पादों का अन्वेषण करें"}</h2>
          <p className="section-desc">
            {language === 'en' ? "Choose from our wide range of tailored financial solutions designed to serve your direct personal or business needs." : "अपनी व्यक्तिगत या व्यावसायिक आवश्यकताओं को पूरा करने के लिए हमारे व्यापक वित्तीय समाधानों में से चुनें।"}
          </p>
        </div>

        {/* Tab Headers */}
        <div className="product-tab-headers">
          {Object.keys(products).map(tabName => (
            <button
              key={tabName}
              className={`product-tab-btn ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName === 'Accounts' && <Landmark size={16} />}
              {tabName === 'Loans' && <HandCoins size={16} />}
              {tabName === 'Cards' && <CreditCard size={16} />}
              {tabName === 'Deposits' && <Activity size={16} />}
              <span style={{ marginLeft: '0.5rem' }}>{t[`product_${tabName.toLowerCase()}`] || tabName}</span>
            </button>
          ))}
        </div>

        {/* Tab content cards grid */}
        <div className="product-cards-grid animate-fade">
          {products[activeTab].map((p, idx) => (
            <div key={idx} className="product-showcase-card">
              <div className="product-card-header">
                <span className="product-tag-badge"><Sparkles size={12} /> {activeTab}</span>
                <h4 className="product-card-title">{p.name}</h4>
              </div>
              <p className="product-card-desc">{p.desc}</p>
              <div className="product-card-benefit">
                <CheckCircle size={14} color="#10b981" />
                <span>{p.benefit}</span>
              </div>
              <div className="product-card-actions">
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => {
                  setActiveModal('apply');
                  setApplyProduct(p.name);
                }}>
                  {t.apply_now}
                </button>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handlePillClick(p.name)}>
                  {t.know_more}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC KEY INTEREST RATES SECTION */}
      <section id="rates-section" className="features-section">
        <div className="section-head">
          <span className="section-tag"><Percent size={14} style={{ marginRight: '0.3rem' }} />{language === 'en' ? "BEST IN MARKET RATES" : "बाजार में सर्वोत्तम दरें"}</span>
          <h2 className="section-title">{t.interest_rates_title}</h2>
          <p className="section-desc">{t.interest_rates_desc}</p>
        </div>

        <div className="interest-rates-grid">
          {/* Rate card 1: Home Loan */}
          <div className="rate-card-item cursor-pointer" onClick={() => handleRateCardClick(7.20, 50000, "Home Loan")}>
            <div className="rate-card-head">
              <Landmark size={20} color="var(--ld-primary)" />
              <h5>{language === 'en' ? "Baroda Home Loan" : "बड़ौदा होम लोन"}</h5>
            </div>
            <div className="rate-card-body">
              <span className="rate-number">7.20% <span className="rate-suffix">p.a.</span></span>
              <p className="rate-desc">{language === 'en' ? "Starting interest rate. Click to prefill calculator." : "प्रारंभिक ब्याज दर। कैलकुलेटर भरने के लिए क्लिक करें।"}</p>
            </div>
          </div>

          {/* Rate card 2: Car Loan */}
          <div className="rate-card-item cursor-pointer" onClick={() => handleRateCardClick(7.80, 20000, "Car Loan")}>
            <div className="rate-card-head">
              <Zap size={20} color="var(--ld-secondary)" />
              <h5>{language === 'en' ? "Baroda Car Loan" : "बड़ौदा कार लोन"}</h5>
            </div>
            <div className="rate-card-body">
              <span className="rate-number">7.80% <span className="rate-suffix">p.a.</span></span>
              <p className="rate-desc">{language === 'en' ? "For brand new vehicles. Click to prefill calculator." : "वाहनों के लिए। कैलकुलेटर भरने के लिए क्लिक करें।"}</p>
            </div>
          </div>

          {/* Rate card 3: Education Loan */}
          <div className="rate-card-item cursor-pointer" onClick={() => handleRateCardClick(8.85, 30000, "Education Loan")}>
            <div className="rate-card-head">
              <Users size={20} color="var(--ld-accent)" />
              <h5>{language === 'en' ? "Education Loan" : "शिक्षा ऋण"}</h5>
            </div>
            <div className="rate-card-body">
              <span className="rate-number">8.85% <span className="rate-suffix">p.a.</span></span>
              <p className="rate-desc">{language === 'en' ? "For higher studies worldwide. Click to prefill calculator." : "उच्च शिक्षा के लिए। कैलकुलेटर भरने के लिए क्लिक करें।"}</p>
            </div>
          </div>

          {/* Rate card 4: Personal Loan */}
          <div className="rate-card-item cursor-pointer" onClick={() => handleRateCardClick(10.15, 10000, "Personal Loan")}>
            <div className="rate-card-head">
              <CreditCard size={20} color="#ec4899" />
              <h5>{language === 'en' ? "Personal Loan" : "व्यक्तिगत ऋण"}</h5>
            </div>
            <div className="rate-card-body">
              <span className="rate-number">10.15% <span className="rate-suffix">p.a.</span></span>
              <p className="rate-desc">{language === 'en' ? "Quick digital personal credit. Click to prefill calculator." : "त्वरित डिजिटल क्रेडिट। कैलकुलेटर भरने के लिए क्लिक करें।"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALCULATOR SECTION */}
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>{t.calc_label_principal}</label>
                  <span className="calc-val-indicator">${Number(calcAmount).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  className="calc-range-slider"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                />
              </div>

              <div className="calc-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>{t.calc_label_rate}</label>
                  <span className="calc-val-indicator">{calcRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.1"
                  className="calc-range-slider"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                />
              </div>

              <div className="calc-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>{t.calc_label_duration}</label>
                  <span className="calc-val-indicator">{calcTerm} Months</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="12"
                  className="calc-range-slider"
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

      {/* SPECIAL OFFERS SECTION */}
      <section id="offers-section" className="features-section">
        <div className="section-head">
          <span className="section-tag"><Sparkles size={14} style={{ marginRight: '0.3rem' }} />{language === 'en' ? "PROMOTIONS & REWARDS" : "प्रचार और पुरस्कार"}</span>
          <h2 className="section-title">{t.special_offers_title}</h2>
          <p className="section-desc">{t.special_offers_desc}</p>
        </div>

        <div className="special-offers-grid">
          {/* Card 1 */}
          <div className="offer-card-item">
            <div className="offer-badge">10% OFF</div>
            <h4 className="offer-title">{language === 'en' ? "Instant Discount on Travel & Flights" : "यात्रा और उड़ानों पर त्वरित छूट"}</h4>
            <p className="offer-desc">{language === 'en' ? "Get 10% instant discount up to $100 on flight bookings using BankDash Signature Cards." : "बैंकडैश सिग्नेचर कार्ड्स का उपयोग करके फ्लाइट बुकिंग पर $100 तक 10% त्वरित छूट प्राप्त करें।"}</p>
            <div className="offer-footer">
              <span className="coupon-code">CODE: <b>DASHTRAVEL</b></span>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handlePillClick('Offers')}>{t.apply_now}</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="offer-card-item">
            <div className="offer-badge">15% CASHBACK</div>
            <h4 className="offer-title">{language === 'en' ? "Buy 2 Products & Get Grocery Cashback" : "2 उत्पाद खरीदें और किराना कैशबैक प्राप्त करें"}</h4>
            <p className="offer-desc">{language === 'en' ? "Shop on partnered supermarkets and unlock flat 15% cashback credited directly to savings." : "साझेदार सुपरमार्केट में खरीदारी करें और बचत खाते में सीधे जमा किए गए 15% कैशबैक को अनलॉक करें।"}</p>
            <div className="offer-footer">
              <span className="coupon-code">CODE: <b>DASHMART15</b></span>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handlePillClick('Offers')}>{t.apply_now}</button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="offer-card-item">
            <div className="offer-badge">3 MONTHS FREE</div>
            <h4 className="offer-title">{language === 'en' ? "Entertainment & OTT Subscription" : "मनोरंजन और ओटीटी सदस्यता"}</h4>
            <p className="offer-desc">{language === 'en' ? "Get 3 months complimentary subscription to premier media partners with new accounts." : "नए खातों के साथ प्रमुख मीडिया भागीदारों के लिए 3 महीने की मानार्थ सदस्यता प्राप्त करें।"}</p>
            <div className="offer-footer">
              <span className="coupon-code">CODE: <b>DASHSTREAM</b></span>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handlePillClick('Offers')}>{t.apply_now}</button>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP PROMO SECTION (Bank of Baroda Inspired) */}
      <section className="app-promo-section">
        <div className="app-promo-card">
          <div className="app-promo-grid">
            <div className="app-promo-content">
              <span className="app-badge-new">NEW LOOK</span>
              <h3>{t.app_promo_title}</h3>
              <p>{t.app_promo_desc}</p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Embedded mock QR code */}
                  <div style={{ width: '80px', height: '80px', background: '#000', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', padding: '4px', borderRadius: '4px' }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} style={{ background: i % 3 === 0 || i % 5 === 0 ? '#fff' : '#000' }}></div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{language === 'en' ? "Scan QR code to install" : "इंस्टॉल करने के लिए क्यूआर कोड स्कैन करें"}</div>
                  <div className="app-buttons">
                    <button className="btn-app-store"><Smartphone size={14} /> App Store</button>
                    <button className="btn-app-store"><Play size={14} /> Google Play</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="app-promo-visual">
              <div className="app-phone-mockup">
                <div className="phone-screen">
                  <div className="phone-header">
                    <span className="phone-time">09:41</span>
                    <div className="phone-camera"></div>
                  </div>
                  <div className="phone-app-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600 }}>Dash World</div>
                      <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.5rem', opacity: 0.8 }}>Available Balance</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>$14,925.80</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.45rem' }}>
                        <SendIcon size={12} />
                        <div>Send</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.45rem' }}>
                        <Percent size={12} />
                        <div>Loans</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.45rem' }}>
                        <CreditCard size={12} />
                        <div>Cards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

      {/* MODALS */}

      {/* 1. APPLY NOW APPLICATION FORM MODAL */}
      {activeModal === 'apply' && (
        <div className="modal-backdrop">
          <div className="modal-container animate-slide">
            <div className="modal-header">
              <h3>{language === 'en' ? "Apply for Products" : "उत्पाद के लिए आवेदन करें"}</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </div>
            {applySuccess ? (
              <div className="apply-success-box">
                <CheckCircle size={48} color="#10b981" />
                <h4>{language === 'en' ? "Application Submitted Successfully!" : "आवेदन सफलतापूर्वक जमा किया गया!"}</h4>
                <p>{language === 'en' ? `Your interest in ${applyProduct} has been registered. Our representative will call you within 24 hours.` : `आपकी ${applyProduct} में रुचि दर्ज कर ली गई है। हमारे प्रतिनिधि 24 घंटे के भीतर आपसे संपर्क करेंगे।`}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="modal-form">
                <div style={{ background: 'rgba(79, 70, 229, 0.08)', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid var(--ld-border)' }}>
                  {language === 'en' ? "Product Selected: " : "चयनित उत्पाद: "} <b>{applyProduct}</b>
                </div>

                <div className="form-group-modal">
                  <label>{t.label_name} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t.placeholder_name}
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group-modal">
                  <label>{t.label_email} *</label>
                  <input
                    type="email"
                    required
                    placeholder={t.placeholder_email}
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group-modal">
                  <label>{language === 'en' ? "Mobile Phone Number *" : "मोबाइल फोन नंबर *"}</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9999999999"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group-modal">
                  <label>{language === 'en' ? "Approximate Annual Income ($)" : "अनुमानित वार्षिक आय ($)"}</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={applyForm.income}
                    onChange={(e) => setApplyForm({ ...applyForm, income: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', display: 'flex', justifyContent: 'center' }}>
                  {language === 'en' ? "Submit Secure Application" : "सुरक्षित आवेदन जमा करें"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. DOWNLOAD FORMS MODAL */}
      {activeModal === 'forms' && (
        <div className="modal-backdrop">
          <div className="modal-container animate-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{t.download_forms}</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </div>
            <div className="forms-list">
              <div className="form-download-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Savings Account Opening Form</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>PDF | 240 KB</div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => alert("Downloading Savings Account Opening Form...")}><Download size={14} /></button>
              </div>
              <div className="form-download-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Retail Loan Application Form</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>PDF | 580 KB</div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => alert("Downloading Retail Loan Application Form...")}><Download size={14} /></button>
              </div>
              <div className="form-download-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>KYC Updation Form</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ld-text-muted)' }}>PDF | 120 KB</div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => alert("Downloading KYC Updation Form...")}><Download size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BRANCH LOCATOR MODAL */}
      {activeModal === 'locator' && (
        <div className="modal-backdrop">
          <div className="modal-container animate-slide" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{t.branch_locator_title}</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ld-text-muted)', marginBottom: '1rem' }}>{t.branch_locator_desc}</p>
            <div className="locator-search-box">
              <input type="text" placeholder="Enter city or zip code..." style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--ld-border)', background: 'var(--ld-bg)', outline: 'none' }} />
              <button className="btn-primary" style={{ padding: '0.6rem 1.25rem' }} onClick={() => alert("Searching nearby branches...")}>{language === 'en' ? "Search" : "खोजें"}</button>
            </div>
            <div className="branches-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
              <div style={{ border: '1px solid var(--ld-border)', padding: '0.75rem', borderRadius: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Connaught Place Branch</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ld-text-muted)', marginTop: '0.25rem' }}>E-Block, Inner Circle, New Delhi, 110001</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ld-primary)', fontWeight: 600, marginTop: '0.4rem' }}>{t.branch_hours}: 10:00 AM - 4:00 PM</div>
              </div>
              <div style={{ border: '1px solid var(--ld-border)', padding: '0.75rem', borderRadius: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Mumbai Main Branch</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ld-text-muted)', marginTop: '0.25rem' }}>Heritage building, Fort, Mumbai, 400001</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ld-primary)', fontWeight: 600, marginTop: '0.4rem' }}>{t.branch_hours}: 10:00 AM - 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal mockup helper component for App phone
const SendIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default Landing;
