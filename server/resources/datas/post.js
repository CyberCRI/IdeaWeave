console.log('data !!!',parts)
var type=parts[0];
  // check if user account exsit
   hashCode=function(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);   
    };
 function updateNotify(uid,eid,type){
     switch(type){
         case 'users':
      // add activity
       dpd.activities.post({action:'followUser',entity:eid});
       // notify container
      dpd.unotifys.post({uid:eid,entity:uid,type:'followUser'});
 
          break;
        case "challenges":
        // add numbers to follow
        dpd.challenges.put(eid,{follow:{$inc:1}});
        dpd.activities.post({action:'followChallenge',entity:eid});
         break;
        case "projects":
        dpd.activities.post({action:'followProject',entity:eid});
        
        break;       
    }
 }
 
 function unfollowUpdate(eid,type){
   switch(type){
         case 'users':
      // add activity
       dpd.activities.post({action:'unfollowUser',entity:eid});
          break;
        case "challenges":
        dpd.activities.post({action:'unfollowChallenge',entity:eid});
         dpd.challenges.put(eid,{follow:{$inc:-1}});
         break;
        case "projects":
        dpd.activities.post({action:'unfollowProject',entity:eid});
        break;       
    }
 }
 
 switch(type){
     case 'project':
      var pid=parts[1];
      dpd.projects.get(pid,function(result,err){
         if(!result.isMember){
             dpd.projects.put(pid,{visit:{$inc:1}});
         }
      });
    break;
    case 'unfollow':
    var eid=parts[2];
    var type=parts[1];
    dpd.users.me(function(me,err){
    if(err) setResult({error:err});
      dpd.followers.get({eid:eid,type:type},function(data,err){
          if(err) setResult({error:err});
          if(data.length>0){
              dpd.followers.put(data[0].id,{users:{$pull:me.id},count : {$inc : -1}},function(result,err2){
                if(err2){
                  setResult({error:err2});
                }else{
                   unfollowUpdate(eid,type);
                  setResult({success:'ok'});    
                }
              });
          }else{
              setResult({error:'Concerned about the success! Cool increased by 2 points....'});
          }
      });
    });
    
    break;
    case 'follow':
    var eid=parts[2];
    var type=parts[1];
               //check if he is himself
     dpd.users.me(function(me,err){
       if(err) setResult({error:err});
             dpd.followers.get({eid:eid,type:type},function(data,err){
              if(err) setResult({error:err});
              if(data.length>0){
                  // check if duplicate
                  if(data[0].users.indexOf(me.id)!==-1){
                      setResult({error:'Have been concerned about it!'});
                  }else{
                        dpd.followers.put(data[0].id,{users:{$push:me.id},count:{$inc:1},type:type},function(result,err){
                            if(err) setResult({error:err});
                            // notify
                            updateNotify(me.id,eid,type);
                            if(result)  setResult({success:'ok'});
                        }); 
                  } 
              }else{
                  dpd.followers.post({eid:eid,users:[me.id],count:1,type:type},function(result,err){
                    if(err) setResult({error:err});
                     updateNotify(me.id,eid,type);
                     if(result)  setResult({success:'ok'});
                  });
              }
            });
    });
    break;
    case 'resetPass':
    var email=parts[1];
    // check if value it's email
    var search_str = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
    if(!search_str.test(email)){
        setResult({error:'invalid email'});
    }
    dpd.users.get({email:email},function(data,err){
        if(data.length>0){
            // notify user the hash code
            var hash=-hashCode(data[0].email);
           
        var message="Hello your username is "+data.username+". You asked to reset the password , if not for you, please ignore this message. Verification code below:"+hash;
        dpd.email.post({from:'IdeaStorm<no-reply@jiizhi.com>',to:data[0].email,subject:'account password reset',html:message,text:message},function(){
          setResult('ok');
        });  
        }else{
           setResult({error:'This e-mail address does not exist'});
        }
        
    });
    break;
    case 'reset':
        // check hash code 
        if(hashCode(body.email)==-body.token){
            // update password
            dpd.users.get({email:body.checkEmail},function(data){
               
               if(data.length>0){
                    
                   dpd.users.put(data[0].id,{password:body.password},function(data2,err){
                      if(err) setResult({error:'Update failed, please try again later or contact administrator.'});
                       setResult('ok');
                   });
               }
            });
        }else{
            setResult({error:'Verification code is incorrect.'});
        }
      
    break;
    case 'joinTeam':
        if(!me){
            cancel('no permission',401);
        }else{
            console.log('part',parts[1]);
            dpd.invites.get(parts[1],function(result,err){
                console.log('result',result);
                if(result.friend==me.email){
                    dpd.projects.put(result.pid,{member:{$push:me.id},context:'team'},function(result,err){
                      if(err) error('project',err);
                      setResult(result);
                    });
                }
            });
        }     
    break;
    
 }
