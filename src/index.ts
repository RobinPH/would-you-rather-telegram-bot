import { connectDB, getDefaultQuestions } from './api/database';
import { ratherBot } from './api/ratherbot';

(async() => {
  await connectDB(process.env.ATLAS_URI!);

  const preloadedQuestion = await getDefaultQuestions();
  ratherBot(process.env.TOKEN!, preloadedQuestion);
})();