

var path=require('path');
/**
 *  Yapıcı fonksiyonu parametre alabilir
 */
module.exports= function(parametreStringi)
{
    console.log("Bu modül çağrılmıştır "+ parametreStringi)
}
module.exports.index =  function(request,response){
    console.log(request.message);
    console.log("index get");
    response.sendFile(path.join(__dirname,'../../index.html'));
};
module.exports.chat  =  function(request,response){ 
    console.log("chat get");
    response.sendFile(path.join(__dirname,'../../chat.html'));
};

module.exports.room  =  function(request,response){ 

    console.log("room get");

    var series= ['------','------','-----'];
    
    response.render('room',{mesaj : 'Controllerdan rooma bağlantı', 
    dizi: series
    });
};

