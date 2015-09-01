angular.module('cri.idea')
.factory('Idea', function ($http,$q,Config) {
    var URI = '/ideas';
    var service  = {
        getByTag : function(tag,param){
            var defered = $q.defer();
            $http.get(Config.apiServer+URI+'/tag/'+tag,{
                params : param
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        fetch : function(id){
            var defered = $q.defer();
            var url = Config.apiServer+URI;
            if(id) {
                url += '/'+id;
            }
            $http.get(url).success(function(data){
                service.data = data[0];
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        create : function(newIdea){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI,newIdea).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        update : function(id,idea){
            var copiedIdea = angular.copy(idea);
            copiedIdea.tags = _.pluck(idea.tags, "_id");

            var defered = $q.defer();
            $http.put(Config.apiServer+URI+'/'+id, copiedIdea).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        remove : function(id){
            var defered = $q.defer();
            $http.delete(Config.apiServer+URI+'/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        follow : function(id){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI+'/'+id+'/follow').success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        unfollow : function(id){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI+'/'+id+'/unfollow').success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }, 
        addLinkToProject : function(id, projectId){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI+'/'+id+'/link?project='+projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        removeLinkToProject : function(id, projectId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+URI+'/'+id+'/link?project='+projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        addLinkToChallenge : function(id, challengeId){
            var defered = $q.defer();
            $http.post(Config.apiServer+URI+'/'+id+'/link?challenge='+challengeId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        removeLinkToChallenge : function(id, challengeId){
            var defered = $q.defer();
            $http.delete(Config.apiServer+URI+'/'+id+'/link?challenge='+challengeId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },  
        /*,
        getFollowing : function(userId){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/datas/fIdeas/'+userId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }
        */

    };
    return service;
});