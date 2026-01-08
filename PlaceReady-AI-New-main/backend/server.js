const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Save user profile
app.post('/api/users/:uid/profile', async (req, res) => {
  try {
    await ensureDataDir();
    const { uid } = req.params;
    const profilePath = path.join(DATA_DIR, `profile_${uid}.json`);
    await fs.writeFile(profilePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/users/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    const profilePath = path.join(DATA_DIR, `profile_${uid}.json`);
    const data = await fs.readFile(profilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: 'Profile not found' });
  }
});

// Save analysis data
app.post('/api/users/:uid/analysis', async (req, res) => {
  try {
    await ensureDataDir();
    const { uid } = req.params;
    const analysisPath = path.join(DATA_DIR, `analysis_${uid}.json`);
    await fs.writeFile(analysisPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analysis data
app.get('/api/users/:uid/analysis', async (req, res) => {
  try {
    const { uid } = req.params;
    const analysisPath = path.join(DATA_DIR, `analysis_${uid}.json`);
    const data = await fs.readFile(analysisPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: 'Analysis not found' });
  }
});

// Get all users (for admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const users = [];
    
    for (const file of files) {
      if (file.startsWith('profile_')) {
        const uid = file.replace('profile_', '').replace('.json', '');
        const profilePath = path.join(DATA_DIR, file);
        const analysisPath = path.join(DATA_DIR, `analysis_${uid}.json`);
        
        const profile = JSON.parse(await fs.readFile(profilePath, 'utf8'));
        let analysis = null;
        
        try {
          analysis = JSON.parse(await fs.readFile(analysisPath, 'utf8'));
        } catch {}
        
        users.push({ ...profile, analysis });
      }
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});