var db = require("../models");

module.exports = function(app,passport){
   
    app.post("/login",passport.authenticate("local-login"),function(req,res){
        res.json(req.user);
    });
  
    app.post("/logout",function(req,res){
        req.logOut();
        res.send(200);
    });
   
    app.get("/loggedin",function(req,res){
        res.send(req.isAuthenticated() ? req.user : "0");
    });
   
    app.post("/signup",function(req,res){
        db.User.findOne({username:req.body.username},function(err,user){
            if(user){
                res.json(null);
                return;
            }else{
                var newUser = new db.User();
                newUser.username = req.body.username.toLowerCase();
                newUser.password = newUser.generateHash(req.body.password);
                newUser.firstName = req.body.first_name;
                newUser.lastName = req.body.last_name;
                newUser.email = req.body.email;

                newUser.save(function(err,user){
                    req.login(user, function(err) {
                        if (err) {
                            return next(err);
                        }
                        res.json(user);
                    });
                });
            }
        });

    });
   
    app.get('/auth/facebook', function authenticateFacebook (req, res, next) {
            req.session.returnTo = '/#' + req.query.returnTo;
            next ();
        },
        passport.authenticate ('facebook'));

    app.get('/auth/facebook/callback', function (req, res, next) {
        var authenticator = passport.authenticate ('facebook', {
            successRedirect: req.session.returnTo,
            failureRedirect: '/'
        });

        delete req.session.returnTo;
        authenticator (req, res, next);
    });
};