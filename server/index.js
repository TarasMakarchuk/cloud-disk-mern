const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const fileUpload = require('express-fileupload');
const corsMiddleware = require('./middleware/cors.middleware');

const app = express();
const HOST = config.get('host');
const PORT = config.get('serverPort') || 8008;

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'));

    app.listen(PORT, () => {
      console.log(`Server start on: ${HOST}${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
};

start();
