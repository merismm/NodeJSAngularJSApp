var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./oauth');

module.exports = function (passport) {
    passport.serializeUser(function(user,done){
        done(null,user);
    });
    passport.deserializeUser(function(user,done){
        done(null,user);
    });

    passport.use('local-login', new LocalStrategy(
        function(username, password, done) {
            User.findOne({
                username: username.toLowerCase()
            }, function(err, user) {
               
                if (err)
                    return done(err);
               
                if (!user)
                    return done(null, false);
               
                if (!user.validPassword(password))
                    return done(null, false);
               
                return done(null, user);
            });
        }
    ));
    
    passport.use(new FacebookStrategy({
            
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : ['displayName','profileUrl','email','friends','photos',"feed","gender","birthday"]
        },

        function(token, refreshToken, profile, done) {
          
            process.nextTick(function() {
                
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user); 
                    } else {
                       
                        var newUser            = new User();
                        
                        newUser.facebook.id    = profile.id; 
                        newUser.facebook.token = token; 
                        newUser.facebook.email  = profile._json.email;
                        newUser.facebook.gender  = profile._json.gender;
                        newUser.facebook.birthday  = profile._json.birthday;
                        newUser.facebook.name  = profile.displayName;
                        newUser.facebook.friends = profile._json.friends.data;
                        newUser.facebook.photos = profile.photos
                        newUser.facebook.profileUrl = profile.profileUrl;
                        newUser.facebook.feed = profile._json.feed.data;
                       
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                          
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));
};