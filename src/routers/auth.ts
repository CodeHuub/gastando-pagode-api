import express from "express";
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2'
import { Strategy } from 'passport-local'
import crypto from 'crypto'
const authRouter = express.Router();

authRouter.get('/login', (req, res, next) => {
    res.render('login');
})


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    passReqToCallback: true
}, authUser)

passport.serializeUser()
passport.deserializeUser()

passport.use(new Strategy(function verify(username, password, cb) {
    // TODO: Implement database query to retriever the user
    console.log('1')
    crypto.pbkdf2(password, 'salt', 310000, 32, 'sha256', function (err, hashedPassword) {
        console.log('2')
        const newHashedPassword = hashedPassword;
        if (hashedPassword === newHashedPassword) {
            console.log('3')
            return cb(null,
                { username, password },
                { message: 'Logado' });
        } else {
            console.log('4')
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
    });
}));

authRouter.get('/login', (req, res, next) => {
    // Login Page
    res.send('Login Page')
})

authRouter.post('/login/password', passport.authenticate('local', {
    successMessage: 'Bem Vindo! Login efetuado com sucesso!',
    failureMessage: 'Deu errado'
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

export default authRouter;