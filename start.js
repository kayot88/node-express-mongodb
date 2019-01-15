const mongoose = require('mongoose');

// Make sure we are running node 7.6+
// const nodeV = console.log(process.versions.node.split('.').map(parseFloat));
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major <= 7 && minor <= 5) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.log(`🛑 🇳🇴 💩 👉 ${err}`);
})

// READY?! Let's go!
require('./models/Store');
require('./models/User');

// Start our app!
const app = require('./app');
app.set('port', 7777 || process.env.port);
const server = app.listen(app.get('port'), () => {
  console.log(`Express is running 🆒  👉  ${server.address().port}`);
});


