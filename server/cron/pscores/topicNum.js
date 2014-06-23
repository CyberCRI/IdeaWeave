function updateTopicNum(){
dpd.projects.get(function(datas,err){
	var count=0;
	for(var i in datas){
		// get topic
		updateTopic(datas[i].id,function(){
			count++
		    if(count==datas.length){
		    		console.log('ok');
		    }
		})
	    
	}
})

}

function updateTopic(pid,callback){
	dpd.pforums.get({container:pid},function(datas,err){
		if(datas.length>0){
			update(pid,datas.length,callback);
		}else{
			callback();
		}
	})
}

function update(pid,num,callback){
	 dpd.projectscores.get({pid:pid},function(data2){
	         if(data2.length>0){
	         	console.log(pid,'topicNum',num);
	           dpd.projectscores.put(data2[0].id,{topicNum:num},callback); 	
	         }
	    })
}
// run update
updateTopicNum();