// server.js (Node + Express)
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });

    // Example: dummy translation (replace with real translator)
    const translatedText = targetLang === 'mr' ? `मराठी: ${text}` : text;
    return res.json({ translatedText });
  } catch (err) {
    console.error('Translate handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
