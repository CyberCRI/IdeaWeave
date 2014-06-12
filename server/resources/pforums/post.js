if(!me){
   // set owner as anomynours
  //this.owner={id:0,username:'Anonymous'};
  cancel('No permission',401);
}
// check if already post
dpd.pforums.get({id:this.id},function(data,err){
    if(data){
        if(data[0]){
            console.log('1 ',data);
            cancel('Already created it',401);   
        }
    }
});
dpd.projects.get({ id :  this.container},function(result){
    if(!result){
        console.log('2 ',result);
        cancel('No idea',401);
    } 
    

    
    this.owner=me.id;
    this.createDate=new Date().getTime();
    
    dpd.activities.post({action:'createPtopic',entity:this.id,container:this.container});
});

//notify project owner and member  and fans
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
             dpd.unotifys.post({uid:users[i],type:'createPforum',entity:this.id}); 
          }
     });
    }
});