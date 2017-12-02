(function($) {
    
      var self = {
        id: null,
        partnerId: null,
        username: 'User_'+Math.random().toString(36).substring(4,8)
      };
      
      // daha sonra kullanmak üzere DOM öğelerini sakla
      var elMessages = $('#messages_container');
      var elUsers = $('#user_container');
      var elText = $('#message');
      var btnSend = $('#send_btn');
    
      // olay dinleyicilerini bağla
      btnSend.on('click', function() {
        var text = elText.val().trim();
        if(text){
          elText.val('');
          // webRTC, P2P mesajı göndermesine izin verdiği gibi, iş ortağına gönderir
          // sunucu ile etkileşim kurmadan
          easyrtc.sendPeerMessage(self.partnerId, 'send_peer_msg', text);
          // kullanıcıya ileti ekleyin
          addMessage(text, self.id);
        }
      });
      
      $('#next_btn').on('click', function() {
        hangupCall();
        addMessage('searching...');
        easyrtc.webSocket.emit('next_user');
      });
      
      $('#stop_btn').on('click', hangupCall);
      
      $('#clear_btn').on('click', function() {
        elMessages.html('');
      });
    
    
      // önemli olayları işlemek
      elText.on('keypress', function(e) {
        if (e.keyCode == 13 && !e.shiftKey && !btnSend.hasClass('disabled')) {
          btnSend.trigger('click');
          return false;
        }
      });
    
      // gönderici üzerinde tetiklenecek Mesaj () çağrısı
      easyrtc.setPeerListener( function(senderId, msgType, msgData, targeting) {
        if( msgType === 'send_peer_msg' ) {
          addMessage(msgData, senderId);
        } else if(msgType === 'send_peer_disconnect') {
          disconnectMeFromPartner();
        }
      });
    
      // iş ortağı video akışını elde edin - başarılı bir şekilde çağrıldığında tetiklenir
      easyrtc.setStreamAcceptor( function(callerId, stream) {
        var video = document.getElementById('partnerVideo');
        easyrtc.setVideoObjectSrc(video,stream);
      });
      
      // Hangout çağrısında tetiklenen ortak video akışını almak için durun
      easyrtc.setOnStreamClosed( function (callerId) {
        var video = document.getElementById('partnerVideo');
        easyrtc.setVideoObjectSrc(video, '');
      });
      
      function connect() {
        //easyrtc.enableDebug(true);
    
        easyrtc.setUsername(self.username);
        easyrtc.initMediaSource(
          // başarı geribildirimi
          function() {
            // kullanıcıya kendi video ayarla
            var selfVideo = document.getElementById('selfVideo');
            easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
          },
          // failure callback
          function(errorCode, errmesg) {
            console.error('Failed to get your media: '+ errmesg);
          }
        );
        
        easyrtc.connect('enlargify_app',
          // success callback
          function(socketId) {
            self.id = socketId;
    
            // event listener aktif kullanıcı listesini güncellemesi
            easyrtc.webSocket.on('ui_user_add', function(userData) {
              elUsers.append('<div id='+userData.id+'>'+userData.name+'</div>');
            });
            easyrtc.webSocket.on('ui_user_remove', function(userId) {
              elUsers.find('#'+userId).remove();
            });
            easyrtc.webSocket.on('ui_user_set', function(userList) {
              for (id in userList) {
                elUsers.append('<div id='+userList[id].id+'>'+userList[id].name+'</div>');
              }
            });
     
    
            easyrtc.webSocket.on('connect_partner', function(user) {
              if(user.caller){
                performCall(user.partnerId);
              } else {
                connectMeToPartner(user.partnerId);
              }
            });
            easyrtc.webSocket.on('disconnect_partner', function(partnerId){
              // yine aynı kullanıcıya bağlı olup olmadığını kontrol eder
              if(partnerId == self.partnerId){
                disconnectMeFromPartner();
              }
            });
    
            // yeni kullanıcı için sunucu tarafında gerekli güncellemeleri yapın
            easyrtc.webSocket.emit('init_user', {'name':self.username});
          },
          // failure callback
          function(errCode, message) {
            console.error('Failed to connect to the server: '+ message);
          }
        );
      }
    
      function addMessage(text, senderId) {
        // Html özel karakterlerinden kaçının, ardından satır beslemeleri ekleyin.
        var content = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />');
        if(!senderId) {
          // no sender, informative message only
          elMessages.append('<div><b>' + content + '</b></div>');
        } else {
          elMessages.append('<div>' + (senderId == self.id ? '<b>Me: </b>' : '<b>Stranger: </b>') + content + '</div>');
        }
      }
    
      function performCall(id) {
        connectMeToPartner(id);
        
        // gerekirse bu işlevleri doldurun
        var successCB = function() {};
        var failureCB = function() {
          // başarısızlık durumunda iş ortağını sıfırlayın
          disconnectMeFromPartner();
        };
        var acceptedCB = function(isAccepted, callerId) {};
        easyrtc.call(self.partnerId, successCB, failureCB, acceptedCB);
      }
    
      // çağrıyı otomatik kabul et
      easyrtc.setAcceptChecker(function(callerId, callback) {
        //callback(callerId == self.partnerId);
        callback(true);
      });
      
      function hangupCall() {
        if(self.partnerId) {
          // her iki kullanıcıyı da bağlantısını kestiler
          easyrtc.sendPeerMessage(self.partnerId, 'send_peer_disconnect', 'Disconnected');
          disconnectMeFromPartner();
        }
        easyrtc.hangupAll();
      }
    
      function connectMeToPartner(id) {
        addMessage('Connected');
        // set the partner
        self.partnerId = id;
        // enable the button to allow sending messages
        btnSend.removeClass('disabled');
      }
    
      function disconnectMeFromPartner() {
        addMessage('Disconnected');
        // reset the partner
        self.partnerId = null;
        // disable the button
        btnSend.addClass('disabled');
      }
    
      // start the process
      connect();
    }(jQuery));