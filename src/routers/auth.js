const express = require('express');
const router = express.Router();
const passport = require('passport');
const bCrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy
const userDaoSelection = require('../helpers/daoSelection').userDaoSelection;
const logger = require('../middlewares/logger')
const sendEmail = require('../helpers/emails');

router.use(logger);

const userDao = userDaoSelection();

// passport strategies
// login
passport.use('login', new LocalStrategy(
  async (username, password, done) => {
    const user = await userDao.findBy('email', username);
    if (!user) {
      return done(null, { error: 'usuario o contraseña incorrecto' });
    }

    if (!bCrypt.compareSync(password, user.password)) {
      return done(null, { error: 'usuario o contraseña incorrecto' });
    }

    delete (user.password);
    return done(null, user);
  }
));

// signup
passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
},
  async (req, username, password, done) => {
    try {
      const user = await userDao.findBy('email', username);

      if (user) {
        return done(null, { error: 'usuario ya existe' });
      }

      const newUser = await userDao.create({
        ...req.body,
        password: createHash(password)
      });
      delete (newUser.password);

      // mail de bienvenida
      sendEmail(newUser.email, 'Bienvienido', '<b>Te has creado una cuenta en el sitio satisfactorriamente!</b>');

      // mail al administrador
      sendEmail(process.env.EMAIL_ADMIN, 'Nuevo Registro', JSON.stringify(newUser));

      return done(null, newUser);
    } catch (error) {
      return error;
    }
  }
));

// passport serializers
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// helpers
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  // return bCrypt.hashSync(password, '$2b$10$bWDH0FuuSAOX/sOGgBP8zu', null);
};

// router
// login
router.post(
  '/login',
  passport.authenticate('login'),
  (req, res) => res.json(req.user)
);

router.post(
  '/signup',
  passport.authenticate('signup'),
  (req, res) => res.json(req.user)
);

module.exports = router;
