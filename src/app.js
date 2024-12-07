const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { assignDeviceId } = require('./middlewares/assignDeviceId');


dotenv.config();
const app = express();


require('./passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser()); // Required for parsing cookies
app.use(assignDeviceId); // Add the middleware here


app.use('/api', authRoutes); 
app.use('/api', urlRoutes);
app.use('/api/analytics', analyticsRoutes);


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;