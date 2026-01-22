const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('tmc-tracking.db');

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'TMC-Sauerland-Secret-Key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database tables
function initDatabase() {
    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Goals table
    db.exec(`
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            mobilfunk INTEGER DEFAULT 0,
            breitband INTEGER DEFAULT 0,
            tv INTEGER DEFAULT 0,
            vertragsverlaengerung INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Entries table
    db.exec(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            order_number TEXT NOT NULL,
            category TEXT NOT NULL,
            tariff TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Create default users if they don't exist
    createDefaultUsers();
}

// Create default users
async function createDefaultUsers() {
    const users = [
        { username: 'Admin', password: 'Vllahia222199859846!', isAdmin: 1, goals: { mobilfunk: 0, breitband: 0, tv: 0, vertragsverlaengerung: 0 } },
        { username: 'Manja', password: 'Pia2026!', isAdmin: 0, goals: { mobilfunk: 50, breitband: 40, tv: 30, vertragsverlaengerung: 60 } },
        { username: 'Michael', password: 'Mario2026!', isAdmin: 0, goals: { mobilfunk: 50, breitband: 40, tv: 30, vertragsverlaengerung: 60 } },
        { username: 'Aaron', password: 'Peugeot2026!', isAdmin: 0, goals: { mobilfunk: 50, breitband: 40, tv: 30, vertragsverlaengerung: 60 } }
    ];

    for (const user of users) {
        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(user.username);
        
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const result = db.prepare('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)').run(
                user.username,
                hashedPassword,
                user.isAdmin
            );

            // Create default goals for the user
            db.prepare('INSERT INTO goals (user_id, mobilfunk, breitband, tv, vertragsverlaengerung) VALUES (?, ?, ?, ?, ?)').run(
                result.lastInsertRowid,
                user.goals.mobilfunk,
                user.goals.breitband,
                user.goals.tv,
                user.goals.vertragsverlaengerung
            );
        }
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }
    next();
}

// Admin middleware
function requireAdmin(req, res, next) {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
    }
    next();
}

// ==================== API ROUTES ====================

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isAdmin = user.is_admin === 1;

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.is_admin === 1
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server-Fehler' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Get current user
app.get('/api/user', requireAuth, (req, res) => {
    const user = db.prepare('SELECT id, username, is_admin FROM users WHERE id = ?').get(req.session.userId);
    res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin === 1
    });
});

// Get user goals
app.get('/api/goals/:userId?', requireAuth, (req, res) => {
    const userId = req.params.userId || req.session.userId;

    // Non-admin users can only see their own goals
    if (!req.session.isAdmin && userId != req.session.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const goals = db.prepare('SELECT * FROM goals WHERE user_id = ?').get(userId);
    res.json(goals || { mobilfunk: 0, breitband: 0, tv: 0, vertragsverlaengerung: 0 });
});

// Update user goals (admin only)
app.put('/api/goals/:userId', requireAdmin, (req, res) => {
    const { userId } = req.params;
    const { mobilfunk, breitband, tv, vertragsverlaengerung } = req.body;

    try {
        const existing = db.prepare('SELECT id FROM goals WHERE user_id = ?').get(userId);

        if (existing) {
            db.prepare(`
                UPDATE goals 
                SET mobilfunk = ?, breitband = ?, tv = ?, vertragsverlaengerung = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `).run(mobilfunk, breitband, tv, vertragsverlaengerung, userId);
        } else {
            db.prepare(`
                INSERT INTO goals (user_id, mobilfunk, breitband, tv, vertragsverlaengerung)
                VALUES (?, ?, ?, ?, ?)
            `).run(userId, mobilfunk, breitband, tv, vertragsverlaengerung);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Update goals error:', error);
        res.status(500).json({ error: 'Fehler beim Speichern der Ziele' });
    }
});

// Get entries
app.get('/api/entries/:userId?', requireAuth, (req, res) => {
    const userId = req.params.userId || req.session.userId;

    // Non-admin users can only see their own entries
    if (!req.session.isAdmin && userId != req.session.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const entries = db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(entries);
});

// Create entry
app.post('/api/entries', requireAuth, (req, res) => {
    const { orderNumber, category, tariff } = req.body;

    try {
        const result = db.prepare(`
            INSERT INTO entries (user_id, order_number, category, tariff)
            VALUES (?, ?, ?, ?)
        `).run(req.session.userId, orderNumber, category, tariff);

        res.json({
            success: true,
            entry: {
                id: result.lastInsertRowid,
                user_id: req.session.userId,
                order_number: orderNumber,
                category: category,
                tariff: tariff
            }
        });
    } catch (error) {
        console.error('Create entry error:', error);
        res.status(500).json({ error: 'Fehler beim Speichern des Abschlusses' });
    }
});

// Delete entry
app.delete('/api/entries/:entryId', requireAuth, (req, res) => {
    const { entryId } = req.params;

    try {
        // Check if entry belongs to user (or user is admin)
        const entry = db.prepare('SELECT user_id FROM entries WHERE id = ?').get(entryId);

        if (!entry) {
            return res.status(404).json({ error: 'Abschluss nicht gefunden' });
        }

        if (!req.session.isAdmin && entry.user_id !== req.session.userId) {
            return res.status(403).json({ error: 'Keine Berechtigung' });
        }

        db.prepare('DELETE FROM entries WHERE id = ?').run(entryId);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete entry error:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Abschlusses' });
    }
});

// Get statistics
app.get('/api/statistics/:userId?', requireAuth, (req, res) => {
    const userId = req.params.userId || req.session.userId;

    // Non-admin users can only see their own statistics
    if (!req.session.isAdmin && userId != req.session.userId) {
        return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const stats = {
        mobilfunk: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'mobilfunk').count,
        breitband: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'breitband').count,
        tv: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'tv').count,
        vertragsverlaengerung: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'vertragsverlaengerung').count
    };

    res.json(stats);
});

// Get all users (admin only)
app.get('/api/users', requireAdmin, (req, res) => {
    const users = db.prepare('SELECT id, username, is_admin FROM users WHERE is_admin = 0').all();
    res.json(users);
});

// Get user with goals and stats (admin only)
app.get('/api/admin/user/:userId', requireAdmin, (req, res) => {
    const { userId } = req.params;

    const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(userId);
    if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const goals = db.prepare('SELECT * FROM goals WHERE user_id = ?').get(userId);
    const stats = {
        mobilfunk: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'mobilfunk').count,
        breitband: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'breitband').count,
        tv: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'tv').count,
        vertragsverlaengerung: db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ? AND category = ?').get(userId, 'vertragsverlaengerung').count
    };
    const totalEntries = db.prepare('SELECT COUNT(*) as count FROM entries WHERE user_id = ?').get(userId).count;

    res.json({
        user,
        goals: goals || { mobilfunk: 0, breitband: 0, tv: 0, vertragsverlaengerung: 0 },
        stats,
        totalEntries
    });
});

// ==================== START SERVER ====================

initDatabase();

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   TMC SAUERLAND - ZIEL-TRACKING SERVER           ║
║                                                   ║
║   Server läuft auf: http://localhost:${PORT}      ║
║                                                   ║
║   Status: ✓ Online                               ║
║   Datenbank: ✓ SQLite initialisiert              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});
