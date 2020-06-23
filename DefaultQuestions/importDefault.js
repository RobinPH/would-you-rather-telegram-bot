const process = require('process');

if (process.argv.length !== 4) {
  console.log("Usage: node importDefault.js [txt path] [MONGODB_URI]")
  process.exit(1);
}

const fs = require('fs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Questions = mongoose.model('Question', new Schema({ questions: [ String ] }, { timestamps: true }));

mongoose.connect(process.argv[3], { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection.once('open', async() => {
  console.log("MongoDB database connection established successfully");

  const questions = new Questions({
    questions: fs.readFileSync(process.argv[2], {encoding: 'utf-8'}).split('\r\n')
  })

  questions.save()
    .then(() => {
      console.log("Added Default Questions!")
      process.exit(0);
    })
    .catch((err) => console.log(`Error ${ err }`))
})