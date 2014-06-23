function updateTeamNum(){
dpd.projects.get(function(datas,err){
	var count=0;
	for(var i in datas){
	    update(datas[i].id,datas[i].member.length,function(){
	    	count++
	    	if(count==datas.length){
	    		console.log('ok');
	    	}
	    })
	}
})

}

function update(pid,num,callback){
	 dpd.projectscores.get({pid:pid},function(data2){
	         if(data2.length>0){
	         	console.log(pid,'teamNum',num);
	           dpd.projectscores.put(data2[0].id,{teamNum:num},callback); 	
	         }
	    })
}
// run update
updateTeamNum();