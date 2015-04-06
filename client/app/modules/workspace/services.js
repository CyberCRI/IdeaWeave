angular.module('cri.workspace')
.factory('NoteLab',['$http','$q','Config','$upload','$stateParams','mySocket','$rootScope',function($http,$q,Config,$upload,$stateParams,mySocket,$rootScope){
        var service = {
            // Params should be { challenge: <id> } or { project: <id> }
            listNotes : function(params){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/notes',{
                    params : params
                }).success(function(data){
                    service.data = data;
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


            fetch : function(param){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/note',{
                    params : param
                }).success(function(data){
                    service.data = data[0];
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },

            exportHackPad : function(id){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/note/hackpad/'+id).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },

            fetchUrl : function(noteId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/note/'+noteId+'/url').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            addUrl : function(url){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/note/'+url.container+'/url', url).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            uploadFile : function(note,file,description,ownerId){
                var defered = $q.defer();
                $upload.upload({
                    url: Config.apiServer+'/upload',
                    method: 'POST',
                    file: file,
                    data: {
                        project:note.project,
                        topic: note._id,
                        projectUrl : $stateParams.pid,
                        description : description,
                        owner : ownerId,
                        container : $stateParams.tid
                    }
                }).progress(function(evt) {
//                    $rootScope.$broadcast('upload::progress',evt)
                    console.log(evt);
                }).success(function(data, status, headers, config) {
                    defered.resolve(data);
                });
                return defered.promise;
            },
            fetchFile : function(id){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/upload',{
                    params : {
                        container : id
                    }
                }).success(function(data){
                   defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }])
    .factory('Url',['Config','$http','$q',function(Config,$http,$q){
        var service = {
            fetch : function(param){
                var defered = $q.defer();
                if(!param){
                    param = {};
                }
                $http.get(Config.apiServer+'/url',{
                    params : param
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            update : function(param){
                var defered=  $q.defer();
                $http.put(Config.apiServer+'/url',param).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);