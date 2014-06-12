// check if project exsit
dpd.projects.get(this.container,function(result,err){
  if(result){
      this.createDate=new Date().getTime();
      this.status=0;
      this.owner=me.id;
      console.log('me',me);
      // notify the project owner
       dpd.users.get(result.owner,function(user){
           var link="http://127.0.0.1:5011/project/setting/"+this.container+"/apply";
           var emailMsg=this.message+"This message"+me.username+"Issued by the coIdea network"+"<br>Please click for details:<a href='"+link+"'>"+link+"</a>";
           dpd.email.post({from:'<no-reply@jiizhi.com>',to:user.email,subject:'coIdea join request',html:emailMsg,text:emailMsg});
       });
      console.log(2,this)
      dpd.activities.post({action:'applyTeam',entity:this.id,container:this.container});
  }
});
