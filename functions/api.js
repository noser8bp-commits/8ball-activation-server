const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (will reset on each deploy)
let database = { keys: [] };

// Generate random key
function generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// API Routes
app.post('/api/check', async (req, res) => {
    try {
        const { key } = req.body;
        
        if (!key) {
            return res.json({ 
                success: false, 
                message: 'No key provided' 
            });
        }

        const keyData = database.keys.find(k => k.key === key && k.active);
        
        if (keyData) {
            keyData.lastUsed = new Date().toISOString();
            keyData.usageCount = (keyData.usageCount || 0) + 1;
            
            return res.json({ 
                success: true, 
                message: 'Key is valid',
                result: "1"
            });
        } else {
            return res.json({ 
                success: false, 
                message: 'Invalid or inactive key',
                result: "0"
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.post('/api/keys/list', async (req, res) => {
    try {
        res.json({ 
            success: true, 
            keys: database.keys 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.post('/api/keys/add', async (req, res) => {
    try {
        const { key, description } = req.body;
        const newKey = key || generateKey().toUpperCase();
        
        if (database.keys.find(k => k.key === newKey)) {
            return res.json({ 
                success: false, 
                message: 'Key already exists' 
            });
        }
        
        database.keys.push({
            key: newKey,
            description: description || '',
            active: true,
            createdAt: new Date().toISOString(),
            usageCount: 0
        });
        
        res.json({ 
            success: true, 
            message: 'Key added successfully',
            key: newKey
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.post('/api/keys/delete', async (req, res) => {
    try {
        const { key } = req.body;
        database.keys = database.keys.filter(k => k.key !== key);
        
        res.json({ 
            success: true, 
            message: 'Key deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.post('/api/keys/toggle', async (req, res) => {
    try {
        const { key } = req.body;
        const keyData = database.keys.find(k => k.key === key);
        
        if (!keyData) {
            return res.json({ 
                success: false, 
                message: 'Key not found' 
            });
        }
        
        keyData.active = !keyData.active;
        
        res.json({ 
            success: true, 
            message: 'Key status updated',
            active: keyData.active
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports.handler = serverless(app);
