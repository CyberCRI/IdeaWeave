var userId = parts[1]


function inArray(value,array){
    if(typeof value=="string"){
        var len=array.length;
        for(var i=0;i<len;i++){
            if(value===array[i]){
                return true;
            }
        }
    }
    return false;
}

switch(parts[0]){
    case 'user':
        dpd.users.get({ id : userId},function(data){
            var result = [];
            data.tags.forEach(function(tag){
                dpd.users.get({tags:{$regex:tag+".*",$options: 'i'}},function(users,err){
                    users.forEach(function(user,k){
                        dpd.followers.get({eid : user.id},function(follow){
                            if(follow[0]){
                                if(!inArray(data.id,follow[0].users)){
                                    if(!inArray(user.id,result)){
                                        result.push(user.id);
                                    }
                                }

                            }else{
                                if(data.id != user.id) {
                                    result.push(user.id);
                                }
                            }

                        })
                        if(k == users.length - 1){
                            setResult(result);
                        }
                    });
                })
            })
        });
        break;
    case 'challenge':
        dpd.users.get({ id : userId},function(user){
            var result = [];
            if(user.tags){
                user.tags.forEach(function(tag){
                    dpd.challenges.get({tags:{$regex:tag+".*",$options: 'i'}},function(challenges,err){
                        if(challenges){
                            challenges.forEach(function(challenge,k){
                                dpd.followers.get({eid : challenge.id},function(follow,key){
                                    if(follow[0]){
                                        if(!inArray(user.id,follow[0].users)){
                                            if(!inArray(challenge.id,result)){
                                                dpd.challenges.get({ id : challenge.id },function(data){
                                                    result.push(data);
                                                    if(k == challenges.length - 1 ){
                                                       setResult(result);
                                                    }
                                                })
                                            }
                                        }
                                    }else{
                                        dpd.challenges.get({ id : challenge.id },function(data){
                                            result.push(data);
                                        })   
                                        if(k == challenges.length - 1 ){
                                           setResult(result);
                                        }
                                    }

                                });

                            })
                        }
                    })
                })
            }
        });
        break;
    case 'project':
        dpd.users.get({ id : userId},function(user){
            var result = [];
            user.tags.forEach(function(tag){
                dpd.projects.get({tags:{$regex:tag+".*",$options: 'i'}},function(projects,err){
                    if(projects){
                        projects.forEach(function(project,k){
                            dpd.followers.get({eid : project.id},function(follow){
                                if(follow[0]){
                                    if(!inArray(user.id,follow[0].users)){
                                        if(!inArray(project.id,result)){
                                            dpd.projects.get({ id : project.id },function(data){
                                                result.push(data);
                                                if(k == projects.length - 1 ){
                                                   setResult(result);
                                                }
                                            })
                                        }
                                    }

                                }else{
                                    dpd.projects.get({ id : project.id },function(data){
                                        result.push(data);
                                        if(k == projects.length - 1 ){
                                           setResult(result);
                                        }
                                    }) 
                                }

                            })
                            if(k == projects.length - 1){
                                setResult(result);
                            }

                        })
                    }
                })
            })
        });
        break;
    default:

        break;
}