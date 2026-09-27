const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Serve static files
app.use(express.static(__dirname));

// API endpoint to list available quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    res.json(jsonFiles);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      res.status(500).json({ error: 'Failed to read quiz directory' });
    }
  }
});

// Serve quiz JSON files
app.get('/data/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    if (!filename.endsWith('.json')) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Quiz not found' });
    } else {
      res.status(500).json({ error: 'Failed to read quiz file' });
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz server running at http://localhost:${PORT}`);
  console.log(`Also accessible via your local IP address on port ${PORT}`);
  console.log(`Add quiz JSON files to the 'data' directory`);
});
