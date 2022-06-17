const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes');

const app = express();
const host = config.get('host');
const PORT = config.get('serverPort') || 8008;

app.use(express.json());
app.use('/api/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'));

    app.listen(PORT, () => {
      console.log(`Server start on: ${host}${PORT}`);
    })
  } catch (e) {

  }
};

start();
