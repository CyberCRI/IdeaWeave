angular.module('cri.challenge')
.factory('Challenge',['$http','$q','Upload','Config',function($http,$q,Upload,Config){
        var URI = '/challenges';
        var service  = {
            getTemplates :function(id){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/challenges/'+id+'/templates').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            createTemplate : function(id,template){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/challenges/'+id+'/templates',template).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getTemplate :function(challengeId, templateId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/challenges/'+challengeId+'/templates/'+templateId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            updateTemplate :function(challengeId, templateId, template){
                var defered = $q.defer();
                $http.put(Config.apiServer+'/challenges/'+challengeId+'/templates/'+templateId, template).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            removeTemplate :function(challengeId, templateId){
                var defered = $q.defer();
                $http.delete(Config.apiServer+'/challenges/'+challengeId+'/templates/'+templateId).success(function(data){
                    defered.resolve();
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
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
            fetch : function(param,id){
                var defered = $q.defer();
                var url = Config.apiServer+URI;
                if(id){
                    url += '/'+id;
                }
                $http.get(url,{
                    params : param
                }).success(function(data){
                    service.data = data[0];
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            create : function(newChallenge){
                var defered = $q.defer();
                $http.post(Config.apiServer+URI,newChallenge).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            update : function(id,challenge){
                var defered = $q.defer();
                $http.put(Config.apiServer+URI+'/'+id,challenge).success(function(data){
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
            follow : function(follower,following){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/challenges/follow',{
                    follower : follower,
                    following : following
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            unfollow : function(follower,following){
                var defered = $q.defer();
                $http.post(Config.apiServer + '/challenges/unfollow',{
                    follower : follower,
                    following : following
            }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getFollowing : function(userId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/datas/fChallenges/'+userId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getContributed : function(userId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/datas/conChallenges/'+userId).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            getMessage : function(challengeId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/chat',{
                    params : {
                        container : challengeId
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            postMessage : function(message){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/chat',message).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            like: function(challengeId){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/challenges/'+challengeId+'/like').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            dislike: function(challengeId){
                var defered = $q.defer();
                $http.post(Config.apiServer+'/challenges/'+challengeId+'/unlike').success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            } 
        };
        return service;
    }]);