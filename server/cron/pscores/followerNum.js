function updateFollowerNum(){
dpd.projects.get(function(datas,err){
	var count=0;
	for(var i in datas){
		// get follower
		updateFollower(datas[i].id,function(){
			count++
		    if(count==datas.length){
		    		console.log('ok');
		    }
		})
	    
	}
})

}

function updateFollower(pid,callback){
	dpd.followers.get({eid:pid,type:'projects'},function(datas,err){
		if(datas.length>0){
			update(pid,datas[0].count,callback);
		}else{
			callback();
		}
	})
}

function update(pid,num,callback){
	 dpd.projectscores.get({pid:pid},function(data2){
	         if(data2.length>0){
	         	console.log(pid,'followerNum',num);
	           dpd.projectscores.put(data2[0].id,{followerNum:num},callback); 	
	         }
	    })
}
// run update
updateFollowerNum();