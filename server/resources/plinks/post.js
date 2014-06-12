if(!me){
    //this.owner=0;
    cancel('no permission',401);
}else{
    this.owner=me.id;
}
// check if already post
dpd.plinks.get({title:this.title},function(data,err){
 if(data.length>0) cancel('已经创建过啦',401);
});

this.createDate=new Date().getTime();
dpd.activities.post({action:'createPlink',entity:this.id,container:this.container});
//notify project owner and member 
function getUnique(array){
     var uniqueArray = array.filter(function(elem, pos, self) {
      return self.indexOf(elem) == pos;
     });
      return uniqueArray;
}
dpd.projects.get(this.container,function(data,err){
    if(data){
        var users=[];
        users[0]=data.owner;
        users=users.concat(data.member);
      // get fans
     dpd.followers.get({type:'projects',eid:this.container},function(result,err){
       if(result[0]) users=users.concat(result[0].users); 
          // delete dulplicate
          users=getUnique(users);
          for(var i in users){
             dpd.unotifys.post({uid:users[i],type:'createPlink',entity:this.id}); 
          }
     });
    }
});