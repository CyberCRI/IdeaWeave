if(query.value == 'following'){
    dpd.followers.get({users:{$in:[query.uid]},type:'users'},function(data){
        var users = [];
        for(var i in data){
            users.push(data[i].eid);
        }
        setResult(users);
    });
}