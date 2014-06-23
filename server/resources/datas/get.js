
function uniqueObject(arr){
      var o={},i,j,r=[];
      for(var i=0;i<arr.length;i++) o[arr[i]['id']]=arr[i];
      for(var j in o) r.push(o[j])
      return r
}
switch(parts[0]){
    case 'activity':
    var uid=parts[1]; 
    var limit=parts[2];
    var skip=parts[3];
    // get follower's activity
    function getFollowers(uid,callback){
      dpd.followers.get({eid:uid},function(data,err){
        if(data.length>0){
         callback(data[0].users);    
        }else{
          callback('');
        }
      });
    }
    function getActivity(uid,callback){
        getFollowers(uid,function(data){
          if(data.length>0){
              dpd.activities.get({owner:{$in:data},$limit:limit,$sort:{createDate:-1},context:'list',$skip:skip,action:{$in:['followChallenge','followProject','createProject','createPtopic','createPlink','commentPtopic']}},function(data,err){
                callback(data);
              });
          }else{
              callback('');
          }
        });
    }
    getActivity(uid,setResult);
    break;
    case 'conChallenges':
     var uid=parts[1];
        // get project that he created
     dpd.projects.get({owner:uid,context:''},function(result){
        if(result.length>0){
            var carr=[];
            for(var i in result){
                carr[i]=(result[i].container);
            }
            dpd.challenges.get({id:{$in:carr},$sort:{follow:-1},context:'list'},function(datas){
             setResult(datas);
            });
        }else{
            setResult('');
        }
     });
    break;
    case 'fChallenges':
           var uid=parts[1];
        dpd.followers.get({users:{$in:[uid]},type:'challenges'},function(datas,err){
            console.log('fChallenges',datas)
             if(datas.length>0){
              var fpids=[];
              for(var i in datas){
                fpids[i]=datas[i].eid;
              }
              dpd.challenges.get({id:{$in:fpids},$sort:{score:-1,createDate:-1},context:'list'},setResult);
             }else{
                 setResult('');
             }
        });
    break;
    case 'conProjects':
         var uid=parts[1];
     // projects that i post topic or post links
             function getPidsfromOj(data){
                    var pids=[];
                  if(data&&data.length>0){
                    for(var i in data){
                      pids[i]=data[i].container;
                    }
                  }
                  return pids;
             }
           function getCProjects(uid,pids,callback){
              var subcount=0;
              var result=[];
               dpd.projects.get({member:{$in:[uid]},owner:{$ne:uid},$sort:{score:-1,createDate:-1},context:'list'},function(data,err){
                  finalCallback(data,callback);
               });
               dpd.projects.get({id:{$in:pids},owner:{$ne:uid},context:'list'},function(data,err){
                  finalCallback(data,callback);
               });
                function finalCallback(data,callback){
                      subcount++;
                      result=result.concat(data);
                      // delete dulplicate
                      result=uniqueObject(result);
                      if(subcount==2){
                        callback(result);
                      }
                }
           }
           
          function getConProjects(uid,callback){
              var count=0;
              var pids=[];
            dpd.pforums.get({owner:uid},function(data,err){
                scallback(getPidsfromOj(data),callback); 
            });
            dpd.plinks.get({owner:uid},function(data,err){
               scallback(getPidsfromOj(data),callback); 
            })
            function scallback(data,callback){
               count++;
                pids=pids.concat(data);
                if(count==2){
                  getCProjects(uid,pids,callback);
                }
             }
          }
          
          // set result;
          getConProjects(uid,setResult);
    break;
    case 'fProjects':
          var uid=parts[1];
        // get projets that i follow
        dpd.followers.get({users:{$in:[uid]},type:'project'},function(datas,err){
             if(datas.length>0){
              var fpids=[];
              for(var i in datas){
                fpids[i]=datas[i].eid;
              }
              dpd.projects.get({id:{$in:fpids},$sort:{score:-1,createDate:-1},context:'list'},setResult);
             }else{
                 setResult('');
             }
        });
    break;
    case 'searchTag':
        var tag=parts[1];
        // delete whitespace
        tag=tag.replace(/%20/g," ");
       
        //get users
        function searchUsers(tag,callback){
             //search by tag
             dpd.users.get({tags:{$regex:tag+".*",$options: 'i'},context:'userBlock'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
             // search by username
             dpd.users.get({username:{$regex:tag+".*",$options: 'i'},context:'userBlock'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
              // search by realname
             dpd.users.get({realname:{$regex:tag+".*",$options: 'i'},context:'userBlock'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
        }
        function searchProjects(tag,callback){
             //search by tag
             dpd.projects.get({tags:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
             // search by title
             dpd.projects.get({title:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
              // search by brief
             dpd.projects.get({brief:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
                if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
        }
        function searchChallenges(tag,callback){
             //search by tag
             dpd.challenges.get({tags:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
               if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
             // search by title
             dpd.challenges.get({title:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
               if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
              // search by brief
             dpd.challenges.get({brief:{$regex:tag+".*",$options: 'i'},context:'feed'},function(result,err){
               if(result.length>0){
                 callback(result);
               }else{
                  callback();
               }
             });
        }
      
        function getOjByTag(tag,callback){
            // search users with same tag
            var ucount=0;
            var uusers=[];
            searchUsers(tag,function(datas){ 
                ucount++;
             if(datas&&datas.length>0){
                 uusers=uusers.concat(datas);
             }
             if(ucount==3){
                 uusers=uniqueObject(uusers);
                 callback({users:uusers});
             }
            });
            var pcount=0;
            var projects=[];
            searchProjects(tag,function(datas){
                pcount++;
             if(datas&&datas.length>0){
                 projects=projects.concat(datas);
             }
             if(pcount==3){
                 projects=uniqueObject(projects);
                 callback({projects:projects});
             }
            });
            
            var ccount=0;
            var challenges=[];
             searchChallenges(tag,function(datas){
                ccount++;
             if(datas&&datas.length>0){
                 challenges=challenges.concat(datas);
             }
             if(ccount==3){
                challenges=uniqueObject(challenges);  
                 callback({challenges:challenges});
             }
            });
        };
        var count=0;
        var result={};
        console.log(tag);
        getOjByTag(tag,function(data){
           count++;
           if(data.users){
               result.users=data.users;
           }
           if(data.projects){
               result.projects=data.projects;
           }
           if(data.challenges){
               result.challenges=data.challenges;
           }
           if(count==3){
             setResult(result);  
           };
        });
    break;
    
}
