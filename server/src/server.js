import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'colors';
dotenv.config();
import { connectDB } from './config/db.js';
import routes from './routes/index.js';

const app = express();

// accept json data in body
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

// connecting to Database
connectDB();

app.use('/', routes);

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  );
});
