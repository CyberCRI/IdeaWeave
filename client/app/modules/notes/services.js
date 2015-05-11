angular.module('cri.notes')
.factory('Notes', function($http, $q, Config) {
    return {
        // Params should be { challenge: <id> } or { project: <id> }
        listNotes : function(params){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/notes',{
                params : params
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        createNote : function(note){
            var defered = $q.defer();
            $http.post(Config.apiServer+'/notes',note).success(function(newNote){
                defered.resolve(newNote);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        deleteNote : function(noteId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+'/notes/'+noteId).success(function(){
                defered.resolve();
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        createComment : function(noteId, commentText){
            var comment = {
                text: commentText
            };

            var defered = $q.defer();
            var url = Config.apiServer + '/notes/' + noteId + "/comments";
            $http.post(url, comment).success(function(newComment){
                defered.resolve(newComment);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        deleteComment : function(noteId, commentId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+'/notes/'+noteId+'/comments/'+commentId).success(function(){
                defered.resolve();
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }
    };
});
