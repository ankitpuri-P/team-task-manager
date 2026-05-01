// backend/routes/projects.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/auth'); // Bring in the security guard

const router = express.Router();
const prisma = new PrismaClient();

// GET all projects (Only logged-in users can do this)
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: true } // Also fetch the tasks inside each project
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST a new project (Only ADMINS can do this)
router.post('/', verifyToken, async (req, res) => {
  try {
    // 1. Role-Based Access Control check!
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { name, description } = req.body;

    // 2. Save the project to the database
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.userId // We get this from the verified token!
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;