const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { readUsers, writeUsers, readApplications, writeApplications } = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = readUsers();

    // Check if user already exists
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const isFirstUser = users.length === 0;
    const role = isFirstUser ? 'Admin' : 'Viewer';
    const permissions = {
      view_dashboard: true,
      manage_tx: isFirstUser,
      manage_cards: isFirstUser,
      manage_loans: isFirstUser,
      manage_services: isFirstUser,
      manage_users: isFirstUser
    };

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      permissions
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readUsers();

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Viewer',
        permissions: user.permissions || {
          view_dashboard: true,
          manage_tx: false,
          manage_cards: false,
          manage_loans: false,
          manage_services: false,
          manage_users: false
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Middleware to verify requester has appropriate privileges
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const requesterRole = req.headers['x-user-role'];
    if (!requesterRole || !allowedRoles.includes(requesterRole)) {
      return res.status(403).json({ error: 'Access Denied: Insufficient privileges.' });
    }
    next();
  };
};

// Route: Get public platform statistics
app.get('/api/public-stats', (req, res) => {
  try {
    const users = readUsers();
    const adminsCount = users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
    const editorsCount = users.filter(u => (u.role || '').toLowerCase() === 'editor').length;
    const viewersCount = users.filter(u => (u.role || '').toLowerCase() === 'viewer').length;
    
    // Get latest 3 registered users (name and role)
    const latestUsers = users.slice(-3).map(u => ({
      name: u.name,
      role: u.role || 'Viewer'
    }));

    res.json({
      totalUsers: users.length,
      admins: adminsCount,
      editors: editorsCount,
      viewers: viewersCount,
      latestUsers
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

// Route: Get all users (Admin & Editor only)
app.get('/api/users', requireRole(['Admin', 'Editor']), (req, res) => {
  try {
    const users = readUsers();
    // Strip passwords before sending user list
    const safeUsers = users.map(({ password, ...u }) => ({
      ...u,
      role: u.role || 'Viewer',
      permissions: u.permissions || {
        view_dashboard: true,
        manage_tx: false,
        manage_cards: false,
        manage_loans: false,
        manage_services: false,
        manage_users: false
      }
    }));
    res.json(safeUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Route: Update user role & permissions (Admin only)
app.put('/api/users/:id/permissions', requireRole(['Admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    if (!role || !permissions) {
      return res.status(400).json({ error: 'Role and permissions are required' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    users[userIndex].role = role;
    users[userIndex].permissions = {
      ...users[userIndex].permissions,
      ...permissions
    };

    writeUsers(users);

    res.json({
      message: 'User permissions updated successfully',
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        role: users[userIndex].role,
        permissions: users[userIndex].permissions
      }
    });
  } catch (err) {
    console.error('Error updating user permissions:', err);
    res.status(500).json({ error: 'Server error updating user permissions' });
  }
});

// Route: Submit application for a banking product
app.post('/api/applications', (req, res) => {
  try {
    const { name, email, phone, product, income } = req.body;

    if (!name || !email || !phone || !product) {
      return res.status(400).json({ error: 'Name, email, phone, and product are required.' });
    }

    const apps = readApplications();
    const newApp = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      product,
      income: income || 'Not Specified',
      submittedAt: new Date().toISOString()
    };

    apps.push(newApp);
    writeApplications(apps);

    res.status(201).json({ message: 'Application submitted successfully', application: newApp });
  } catch (err) {
    console.error('Error saving application:', err);
    res.status(500).json({ error: 'Server error saving application' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
