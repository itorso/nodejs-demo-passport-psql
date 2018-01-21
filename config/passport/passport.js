const bCrypt = require('bcrypt-nodejs');

module.exports = (passport,user) => {

  let User = user;
  let LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });


  //used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      user ? done(null, user.get()) : done(user.errors,null);
    });
  });


  //strategy for registration
  passport.use('local-signup', new LocalStrategy({         
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {

    let generateHash = (password) => {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    //@todo validazione indirizzo eth
    User.findOne({where: {email:email}}).then((user) => {

      if(user){
        return done(null, false, {message : 'That email is already taken'} );
      } else {

        let data = { 
          email: email,
          password: generateHash(password)
        };

        User.create(data).then((newUser,created) => {
          return newUser ? done(null,newUser) : done(null,false);
        });
      }

    });
  }));

  //strategy for login 
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {

      let User = user;

      let isValidPassword = function(userpass,password){
        return bCrypt.compareSync(password, userpass);
      }

      User.findOne({ where : { email: email}}).then(function (user) {

        if (!user || !isValidPassword(user.password,password)) {
          return done(null, false, { message: 'Incorrect credentials.' });
        }

        let userinfo = user.get();
        return done(null,userinfo);

  }).catch(function(err){
      console.log("Error:",err);
      return done(null, false, { message: 'Something went wrong with your Signin' });
    });

  }));

}

