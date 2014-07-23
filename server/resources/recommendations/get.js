var userId = parts[1]

function uniqueObject(arr){
    var unique = {},
        result = [];
    arr.forEach(function(item) {
        if (!unique[item.id]) {
            result.push(item);
            unique[item.id] = item;
        }
    });
    return result;
}

switch(parts[0]){
    case 'user':
        function getRecommandation(data,following,result,cb){
            var i = 0;
            data.tags.forEach(function(tag,k) {
                console.log('tag', tag);
                dpd.users.get({tags: {$regex: tag + ".*", $options: 'i'}}, function (users, err) {
                    users.forEach(function (user) {
                        console.log('user', user.id)
                        if (user.id != userId) {
                            var isFollowing = false;
                            following.forEach(function (v) {
                                console.log('following test', v.eid, user.id);
                                if (v.eid == user.id) {
                                    isFollowing = true
                                }
                            });
                            i = i+1
                            if (!isFollowing) {
                                console.log('new user');
                                result.push(user);
                            }
                        }
                        console.log(i,data.tags.length,result.length)
                        if(i == data.tags.length -1){
                            cb();
                        }
                    });

                })

            })
        };

         dpd.users.get({ id : userId},function(data){
            var result = [],
                following = [];
            dpd.followers.get({users:{$in:[userId]},type:'users'},function(follow){
                console.log('followingr',follow);
                if(follow){
                    following = follow;
                }
                getRecommandation(data,following,result,function(){
                    console.log('the end !!!',data.tags.length);
                    console.log('size result',result.length);
                    setResult(uniqueObject(result));

                })


            });
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
                                        var isFollow = false
                                        follow[0].users.forEach(function(v,k){
                                            if(v == me.id){
                                                isFollow = true;
                                            }
                                        });
                                        if(!isFollow){
                                            dpd.challenges.get({ id : challenge.id },function(data){
                                                result.push(data);
                                                if(k == challenges.length - 1 ){
                                                    setResult(uniqueObject(result));
                                                }
                                            })
                                        }
                                    }else{
                                        dpd.challenges.get({ id : challenge.id },function(data){
                                            result.push(data);
                                            if(k == challenges.length - 1 ){
                                                setResult(uniqueObject(result));
                                            }
                                        })
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

                                    dpd.projects.get({ id : project.id },function(data){
                                        result.push(data);
                                        if(k == projects.length - 1 ){
                                           setResult(uniqueObject(result));
                                        }
                                    })


                                }else{
                                    dpd.projects.get({ id : project.id },function(data){
                                        result.push(data);
                                        if(k == projects.length - 1 ){
                                           setResult(uniqueObject(result));
                                        }
                                    }) 
                                }

                            })
                            if(k == projects.length - 1){
                                setResult(uniqueObject(result));
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