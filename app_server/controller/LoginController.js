var user = require('../models/user');
module.exports.login =function(req,res){
    res.render('login'); // render login.ejs bulunur. path yazmaya gerek yok next yazmayada gerek yok
    
}

module.exports.loginPost = function(req,res){
    
    console.log(req.body);
    console.log(req.body.username);
    res.render('login',{
        username:req.body.username,
        password:req.body.password

    }); // render login.ejs bulunur. path yazmaya gerek yok next yazmayada gerek yok    
}

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
   
    
} 