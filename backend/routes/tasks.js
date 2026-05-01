// backend/routes/tasks.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST a new task (Only Admins can assign tasks)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { title, description, projectId, assignedToId, dueDate } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        projectId: parseInt(projectId),
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task status (Both Admins and Members can update progress)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, IN_PROGRESS, or COMPLETED

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

module.exports = router;