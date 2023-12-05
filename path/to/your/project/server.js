import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { connectWithRetry } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { getRecipeSuggestion } from './utils/aiHandlers.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_PROD_URL : '*', 
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('request-recipe', async (ingredientsArray) => {
    try {
      const recipeSuggestion = await getRecipeSuggestion(ingredientsArray);
      socket.emit('update-recipe', { recipe: recipeSuggestion });
    } catch (error) {
      console.error('Error:', error);
      socket.emit('error', { message: 'Failed to generate recipe from OpenAI.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

connectWithRetry();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
    app.get('/', (req, res) => {
    res.send('Welcome to SavorySagas.com!');
  });
}

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

