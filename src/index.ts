import { connectDB, getDefaultQuestions } from './api/database';
import { ratherBot } from './ratherbot';

(async() => {
  await connectDB(process.env.ATLAS_URI!);

  const defaultQuestions = await getDefaultQuestions();
  ratherBot(process.env.TOKEN!, defaultQuestions);
})();