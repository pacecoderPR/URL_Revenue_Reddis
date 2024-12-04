const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

// Passport Configuration
require('./passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Use Routes
app.use('/api', authRoutes); // Prefixed auth-related routes
app.use('/api', urlRoutes); // Prefixed URL-related routes
app.use('/api/analytics', analyticsRoutes); // Prefixed analytics-related routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
