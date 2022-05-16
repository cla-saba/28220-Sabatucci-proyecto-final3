require('dotenv').config();
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const app = express()
const { logConsole } = require('./helpers/loggers.js');
const port = process.env.PORT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: +process.env.COOKIES_MAXAGE
  },
  rolling: true,
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// Router
const productRouter = require('./routers/products');
app.use('/api/products', productRouter);

const cartRouter = require('./routers/cart');
app.use('/api/cart', cartRouter);

const authRouter = require('./routers/auth');
app.use('/api/auth', authRouter);

// const sendEmail = require('./helpers/emails');
// sendEmail('cla.saba@gmail.com', 'Hola Prueba', '<b>OOOOOO</b>')

// MEMORY
// app.get('/api/test/memory', async (req, res) => {
//   const Memory = require('./classes/Memory')
//   const memory = new Memory();
//   await memory.create({ mariano: 'adrian' });
//   await memory.update({ mariano: 'adrian', age: 38 }, 1);
//   await memory.create({ belen: 'anahi' });
//   await memory.create({ milena: 'encanto' });
//   await memory.remove(1);
//   res.status(200).send(await memory.findAll());
// });

// FILE SYSTEM
// app.get('/api/test/filesystem', async (req, res) => {
//   const FileSystem = require('./classes/FileSystem')
//   const fileSystem = new FileSystem('test');
//   await fileSystem.create({ mariano: 'adrian' });
//   await fileSystem.update({ mariano: 'adrian', age: 38 }, 1);
//   await fileSystem.create({ belen: 'anahi' });
//   await fileSystem.create({ milena: 'encanto' });
//   await fileSystem.remove(1);
//   res.status(200).send(await fileSystem.findAll());
// });

// MONGODB
// app.get('/api/test/mongodb', async (req, res) => {
//   const MongoDb = require('./classes/MongoDb');
//   const mongoDb = new MongoDb('productos');
//   await mongoDb.removeAll();
//   await mongoDb.create({ mariano: 'adrian' });
//   const id = await mongoDb.findAll();
//   await mongoDb.update({ mariano: 'adrian', age: 38 }, id[0]._id.toString());
//   await mongoDb.create({ belen: 'anahi' });
//   await mongoDb.create({ milena: 'encanto' });
//   res.status(200).send(await mongoDb.findAll());
// });

// FIREBASE
// app.get('/api/test/firebase', async (req, res) => {
//   const Firebase = require('./classes/Firebase');
//   const firebase = new Firebase('productos');
//   await firebase.removeAll();
//   const doc = await firebase.create({ mariano: 'loco' });
//   await firebase.update({ mariano: 'adrian', age: 38 }, doc.id);
//   await firebase.create({ belen: 'anahi' });
//   const id2 = await firebase.create({ milena: 'encanto' });
//   await firebase.remove(id2.id)
//   res.status(200).send(await firebase.findAll());
// });

// Server

app.listen(port, () => {
  logConsole.info(`Example app listening on port ${port}`)
})

