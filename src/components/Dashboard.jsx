import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  User, 
  Users,
  LineChart, 
  CreditCard, 
  HandCoins, 
  Wrench, 
  Lightbulb, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Send, 
  ChevronRight,
  Plus,
  TrendingUp,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Lock,
  Edit2,
  Trash2,
  Globe,
  X,
  Scan
} from 'lucide-react';
import QrScannerTab from './QrScannerTab';
import '../dashboard.css';

const quickTransferUsers = [
  {
    name: 'Livia Bator',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop'
  },
  {
    name: 'Randy Press',
    role: 'Director',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop'
  },
  {
    name: 'Worku Melese',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop'
  },
  {
    name: 'Kevin Peterson',
    role: 'Developer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 1. Get Logged-in User Session Details with legacy compatibility
  const userSession = (() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      return { 
        name: 'John Doe', 
        email: 'john.doe@gmail.com',
        role: 'Viewer',
        permissions: {
          view_dashboard: true,
          manage_tx: false,
          manage_cards: false,
          manage_loans: false,
          manage_services: false,
          manage_users: false
        }
      };
    }
    const parsed = JSON.parse(raw);
    const emailLower = (parsed.email || '').toLowerCase();
    const isAdmin = emailLower === 'admin@gmail.com';
    return {
      ...parsed,
      role: parsed.role || (isAdmin ? 'Admin' : 'Viewer'),
      permissions: parsed.permissions || {
        view_dashboard: true,
        manage_tx: isAdmin,
        manage_cards: isAdmin,
        manage_loans: isAdmin,
        manage_services: isAdmin,
        manage_users: isAdmin
      }
    };
  })();
  
  // Storage Keys scoped to the current user's email
  const CARDS_KEY = `bankdash_cards_${userSession.email.toLowerCase()}`;
  const TXS_KEY = `bankdash_txs_${userSession.email.toLowerCase()}`;
  const PROFILE_KEY = `bankdash_profile_${userSession.email.toLowerCase()}`;
  const SERVICES_KEY = `bankdash_services_${userSession.email.toLowerCase()}`;
  const LOANS_KEY = `bankdash_loans_${userSession.email.toLowerCase()}`;

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('dashboard_active_tab');
    if (saved) {
      localStorage.removeItem('dashboard_active_tab');
      return saved;
    }
    return 'Dashboard';
  });
  const [settingsSubTab, setSettingsSubTab] = useState('Edit Profile');
  
  // Search state for transactions page
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('All');

  // 3. User Management States
  const [users, setUsers] = useState([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    role: 'Viewer',
    permissions: {
      view_dashboard: true,
      manage_tx: false,
      manage_cards: false,
      manage_loans: false,
      manage_services: false,
      manage_users: false
    }
  });

  // 3b. Notifications State
  const [notifications, setNotifications] = useState(() => {
    const isAdmin = userSession.role === 'Admin';
    if (isAdmin) {
      return [
        { id: 1, text: "System Alert: 3 platform users registered database synced.", time: "Just now", type: "success", unread: true },
        { id: 2, text: "Role settings adjusted for 'Test User' (Viewer privileges).", time: "5 mins ago", type: "info", unread: true },
        { id: 3, text: "New contact query received from 'Sarah Jenkins'.", time: "1 hour ago", type: "warning", unread: true }
      ];
    } else {
      return [
        { id: 1, text: "Security Notice: Online Banking MFA is operational.", time: "2 mins ago", type: "success", unread: true },
        { id: 2, text: "Role limits configured: Account Viewer mode activated.", time: "10 mins ago", type: "info", unread: true },
        { id: 3, text: "Welcome to BankDash! Customize your profile avatar.", time: "1 day ago", type: "info", unread: false }
      ];
    }
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // 4. Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      name: userSession.name || 'John Doe',
      email: userSession.email || 'john.doe@gmail.com',
      phone: '+1 (555) 019-2834',
      dob: '1995-08-12',
      address: '88 Tech Boulevard, Silicon Valley, CA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'
    };
  });

  // Settings Forms Temp States
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // 4. Cards State
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem(CARDS_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, balance: 5756, holder: userSession.name || 'John Doe', number: '3778 **** **** 1234', expiry: '12/28', type: 'dark' },
      { id: 2, balance: 3502, holder: userSession.name || 'John Doe', number: '4532 **** **** 5678', expiry: '06/27', type: 'light' },
      { id: 3, balance: 8210, holder: userSession.name || 'John Doe', number: '5412 **** **** 9012', expiry: '10/29', type: 'purple' },
      { id: 4, balance: 1420, holder: userSession.name || 'John Doe', number: '3799 **** **** 3456', expiry: '04/26', type: 'green' }
    ];
  });

  // 5. Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(TXS_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: 'TX001', desc: 'Deposit from Card', date: '2021-01-28', type: 'income', method: 'Card', category: 'Deposit', amount: 850, status: 'Success' },
      { id: 'TX002', desc: 'Deposit Paypal', date: '2021-01-25', type: 'income', method: 'Paypal', category: 'Deposit', amount: 2500, status: 'Success' },
      { id: 'TX003', desc: 'Jemi Wilson', date: '2021-01-21', type: 'income', method: 'Wire Transfer', category: 'Transfer', amount: 5400, status: 'Success' },
      { id: 'TX004', desc: 'Spotify Premium', date: '2021-01-19', type: 'expense', method: 'Card', category: 'Entertainment', amount: 15, status: 'Success' },
      { id: 'TX005', desc: 'Netflix Subscription', date: '2021-01-15', type: 'expense', method: 'Paypal', category: 'Entertainment', amount: 20, status: 'Success' },
      { id: 'TX006', desc: 'Salary Payment', date: '2021-01-01', type: 'income', method: 'Wire Transfer', category: 'Salary', amount: 8000, status: 'Success' },
      { id: 'TX007', desc: 'Amazon Purchase', date: '2020-12-28', type: 'expense', method: 'Card', category: 'Shopping', amount: 120, status: 'Pending' },
      { id: 'TX008', desc: 'Uber Ride', date: '2020-12-25', type: 'expense', method: 'Card', category: 'Transport', amount: 35, status: 'Failed' },
      { id: 'TX009', desc: 'Google Cloud Platform', date: '2020-12-20', type: 'expense', method: 'Card', category: 'Hosting', amount: 312, status: 'Success' },
      { id: 'TX010', desc: 'Upwork Payment Received', date: '2020-12-18', type: 'income', method: 'Wire Transfer', category: 'Salary', amount: 1450, status: 'Success' },
      { id: 'TX011', desc: 'Starbucks Coffee', date: '2020-12-15', type: 'expense', method: 'Card', category: 'Food & Dining', amount: 12, status: 'Success' },
      { id: 'TX012', desc: 'Office Supplies Inc', date: '2020-12-10', type: 'expense', method: 'Card', category: 'Business', amount: 89, status: 'Success' },
      { id: 'TX013', desc: 'Airbnb Booking Refund', date: '2020-12-05', type: 'income', method: 'Paypal', category: 'Travel', amount: 450, status: 'Success' },
      { id: 'TX014', desc: 'Adobe Creative Suite', date: '2020-12-01', type: 'expense', method: 'Card', category: 'Software', amount: 55, status: 'Success' }
    ];
  });

  // 6. Services State
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem(SERVICES_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: 'srv-1', title: 'Online Banking Security', desc: 'Enable multi-factor authorization and security notifications', enabled: true, color: '#396AFF', iconName: 'ShieldCheck' },
      { id: 'srv-2', title: 'Mobile Notification Alerts', desc: 'Get SMS notifications for every debit and credit transfer', enabled: true, color: '#FFBB38', iconName: 'Smartphone' },
      { id: 'srv-3', title: 'Weekly Auto Save', desc: 'Automatically transfer 5% of weekly income into savings account', enabled: false, color: '#16DBAA', iconName: 'DollarSign' },
      { id: 'srv-4', title: 'Monthly Expense Report', desc: 'Receive interactive monthly breakdown PDF via email', enabled: false, color: '#FF4B4A', iconName: 'Briefcase' },
      { id: 'srv-5', title: 'Travel Mode Verification', desc: 'Allows global purchases without raising fraud detection triggers', enabled: false, color: '#A855F7', iconName: 'Globe' },
      { id: 'srv-6', title: 'Crypto Buy Allowances', desc: 'Grant wallet permission to directly interact with crypto gateways', enabled: false, color: '#EC4899', iconName: 'CreditCard' }
    ];
  });

  // Helper map for icons in services
  const iconMap = {
    ShieldCheck: ShieldCheck,
    Smartphone: Smartphone,
    DollarSign: DollarSign,
    Briefcase: Briefcase,
    Globe: Globe,
    CreditCard: CreditCard
  };

  // 7. Loans State
  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem(LOANS_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: 'L001', type: 'Personal Loan', amount: 20000, balance: 12500, installment: 550, duration: '36 Months' },
      { id: 'L002', type: 'Car Loan', amount: 35000, balance: 28000, installment: 720, duration: '60 Months' },
      { id: 'L003', type: 'Home Loan', amount: 250000, balance: 235000, installment: 1200, duration: '240 Months' },
      { id: 'L004', type: 'Education Loan', amount: 15000, balance: 9200, installment: 320, duration: '48 Months' },
      { id: 'L005', type: 'Business Expansion', amount: 120000, balance: 110000, installment: 2400, duration: '60 Months' },
      { id: 'L006', type: 'Medical Emergency', amount: 8000, balance: 0, installment: 400, duration: '20 Months' }
    ];
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, PROFILE_KEY]);

  useEffect(() => {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  }, [cards, CARDS_KEY]);

  useEffect(() => {
    localStorage.setItem(TXS_KEY, JSON.stringify(transactions));
  }, [transactions, TXS_KEY]);

  useEffect(() => {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  }, [services, SERVICES_KEY]);

  useEffect(() => {
    localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  }, [loans, LOANS_KEY]);

  // Sync profile details if changed elsewhere
  useEffect(() => {
    setTempProfile({ ...profile });
  }, [profile]);

  // Upgrade legacy session details in localStorage if needed
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.role || !parsed.permissions) {
        localStorage.setItem('user', JSON.stringify(userSession));
      }
    }
  }, [userSession]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'x-user-role': userSession.role
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'User Details') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdatePermissions = async (userId, updatedRole, updatedPermissions) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userSession.role
        },
        body: JSON.stringify({
          role: updatedRole,
          permissions: updatedPermissions
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Permissions updated successfully!');
        if (userId === userSession.id) {
          const updatedUser = { ...userSession, role: updatedRole, permissions: updatedPermissions };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setNotifications(prev => [
          { id: Date.now(), text: `Role & access rights updated for user ${editingUser?.name || userId}.`, time: "Just now", type: "warning", unread: true },
          ...prev
        ]);
        fetchUsers();
        setUserModalOpen(false);
      } else {
        alert(data.error || 'Failed to update permissions');
      }
    } catch (err) {
      console.error('Error updating permissions:', err);
      alert('Error updating permissions');
    }
  };

  const openUserPermissionsModal = (user) => {
    setEditingUser(user);
    setUserForm({
      role: user.role,
      permissions: { ...user.permissions }
    });
    setUserModalOpen(true);
  };

  // Card Add Form State
  const [newCardForm, setNewCardForm] = useState({ balance: '', holder: '', number: '', expiry: '', type: 'dark' });

  // Loan Calculator State
  const [loanCalc, setLoanCalc] = useState({ amount: '10000', rate: '5', term: '12', output: '856.07' });

  // Quick Transfer Widget States
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  // --------------------------------------------------------
  // CRUD MODALS STATES
  // --------------------------------------------------------
  // Transaction Modal State
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null); // null for create, object for edit
  const [txForm, setTxForm] = useState({
    desc: '',
    amount: '',
    type: 'expense',
    category: 'Deposit',
    method: 'Card',
    date: new Date().toISOString().split('T')[0],
    status: 'Success'
  });

  // Credit Card Modal State
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    balance: '',
    holder: '',
    number: '',
    expiry: '',
    type: 'dark'
  });

  const { logout: contextLogout } = useAuth();

  const handleLogout = () => {
    contextLogout();
    navigate('/login');
  };

  // Action: Quick Transfer Submission
  const handleQuickTransfer = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!transferAmount || isNaN(amt) || amt <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    if (cards.length === 0) {
      alert('You must have at least one credit card to make a transfer.');
      return;
    }

    if (cards[0].balance < amt) {
      alert(`Insufficient funds in your primary ${cards[0].type} card!`);
      return;
    }

    const recipient = quickTransferUsers[selectedUserIndex].name;
    
    // Deduct from primary card balance
    const updatedCards = [...cards];
    updatedCards[0].balance -= amt;
    setCards(updatedCards);

    // Prepend new transaction
    const newTx = {
      id: `TX${Math.floor(100 + Math.random() * 900)}`,
      desc: `Transfer to ${recipient}`,
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      method: 'Paypal',
      category: 'Transfer',
      amount: amt,
      status: 'Success'
    };
    setTransactions([newTx, ...transactions]);

    setNotifications(prev => [
      { id: Date.now(), text: `Quick Transfer of $${amt.toLocaleString()} to ${recipient} completed.`, time: "Just now", type: "success", unread: true },
      ...prev
    ]);

    setTransferSuccess(`Successfully sent $${amt.toLocaleString()} to ${recipient}!`);
    setTransferAmount('');

    setTimeout(() => {
      setTransferSuccess('');
    }, 4000);
  };

  // --------------------------------------------------------
  // TRANSACTION CRUD OPERATIONS
  // --------------------------------------------------------
  const openTxCreateModal = () => {
    setEditingTx(null);
    setTxForm({
      desc: '',
      amount: '',
      type: 'expense',
      category: 'Deposit',
      method: 'Card',
      date: new Date().toISOString().split('T')[0],
      status: 'Success'
    });
    setTxModalOpen(true);
  };

  const openTxEditModal = (tx) => {
    setEditingTx(tx);
    setTxForm({
      desc: tx.desc,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      method: tx.method,
      date: tx.date,
      status: tx.status
    });
    setTxModalOpen(true);
  };

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!txForm.desc || !txForm.amount || isNaN(parseFloat(txForm.amount))) {
      alert('Please fill out all fields with valid data.');
      return;
    }

    if (editingTx) {
      // UPDATE
      setTransactions(transactions.map(t => {
        if (t.id === editingTx.id) {
          return {
            ...t,
            desc: txForm.desc,
            amount: parseFloat(txForm.amount),
            type: txForm.type,
            category: txForm.category,
            method: txForm.method,
            date: txForm.date,
            status: txForm.status
          };
        }
        return t;
      }));
      setNotifications(prev => [
        { id: Date.now(), text: `Transaction "${txForm.desc}" updated successfully.`, time: "Just now", type: "info", unread: true },
        ...prev
      ]);
      alert('Transaction updated successfully!');
    } else {
      // CREATE
      const newTx = {
        id: `TX${Math.floor(100 + Math.random() * 900)}`,
        desc: txForm.desc,
        amount: parseFloat(txForm.amount),
        type: txForm.type,
        category: txForm.category,
        method: txForm.method,
        date: txForm.date,
        status: txForm.status
      };
      setTransactions([newTx, ...transactions]);
      setNotifications(prev => [
        { id: Date.now(), text: `New transaction "${txForm.desc}" ($${parseFloat(txForm.amount).toLocaleString()}) created.`, time: "Just now", type: "success", unread: true },
        ...prev
      ]);
      alert('Transaction created successfully!');
    }
    setTxModalOpen(false);
  };

  const handleDeleteTx = (txId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== txId));
      setNotifications(prev => [
        { id: Date.now(), text: `Transaction removed successfully.`, time: "Just now", type: "warning", unread: true },
        ...prev
      ]);
    }
  };

  // --------------------------------------------------------
  // CREDIT CARD CRUD OPERATIONS
  // --------------------------------------------------------
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardForm.balance || !newCardForm.holder || !newCardForm.number || !newCardForm.expiry) {
      alert('Please fill out all fields to add a credit card.');
      return;
    }

    const newCard = {
      id: Date.now(),
      balance: parseFloat(newCardForm.balance) || 0,
      holder: newCardForm.holder,
      number: newCardForm.number.replace(/(\d{4})/g, '$1 ').trim(),
      expiry: newCardForm.expiry,
      type: newCardForm.type
    };

    setCards([...cards, newCard]);
    setNotifications(prev => [
      { id: Date.now(), text: `New credit card created for ${newCard.holder}.`, time: "Just now", type: "success", unread: true },
      ...prev
    ]);
    setNewCardForm({ balance: '', holder: '', number: '', expiry: '', type: 'dark' });
    alert('Card successfully added!');
  };

  const openCardEditModal = (card) => {
    setEditingCard(card);
    setCardForm({
      balance: card.balance.toString(),
      holder: card.holder,
      number: card.number.replace(/\s+/g, ''),
      expiry: card.expiry,
      type: card.type
    });
    setCardModalOpen(true);
  };

  const handleCardUpdateSubmit = (e) => {
    e.preventDefault();
    if (!cardForm.holder || !cardForm.balance || !cardForm.number || !cardForm.expiry) {
      alert('Please enter valid inputs.');
      return;
    }

    setCards(cards.map(c => {
      if (c.id === editingCard.id) {
        return {
          ...c,
          holder: cardForm.holder,
          balance: parseFloat(cardForm.balance),
          number: cardForm.number.replace(/(\d{4})/g, '$1 ').trim(),
          expiry: cardForm.expiry,
          type: cardForm.type
        };
      }
      return c;
    }));
    setCardModalOpen(false);
    setNotifications(prev => [
      { id: Date.now(), text: `Credit card details for ${cardForm.holder} updated.`, time: "Just now", type: "info", unread: true },
      ...prev
    ]);
    alert('Card updated successfully!');
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      setCards(cards.filter(c => c.id !== cardId));
      setNotifications(prev => [
        { id: Date.now(), text: `Credit card removed successfully.`, time: "Just now", type: "warning", unread: true },
        ...prev
      ]);
    }
  };

  // --------------------------------------------------------
  // LOANS CALCULATOR & OTHER OPERATIONS
  // --------------------------------------------------------
  const calculateLoan = (e) => {
    e.preventDefault();
    const P = parseFloat(loanCalc.amount);
    const r = parseFloat(loanCalc.rate) / 12 / 100;
    const n = parseInt(loanCalc.term);

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r <= 0 || n <= 0) {
      alert('Please enter valid calculator inputs.');
      return;
    }

    const monthlyInstallment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setLoanCalc({ ...loanCalc, output: monthlyInstallment.toFixed(2) });
  };

  // Action: Service Status Toggle
  const toggleService = (srvId) => {
    setServices(services.map(srv => {
      if (srv.id === srvId) {
        return { ...srv, enabled: !srv.enabled };
      }
      return srv;
    }));
  };

  // Action: Profile Save Submission
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfile({ ...tempProfile });
    setNotifications(prev => [
      { id: Date.now(), text: "Profile details updated successfully.", time: "Just now", type: "success", unread: true },
      ...prev
    ]);
    setSettingsSuccess('Profile updated successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  // Action: Security Change Password Submission
  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Please fill in all password fields.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New password and confirm password do not match!');
      return;
    }
    setPasswordForm({ current: '', new: '', confirm: '' });
    setNotifications(prev => [
      { id: Date.now(), text: "Security credentials / Password changed successfully.", time: "Just now", type: "success", unread: true },
      ...prev
    ]);
    setSettingsSuccess('Password changed successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="logo-text">BankDash.</h1>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems
            .filter((item) => {
              if (item.name === 'User Details') {
                return userSession.role === 'Admin' || userSession.role === 'Editor';
              }
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              return (
                <a 
                  key={item.name} 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveTab(item.name); }}
                  className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </a>
              );
            })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <h2 className="page-title">{activeTab === 'Dashboard' ? 'Overview' : activeTab}</h2>
          
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for something" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="icon-btn" onClick={() => setActiveTab('Setting')} aria-label="Settings">
              <Settings size={20} />
            </button>
            
            <div className="icon-btn-container">
              <button 
                className={`icon-btn ${notificationsOpen ? 'active' : ''}`} 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <button className="clear-notifications-btn" onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <ul className="notification-list">
                    {notifications.length === 0 ? (
                      <li className="notification-empty">No notifications</li>
                    ) : (
                      notifications.map(n => (
                        <li 
                          key={n.id} 
                          className={`notification-item ${n.unread ? 'unread' : ''}`}
                          onClick={() => {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                          }}
                        >
                          <span className={`notification-status-dot status-dot-${n.type}`}></span>
                          <div className="notification-item-content">
                            <span className="notification-item-text">{n.text}</span>
                            <span className="notification-item-time">{n.time}</span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="user-profile" onClick={() => { setActiveTab('Setting'); setSettingsSubTab('Edit Profile'); }}>
              <img 
                src={profile.avatar} 
                alt="User Profile" 
                className="avatar-img"
              />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* ========================================================
              PAGE: DASHBOARD (OVERVIEW)
             ======================================================== */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Row 1 */}
              <div className="dashboard-section-row">
                {/* My Cards */}
                <div className="col-8">
                  <div className="section-header">
                    <h3 className="section-title">My Cards</h3>
                    <a href="#" className="see-all-link" onClick={(e) => { e.preventDefault(); setActiveTab('Credit Cards'); }}>See All</a>
                  </div>
                  <div className="cards-container">
                    {cards.map((card) => (
                      <div key={card.id} className={`credit-card ${card.type}`}>
                        {/* Hover Overlay CRUD actions */}
                        {userSession.permissions?.manage_cards && (
                          <div className="card-actions-overlay">
                            <button className="card-mini-btn" onClick={() => openCardEditModal(card)} title="Edit Card">
                              <Edit2 size={13} />
                            </button>
                            <button className="card-mini-btn" onClick={() => handleDeleteCard(card.id)} title="Delete Card">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}

                        <div className="card-header-row">
                          <div>
                            <div className="card-label">Balance</div>
                            <div className="card-balance">${card.balance.toLocaleString()}</div>
                          </div>
                          <img 
                            src={card.type === 'light' ? 'https://img.icons8.com/ios/50/343c6a/chip.png' : 'https://img.icons8.com/ios-filled/50/ffffff/chip.png'} 
                            alt="Chip" 
                            className="card-chip" 
                          />
                        </div>
                        <div className="card-middle-row">
                          <div className="card-holder-info">
                            <div className="card-label">Card Holder</div>
                            <div className="card-value">{card.holder}</div>
                          </div>
                          <div className="card-expiry-info">
                            <div className="card-label">Valid Thru</div>
                            <div className="card-value">{card.expiry}</div>
                          </div>
                        </div>
                        <div className="card-footer-row">
                          <div className="card-number">{card.number}</div>
                          <svg className="card-logo" width="44" height="30" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="15" fill={card.type === 'light' ? '#9199AF' : 'white'} fillOpacity="0.5"/>
                            <circle cx="29" cy="15" r="15" fill={card.type === 'light' ? '#9199AF' : 'white'} fillOpacity="0.5"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions List */}
                <div className="col-4">
                  <div className="section-header">
                    <h3 className="section-title">Recent Transaction</h3>
                  </div>
                  <div className="panel">
                    <div className="transactions-list">
                      {transactions.slice(0, 3).map((tx) => (
                        <div key={tx.id} className="transaction-item">
                          <div className="transaction-left">
                            <div className={`transaction-icon-wrapper ${
                              tx.category === 'Deposit' ? 'blue' : 
                              tx.category === 'Transfer' ? 'green' : 'yellow'
                            }`}>
                              {tx.category === 'Deposit' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                              ) : tx.category === 'Transfer' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect x="2" y="5" width="20" height="14" rx="2" />
                                  <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                              )}
                            </div>
                            <div className="transaction-details">
                              <h4>{tx.desc}</h4>
                              <p>{tx.date}</p>
                            </div>
                          </div>
                          <div className={`transaction-amount ${tx.type === 'expense' ? 'negative' : 'positive'}`}>
                            {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="dashboard-section-row">
                {/* Weekly Activity Chart */}
                <div className="col-8">
                  <div className="section-header">
                    <h3 className="section-title">Weekly Activity</h3>
                  </div>
                  <div className="panel" style={{ height: '320px' }}>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color withdraw"></span>
                        <span>Withdraw</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color deposit"></span>
                        <span>Deposit</span>
                      </div>
                    </div>
                    <svg className="weekly-chart-svg" viewBox="0 0 600 220">
                      <line x1="50" y1="30" x2="560" y2="30" stroke="#F3F3F5" strokeWidth="1" />
                      <line x1="50" y1="70" x2="560" y2="70" stroke="#F3F3F5" strokeWidth="1" />
                      <line x1="50" y1="110" x2="560" y2="110" stroke="#F3F3F5" strokeWidth="1" />
                      <line x1="50" y1="150" x2="560" y2="150" stroke="#F3F3F5" strokeWidth="1" />
                      <line x1="50" y1="190" x2="560" y2="190" stroke="#E6EFF5" strokeWidth="1.5" />
                      
                      <text x="35" y="34" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">500</text>
                      <text x="35" y="74" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">300</text>
                      <text x="35" y="114" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">200</text>
                      <text x="35" y="154" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">100</text>
                      <text x="35" y="194" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">0</text>

                      <g className="bar-group">
                        <rect x="85" y="62" width="14" height="128" rx="4" fill="#343C6A" />
                        <rect x="103" y="122" width="14" height="68" rx="4" fill="#396AFF" />
                        <text x="101" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Sat</text>
                      </g>
                      <g className="bar-group">
                        <rect x="155" y="94" width="14" height="96" rx="4" fill="#343C6A" />
                        <rect x="173" y="158" width="14" height="32" rx="4" fill="#396AFF" />
                        <text x="171" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Sun</text>
                      </g>
                      <g className="bar-group">
                        <rect x="225" y="102" width="14" height="88" rx="4" fill="#343C6A" />
                        <rect x="243" y="118" width="14" height="72" rx="4" fill="#396AFF" />
                        <text x="241" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Mon</text>
                      </g>
                      <g className="bar-group">
                        <rect x="295" y="62" width="14" height="128" rx="4" fill="#343C6A" />
                        <rect x="313" y="90" width="14" height="100" rx="4" fill="#396AFF" />
                        <text x="311" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Tue</text>
                      </g>
                      <g className="bar-group">
                        <rect x="365" y="146" width="14" height="44" rx="4" fill="#343C6A" />
                        <rect x="383" y="122" width="14" height="68" rx="4" fill="#396AFF" />
                        <text x="381" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Wed</text>
                      </g>
                      <g className="bar-group">
                        <rect x="435" y="86" width="14" height="104" rx="4" fill="#343C6A" />
                        <rect x="453" y="122" width="14" height="68" rx="4" fill="#396AFF" />
                        <text x="451" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Thu</text>
                      </g>
                      <g className="bar-group">
                        <rect x="505" y="82" width="14" height="108" rx="4" fill="#343C6A" />
                        <rect x="523" y="102" width="14" height="88" rx="4" fill="#396AFF" />
                        <text x="521" y="210" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Fri</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Expense Statistics */}
                <div className="col-4">
                  <div className="section-header">
                    <h3 className="section-title">Expense Statistics</h3>
                  </div>
                  <div className="panel" style={{ height: '320px' }}>
                    <div className="expense-donut-container">
                      <svg className="donut-chart-svg" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#F5F7FA" strokeWidth="16" />
                        <circle className="donut-segment" cx="100" cy="100" r="70" fill="none" stroke="#396AFF" strokeWidth="20" strokeDasharray="153.9 440" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                        <circle className="donut-segment" cx="100" cy="100" r="70" fill="none" stroke="#343C6A" strokeWidth="20" strokeDasharray="132 440" strokeDashoffset="-153.9" transform="rotate(-90 100 100)" />
                        <circle className="donut-segment" cx="100" cy="100" r="70" fill="none" stroke="#FC7900" strokeWidth="20" strokeDasharray="88 440" strokeDashoffset="-285.9" transform="rotate(-90 100 100)" />
                        <circle className="donut-segment" cx="100" cy="100" r="70" fill="none" stroke="#16DBAA" strokeWidth="20" strokeDasharray="66 440" strokeDashoffset="-373.9" transform="rotate(-90 100 100)" />
                        
                        <text x="100" y="95" className="chart-center-text" fill="#343C6A" fontSize="18" fontWeight="700">30%</text>
                        <text x="100" y="115" className="chart-center-text" fill="#718EBF" fontSize="11" fontWeight="600" letterSpacing="0.5">Entertainment</text>
                      </svg>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', marginTop: '0.5rem', padding: '0 0.5rem' }}>
                      <div className="legend-item"><span className="legend-color" style={{ background: '#343C6A' }}></span><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>30% Ent.</span></div>
                      <div className="legend-item"><span className="legend-color" style={{ background: '#396AFF' }}></span><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>35% Others</span></div>
                      <div className="legend-item"><span className="legend-color" style={{ background: '#FC7900' }}></span><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>20% Inv.</span></div>
                      <div className="legend-item"><span className="legend-color" style={{ background: '#16DBAA' }}></span><span style={{ fontSize: '0.8rem', fontWeight: 600 }}>15% Bills</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="dashboard-section-row">
                {/* Quick Transfer Widget */}
                <div className="col-5">
                  <div className="section-header">
                    <h3 className="section-title">Quick Transfer</h3>
                  </div>
                  <div className="panel" style={{ height: '280px' }}>
                    <div className="quick-transfer-container">
                      <div className="users-slider-row">
                        <div className="users-slider">
                          {quickTransferUsers.map((user, idx) => (
                            <div 
                              key={user.name} 
                              className={`slider-user ${selectedUserIndex === idx ? 'selected' : ''}`}
                              onClick={() => setSelectedUserIndex(idx)}
                            >
                              <img src={user.avatar} alt={user.name} className="user-avatar" />
                              <span className="user-name">{user.name.split(' ')[0]}</span>
                              <span className="user-role">{user.role}</span>
                            </div>
                          ))}
                        </div>
                        <button className="slider-arrow-btn" aria-label="Next User">
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleQuickTransfer} className="transfer-action-row">
                        <span className="transfer-label">Write Amount</span>
                        <div className="amount-input-wrapper" style={!userSession.permissions?.manage_tx ? { opacity: 0.7 } : {}}>
                          <input 
                            type="text" 
                            placeholder={userSession.permissions?.manage_tx ? "525.50" : "Disabled (Read-Only)"} 
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            disabled={!userSession.permissions?.manage_tx}
                          />
                          <button type="submit" className="send-btn" disabled={!userSession.permissions?.manage_tx} style={!userSession.permissions?.manage_tx ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}}>
                            <span>Send</span>
                            <Send size={15} />
                          </button>
                        </div>
                      </form>
                      {transferSuccess && (
                        <div style={{ 
                          marginTop: '0.75rem', 
                          padding: '0.5rem 1rem', 
                          background: 'rgba(22, 219, 170, 0.12)', 
                          color: '#0e906f', 
                          borderRadius: '12px', 
                          fontSize: '0.85rem', 
                          fontWeight: 600,
                          textAlign: 'center',
                          border: '1px solid rgba(22, 219, 170, 0.25)',
                          animation: 'slideUp 0.3s ease-out'
                        }}>
                          {transferSuccess}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Balance History */}
                <div className="col-7">
                  <div className="section-header">
                    <h3 className="section-title">Balance History</h3>
                  </div>
                  <div className="panel" style={{ height: '280px' }}>
                    <div className="balance-chart-container">
                      <svg className="balance-chart-svg" viewBox="0 0 600 200">
                        <defs>
                          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1814F3" stopOpacity="0.22"/>
                            <stop offset="100%" stopColor="#1814F3" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>

                        <line className="balance-grid-line" x1="40" y1="30" x2="570" y2="30" stroke="#F3F3F5" strokeWidth="1" />
                        <line className="balance-grid-line" x1="40" y1="75" x2="570" y2="75" stroke="#F3F3F5" strokeWidth="1" />
                        <line className="balance-grid-line" x1="40" y1="120" x2="570" y2="120" stroke="#F3F3F5" strokeWidth="1" />
                        <line className="balance-grid-line" x1="40" y1="165" x2="570" y2="165" stroke="#E6EFF5" strokeWidth="1.5" />

                        <text x="30" y="34" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">800</text>
                        <text x="30" y="79" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">400</text>
                        <text x="30" y="124" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">200</text>
                        <text x="30" y="169" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="end">0</text>

                        <text x="60" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Jul</text>
                        <text x="145" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Aug</text>
                        <text x="230" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Sep</text>
                        <text x="315" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Oct</text>
                        <text x="400" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Nov</text>
                        <text x="485" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Dec</text>
                        <text x="560" y="190" fill="#718EBF" fontSize="12" fontWeight="500" textAnchor="middle">Jan</text>

                        <path 
                          d="M 60 165 C 102.5 150, 102.5 110, 145 110 C 187.5 110, 187.5 130, 230 130 C 272.5 130, 272.5 60, 315 60 C 357.5 60, 357.5 120, 400 120 C 442.5 120, 442.5 80, 485 80 C 527.5 80, 527.5 50, 560 50 L 560 165 Z" 
                          fill="url(#balanceGradient)" 
                        />

                        <path 
                          d="M 60 165 C 102.5 150, 102.5 110, 145 110 C 187.5 110, 187.5 130, 230 130 C 272.5 130, 272.5 60, 315 60 C 357.5 60, 357.5 120, 400 120 C 442.5 120, 442.5 80, 485 80 C 527.5 80, 527.5 50, 560 50" 
                          fill="none" 
                          stroke="#1814F3" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                        />

                        <circle cx="315" cy="60" r="5" fill="#1814F3" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="560" cy="50" r="5" fill="#1814F3" stroke="#FFFFFF" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================
              PAGE: TRANSACTIONS
             ======================================================== */}
          {activeTab === 'Transactions' && (
            <div className="col-12">
              <div className="section-header">
                <div className="filter-tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
                  <div 
                    className={`filter-tab ${transactionTypeFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setTransactionTypeFilter('All')}
                  >
                    All Transactions
                  </div>
                  <div 
                    className={`filter-tab ${transactionTypeFilter === 'income' ? 'active' : ''}`}
                    onClick={() => setTransactionTypeFilter('income')}
                  >
                    Income
                  </div>
                  <div 
                    className={`filter-tab ${transactionTypeFilter === 'expense' ? 'active' : ''}`}
                    onClick={() => setTransactionTypeFilter('expense')}
                  >
                    Expense
                  </div>
                </div>
                {/* CREATE action trigger */}
                {userSession.permissions?.manage_tx && (
                  <button className="settings-save-btn" style={{ margin: 0, padding: '0.6rem 1.5rem', borderRadius: '40px' }} onClick={openTxCreateModal}>
                    <Plus size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    Add Transaction
                  </button>
                )}
              </div>

              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Transaction ID</th>
                      <th>Category</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(tx => transactionTypeFilter === 'All' || tx.type === transactionTypeFilter)
                      .filter(tx => 
                        tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((tx) => (
                        <tr key={tx.id}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={`transaction-icon-wrapper ${
                              tx.type === 'income' ? 'green' : 'red'
                            }`} style={{ width: '36px', height: '36px' }}>
                              {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                            </div>
                            <span>{tx.desc}</span>
                          </td>
                          <td style={{ color: '#718EBF' }}>{tx.id}</td>
                          <td>{tx.category}</td>
                          <td>{tx.method}</td>
                          <td style={{ color: '#718EBF' }}>{tx.date}</td>
                          <td style={{ 
                            fontWeight: '700', 
                            color: tx.type === 'expense' ? 'var(--error)' : 'var(--success)'
                          }}>
                            {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                          </td>
                          <td>
                            <span className={`status-badge ${
                              tx.status === 'Success' ? 'success' : 
                              tx.status === 'Pending' ? 'pending' : 'failed'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td>
                            {/* UPDATE & DELETE Actions */}
                            {userSession.permissions?.manage_tx ? (
                              <div className="action-btn-group">
                                <button className="table-action-btn edit" onClick={() => openTxEditModal(tx)} title="Edit">
                                  <Edit2 size={15} />
                                </button>
                                <button className="table-action-btn delete" onClick={() => handleDeleteTx(tx.id)} title="Delete">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>Read-Only</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE: ACCOUNTS
             ======================================================== */}
          {activeTab === 'Accounts' && (
            <>
              {/* Account summary cards */}
              <div className="summary-cards-grid">
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#FFF5E9', color: '#FFBB38' }}>
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="summary-label">My Balance</div>
                    <div className="summary-val">${(cards.reduce((acc, c) => acc + c.balance, 0)).toLocaleString()}</div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#E7F3FF', color: '#396AFF' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Income Growth</div>
                    <div className="summary-val">+15.8%</div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#DCFCE7', color: '#10B981' }}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Total Accounts</div>
                    <div className="summary-val">{cards.length} Active</div>
                  </div>
                </div>
              </div>

              {/* Accounts Content layout */}
              <div className="dashboard-section-row">
                <div className="col-8">
                  <div className="section-header">
                    <h3 className="section-title">Recent Deposits</h3>
                  </div>
                  <div className="table-wrapper">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Method</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions
                          .filter(tx => tx.type === 'income')
                          .slice(0, 4)
                          .map((tx) => (
                            <tr key={tx.id}>
                              <td>{tx.desc}</td>
                              <td style={{ color: '#718EBF' }}>{tx.date}</td>
                              <td>{tx.method}</td>
                              <td style={{ color: 'var(--success)', fontWeight: '700' }}>
                                +${tx.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cash Flow summary block */}
                <div className="col-4">
                  <div className="section-header">
                    <h3 className="section-title">Weekly Cash Flow</h3>
                  </div>
                  <div className="panel" style={{ padding: '2rem', justifyContent: 'space-around' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#718EBF' }}>Average Deposit</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem' }}>+$3,450</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#718EBF' }}>Average Withdrawal</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--error)', marginTop: '0.25rem' }}>-$412</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================
              PAGE: INVESTMENTS
             ======================================================== */}
          {activeTab === 'Investments' && (
            <>
              <div className="summary-cards-grid">
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#E7F3FF', color: '#396AFF' }}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Total Value</div>
                    <div className="summary-val">$65,240</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#DCFCE7', color: '#10B981' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Net Growth</div>
                    <div className="summary-val">+$8,241 (12.4%)</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#FFF5E9', color: '#FFBB38' }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Assets Count</div>
                    <div className="summary-val">4 Active</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section-row">
                <div className="col-7">
                  <div className="section-header">
                    <h3 className="section-title">My Portfolio</h3>
                  </div>
                  <div className="panel" style={{ height: '300px' }}>
                    <div className="stocks-list">
                      <div className="stock-row-item">
                        <div className="stock-name-col">
                          <div className="stock-icon-wrapper" style={{ background: '#000000' }}>A</div>
                          <div>
                            <div className="stock-title">Apple Inc.</div>
                            <div className="stock-desc">AAPL (Nasdaq)</div>
                          </div>
                        </div>
                        <div className="stock-val-box">
                          <div className="stock-price">$174.12</div>
                          <div className="stock-change-percent positive">+1.85%</div>
                        </div>
                      </div>
                      <div className="stock-row-item">
                        <div className="stock-name-col">
                          <div className="stock-icon-wrapper" style={{ background: '#E82127' }}>T</div>
                          <div>
                            <div className="stock-title">Tesla Inc.</div>
                            <div className="stock-desc">TSLA (Nasdaq)</div>
                          </div>
                        </div>
                        <div className="stock-val-box">
                          <div className="stock-price">$185.00</div>
                          <div className="stock-change-percent negative">-2.40%</div>
                        </div>
                      </div>
                      <div className="stock-row-item">
                        <div className="stock-name-col">
                          <div className="stock-icon-wrapper" style={{ background: '#4285F4' }}>G</div>
                          <div>
                            <div className="stock-title">Alphabet Inc.</div>
                            <div className="stock-desc">GOOGL (Nasdaq)</div>
                          </div>
                        </div>
                        <div className="stock-val-box">
                          <div className="stock-price">$154.20</div>
                          <div className="stock-change-percent positive">+0.95%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="section-header">
                    <h3 className="section-title">Investment Growth Chart</h3>
                  </div>
                  <div className="panel" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="220" height="150" viewBox="0 0 220 150">
                      <path d="M 10 130 C 50 110, 80 40, 120 70 C 160 100, 180 20, 210 10" fill="none" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="210" cy="10" r="6" fill="var(--accent-primary)" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="10" y="145" fill="#718EBF" fontSize="10">2021</text>
                      <text x="210" y="145" fill="#718EBF" fontSize="10" textAnchor="end">2026</text>
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================
              PAGE: CREDIT CARDS
             ======================================================== */}
          {activeTab === 'Credit Cards' && (
            <div className="dashboard-section-row">
              {/* Card List in a grid */}
              <div className="col-7">
                <div className="section-header">
                  <h3 className="section-title">My Cards</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                  {cards.map((card) => (
                    <div key={card.id} className={`credit-card ${card.type}`} style={{ width: '100%' }}>
                      {/* Hover Overlay CRUD actions */}
                      {userSession.permissions?.manage_cards && (
                        <div className="card-actions-overlay">
                          <button className="card-mini-btn" onClick={() => openCardEditModal(card)} title="Edit Card">
                            <Edit2 size={13} />
                          </button>
                          <button className="card-mini-btn" onClick={() => handleDeleteCard(card.id)} title="Delete Card">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}

                      <div className="card-header-row">
                        <div>
                          <div className="card-label">Balance</div>
                          <div className="card-balance">${card.balance.toLocaleString()}</div>
                        </div>
                        <img 
                          src={card.type === 'light' ? 'https://img.icons8.com/ios/50/343c6a/chip.png' : 'https://img.icons8.com/ios-filled/50/ffffff/chip.png'} 
                          alt="Chip" 
                          className="card-chip" 
                        />
                      </div>
                      <div className="card-middle-row">
                        <div className="card-holder-info">
                          <div className="card-label">Card Holder</div>
                          <div className="card-value">{card.holder}</div>
                        </div>
                        <div className="card-expiry-info">
                          <div className="card-label">Valid Thru</div>
                          <div className="card-value">{card.expiry}</div>
                        </div>
                      </div>
                      <div className="card-footer-row">
                        <div className="card-number">{card.number}</div>
                        <svg className="card-logo" width="44" height="30" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="15" cy="15" r="15" fill={card.type === 'light' ? '#9199AF' : 'white'} fillOpacity="0.5"/>
                          <circle cx="29" cy="15" r="15" fill={card.type === 'light' ? '#9199AF' : 'white'} fillOpacity="0.5"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to Add New Card */}
              <div className="col-5">
                <div className="section-header">
                  <h3 className="section-title">Add New Card</h3>
                </div>
                <div className="panel" style={{ minHeight: '340px' }}>
                  {!userSession.permissions?.manage_cards && (
                    <div style={{ color: 'var(--error)', background: 'rgba(255, 75, 74, 0.08)', border: '1px solid rgba(255, 75, 74, 0.2)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
                      Read-Only: Card creation is disabled.
                    </div>
                  )}
                  <form onSubmit={handleAddCard} className="add-card-form" style={!userSession.permissions?.manage_cards ? { opacity: 0.6 } : {}}>
                    <div className="settings-input-group" style={{ gridColumn: 'span 2' }}>
                      <label>Card Holder Name</label>
                      <input 
                        type="text" 
                        className="settings-form-input"
                        placeholder="John Doe"
                        value={newCardForm.holder}
                        onChange={(e) => setNewCardForm({ ...newCardForm, holder: e.target.value })}
                        disabled={!userSession.permissions?.manage_cards}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Starting Balance ($)</label>
                      <input 
                        type="number" 
                        className="settings-form-input"
                        placeholder="2500"
                        value={newCardForm.balance}
                        onChange={(e) => setNewCardForm({ ...newCardForm, balance: e.target.value })}
                        disabled={!userSession.permissions?.manage_cards}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        className="settings-form-input"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={newCardForm.expiry}
                        onChange={(e) => setNewCardForm({ ...newCardForm, expiry: e.target.value })}
                        disabled={!userSession.permissions?.manage_cards}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Card Number (16 Digits)</label>
                      <input 
                        type="text" 
                        className="settings-form-input"
                        placeholder="4812384910293847"
                        maxLength="16"
                        value={newCardForm.number}
                        onChange={(e) => setNewCardForm({ ...newCardForm, number: e.target.value })}
                        disabled={!userSession.permissions?.manage_cards}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Card Color theme</label>
                      <select 
                        className="settings-form-input"
                        value={newCardForm.type}
                        onChange={(e) => setNewCardForm({ ...newCardForm, type: e.target.value })}
                        disabled={!userSession.permissions?.manage_cards}
                      >
                        <option value="dark">Dark Gradient</option>
                        <option value="light">Light Border</option>
                        <option value="green">Emerald Green</option>
                        <option value="purple">Royal Purple</option>
                      </select>
                    </div>
                    <button type="submit" className="add-card-btn" disabled={!userSession.permissions?.manage_cards} style={!userSession.permissions?.manage_cards ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}}>
                      Create Credit Card
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE: LOANS
             ======================================================== */}
          {activeTab === 'Loans' && (
            <div className="dashboard-section-row">
              {/* Active Loans Table */}
              <div className="col-8">
                <div className="section-header">
                  <h3 className="section-title">Active Loans</h3>
                </div>
                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Loan ID</th>
                        <th>Loan Type</th>
                        <th>Principal Amount</th>
                        <th>Outstanding Balance</th>
                        <th>Installment</th>
                        <th>Term Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan.id}>
                          <td style={{ color: '#718EBF' }}>{loan.id}</td>
                          <td style={{ fontWeight: '600' }}>{loan.type}</td>
                          <td>${loan.amount.toLocaleString()}</td>
                          <td>${loan.balance.toLocaleString()}</td>
                          <td style={{ color: 'var(--error)' }}>${loan.installment}/mo</td>
                          <td>{loan.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simple Loan Calculator */}
              <div className="col-4">
                <div className="section-header">
                  <h3 className="section-title">Loan Calculator</h3>
                </div>
                <div className="panel" style={{ minHeight: '340px' }}>
                  <form onSubmit={calculateLoan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: !userSession.permissions?.manage_loans ? 0.8 : 1 }}>
                    {!userSession.permissions?.manage_loans && (
                      <div style={{ color: 'var(--error)', background: 'rgba(255, 75, 74, 0.08)', border: '1px solid rgba(255, 75, 74, 0.2)', padding: '0.6rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                        Read-Only: Calculator disabled.
                      </div>
                    )}
                    <div className="settings-input-group">
                      <label>Principal Amount ($)</label>
                      <input 
                        type="number" 
                        className="settings-form-input" 
                        value={loanCalc.amount}
                        onChange={(e) => setLoanCalc({ ...loanCalc, amount: e.target.value })}
                        disabled={!userSession.permissions?.manage_loans}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Interest Rate (% Annual)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        className="settings-form-input" 
                        value={loanCalc.rate}
                        onChange={(e) => setLoanCalc({ ...loanCalc, rate: e.target.value })}
                        disabled={!userSession.permissions?.manage_loans}
                      />
                    </div>
                    <div className="settings-input-group">
                      <label>Duration (Months)</label>
                      <input 
                        type="number" 
                        className="settings-form-input" 
                        value={loanCalc.term}
                        onChange={(e) => setLoanCalc({ ...loanCalc, term: e.target.value })}
                        disabled={!userSession.permissions?.manage_loans}
                      />
                    </div>
                    <button type="submit" className="add-card-btn" disabled={!userSession.permissions?.manage_loans} style={!userSession.permissions?.manage_loans ? { gridColumn: 'span 1', opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : { gridColumn: 'span 1' }}>
                      Calculate Installment
                    </button>
                    {loanCalc.output && (
                      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#718EBF' }}>Estimated Installment</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                          ${loanCalc.output} / mo
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE: SERVICES
             ======================================================== */}
          {activeTab === 'Services' && (
            <div className="col-12">
              <div className="section-header">
                <h3 className="section-title">Manage Services</h3>
              </div>
              <div className="services-list">
                {services.map((srv) => {
                  const SrvIcon = iconMap[srv.iconName] || ShieldCheck;
                  return (
                    <div key={srv.id} className="service-item-box">
                      <div className="service-icon-box" style={{ background: `${srv.color}15`, color: srv.color }}>
                        <SrvIcon size={24} />
                      </div>
                      <div className="service-text">
                        <h4>{srv.title}</h4>
                        <p>{srv.desc}</p>
                      </div>
                      <div>
                        <label className="switch-label" style={{ pointerEvents: userSession.permissions?.manage_services ? 'auto' : 'none', opacity: userSession.permissions?.manage_services ? 1 : 0.6 }}>
                          <input 
                            type="checkbox" 
                            checked={srv.enabled} 
                            onChange={() => toggleService(srv.id)} 
                            disabled={!userSession.permissions?.manage_services}
                          />
                          <span className="switch-slider"></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE: MY PRIVILEGES
             ======================================================== */}
          {activeTab === 'My Privileges' && (
            <>
              <div className="summary-cards-grid">
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#E7F3FF', color: '#396AFF' }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Loyalty Tier</div>
                    <div className="summary-val">Gold Member</div>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon-box" style={{ background: '#FFF5E9', color: '#FFBB38' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="summary-label">Reward Points Balance</div>
                    <div className="summary-val">12,450 pts</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section-row">
                <div className="col-12">
                  <div className="section-header">
                    <h3 className="section-title">Tier Benefits & Privileges</h3>
                  </div>
                  <div className="panel" style={{ height: 'auto', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <div style={{ background: 'rgba(24, 20, 243, 0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '700' }}>1</div>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>0% Transaction Fees</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Enjoy free wire transfers and credit card payments to all international banks.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <div style={{ background: 'rgba(24, 20, 243, 0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '700' }}>2</div>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Priority Support</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>24/7 dedicated support desk with chat responses in under 1 minute.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ background: 'rgba(24, 20, 243, 0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '700' }}>3</div>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Airport Lounge Access</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Complimentary global access to premium airport lounges with your primary dark card.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================
              PAGE: SETTING
             ======================================================== */}
          {activeTab === 'Setting' && (
            <div className="col-12">
              <div className="settings-panel">
                <div className="settings-tabs">
                  <div 
                    className={`settings-tab ${settingsSubTab === 'Edit Profile' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('Edit Profile')}
                  >
                    Edit Profile
                  </div>
                  <div 
                    className={`settings-tab ${settingsSubTab === 'Preference' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('Preference')}
                  >
                    Preferences
                  </div>
                  <div 
                    className={`settings-tab ${settingsSubTab === 'Security' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('Security')}
                  >
                    Security
                  </div>
                </div>

                {/* Sub Tab: Edit Profile */}
                {settingsSubTab === 'Edit Profile' && (
                  <div className="settings-content-wrapper">
                    {/* Avatar picker section */}
                    <div className="profile-avatar-section">
                      <div className="avatar-edit-wrapper" onClick={() => {
                        const newAvatar = prompt("Enter a URL for your profile image:", tempProfile.avatar);
                        if (newAvatar) setTempProfile({ ...tempProfile, avatar: newAvatar });
                      }}>
                        <img 
                          src={tempProfile.avatar} 
                          alt="Edit Avatar" 
                          className="avatar-edit-img"
                        />
                        <div className="avatar-edit-badge">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', fontWeight: 600 }}>Click to Change Photo</span>
                    </div>

                    {/* Profile Fields Form */}
                    <form onSubmit={handleProfileSave} className="settings-form">
                      <div className="settings-input-group">
                        <label>Your Name</label>
                        <input 
                          type="text" 
                          className="settings-form-input" 
                          value={tempProfile.name}
                          onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          className="settings-form-input" 
                          value={tempProfile.email}
                          onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group">
                        <label>Phone Number</label>
                        <input 
                          type="text" 
                          className="settings-form-input" 
                          value={tempProfile.phone}
                          onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group">
                        <label>Date of Birth</label>
                        <input 
                          type="date" 
                          className="settings-form-input" 
                          value={tempProfile.dob}
                          onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Address</label>
                        <input 
                          type="text" 
                          className="settings-form-input" 
                          value={tempProfile.address}
                          onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="settings-save-btn">
                        Save Profile Details
                      </button>
                    </form>
                  </div>
                )}

                {/* Sub Tab: Preferences */}
                {settingsSubTab === 'Preference' && (
                  <div className="settings-content-wrapper">
                    <form onSubmit={(e) => { e.preventDefault(); setSettingsSuccess('Preferences saved!'); setTimeout(() => setSettingsSuccess(''), 3000); }} className="settings-form">
                      <div className="settings-input-group">
                        <label>Default Currency</label>
                        <select className="settings-form-input">
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                        </select>
                      </div>
                      <div className="settings-input-group">
                        <label>Default Time Zone</label>
                        <select className="settings-form-input">
                          <option value="EST">GMT-5 (EST) - Eastern Time</option>
                          <option value="GMT">GMT+0 (GMT) - London Time</option>
                          <option value="IST">GMT+5:30 (IST) - India Time</option>
                        </select>
                      </div>
                      <div className="settings-input-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Notification Preferences</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" defaultChecked />
                            <span>I want to receive weekly email statement summaries.</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="checkbox" defaultChecked />
                            <span>Notify me about login actions from unrecognized devices.</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="settings-save-btn">
                        Save Preferences
                      </button>
                    </form>
                  </div>
                )}

                {/* Sub Tab: Security */}
                {settingsSubTab === 'Security' && (
                  <div className="settings-content-wrapper">
                    <form onSubmit={handleSecuritySave} className="settings-form full-width">
                      <div className="settings-input-group">
                        <label>Current Password</label>
                        <input 
                          type="password" 
                          className="settings-form-input" 
                          placeholder="••••••••"
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group">
                        <label>New Password</label>
                        <input 
                          type="password" 
                          className="settings-form-input" 
                          placeholder="••••••••"
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        />
                      </div>
                      <div className="settings-input-group">
                        <label>Confirm New Password</label>
                        <input 
                          type="password" 
                          className="settings-form-input" 
                          placeholder="••••••••"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="settings-save-btn" style={{ gridColumn: 'span 1' }}>
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {/* Global Success Indicator */}
                {settingsSuccess && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '0.8rem 1.5rem', 
                    background: 'rgba(22, 219, 170, 0.12)', 
                    color: '#0e906f', 
                    borderRadius: '12px', 
                    fontSize: '0.95rem', 
                    fontWeight: 600,
                    textAlign: 'center',
                    border: '1px solid rgba(22, 219, 170, 0.25)',
                    animation: 'slideUp 0.3s ease-out'
                  }}>
                    {settingsSuccess}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              PAGE: USER DETAILS
             ======================================================== */}
          {activeTab === 'User Details' && (
            <div className="col-12" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div className="section-header">
                <h3 className="section-title">User Roles & Access Rights</h3>
                {userSession.role === 'Admin' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, padding: '0.4rem 1rem', background: 'rgba(24, 20, 243, 0.05)', borderRadius: '20px' }}>
                    Administrator Mode (Write Access)
                  </span>
                )}
                {userSession.role === 'Editor' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, padding: '0.4rem 1rem', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '20px' }}>
                    Editor Mode (Read Only)
                  </span>
                )}
              </div>

              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>User Info</th>
                      <th>Email Address</th>
                      <th>System Role</th>
                      <th>Access Rights Summary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user => 
                        !searchQuery ||
                        (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (user.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (user.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1814F3 100%)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {user.id}</div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${
                            user.role === 'Admin' ? 'failed' : 
                            user.role === 'Editor' ? 'pending' : 'success'
                          }`} style={{
                            background: user.role === 'Admin' ? 'rgba(139, 92, 246, 0.12)' : user.role === 'Editor' ? 'rgba(57, 106, 255, 0.12)' : 'rgba(107, 114, 128, 0.12)',
                            color: user.role === 'Admin' ? '#8B5CF6' : user.role === 'Editor' ? '#396AFF' : '#6B7280',
                            padding: '0.35rem 0.85rem'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.entries(user.permissions || {}).map(([key, val]) => (
                              <span 
                                key={key} 
                                style={{ 
                                  fontSize: '0.75rem', 
                                  padding: '0.15rem 0.5rem', 
                                  borderRadius: '6px', 
                                  background: val ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                  color: val ? '#10B981' : '#EF4444',
                                  border: `1px solid ${val ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontWeight: 600
                                }}
                              >
                                <span style={{ 
                                  width: '5px', 
                                  height: '5px', 
                                  borderRadius: '50%', 
                                  background: val ? '#10B981' : '#EF4444' 
                                }}></span>
                                {key.replace('manage_', '').replace('view_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          {userSession.role === 'Admin' ? (
                            <button 
                              className="table-action-btn edit" 
                              onClick={() => openUserPermissionsModal(user)}
                              title="Manage Permissions"
                              style={{ background: 'rgba(24, 20, 243, 0.08)', color: 'var(--accent-primary)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Settings size={16} />
                            </button>
                          ) : (
                            <button 
                              className="table-action-btn edit" 
                              onClick={() => openUserPermissionsModal(user)}
                              title="View Permissions"
                              style={{ background: 'rgba(107, 114, 128, 0.08)', color: '#6B7280', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Search size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Scan & Pay' && (
            <QrScannerTab 
              userSession={userSession}
              cards={cards}
              onAddTransaction={(newTx) => setTransactions(prev => [newTx, ...prev])}
              onUpdateCardBalance={(cardId, newBalance) => {
                setCards(prev => prev.map(c => c.id === cardId ? { ...c, balance: newBalance } : c));
              }}
              onAddNotification={(newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
              }}
            />
          )}
        </div>
      </main>

      {/* ========================================================
          TRANSACTION CRUD MODAL WINDOW
         ======================================================== */}
      {txModalOpen && (
        <div className="modal-backdrop" onClick={() => setTxModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTx ? 'Edit Transaction' : 'Create Transaction'}</h3>
              <button className="modal-close-btn" onClick={() => setTxModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleTxSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="settings-input-group">
                <label>Description</label>
                <input 
                  type="text" 
                  className="settings-form-input" 
                  placeholder="e.g. Spotify Premium"
                  value={txForm.desc}
                  onChange={(e) => setTxForm({ ...txForm, desc: e.target.value })}
                  required
                />
              </div>
              <div className="settings-input-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="settings-form-input" 
                  placeholder="e.g. 15.00"
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="settings-input-group">
                  <label>Type</label>
                  <select 
                    className="settings-form-input"
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
                <div className="settings-input-group">
                  <label>Status</label>
                  <select 
                    className="settings-form-input"
                    value={txForm.status}
                    onChange={(e) => setTxForm({ ...txForm, status: e.target.value })}
                  >
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="settings-input-group">
                  <label>Category</label>
                  <select 
                    className="settings-form-input"
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                  >
                    <option value="Deposit">Deposit</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Salary">Salary</option>
                    <option value="Transport">Transport</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="settings-input-group">
                  <label>Method</label>
                  <select 
                    className="settings-form-input"
                    value={txForm.method}
                    onChange={(e) => setTxForm({ ...txForm, method: e.target.value })}
                  >
                    <option value="Card">Card</option>
                    <option value="Paypal">Paypal</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                  </select>
                </div>
              </div>
              <div className="settings-input-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="settings-form-input" 
                  value={txForm.date}
                  onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setTxModalOpen(false)}>Cancel</button>
                <button type="submit" className="add-card-btn" style={{ margin: 0, padding: '0.75rem 2rem' }}>
                  {editingTx ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          CREDIT CARD CRUD MODAL WINDOW
         ======================================================== */}
      {cardModalOpen && (
        <div className="modal-backdrop" onClick={() => setCardModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Credit Card</h3>
              <button className="modal-close-btn" onClick={() => setCardModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCardUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="settings-input-group">
                <label>Card Holder Name</label>
                <input 
                  type="text" 
                  className="settings-form-input" 
                  placeholder="e.g. John Doe"
                  value={cardForm.holder}
                  onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })}
                  required
                />
              </div>
              <div className="settings-input-group">
                <label>Balance ($)</label>
                <input 
                  type="number" 
                  className="settings-form-input" 
                  placeholder="e.g. 5000"
                  value={cardForm.balance}
                  onChange={(e) => setCardForm({ ...cardForm, balance: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="settings-input-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    className="settings-form-input" 
                    placeholder="MM/YY"
                    maxLength="5"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    required
                  />
                </div>
                <div className="settings-input-group">
                  <label>Card Style</label>
                  <select 
                    className="settings-form-input"
                    value={cardForm.type}
                    onChange={(e) => setCardForm({ ...cardForm, type: e.target.value })}
                  >
                    <option value="dark">Dark Gradient</option>
                    <option value="light">Light Border</option>
                    <option value="green">Emerald Green</option>
                    <option value="purple">Royal Purple</option>
                  </select>
                </div>
              </div>
              <div className="settings-input-group">
                <label>Card Number (16 Digits)</label>
                <input 
                  type="text" 
                  className="settings-form-input" 
                  placeholder="4812384910293847"
                  maxLength="16"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setCardModalOpen(false)}>Cancel</button>
                <button type="submit" className="add-card-btn" style={{ margin: 0, padding: '0.75rem 2rem' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================
          USER PERMISSIONS MODAL WINDOW
         ======================================================== */}
      {userModalOpen && editingUser && (
        <div className="modal-backdrop" onClick={() => setUserModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>{userSession.role === 'Admin' ? 'Manage Access Rights' : 'View Access Rights'}</h3>
              <button className="modal-close-btn" onClick={() => setUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{editingUser.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{editingUser.email}</div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (userSession.role !== 'Admin') {
                setUserModalOpen(false);
                return;
              }
              handleUpdatePermissions(editingUser.id, userForm.role, userForm.permissions);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="settings-input-group">
                <label style={{ fontWeight: 600 }}>System Role</label>
                <select 
                  className="settings-form-input"
                  value={userForm.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    let newPermissions = { ...userForm.permissions };
                    if (newRole === 'Admin') {
                      newPermissions = {
                        view_dashboard: true,
                        manage_tx: true,
                        manage_cards: true,
                        manage_loans: true,
                        manage_services: true,
                        manage_users: true
                      };
                    } else if (newRole === 'Viewer') {
                      newPermissions = {
                        view_dashboard: true,
                        manage_tx: false,
                        manage_cards: false,
                        manage_loans: false,
                        manage_services: false,
                        manage_users: false
                      };
                    } else if (newRole === 'Editor') {
                      newPermissions = {
                        view_dashboard: true,
                        manage_tx: true,
                        manage_cards: true,
                        manage_loans: true,
                        manage_services: true,
                        manage_users: false
                      };
                    }
                    setUserForm({ role: newRole, permissions: newPermissions });
                  }}
                  disabled={userSession.role !== 'Admin'}
                >
                  <option value="Admin">Admin (Full Write Access)</option>
                  <option value="Editor">Editor (Read/Write except Users)</option>
                  <option value="Viewer">Viewer (Read-Only Access)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Individual Feature Access Rights</label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                  
                  {/* Permission: View Dashboard */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Dashboard Overview</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow viewing standard dashboard metrics and charts.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.view_dashboard} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, view_dashboard: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission: Manage Transactions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Transactions Management</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow adding, editing, deleting and transferring funds.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.manage_tx} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, manage_tx: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission: Manage Cards */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Credit Cards Management</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow creating, modifying or removing credit cards.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.manage_cards} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, manage_cards: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission: Manage Loans */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Loans Calculator & Management</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow calculations and updates of loan structures.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.manage_loans} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, manage_loans: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission: Manage Services */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Services Activation</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow toggling account-specific mobile security and savings services.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.manage_services} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, manage_services: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission: Manage Users */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>User Profiles & Access Rights</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow managing roles and modifying authorization access of other users.</div>
                    </div>
                    <label className="switch-label" style={{ pointerEvents: userSession.role !== 'Admin' ? 'none' : 'auto' }}>
                      <input 
                        type="checkbox" 
                        checked={userForm.permissions.manage_users} 
                        onChange={(e) => setUserForm({
                          ...userForm,
                          permissions: { ...userForm.permissions, manage_users: e.target.checked }
                        })}
                        disabled={userSession.role !== 'Admin'}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setUserModalOpen(false)}>
                  {userSession.role === 'Admin' ? 'Cancel' : 'Close'}
                </button>
                {userSession.role === 'Admin' && (
                  <button type="submit" className="add-card-btn" style={{ margin: 0, padding: '0.75rem 2rem' }}>
                    Save Changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar navigation structure helper list
const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Transactions', icon: ArrowLeftRight },
  { name: 'Scan & Pay', icon: Scan },
  { name: 'Accounts', icon: User },
  { name: 'Investments', icon: LineChart },
  { name: 'Credit Cards', icon: CreditCard },
  { name: 'Loans', icon: HandCoins },
  { name: 'Services', icon: Wrench },
  { name: 'My Privileges', icon: Lightbulb },
  { name: 'User Details', icon: Users },
  { name: 'Setting', icon: Settings }
];

export default Dashboard;
