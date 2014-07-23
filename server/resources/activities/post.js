this.createDate=new Date().getTime();
this.owner=me.id;
switch(this.action){
    case "followUser":
    // update user score
   dpd.users.put(me.id,{score:{$inc:1}});
    break;
    case "unfollowUser":
    // update user score
    dpd.users.put(me.id,{score:{$inc:-1}});
    break;
    case "followProject":
          // update project score
        dpd.projectscores.get({pid:this.entity},function(data,err){
          if(data.length>0){
            dpd.projectscores.put(data[0].id,{followerNum:{$inc:1}});      
          }
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:2}});
    break;
    case "unfollowProject":
          // update project score
        dpd.projectscores.get({pid:this.entity},function(data,err){
          if(data.length>0){
            dpd.projectscores.put(data[0].id,{followerNum:{$inc:-1}});      
          }
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:-2}});
    break;
    case "followChallenge":
         // update user score
        dpd.users.put(me.id,{score:{$inc:5}});
        
    break;
    case "unfollowChallenge":
         // update user score
        dpd.users.put(me.id,{score:{$inc:-5}});
        
    break;
    case "createProject":
        // post project score
        dpd.projectscores.post({pid:this.entity});
         // update user score
        dpd.users.put(me.id,{score:{$inc:20}});
        
    break;
    case "createPtopic":
        // update project score
        dpd.projectscores.get({pid:this.container},function(data,err){
          if(data.length>0){
            dpd.projectscores.put(data[0].id,{topicNum:{$inc:1}});      
          }
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:10}});
    break;
    case "createPlink":
         // update project score
        dpd.projectscores.get({pid:this.container},function(data,err){
          if(data.length>0){
            dpd.projectscores.put(data[0].id,{linkNum:{$inc:1}});      
          }
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:10}});
    break;
    case "applyTeam":
          // update project score
        dpd.projectscores.get({pid:this.container},function(data,err){
          if(data.length>0){
            dpd.projectscores.put(data[0].id,{applyTeamNum:{$inc:1}});      
          }
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:5}});
    break;
    case "commentPtopic":
        // get project id
        dpd.pforums.get({container:this.container},function(project,err){
            // update project score
            dpd.projectscores.get({pid:project.id},function(data,err){
              if(data.length>0){
                dpd.projectscores.put(data[0].id,{commentNum:{$inc:1}});      
              }
            });
        });
         // update user score
        dpd.users.put(me.id,{score:{$inc:5}});
    break;
    case "feedback":
        
    break;
}
// emit this
emit('activities:create',this);