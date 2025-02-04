import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'colors';
dotenv.config();
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import path from 'path';
import setupSocket from './socket.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// accept json data in body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 5000;

// connecting to Database
connectDB();

app.use('/', routes);

// serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  );
});

//socket
setupSocket(server);
