/**
 * Family Organizer - Simple File Persistence Server
 * 
 * A lightweight Express server that:
 * - Serves the static frontend
 * - Provides API endpoints for data persistence
 * - Stores data in a JSON file on disk
 */

import express from 'express';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = join(DATA_DIR, 'family-data.json');

// Middleware
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  }
  next();
});

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
    console.log(`Created data directory: ${DATA_DIR}`);
  }
}

// Initialize empty data file if it doesn't exist
async function ensureDataFile() {
  if (!existsSync(DATA_FILE)) {
    const initialData = {
      members: [],
      chores: [],
      events: [],
      monthlyCompetitions: [],
      weeklyCompetitions: [],
      settings: {},
      _meta: {
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    await writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log(`Created data file: ${DATA_FILE}`);
  }
}

// =============================================================================
// API Routes
// =============================================================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dataFile: DATA_FILE
  });
});

/**
 * GET /api/data
 * Retrieve all stored data
 */
app.get('/api/data', async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

/**
 * PUT /api/data
 * Save all data (full replacement)
 */
app.put('/api/data', async (req, res) => {
  try {
    const data = {
      ...req.body,
      _meta: {
        ...req.body._meta,
        version: (req.body._meta?.version || 0) + 1,
        updatedAt: new Date().toISOString()
      }
    };
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, meta: data._meta });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).json({ error: 'Failed to write data' });
  }
});

/**
 * PATCH /api/data/:key
 * Update a specific data key (members, chores, events, etc.)
 */
app.patch('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const allowedKeys = ['members', 'chores', 'events', 'monthlyCompetitions', 'weeklyCompetitions', 'settings'];
    
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ error: `Invalid key: ${key}` });
    }

    const fileContent = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    
    data[key] = req.body;
    data._meta = {
      ...data._meta,
      version: (data._meta?.version || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, meta: data._meta });
  } catch (error) {
    console.error('Error patching data:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

/**
 * POST /api/backup
 * Create a timestamped backup of the data file
 */
app.post('/api/backup', async (req, res) => {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = join(DATA_DIR, `backup-${timestamp}.json`);
    await writeFile(backupFile, data);
    res.json({ success: true, backupFile });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// =============================================================================
// Static File Serving
// =============================================================================

// Serve static files from the dist directory
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

// =============================================================================
// Server Startup
// =============================================================================

async function start() {
  try {
    await ensureDataDir();
    await ensureDataFile();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║       🏠 Family Organizer Server Started                     ║
╚══════════════════════════════════════════════════════════════╝

  → Server:    http://0.0.0.0:${PORT}
  → Data file: ${DATA_FILE}
  → API:       /api/data, /api/health, /api/backup

`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
