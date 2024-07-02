import express from 'express';
import cors from 'cors';
import tokenRoutes from './routes/tokens.js';
import quoteRoutes from './routes/quotes.js';
import paramRoutes from './routes/params.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/api', (req, res) => {
  res.send('React App Backend');
});

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/params', paramRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // For testing purposes
