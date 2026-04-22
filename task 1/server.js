const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            goal REAL NOT NULL,
            raised REAL DEFAULT 0,
            image TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating projects table", err);
            } else {
                // Check if empty, then seed
                db.get(`SELECT COUNT(*) as count FROM projects`, (err, row) => {
                    if (row && row.count === 0) {
                        db.run(`INSERT INTO projects (title, description, goal, raised, image) VALUES 
                        ('Quantum AI Assistant', 'A next-generation personalized AI that anticipates your needs.', 50000, 15400, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80'),
                        ('Ocean Cleanup Drone', 'Autonomous solar-powered drones that collect ocean plastics.', 100000, 85000, 'https://images.unsplash.com/photo-1582967634289-4dd7dbba50c2?auto=format&fit=crop&w=600&q=80'),
                        ('Neon Urban Garden', 'Modular, automated vertical hydroponic farms for apartment living.', 25000, 3200, 'https://images.unsplash.com/photo-1587334274328-64186a80aeb6?auto=format&fit=crop&w=600&q=80')`);
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            content TEXT,
            date TEXT,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )`);
    }
});

// API Routes
app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/projects/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM projects WHERE id = ?`, [id], (err, project) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        db.all(`SELECT * FROM updates WHERE project_id = ? ORDER BY id DESC`, [id], (err, updates) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            project.updates = updates;
            res.json(project);
        });
    });
});

app.post('/api/projects', (req, res) => {
    const { title, description, goal, image } = req.body;
    db.run(`INSERT INTO projects (title, description, goal, image) VALUES (?, ?, ?, ?)`, 
        [title, description, goal, image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, title, description, goal });
    });
});

app.post('/api/projects/:id/contribute', (req, res) => {
    const id = req.params.id;
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    db.run(`UPDATE projects SET raised = raised + ? WHERE id = ?`, [amount, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.get(`SELECT raised FROM projects WHERE id = ?`, [id], (err, row) => {
            res.json({ success: true, newRaised: row ? row.raised : 0 });
        });
    });
});

app.post('/api/projects/:id/updates', (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
    const date = new Date().toISOString();

    db.run(`INSERT INTO updates (project_id, content, date) VALUES (?, ?, ?)`, [id, content, date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, content, date });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
