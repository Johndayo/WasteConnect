const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, phone, password, role = 'user' } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          phone,
          password: hashedPassword,
          role,
          points: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Pickup Request Routes
app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, category, description } = req.body;
    const userId = req.user.userId;

    const { data: request, error } = await supabase
      .from('pickup_requests')
      .insert([
        {
          user_id: userId,
          name,
          phone,
          address,
          category,
          description,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Pickup request submitted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let query = supabase.from('pickup_requests').select(`
      *,
      users!pickup_requests_user_id_fkey(name, phone),
      collectors!pickup_requests_collector_id_fkey(name, phone)
    `);

    if (userRole === 'user') {
      query = query.eq('user_id', userId);
    }

    const { data: requests, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: request, error } = await supabase
      .from('pickup_requests')
      .select(`
        *,
        users!pickup_requests_user_id_fkey(name, phone),
        collectors!pickup_requests_collector_id_fkey(name, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Collector Routes
app.put('/api/requests/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const collectorId = req.user.userId;

    if (req.user.role !== 'collector') {
      return res.status(403).json({ error: 'Only collectors can accept requests' });
    }

    const { data: request, error } = await supabase
      .from('pickup_requests')
      .update({
        status: 'accepted',
        collector_id: collectorId,
        accepted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Request accepted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/requests/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'collector') {
      return res.status(403).json({ error: 'Only collectors can reject requests' });
    }

    const { data: request, error } = await supabase
      .from('pickup_requests')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Request rejected',
      request
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/requests/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const collectorId = req.user.userId;

    if (req.user.role !== 'collector') {
      return res.status(403).json({ error: 'Only collectors can complete requests' });
    }

    // Get the request to find the user
    const { data: request } = await supabase
      .from('pickup_requests')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status
    const { error: requestError } = await supabase
      .from('pickup_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (requestError) {
      return res.status(400).json({ error: requestError.message });
    }

    // Add points to user
    const { error: pointsError } = await supabase
      .from('users')
      .update({
        points: supabase.raw('points + 10')
      })
      .eq('id', request.user_id);

    if (pointsError) {
      console.error('Error updating points:', pointsError);
    }

    res.json({
      message: 'Request completed successfully. User earned 10 points!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Routes
app.get('/api/admin/analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get total requests
    const { count: totalRequests } = await supabase
      .from('pickup_requests')
      .select('*', { count: 'exact', head: true });

    // Get completed requests
    const { count: completedRequests } = await supabase
      .from('pickup_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get active collectors
    const { count: activeCollectors } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'collector');

    // Get waste category breakdown
    const { data: categoryData } = await supabase
      .from('pickup_requests')
      .select('category')
      .eq('status', 'completed');

    const categoryBreakdown = categoryData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalRequests: totalRequests || 0,
      completedRequests: completedRequests || 0,
      activeCollectors: activeCollectors || 0,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, phone, role, points, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});