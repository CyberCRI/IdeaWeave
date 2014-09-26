angular.module('cri.common')
.factory('Recommendation',['$q','$http','Config',function($q,$http,Config){

        function reduceTags(tags){
            var response = tags.map(function(tag){
                return tag._id
            });
            return response
        }

        var service = {
            fetchUsers : function(id,tags){
                var defered = $q.defer(),
                    tagsMin = reduceTags(tags);
                $http.get(Config.apiServer+'/recommendations/user/'+id,{
                    params : {
                        tags : tagsMin
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetchProjects : function(id,tags){
                var defered = $q.defer(),
                    tagsMin = reduceTags(tags);
                $http.get(Config.apiServer+'/recommendations/project/'+id,{
                    params : {
                        tags : tagsMin
                    }
                }).success(function(data){
                    data.forEach(function(project,key){
                        if(project._id == id){
                            data.splice(key,1);
                        }
                    });
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetchChallenges : function(id,tags){
                var defered = $q.defer(),
                    tagsMin = reduceTags(tags);
                $http.get(Config.apiServer+'/recommendations/challenge/'+id,{
                    params : {
                        tags : tagsMin
                    }
                }).success(function(data){
                    data.forEach(function(challenge,key){
                       if(challenge._id == id){
                           data.splice(key,1);
                       }
                    });
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);