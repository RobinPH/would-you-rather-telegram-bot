import { connectDB } from './api/database';
import { ratherBot } from './ratherbot';

require('dotenv').config();

(async() => {
  await connectDB(process.env.MONGODB_URI!);
  ratherBot(process.env.TOKEN!);
})();