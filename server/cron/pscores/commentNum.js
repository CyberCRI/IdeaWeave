function updateCommentNum(){
dpd.projects.get(function(datas,err){
	var count=0;
	for(var i in datas){
		// get comment
		updateComment(datas[i].id,function(){
			count++
		    if(count==datas.length){
		    		console.log('ok');
		    }
		})
	    
	}
})

}
function getTopics(pid,callback){
	dpd.pforums.get({container:pid},function(datas,err){
		if(datas.length>0){
		 var tid=[];
		 for(var i in datas){
		 	tid[i]=datas[i].id;
		 }
		 callback(tid);
		}else{
			callback();
		}
	})
}

function updateComment(pid,callback){
  getTopics(pid,function(tids){
  	if(tids!==undefined){
	  	dpd.comments.get({container:{$in:tids}},function(datas,err){
			if(datas.length>0){
				update(pid,datas.length,callback);
			}else{
				callback();
			}
		})		
  	}
  
  })
	
}

function update(pid,num,callback){
	 dpd.projectscores.get({pid:pid},function(data2){
	         if(data2.length>0){
	         	console.log(pid,'commentNum',num);
	           dpd.projectscores.put(data2[0].id,{commentNum:num},callback); 	
	         }
	    })
}
// run update
updateCommentNum();