// check if the user is login
if(!me){
    cancel('没有权限',401);
}
// check if the user has create project
this.user=me.id;
this.createDate=new Date().getTime();
dpd.users.get({id:me.id,context:'iconBlock'},function(data){
    var username=data.realname;
    var invitelink="http://localhost:5010/project/"+this.pid+"/join/"+this.id;
    // check if it's come from project
    var message;
    if(this.pid){
            dpd.projects.get(this.pid,function(result,err){
            message=this.message+"<br>Join the team, please click the link below：<br><a href='"+invitelink+"'>"+invitelink+"</a>"+"<br>Please do not reply</br>";
            dpd.email.post({from:'IdeaStorm<no-reply@ideastorm.com>',to:this.friend,subject:this.subject,html:message,text:message});
        });
  }/*else{
       message=this.message+"<br>接受邀请请点击<a href='"+invitelink+"'>"+invitelink+"</a><br>本邀请邮件是由<b>"+username+"</b>通过积致网发送给你。<br>Please do not reply this email.</br>";
      dpd.email.post({from:'积致<no-reply@jiizhi.com>',to:this.friend,subject:this.subject,html:message,text:message});
  }*/
});