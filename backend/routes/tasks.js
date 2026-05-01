// backend/routes/tasks.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET all tasks (Includes Project Name and Assigned User Name)
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: { name: true } // Grabs the project name
        },
        assignedTo: {
          select: { name: true, email: true } // Grabs the assignee's name so UI doesn't just show an ID
        }
      },
      orderBy: { createdAt: 'desc' } // Shows newest tasks first
    });
    
    res.json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

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
        // If assignedToId exists, parse it. Otherwise, leave it null.
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        // If dueDate exists, convert it to an ISO Date object for PostgreSQL
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Create Task Error:", error);
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
    console.error("Update Task Error:", error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

module.exports = router;