angular.module('cri.project')
    .service('Project',['$http','$q','$upload','Config', function($http,$q,$upload,Config){

    var service = {
        getByTag : function(tag,param){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/projects/tag/'+tag,{
                params : param
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        fetchUrls : function(id){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/project/urls/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        fetchFiles : function(id){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/project/files/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        update : function(id,param){
            var defered = $q.defer(),
                url = Config.apiServer + '/projects/'+id;
            $http.put(url,param).success(function(){
                defered.resolve();
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        getByChallenge : function(challengeId){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/projects/challenge/'+challengeId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        fetch :function(param){
            var defered = $q.defer(),
                url = Config.apiServer+'/projects';
            $http.get(url,{params : param}).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        create : function(project){
            var defered = $q.defer();
            $http.post(Config.apiServer + '/projects', project)
                .success(function (data) {
                    service.data = data;
                    defered.resolve(data)
                })
                .error(function (err) {
                    console.log(err)
                    defered.reject(err)
                });
            return defered.promise;
        },
        follow : function(param){
            var defered = $q.defer();
            $http.post(Config.apiServer + '/project/follow',param).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        unfollow : function(param){
            var defered = $q.defer();
            $http.post(Config.apiServer + '/project/unfollow',param).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        apply : function(param){
            var defered = $q.defer();
            $http.post(Config.apiServer+'/project/team/apply',param).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        getApply : function(param){
            var defered = $q.defer();
            $http.get(Config.apiServer+'/project/team/apply',{
                params : param
            }).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        finishApply : function(param, id){
            var defered = $q.defer();
            $http.put(Config.apiServer+'/project/apply/'+id,param).success(function(data){
                defered.resolve(data);
            }).catch(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        addToTeam : function(projectId,param){
            var defered = $q.defer();
            $http.put(Config.apiServer+'/project/add/'+projectId,param).success(function(data){
                defered.resolve(data);
            }).catch(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        banMember : function(projectId,param){
            var defered = $q.defer();
            $http.put(Config.apiServer+'/project/ban/'+projectId,param).success(function(data){
                defered.resolve(data);
            }).catch(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        delete : function(id){
            var defered = $q.defer();
            $http.delete(Config.apiServer+'/projects/'+id).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        sendInvite : function(invite){
            var defered = $q.defer();
            $http.post(Config.apiServer+'/project/invites',invite).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        },
        join : function(projectId){
            var defered = $q.defer();
            $http.post(Config.apiServer+'/datas/joinTeam/'+projectId).success(function(data){
                defered.resolve(data);
            }).error(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }

    };

    return service;
}])