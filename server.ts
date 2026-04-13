import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('taskify.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('manager', 'employee')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    timeline TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    project_id TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    status TEXT CHECK(status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
    deadline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Routes
  app.post('/api/auth/signup', (req, res) => {
    const { id, name, email, password, role } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
      stmt.run(id, name, email, password, role);
      res.status(201).json({ message: 'User created' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Project Routes
  app.post('/api/projects', (req, res) => {
    const { id, name, description, timeline, created_by } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO projects (id, name, description, timeline, created_by) VALUES (?, ?, ?, ?, ?)');
      stmt.run(id, name, description, timeline, created_by);
      res.status(201).json({ id, name, description, timeline, created_by });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();
    res.json(projects);
  });

  // Task Routes
  app.post('/api/tasks', (req, res) => {
    const { id, name, description, project_id, assigned_to, deadline } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO tasks (id, name, description, project_id, assigned_to, deadline) VALUES (?, ?, ?, ?, ?, ?)');
      stmt.run(id, name, description, project_id, assigned_to, deadline);
      res.status(201).json({ id, name, description, project_id, assigned_to, deadline, status: 'todo' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
  app.patch('/api/tasks/:taskId', (req, res) => {
    const { name, description, status } = req.body;
    try {
      const stmt = db.prepare('UPDATE tasks SET name = ?, description = ?, status = ? WHERE id = ?');
      stmt.run(name, description, status, req.params.taskId);
      res.json({ message: 'Task updated successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/tasks/:projectId', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ?').all(req.params.projectId);
    res.json(tasks);
  });

  app.patch('/api/tasks/:taskId/status', (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.taskId);
      res.json({ message: 'Status updated' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Comment Routes
  app.post('/api/comments', (req, res) => {
    const { id, task_id, user_id, text } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO comments (id, task_id, user_id, text) VALUES (?, ?, ?, ?)');
      stmt.run(id, task_id, user_id, text);
      res.status(201).json({ id, task_id, user_id, text });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/comments/:taskId', (req, res) => {
    const comments = db.prepare(`
      SELECT c.*, u.name as user_name 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.task_id = ?
      ORDER BY c.created_at ASC
    `).all(req.params.taskId);
    res.json(comments);
  });

  // User Routes
  app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT id, name, email, role FROM users').all();
    res.json(users);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
