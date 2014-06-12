//  update total 
var total=(30*this.topicNum+6*this.commentNum+30*this.linkNum+5*this.followerNum+50*this.teamNum+15*this.applyTeamNum);
//  /900*100, 保留2位小数
//this.total=(total/9).toFixed(2);
// update project
dpd.projects.put(this.pid,{score:total});