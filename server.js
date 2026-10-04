const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Track SSE clients
const clients = new Set();

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

// API endpoint to get quiz metadata without questions
app.get('/api/quizzes-metadata', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const quizMetadata = await Promise.all(
      jsonFiles.map(async (filename) => {
        try {
          const filePath = path.join(DATA_DIR, filename);
          const data = await fs.readFile(filePath, 'utf8');
          const quiz = JSON.parse(data);

          // Extract only metadata, excluding questions
          return {
            filename: filename,
            id: filename.replace('.json', ''),
            title: quiz.title || 'Untitled Quiz',
            description: quiz.description || '',
            settings: quiz.settings || {},
            questionCount: quiz.questions ? quiz.questions.length : 0
          };
        } catch (error) {
          console.error(`Error reading ${filename}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed reads
    const validMetadata = quizMetadata.filter(meta => meta !== null);
    res.json(validMetadata);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      res.status(500).json({ error: 'Failed to read quiz directory' });
    }
  }
});

// Server-Sent Events endpoint for real-time updates
app.get('/api/events', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add client to set
  clients.add(res);
  console.log(`SSE client connected (${clients.size} total)`);

  // Send initial connection event
  res.write('data: {"type":"connected"}\n\n');

  // Remove client on disconnect
  req.on('close', () => {
    clients.delete(res);
    console.log(`SSE client disconnected (${clients.size} remaining)`);
  });
});

// Notify all connected clients of changes
function notifyClients() {
  const message = `data: ${JSON.stringify({ type: 'change' })}\n\n`;
  clients.forEach(client => {
    try {
      client.write(message);
    } catch (error) {
      // Client connection may be broken
      clients.delete(client);
    }
  });
}

// Watch data directory for changes
async function watchDataDirectory() {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Watch for changes
    fsSync.watch(DATA_DIR, (eventType, filename) => {
      if (filename && filename.endsWith('.json')) {
        console.log(`Data directory changed: ${eventType} ${filename}`);
        notifyClients();
      }
    });

    console.log('Watching data directory for changes...');
  } catch (error) {
    console.error('Failed to watch data directory:', error);
  }
}

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
  watchDataDirectory();
});
