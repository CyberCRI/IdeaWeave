dpd.activities.get(function(datas,err){
	if(datas.length>0){
		var count=0;
		var num;
       for(var i in datas){
       	 switch(datas[i].action){
       	 	case 'followUser':
       	 	   num=1;
       	 	break;
       	 	case 'followProject':
       	 	   num=2;
       	 	break;
       	 	case 'followChallenge':
       	 	    num=5;
       	 	break;
       	 	case 'createProject':
       	 	    num=20;
       	 	break;
       	 	case 'createPtopic':
       	 	    num=10;
       	 	break;
       	 	case 'createPlink':
       	 	    num=10;
       	 	break;
       	 	default:
       	 	num=0;
       	 }
       	 if(num!==0){
          	 add_score(datas[i].owner,num,datas[i].action+'-'+datas[i].entity,function(){
       	 	  	count++;
       	 	  	if(count==datas.length){
       	 	  		console.log('done');
       	 	  	}
       	  })	 	
       	 }else{
       	 	count++;
       	 }
       
       }
	}
})
function add_score(uid,num,ctx,callback){
	console.log(uid,num,ctx);
	dpd.users.put(uid,{score:{$inc:num},context:ctx},callback);
}