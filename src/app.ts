// import app from './src/App'
import express from 'express';
import path from 'path';

import connectDB from '../config/db';
import userRoutes from './routes/api/v1/users';
import authRoutes from './routes/api/v1/auth';
import profileRoutes from './routes/api/v1/profile';
import postsRoutes from './routes/api/v1/posts';

const app = express();

// connect database
connectDB();

// Init Middleware
// app.use(express.json());
// @ts-ignore
app.use(express.json({ extended: false }));

// Define Routes
// app.use('/api/v1/users', require('./src/routes/api/v1/users'));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/posts', postsRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
