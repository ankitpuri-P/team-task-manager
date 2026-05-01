const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Use 'bcryptjs' to match your installation
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'MEMBER',
      },
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(400).json({ error: "Signup failed. Email may already be in use." });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;