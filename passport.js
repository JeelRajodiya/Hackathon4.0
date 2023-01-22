const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID:"773788138064-atl0p423cdsgk0ckh3u1h7o0v4h9es59.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"http://localhost:8089/google",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));
