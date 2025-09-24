const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database file
const DB_FILE = path.join(__dirname, 'keys.json');

// Initialize database
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ keys: [] }));
    }
}

// Read database
async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write database
async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate random key
function generateKey() {
    return crypto.randomBytes(16).toString('hex').toUpperCase();
}

// Serve admin page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API Routes

// Check if key is valid
app.post('/api/check', async (req, res) => {
    try {
        const { key } = req.body;
        
        if (!key) {
            return res.json({ 
                success: false, 
                message: 'No key provided' 
            });
        }

        const db = await readDB();
        const keyData = db.keys.find(k => k.key === key && k.active);
        
        if (keyData) {
            // Update last used
            keyData.lastUsed = new Date().toISOString();
            keyData.usageCount = (keyData.usageCount || 0) + 1;
            await writeDB(db);
            
            return res.json({ 
                success: true, 
                message: 'Key is valid',
                result: "1" // للتوافق مع التطبيق
            });
        } else {
            return res.json({ 
                success: false, 
                message: 'Invalid or inactive key',
                result: "0"
            });
        }
    } catch (error) {
        console.error('Error checking key:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get all keys (protected with admin password)
app.post('/api/keys/list', async (req, res) => {
    try {
        const { adminPassword } = req.body;
        
        // تغيير كلمة المرور هنا
        if (adminPassword !== 'admin123') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid admin password' 
            });
        }

        const db = await readDB();
        res.json({ 
            success: true, 
            keys: db.keys 
        });
    } catch (error) {
        console.error('Error listing keys:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Add new key
app.post('/api/keys/add', async (req, res) => {
    try {
        const { adminPassword, key, description } = req.body;
        
        if (adminPassword !== 'admin123') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid admin password' 
            });
        }

        const db = await readDB();
        
        // Generate key if not provided
        const newKey = key || generateKey();
        
        // Check if key already exists
        if (db.keys.find(k => k.key === newKey)) {
            return res.json({ 
                success: false, 
                message: 'Key already exists' 
            });
        }
        
        db.keys.push({
            key: newKey,
            description: description || '',
            active: true,
            createdAt: new Date().toISOString(),
            usageCount: 0
        });
        
        await writeDB(db);
        
        res.json({ 
            success: true, 
            message: 'Key added successfully',
            key: newKey
        });
    } catch (error) {
        console.error('Error adding key:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Delete key
app.post('/api/keys/delete', async (req, res) => {
    try {
        const { adminPassword, key } = req.body;
        
        if (adminPassword !== 'admin123') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid admin password' 
            });
        }

        const db = await readDB();
        db.keys = db.keys.filter(k => k.key !== key);
        await writeDB(db);
        
        res.json({ 
            success: true, 
            message: 'Key deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting key:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Toggle key status
app.post('/api/keys/toggle', async (req, res) => {
    try {
        const { adminPassword, key } = req.body;
        
        if (adminPassword !== 'admin123') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid admin password' 
            });
        }

        const db = await readDB();
        const keyData = db.keys.find(k => k.key === key);
        
        if (!keyData) {
            return res.json({ 
                success: false, 
                message: 'Key not found' 
            });
        }
        
        keyData.active = !keyData.active;
        await writeDB(db);
        
        res.json({ 
            success: true, 
            message: 'Key status updated',
            active: keyData.active
        });
    } catch (error) {
        console.error('Error toggling key:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Start server
app.listen(PORT, async () => {
    await initDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Admin panel: http://localhost:${PORT}/admin.html`);
});
