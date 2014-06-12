   this.from=me.id;
   this.createDate=new Date().getTime(); 

// check the default notification setting,if email=true, then send email to the user

    // get to user email address
    dpd.users.get(this.to,function(user){
       if(user.emailNotify){
           var emailMsg=this.message+"此消息由"+me.realname+"通过积致网发出"+"<br>回复此消息请点击此连接http://www.jiizhi.com/messages/inbox/";
         dpd.email.post({from:'积致<no-reply@jiizhi.com>',to:user.email,subject:this.subject,html:emailMsg,text:emailMsg});
       }
    });
    
emit('messages:create',this);
dpd.activities.post({action:'message',entity:this.id});