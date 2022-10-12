require("dotenv").config();
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const Student = require("./data");
    const passport = require("passport");
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.WEB_TOKEN;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    Student.findOne({_id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));