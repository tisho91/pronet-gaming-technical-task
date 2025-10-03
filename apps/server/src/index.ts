import express from 'express';
import path from 'path';
import { corsMiddleware } from './middlewares/cors.middleware';
import { router } from './router';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(corsMiddleware);
}

app.use(express.static(path.join(__dirname, '../../client/dist/client/browser')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/client/browser/index.html'));
});

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
