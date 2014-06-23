function updateApplyTeamNum(){
dpd.projects.get(function(datas,err){
	var count=0;
	for(var i in datas){
		// get applyTeam
		updateApplyTeam(datas[i].id,function(){
			count++
		    if(count==datas.length){
		    		console.log('ok');
		    }
		})
	    
	}
})

}

function updateApplyTeam(pid,callback){
	dpd.applyteams.get({container:pid},function(datas,err){
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
	         	console.log(pid,'applyTeamNum',num);
	           dpd.projectscores.put(data2[0].id,{applyTeamNum:num},callback); 	
	         }
	    })
}
// run update
updateApplyTeamNum();