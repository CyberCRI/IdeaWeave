 var map = function() {
     if (!this.tags) {
            return;
      }
      for (index in this.tags) {
            emit(this.tags[index], 1);
          }
      }
 var reduce = function(previous, current) {
    var count = 0;
         for (index in current) {
           count += current[index];
         }
    return count;
}
 db.runCommand({
           "mapreduce" :"users",
           "map" : map,
           "reduce" : reduce,
            "out" : "utags"});