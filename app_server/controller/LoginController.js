var user = require('../models/user');

module.exports.login =function(req,res){
    res.render('login'); // render login.ejs bulunur. path yazmaya gerek yok next yazmayada gerek yok

}

module.exports.loginPost = function(req, res, next){

    console.log(req.body);
    console.log("------------->login post içerisindeyiz!");
    //console.log(req.body.username);

    // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  // eğerki tüm alanlar yollanırsa bir kayıt olma işlemi olur
  if (req.body.email &&
    req.body.userName &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    user.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        console.log(req.session);
        
        console.log("session ataması");
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    console.log('Bu bir authenticate işlemi');
    user.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        
        console.log("user.id =>"+user._id);
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

    /* 
    console.log(req.body);
    console.log(req.body.username);
    res.render('login',{
        username:req.body.username,
        password:req.body.password

    }); // render login.ejs bulunur. path yazmaya gerek yok next yazmayada gerek yok    
    */
}
// GET route after registering
module.exports.getProfile=function (req, res, next) {
    user.findById(req.session.userId)
    .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            console.log
            return res.send('<h1>Name: </h1>' + user.userName + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          }
        }
      });
  };

  // GET for logout logout
module.exports.logout=function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  };
/*
module.exports.signupGet =function(req,res){
    res.render('signup'); // render login.ejs bulunur. path yazmaya gerek yok next yazmayada gerek yok
}
module.exports.signupPost =function(req,res){

    var newUser = new user({
        userName:req.body.userName,
        mail:req.body.userMail,
        password:req.body.password
    
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('usersList');
        }
    });
    
}

module.exports.usersList =function(req,res){    
    user.find(function(err,results){
        res.render('usersList',{users:results});
    
    });
} 

module.exports.userRemove =function(req,res){    
  
    user.findOneAndRemove({ userName: req.params.userName},function(err){
        if(err){
            console.log('hata');
        }
        res.redirect('/login/usersList');
    });
   
    
} */